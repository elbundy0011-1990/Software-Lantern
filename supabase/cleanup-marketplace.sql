-- Software Lantern: remove the legacy marketplace schema (leads, partners,
-- unlocks, lead_exclusions) and everything that serves it.
--
-- Paste into the Supabase SQL editor and run once. Nothing in the app reads
-- these objects any more: the public marketplace routes return 410, and the
-- /admin leads and partners screens were removed. /admin now only uses
-- ot_enquiries, which has no foreign key, view, policy or function that
-- touches these tables (see supabase/ot-cyber-schema.sql).
--
-- ---------------------------------------------------------------------------
-- STEP 0. DO THIS FIRST, BEFORE RUNNING ANYTHING BELOW. THIS SQL DELETES DATA.
-- ---------------------------------------------------------------------------
-- Export each of these tables as CSV: leads, partners, unlocks
-- (lead_exclusions too, if you want a complete record).
--
--   Supabase dashboard -> your project -> Table Editor (left sidebar)
--   -> schema "public" -> click the table (e.g. leads)
--   -> "Export" button in the toolbar above the grid -> "Export as CSV"
--
--   (Alternative: the "..." menu next to the table name in the table list
--   -> "Export data" -> "Export table as CSV".)
--
-- Repeat for partners and unlocks. Open each CSV and check the row count
-- matches the table. Keep the files offline (not in this repo, not in cloud
-- sync): they contain personal data. Only then run the transaction below.
-- ---------------------------------------------------------------------------

begin;

-- (b) Stop public inserts into leads.
drop policy if exists "anon can insert leads" on public.leads;

-- (c) Revoke all grants on the marketplace tables from the public roles.
revoke all on table public.leads, public.partners, public.unlocks, public.lead_exclusions
  from anon, authenticated;

-- (d) Trigger first, then the functions. handle_new_unlock() is the trigger's
-- own function and is unused once the trigger is gone. update_unlock_outcome
-- and create_partner return row types of unlocks/partners, so they must go
-- before the tables. The two-argument create_partner is an older overload
-- that may or may not still exist.
drop trigger if exists on_unlock_created on public.unlocks;
drop function if exists public.handle_new_unlock();
drop function if exists public.get_partner_leads();
drop function if exists public.update_unlock_outcome(uuid, text);
drop function if exists public.create_partner(text, text, text[]);
drop function if exists public.create_partner(text, text);

-- (e) Tables, children before parents. RESTRICT (no CASCADE): if anything
-- unexpected still depends on a table, the drop fails and the whole
-- transaction rolls back instead of silently removing the dependent object.
drop table if exists public.unlocks restrict;
drop table if exists public.lead_exclusions restrict;
drop table if exists public.partners restrict;
drop table if exists public.leads restrict;

commit;

-- Optional check after it commits (read-only). Expect no rows.
-- select table_name from information_schema.tables
--   where table_schema = 'public'
--     and table_name in ('leads', 'partners', 'unlocks', 'lead_exclusions');
