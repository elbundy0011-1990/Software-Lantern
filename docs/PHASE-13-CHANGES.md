# Phase 13 — Win/Loss Self-Reporting on Unlocks

## 1. Schema

`unlocks` gains `outcome text not null default 'unknown'` (`'unknown' | 'won' | 'lost'`),
`outcome_set_by text` (`'partner' | 'admin'`), and `outcome_updated_at timestamptz`. A table-level
CHECK constraint enforces the last two are null exactly when `outcome = 'unknown'`, and both set
otherwise, as a hard DB invariant rather than app-level convention.

## 2. Partner write path

`public.update_unlock_outcome(p_unlock_id uuid, p_outcome text)`: SECURITY DEFINER, rejects any
`p_outcome` other than `'won'`/`'lost'` outright, so resetting to `'unknown'` is structurally
unreachable through this function. Ownership check mirrors `get_partner_leads()`'s `me` CTE exactly
(`select p.id as partner_id from public.partners p where p.auth_user_id = auth.uid()`), joined into
an `UPDATE ... FROM me` clause scoped to that partner's own row. `not found` (PL/pgSQL's built-in
post-DML flag) covers both "no such unlock" and "unlock belongs to another partner" identically, so
the error never reveals which case occurred. `execute` revoked from `public`/`anon`, granted to
`authenticated` only — same grant pattern as `get_partner_leads()` and `create_partner()`.

Called through `POST /api/unlocks/outcome` (`app/api/unlocks/outcome/route.ts`), using the
cookie-authenticated `createClient()`, not the service-role client, so `auth.uid()` resolves inside
the function. The route checks `supabase.auth.getUser()` and returns `401` before ever reaching the
RPC, the same explicit gate `/api/stripe/checkout` uses — not relying on the RPC's own ownership
check as the sole authorization boundary, per explicit instruction this phase.

## 3. Admin write path

`setUnlockOutcome(unlockId, partnerId, outcome)` server action (`app/admin/(protected)/actions.ts`):
same `requireAdmin()` + service-role pattern as `setLeadStatus`. Unlike the partner path, admin can
set `outcome` back to `'unknown'` (clearing `outcome_set_by`/`outcome_updated_at` to satisfy the same
constraint) and always stamps `outcome_set_by = 'admin'`, unconditionally overwriting any prior
partner-set value.

## 4. Portal UI

`get_partner_leads()` now also returns `unlock_id` and `outcome` (not `outcome_set_by` or
`outcome_updated_at` — the partner doesn't need "who set it," only admin does, so that stays
unexposed). Function signature changed, so it's dropped and recreated rather than a bare
`create or replace`, same reason `create_partner()` needed the same treatment previously.

`portal-dashboard.tsx`: each unlocked row gets a quiet inline control in the existing status column.
Default state is small muted text, "Mark outcome"; clicking expands to `Won` / `Lost` / `Still in
progress` (the last just collapses back, no request sent, since a partner can never set `unknown`
through this path). Once set, the label becomes the outcome itself and stays clickable to flip
between `Won`/`Lost`. Optimistic local state on success, no full page refresh. Untouched rows stay
at `unknown` indefinitely — no banner, no modal, no follow-up prompt.

## 5. Admin detail page

`/admin/partners/[id]`'s purchase-history table gets an Outcome column: a `<select>` (client
component `outcome-select.tsx`, same `useTransition` + server-action shape as `status-buttons.tsx`)
plus a small label underneath, "Set by partner, 2 days ago" / "Set by admin, 3 hours ago", omitted
when `outcome` is `unknown`. Added `timeAgo()` to `lib/dates.ts` for this (not touching
`portal-dashboard.tsx`'s separate existing copy, out of scope here).

## 6. Still not built

No aggregate win-rate percentage, no reporting view, no dashboard. This phase only records and
displays outcome per unlock. Turning this into an actual win-rate % is a distinct future step, once
there's enough real self-reported data for the number to mean anything, and needs its own follow-up
(denominator questions alone: won+lost / all unlocks, or won / (won+lost) excluding unknowns
entirely, is a real design decision, not a mechanical rollup).

## Verification

`tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (`/admin/partners/[id]`
and the new `/api/unlocks/outcome` route both present; no other route's static/dynamic classification
changed).
