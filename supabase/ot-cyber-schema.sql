-- OT Cybersecurity / NIS2 enquiries schema.
--
-- NOT applied automatically by anything in this repo. Review this file,
-- then run it yourself in the Supabase SQL editor (or via psql) against
-- your project, same as supabase/schema.sql was.
--
-- Deliberately a brand-new, fully isolated table, not a new value in the
-- existing public.leads.category column. Per explicit instruction: OT
-- enquiries must never be reachable via public.get_partner_leads(), must
-- never trigger a partner notification, and must never be "published" to
-- anyone. Keeping this as its own table with its own (much smaller) grant
-- surface, rather than folding it into leads, means that invariant is
-- enforced structurally, not just by convention in application code — a
-- future change to get_partner_leads() literally has no way to reach this
-- table's rows without someone deliberately adding a reference to it, and
-- the comment on the table below exists specifically to make that an
-- obviously-bad idea to anyone who goes looking.
--
-- TRADE-OFF NOTE — new table in this project vs. a dedicated second
-- Supabase project: a second project would give true infrastructure-level
-- isolation (a bug in one project's RLS can never touch the other's data,
-- separate backups/outage domain, separate usage accounting per business),
-- at the cost of a second project to provision (manual, outside this
-- session's reach), a second set of env vars to keep straight inside one
-- Next.js app, and doubled ongoing operational surface for a solo
-- operator. Recommendation: a new table in the existing project, with the
-- hardened RLS/grants below, is the right call for now — it costs nothing
-- extra to run, and the isolation it gives (zero grants to anon/
-- authenticated, no function ever references it) is airtight for the
-- actual threat this is guarding against, which is "a partner or anonymous
-- API caller can read this data" or "this data silently ends up in the
-- marketplace's distribution path." If the OT-cyber offering becomes its
-- own registered business, revisit with a dedicated Supabase project at
-- that point, matching the separate-domain decision in
-- docs/OT-CYBER-PLAN.md §3 — Supabase supports exporting/migrating a
-- single table's data into a new project later, so this isn't a one-way
-- door.

create table if not exists public.ot_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- No "published" state exists for this table, on purpose: there is no
  -- automated distribution mechanism for this data, so there's nothing to
  -- publish it *to*. 'reviewed' just means you've looked at it.
  status text not null default 'new' check (status in ('new', 'reviewed', 'discarded')),

  country text,  -- 'NL' | 'BE' | 'other' | 'not_sure' — self-reported in the checker
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  answers jsonb not null default '{}'::jsonb,  -- full checker answer dump

  -- Records that the person was told, at submission time, that their
  -- answers would be reviewed and that sharing only ever happens after a
  -- separate, specific ask. This column is NOT itself permission to share
  -- with anyone — see shared_with below.
  consent_review_given boolean not null default false,

  -- Manual-only sharing record, set exclusively by the site owner from the
  -- admin panel, after a separate, specific, out-of-band ask to the person
  -- and their yes to that specific ask. No code path in this application
  -- reads these columns to drive any automated distribution — they exist
  -- purely as an audit trail of a decision made outside this system.
  shared_with text,
  shared_at timestamptz,
  admin_notes text
);

create index if not exists ot_enquiries_status_idx on public.ot_enquiries (status);
create index if not exists ot_enquiries_created_at_idx on public.ot_enquiries (created_at);

alter table public.ot_enquiries enable row level security;

-- Deliberately zero policies for anon/authenticated, the same hardening
-- pattern public.lead_exclusions already uses in supabase/schema.sql: with
-- no grant at all, PostgREST excludes this table from the schema it serves
-- to anon/authenticated entirely, so it isn't even visible as "exists but
-- empty" to anyone probing the REST API. Only service_role (this app's
-- admin-only API route and the admin dashboard, both server-only) ever
-- reads or writes this table — never the anon/authenticated Supabase
-- client, never a function callable by a partner.
revoke all on public.ot_enquiries from anon, authenticated;

-- Explicit, defense-in-depth statement, enforced by this comment as much
-- as by the revoke above: no function in this schema may read
-- ot_enquiries and expose it to anon/authenticated. In particular,
-- public.get_partner_leads() (defined in supabase/schema.sql) must never
-- be modified to union, join, or otherwise reference this table, and no
-- new partner-facing function should either. If you're reading this
-- because you're about to change get_partner_leads() or add a new
-- partner-facing RPC, don't reach into this table from it.
comment on table public.ot_enquiries is
  'OT cybersecurity / NIS2 enquiries. Fully isolated from the EUDR/PLM/Battery-Passport marketplace schema (leads/partners/unlocks/lead_exclusions). Admin-only (service_role) access, zero grants to anon/authenticated. Must never be referenced by get_partner_leads() or any partner-facing function. No automated sharing/publishing mechanism exists for this table by design — see shared_with/shared_at/admin_notes for the manual-only audit trail.';
