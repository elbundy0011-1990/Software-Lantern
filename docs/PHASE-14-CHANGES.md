# Phase 14 — Provider Approval Workflow

## 1. Schema

`partners.status text not null default 'pending' check (status in ('pending', 'approved',
'rejected'))`, mirroring `leads.status`'s existing pattern exactly. `create_partner()` needed no
change: it `returns public.partners` (a composite type tracking the table's current shape, not an
explicit column list), and its `insert` doesn't specify `status`, so every new signup lands in
`'pending'` via the column default alone.

## 2. Gate #1 — leads visibility, and the left-join gap this closed

Adding `and p.status = 'approved'` to `get_partner_leads()`'s `me` CTE alone would **not** have been
enough. The function does `left join me on true`, so when `me` returns zero rows, every `leads` row
still survives the join with `me.partner_id` null, and the outer `where l.status = 'published' and
(ex.id is null or u.id is not null)` still evaluates true for every row, since `ex.id is null` stays
true. That would have returned every published lead with contact fields nulled, not zero rows. Fixed
with one more WHERE condition: `and me.partner_id is not null`. Verified both cases hold: an approved
partner gets identical behavior to before (`me` resolves to exactly one row); a pending, rejected, or
non-existent partner, or any authenticated caller with no partner row at all, gets genuinely zero
rows, silently, matching the existing "no distinguishing signal" treatment `lead_exclusions` already
uses (an excluded lead is structurally indistinguishable from one outside the partner's category;
now a pending/rejected partner's entire leads list is structurally indistinguishable from an approved
partner who simply has no matches).

Portal UI (`app/portal/(protected)/page.tsx`): a bare empty leads list would be a confusing dead end,
so the partner's own `status` is fetched directly (already legal under the existing "partners read
own row" RLS policy, no new policy needed, `requirePartner()` just added `status` to its existing
select) and branches to a dedicated pending or rejected screen instead of the dashboard.

## 3. Gate #2 — the purchase path, the gap that matters most

`/api/stripe/checkout` now checks `partner.status !== "approved"` immediately after its existing
partner fetch (same `status` addition to the same already-RLS-legal select), before any lead lookup
or Stripe session creation, fully independent of Gate #1. A pending partner who somehow already has a
`lead_id` (an old bookmark, a direct API call) is blocked here regardless of whether the leads list
ever showed them anything. See Verification below for the live test plan against a real pending
account.

## 4. Admin UI

`/admin/partners` gets status tabs (`Pending` / `Approved` / `Rejected` / `All`), defaulting to
**Pending**, the actionable queue, mirroring how `/admin` defaults to `New` leads. New
`setPartnerStatus(partnerId, status)` server action (`app/admin/(protected)/actions.ts`), same
`requireAdmin()` + service-role pattern as `setLeadStatus`/`setUnlockOutcome`. New
`PartnerStatusButtons` client component (`partners/partner-status-buttons.tsx`), same
`useTransition` + server-action shape as `status-buttons.tsx`, used on both the list and detail
pages. The admin can move a partner between all three states freely (approve, reject, or reset back
to pending), though this phase only needed approve/reject as the primary actions.

## 5. Email notification (Trigger 3)

Reused the existing infrastructure exactly: `buildNewPartnerAdminEmail()` in `lib/email-templates.ts`
(same `emailLayout`/`fieldRow` helpers as Triggers 1 and 2), sent via `lib/resend.ts`, scheduled via
`after()` from inside `requirePartner()`'s `create_partner()` success branch, the one place a partner
row is actually created (covers both the "email confirmation off" and "email confirmation on" signup
paths, since both eventually hit this function). Confirmed `after()` is supported inside Server
Components (not just Route Handlers), per Next's own docs, which is the context `requirePartner()`
runs in via `portal/layout.tsx` and `portal/page.tsx`.

## 6. Explicitly not built this phase

No rejection-reason field, no rejection email to the partner, no partner-facing re-application flow.
Sensible future additions, flagged here, not designed toward yet: a rejection reason would need a
new column and an admin UI field; a rejection email would need a fourth email template and a
decision about whether "you can reapply" language is even accurate before promising it; a
re-application flow needs its own decision about whether that's a status reset, a new signup, or
something else entirely.

## Verification

`tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (`/portal`,
`/api/stripe/checkout`, `/admin/partners`, `/admin/partners/[id]` all present, no other route's
static/dynamic classification changed).

**Live testing against a real pending partner account is pending the schema change being applied.**
The user applies schema changes to Supabase directly, same as every prior phase; this section will be
updated with the actual results (not a prediction) once that's done and the test below has actually
run:
- Create a real test partner via Supabase Auth signup + `create_partner()`, landing in `'pending'` by
  the column default. Sign in as that account to get a real session, not a service-role bypass.
- Call `get_partner_leads()` with that real session against a published lead with no exclusions:
  confirm zero rows, specifically ruling out the left-join gap described above (not just "no
  category match").
- Admin-approve the same partner, re-call `get_partner_leads()` with the same session: confirm the
  published lead now appears, ruling out the gate over-blocking an approved partner.
- Reset the partner back to `'pending'`, then call `/api/stripe/checkout` with that partner's real
  session against the same lead: confirm `403` before Stripe is reached.
- Approve the partner again and repeat the same checkout call: confirm a real Stripe session `url`
  comes back, ruling out the gate blocking a legitimate approved-partner checkout.
