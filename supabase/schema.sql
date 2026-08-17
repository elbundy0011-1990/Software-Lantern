-- Software Lantern schema: leads, partners, unlocks + RLS.
-- Run this once in the Supabase SQL editor (or via psql) against your project.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────────────────

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'published', 'discarded')),

  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  software_need text,
  current_vendor text,
  budget_range text,
  timeline text,
  notes text,

  category text,                              -- 'EUDR Software' | 'Product Lifecycle Management (PLM)' | 'Digital Battery Passport (DBP)'
  answers jsonb not null default '{}'::jsonb,  -- full wizard answer dump (multi/single/text step values)
  custom_fields jsonb not null default '{}'::jsonb, -- admin-added ad hoc label/value pairs, internal only

  unlock_count int not null default 0,
  max_unlocks int not null default 3,
  price_per_unlock numeric(10, 2)
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_email text not null,
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text
);

-- Added post-launch: which categories a partner operates in ('EUDR' | 'PLM' |
-- 'DBP', matching portal-dashboard.tsx's short codes). Powers the portal's
-- default category filter — a soft default, not a hard visibility
-- restriction; get_partner_leads() still returns every published lead, this
-- only changes what the UI shows by default. See docs/PHASE-6-CHANGES.md /
-- PHASE-7-CHANGES.md for the reasoning behind that choice.
alter table public.partners add column if not exists categories text[] not null default '{}';

create table if not exists public.unlocks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  stripe_payment_id text,
  unlocked_at timestamptz not null default now(),
  unique (lead_id, partner_id)
);

-- amount_paid: captured directly from the completed Stripe session's
-- amount_total at checkout time (app/api/stripe/webhook/route.ts), not
-- looked up live from leads.price_per_unlock, so historical spend stays
-- accurate even if a lead's price is edited after the fact.
alter table public.unlocks add column if not exists amount_paid numeric(10, 2);

-- Backfill only, for unlocks that predate this column: best-effort, using
-- each lead's CURRENT price_per_unlock, since the original Stripe
-- transaction amount was never recorded for these pre-existing rows. This
-- is wrong for any of these rows where the lead's price changed since the
-- unlock happened. New unlocks going forward get the real amount from
-- Stripe, not this approximation.
update public.unlocks u
set amount_paid = l.price_per_unlock
from public.leads l
where u.lead_id = l.id and u.amount_paid is null;

-- Win/loss self-reporting: partner-set as the low-key default, admin
-- override as the fallback (see update_unlock_outcome() and the admin
-- setUnlockOutcome() server action below/elsewhere). 'unknown' forever is
-- the expected steady state for most rows — this is opt-in, not required.
alter table public.unlocks add column if not exists outcome text not null default 'unknown'
  check (outcome in ('unknown', 'won', 'lost'));
alter table public.unlocks add column if not exists outcome_set_by text
  check (outcome_set_by in ('partner', 'admin'));
alter table public.unlocks add column if not exists outcome_updated_at timestamptz;

-- Hard DB-level invariant, not just app-level convention: these two columns
-- are null exactly when outcome is 'unknown', and both set otherwise.
alter table public.unlocks drop constraint if exists unlocks_outcome_fields_consistent;
alter table public.unlocks add constraint unlocks_outcome_fields_consistent
  check (
    (outcome = 'unknown' and outcome_set_by is null and outcome_updated_at is null)
    or (outcome <> 'unknown' and outcome_set_by is not null and outcome_updated_at is not null)
  );

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_category_idx on public.leads (category);
create index if not exists unlocks_partner_idx on public.unlocks (partner_id);
create index if not exists unlocks_lead_idx on public.unlocks (lead_id);

-- A row here means "this partner must never see this lead" (e.g. the
-- partner is the buyer's current vendor). Admin-only, set via /admin/leads/[id].
-- See the RLS section below for why this table is locked down harder than
-- the others: its existence as a concept must never be inferable by a partner.
create table if not exists public.lead_exclusions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lead_id, partner_id)
);

create index if not exists lead_exclusions_partner_idx on public.lead_exclusions (partner_id);

-- ─────────────────────────────────────────────────────────────────────────
-- unlock_count bookkeeping: keep it in sync with unlocks, and hard-stop
-- at max_unlocks even under concurrent webhook deliveries.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.handle_new_unlock()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count int;
  cap int;
begin
  select unlock_count, max_unlocks into current_count, cap
  from public.leads
  where id = new.lead_id
  for update;

  if current_count >= cap then
    raise exception 'Lead % is already at its max_unlocks (%)', new.lead_id, cap;
  end if;

  update public.leads set unlock_count = unlock_count + 1 where id = new.lead_id;
  return new;
end;
$$;

drop trigger if exists on_unlock_created on public.unlocks;
create trigger on_unlock_created
  after insert on public.unlocks
  for each row execute function public.handle_new_unlock();

-- ─────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────

alter table public.leads enable row level security;
alter table public.partners enable row level security;
alter table public.unlocks enable row level security;
alter table public.lead_exclusions enable row level security;

-- lead_exclusions: intentionally zero policies for anon/authenticated, and
-- privileges explicitly revoked below. This is stricter than every other
-- table here on purpose: even a permission-denied response on a SELECT
-- would confirm the table exists to a partner probing the REST API, which
-- would itself reveal the concept of exclusion. With no grant at all,
-- PostgREST excludes this table from the schema it serves to `authenticated`
-- entirely, so a partner's client can't distinguish "this table has zero
-- rows for me" from "this table isn't part of the API surface". Only
-- service_role (admin server actions) and get_partner_leads() below
-- (security definer, runs with the function owner's privileges regardless
-- of the caller's grants) ever read this table.
revoke all on public.lead_exclusions from anon, authenticated;

-- leads: anon + authenticated may INSERT new enquiries only. No one gets a
-- direct SELECT/UPDATE/DELETE grant here — the admin panel reads/writes via
-- the service-role key (bypasses RLS), and partners read through the
-- anonymizing get_partner_leads() function below, never this table directly.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (status = 'new');

-- partners: a partner may read/update only their own row.
drop policy if exists "partners read own row" on public.partners;
create policy "partners read own row"
  on public.partners for select
  to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists "partners update own row" on public.partners;
create policy "partners update own row"
  on public.partners for update
  to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- unlocks: a partner may read only their own unlock rows. Rows are only ever
-- written by the Stripe webhook via the service-role key.
drop policy if exists "partners read own unlocks" on public.unlocks;
create policy "partners read own unlocks"
  on public.unlocks for select
  to authenticated
  using (
    partner_id in (select id from public.partners where auth_user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────────────────
-- get_partner_leads(): the only way partners see leads. Published leads only;
-- company/contact fields are nulled out unless the calling partner has a
-- matching row in unlocks. SECURITY DEFINER + owned by the table owner, so
-- it reads leads/unlocks/partners without needing direct grants on those
-- tables for the authenticated role.
--
-- Also excludes any lead with a matching lead_exclusions row for the calling
-- partner, EXCEPT when the partner already has a row in unlocks for that
-- lead: exclusion only ever prevents seeing/unlocking a lead the partner
-- hasn't already paid for. An already-unlocked lead must never disappear
-- just because an exclusion was added after the fact. The exclusion filter
-- is folded into the same WHERE clause as everything else, so an excluded
-- lead is structurally indistinguishable from one outside the partner's
-- category or simply not yet published: no separate flag, no visible gap.
-- ─────────────────────────────────────────────────────────────────────────

-- Signature changed (added unlock_id, outcome) after initial launch — drop
-- the old version explicitly, same reason as create_partner() below: a bare
-- create or replace can't change an existing function's return type.
drop function if exists public.get_partner_leads();

create or replace function public.get_partner_leads()
returns table (
  id uuid,
  created_at timestamptz,
  category text,
  software_need text,
  current_vendor text,
  budget_range text,
  timeline text,
  answers jsonb,
  unlock_count int,
  max_unlocks int,
  price_per_unlock numeric,
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  unlocked boolean,
  unlock_id uuid,
  outcome text
)
language sql
security definer
stable
set search_path = public
as $$
  with me as (
    select p.id as partner_id
    from public.partners p
    where p.auth_user_id = auth.uid()
  )
  select
    l.id,
    l.created_at,
    l.category,
    l.software_need,
    l.current_vendor,
    l.budget_range,
    l.timeline,
    l.answers,
    l.unlock_count,
    l.max_unlocks,
    l.price_per_unlock,
    case when u.id is not null then l.company_name else null end,
    case when u.id is not null then l.contact_name else null end,
    case when u.id is not null then l.contact_email else null end,
    case when u.id is not null then l.contact_phone else null end,
    (u.id is not null) as unlocked,
    u.id as unlock_id,
    u.outcome
  from public.leads l
  left join me on true
  left join public.unlocks u on u.lead_id = l.id and u.partner_id = me.partner_id
  left join public.lead_exclusions ex on ex.lead_id = l.id and ex.partner_id = me.partner_id
  where l.status = 'published'
    and (ex.id is null or u.id is not null)
  order by l.created_at desc;
$$;

-- Supabase's project defaults auto-grant EXECUTE on new public-schema
-- functions directly to anon/authenticated/service_role (an explicit grant,
-- not inherited via PUBLIC) — so anon has to be revoked by name here, not
-- just "from public".
revoke execute on function public.get_partner_leads() from public, anon;
grant execute on function public.get_partner_leads() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- update_unlock_outcome(): the only way a partner can record win/loss.
-- Rejects 'unknown' outright (a partner can flip between won/lost but never
-- reset to unknown once set — that's admin-only, via the service-role
-- client). Ownership check mirrors get_partner_leads()'s "me" CTE: resolve
-- auth.uid() to the calling partner's id, then scope the UPDATE to that
-- partner's own row via UPDATE ... FROM me. `not found` (set by any DML)
-- covers both "no such unlock" and "unlock belongs to someone else"
-- identically, so the error never reveals which case occurred.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.update_unlock_outcome(p_unlock_id uuid, p_outcome text)
returns public.unlocks
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.unlocks;
begin
  if p_outcome not in ('won', 'lost') then
    raise exception 'p_outcome must be won or lost';
  end if;

  with me as (
    select p.id as partner_id from public.partners p where p.auth_user_id = auth.uid()
  )
  update public.unlocks u
  set outcome = p_outcome,
      outcome_set_by = 'partner',
      outcome_updated_at = now()
  from me
  where u.id = p_unlock_id and u.partner_id = me.partner_id
  returning u.* into result;

  if not found then
    raise exception 'Unlock not found or not owned by you';
  end if;

  return result;
end;
$$;

revoke execute on function public.update_unlock_outcome(uuid, text) from public, anon;
grant execute on function public.update_unlock_outcome(uuid, text) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- create_partner(): called right after Supabase Auth signup so the new
-- partner row is created in the same request, without needing a direct
-- INSERT grant on partners for the authenticated role.
-- ─────────────────────────────────────────────────────────────────────────

-- Signature changed (added p_categories) after initial launch — drop the old
-- two-arg overload explicitly so re-running this file doesn't leave a stale
-- create_partner(text, text) function alongside the new one.
drop function if exists public.create_partner(text, text);

create or replace function public.create_partner(
  p_company_name text,
  p_contact_email text,
  p_categories text[] default '{}'
)
returns public.partners
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.partners;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.partners (company_name, contact_email, auth_user_id, categories)
  values (p_company_name, p_contact_email, auth.uid(), coalesce(p_categories, '{}'))
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.create_partner(text, text, text[]) from public, anon;
grant execute on function public.create_partner(text, text, text[]) to authenticated;
