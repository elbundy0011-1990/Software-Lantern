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

create table if not exists public.unlocks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  stripe_payment_id text,
  unlocked_at timestamptz not null default now(),
  unique (lead_id, partner_id)
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_category_idx on public.leads (category);
create index if not exists unlocks_partner_idx on public.unlocks (partner_id);
create index if not exists unlocks_lead_idx on public.unlocks (lead_id);

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
-- ─────────────────────────────────────────────────────────────────────────

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
  unlocked boolean
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
    (u.id is not null) as unlocked
  from public.leads l
  left join me on true
  left join public.unlocks u on u.lead_id = l.id and u.partner_id = me.partner_id
  where l.status = 'published'
  order by l.created_at desc;
$$;

-- Supabase's project defaults auto-grant EXECUTE on new public-schema
-- functions directly to anon/authenticated/service_role (an explicit grant,
-- not inherited via PUBLIC) — so anon has to be revoked by name here, not
-- just "from public".
revoke execute on function public.get_partner_leads() from public, anon;
grant execute on function public.get_partner_leads() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- create_partner(): called right after Supabase Auth signup so the new
-- partner row is created in the same request, without needing a direct
-- INSERT grant on partners for the authenticated role.
-- ─────────────────────────────────────────────────────────────────────────

create or replace function public.create_partner(p_company_name text, p_contact_email text)
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

  insert into public.partners (company_name, contact_email, auth_user_id)
  values (p_company_name, p_contact_email, auth.uid())
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.create_partner(text, text) from public, anon;
grant execute on function public.create_partner(text, text) to authenticated;
