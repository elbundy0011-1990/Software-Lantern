# Phase 12 — Partner Management (Admin)

## 1. Schema fix: accurate historical spend

`unlocks.amount_paid numeric(10, 2)` added (`supabase/schema.sql`). Populated in
`app/api/stripe/webhook/route.ts` from the completed Stripe session's own `amount_total` (cents,
divided by 100) at the moment `checkout.session.completed` fires, not a live lookup of
`leads.price_per_unlock`. This is deliberate: if a lead's price is edited after the fact, every
historical unlock's recorded spend must stay exactly what was actually charged at the time.

Backfill for pre-existing unlocks is best-effort only, using each lead's *current*
`price_per_unlock` as a stand-in, since the original Stripe transaction amount was never recorded
for those rows. Documented inline in the migration SQL as approximate for that reason. The user
runs the `alter table` + backfill against Supabase directly; not applied by this change.

## 2. Duplication check

No existing partner-list or partner-detail view anywhere under `/admin` before this phase. The only
prior references to `partners` were the join used for lead-exclusion matching. Clear to build.

## 3–4. New admin pages

`/admin/partners` (`app/admin/(protected)/partners/page.tsx`): every partner, with unlock count and
total spend (`sum(amount_paid)`, aggregated in JS from a single `unlocks` query, not
`price_per_unlock`), last login, and signup date. Sortable by total spent (default) or last login,
via `?sort=` query-param links, matching the existing status-tabs pattern elsewhere in `/admin`
(server-rendered, no client JS).

`/admin/partners/[id]` (`app/admin/(protected)/partners/[id]/page.tsx`): partner info plus a full
purchase history (one row per unlock: category, truncated requirement summary, amount paid, unlock
date), joined to `leads` in JS the same way the rest of this codebase joins across tables (no
PostgREST embedded-resource selects used anywhere here, so this doesn't introduce a new pattern).

**`auth.users` access**: the `auth` schema isn't exposed via PostgREST, even to the service-role
key, so a direct `.from("auth.users")` call isn't available. Used the GoTrue Admin API instead,
available on the same service-role client: `supabase.auth.admin.listUsers({ perPage: 1000 })` for
the list page (one call, results joined to partners by `auth_user_id` in memory) and
`supabase.auth.admin.getUserById()` for the detail page. Both confirmed present in the installed
`@supabase/supabase-js` version and both expose `last_sign_in_at` on the returned `User` object.

**RLS**: no new policy. Same as the rest of `/admin`, both pages run entirely through
`createAdminClient()` (service role, bypasses RLS) behind the existing `requireAdmin()` gate in
`app/admin/(protected)/layout.tsx`. Partners already have no direct read access to `unlocks` or each
other's data via any client-facing path.

Added a small "Leads / Partners" nav link pair to the admin header layout, since there was
previously no navigation between admin pages at all.

## 5. Win-rate tracking — explicitly deferred

**Not built this phase.** There is currently no concept anywhere in the schema of a lead being
"won" or "lost" once published and unlocked; `leads.status` only tracks `new` / `published` /
`discarded`, which is a pipeline stage, not an outcome. Adding win-rate needs its own data-model
discussion (what marks a lead won: partner self-report? a follow-up admin field? Does "won" apply
per-partner on a multi-unlock lead, or per-lead? does a partner need a way to report this
themselves via the portal?) before any schema or UI work starts. Flagged here as a known next step
only.

## Verification

`tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (`/admin/partners` and
`/admin/partners/[id]` both render as dynamic routes, consistent with every other `/admin` page;
no other route's static/dynamic classification changed).
