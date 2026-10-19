-- OT Cybersecurity / NIS2 enquiries schema.
-- NOT applied automatically. Review, then run in Supabase SQL editor.
-- Separate table, not a new leads.category value, by explicit instruction.
-- Must never be reachable via get_partner_leads() or trigger partner emails.
-- Must never be published; there's no distribution mechanism for it.
-- Trade-off: a dedicated Supabase project gives stronger isolation later,
-- but costs more ops overhead now. This table's RLS/grants are enough today.
-- Revisit a dedicated project if this becomes its own registered business.

create table if not exists public.ot_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- No published status: nothing here is distributed automatically.
  status text not null default 'new' check (status in ('new', 'reviewed', 'discarded')),

  country text,  -- 'NL' | 'BE' | 'LU' | 'other' | 'not_sure', self-reported
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  answers jsonb not null default '{}'::jsonb,  -- full checker answer dump

  -- Added 2026-10-19, written directly in since no data existed yet.
  role text, -- free-text job role
  sector text,
  builder_or_operator text, -- builder, operator, integrator, or not_sure
  current_remote_access text, -- free text, never a product dropdown
  timeline text,
  free_text text,

  -- Records that sharing needs a separate ask; this isn't consent to share.
  consent_review_given boolean not null default false,

  -- Manual-only audit trail, set by the owner after a specific ask and yes.
  shared_with text,
  shared_at timestamptz,
  admin_notes text
);

create index if not exists ot_enquiries_status_idx on public.ot_enquiries (status);
create index if not exists ot_enquiries_created_at_idx on public.ot_enquiries (created_at);

alter table public.ot_enquiries enable row level security;

-- Zero policies for anon/authenticated, same pattern as lead_exclusions.
-- Only service_role reads/writes; hidden from anon/authenticated entirely.
revoke all on public.ot_enquiries from anon, authenticated;

-- No function may expose this table to anon/authenticated.
-- Never reference it from get_partner_leads() or any partner-facing function.
comment on table public.ot_enquiries is
  'OT cybersecurity / NIS2 enquiries. Fully isolated from the EUDR/PLM/Battery-Passport marketplace schema (leads/partners/unlocks/lead_exclusions). Admin-only (service_role) access, zero grants to anon/authenticated. Must never be referenced by get_partner_leads() or any partner-facing function. No automated sharing/publishing mechanism exists for this table by design — see shared_with/shared_at/admin_notes for the manual-only audit trail.';
