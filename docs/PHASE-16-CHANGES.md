# Phase 16 — OT Cybersecurity Site Replaces the Public Marketing Site

Full detail, research, and the approval trail for this work live in `docs/OT-CYBER-PLAN.md` Part B.
This file is the terse, PHASE-doc-convention summary of what actually changed in the codebase.

## 1. Homepage and public identity replaced

`app/(marketing)/page.tsx` (the old EUDR/PLM/Battery-Passport marketplace homepage, including its
named customer logos and a testimonial, see §6 below) is deleted. A new route group,
`app/(ot)/`, with its own `layout.tsx` (new header/footer, no shared nav with the marketplace)
takes over `/` and owns a new page tree: `/machine-builders`, `/factory-operators`,
`/system-integrators`, `/checker`, `/guides` (+ 4 guide pages), `/who-runs-this`, `/enquiry`, and
`/privacy` (moved here from `app/(marketing)/privacy/`, content updated, see §5).

## 2. Scope checker extended, not rebuilt

`components/nis2-scope-checker.tsx` keeps its screen-by-screen, no-scoring structure but adds: a
`LU` country option, an audience question (machine builder / factory operator / system integrator
/ not sure) replacing the old binary sector question, and result-screen content covering the Cyber
Resilience Act and Machinery Regulation alongside NIS2, with an explicit note that product-level
rules (CRA, Machinery Regulation) aren't gated by the same size thresholds as NIS2's organizational
rules. The supply-chain-pressure branch is generalized from "machine builder" to any audience.

## 3. Compliance Ledger — new signature element

`lib/compliance-ledger.ts` is the single source of truth: every entry carries a citation URL, a
`lastVerified` date, and a `verified` boolean that drives an inline `[VERIFY]` tag.
`components/compliance-ledger.tsx` renders it, monospace (IBM Plex Mono, added to
`app/layout.tsx`), styled like an access log. No entry is invented; every one traces to
`docs/OT-CYBER-PLAN.md` Part A §1 or Part B §B.2.1.

## 4. Enquiry pipeline extended

`supabase/ot-cyber-schema.sql` (still not applied — run it yourself) gains `role`, `sector`,
`builder_or_operator`, `current_remote_access`, `timeline`, `free_text` columns, added directly to
the `create table` statement since the table has never been applied to production. `lib/types.ts`'s
`OtEnquiry` and `app/api/ot-enquiries/route.ts` match. The route now also enforces a work-email-only
check (`FREE_EMAIL_DOMAINS`, reused from `lib/finder-config.ts`, the same list `/api/leads` already
uses) both server-side here and client-side in `components/ot-enquiry-form.tsx`. The dry-run guard
(`lib/environment.ts`'s `isProductionDeploy()`) is unchanged in position: every validation step,
including the new work-email check, runs before it; only the DB insert and the admin email sit
after it. `app/admin/(protected)/ot-enquiries/` (list + detail) now shows the new fields.

## 5. Privacy policy

Applied (not left as an unapplied diff this time, since the owner name placeholder was resolved and
this instruction asked to see "the final diff"): `app/(ot)/privacy/page.tsx` restructures the
existing policy into OT-service sections (2-9) plus a new §10 describing the legacy marketplace,
kept for as long as that data exists. Still flagged for your review, same spirit as the consent
text below. `[Product name]` remains a literal placeholder (no brand name has been approved).

## 6. Consent wording — owner name resolved

`components/ot-enquiry-form.tsx`'s `OWNER_NAME` constant is now `"Johannes Cornelis de Boer"`
(the name already used in the privacy policy), replacing the `[Owner name]` placeholder in the
intro paragraph, checkbox label, and success message. The wording itself is otherwise exactly what
was specified. The "pending your final approval" badge stays up.

## 7. Legacy marketplace: noindexed, unlinked, finder disabled

`/eudr`, `/plm`, `/battery-passport`, `/providers`, `/resources/blog/*`, `/resources/regulations/*`
each gain `noindex: true` via `lib/metadata.ts`'s extended `pageMetadata()` helper (which now also
accepts `siteName` for pages outside the "Software Lantern" identity). `app/robots.ts` disallows
all of them plus `/finder`. `app/sitemap.ts` now lists only the new OT routes, and returns an empty
array entirely while `lib/site-config.ts`'s `OT_SITE_INDEXABLE` flag is off.
`app/(marketing)/finder/page.tsx` is replaced with a short notice (constraint 2); `/api/leads` and
`components/finder-wizard.tsx` are untouched and still work for anyone who already has a direct
link. No lead, partner, unlock, or payment data was touched.

## 8. Fabricated-looking customer content removed

The old homepage's named customer logos (PHD, Meraas, Kawasaki) and a testimonial attributed to a
named "Kawasaki Marketing Manager" are gone with the homepage file itself — not carried into any
new page, not reused anywhere. See `docs/OT-CYBER-PLAN.md` Part B §B.1.2 for why this was flagged
independently of this task.

## 9. One flag controls indexability

`lib/site-config.ts`'s `OT_SITE_INDEXABLE` is `true` only when `NEXT_PUBLIC_OT_INDEXABLE=true` is
set **and** the deploy is an actual Vercel production deploy (`isProductionDeploy()`). Every new
page's `noindex` is driven by `!OT_SITE_INDEXABLE`, and the sitemap returns nothing while it's off.
Defaults to off (noindex) everywhere until you flip the env var.

## 10. Analytics

`checker_start`, `checker_complete` (properties: `country`, `audience`, `in_scope_result`, all
category-level), and `enquiry_submit` (property: `source`) via the existing `@vercel/analytics`
`track()` call already used by `components/finder-wizard.tsx`. No name, email, phone, company, or
free-text content in any event.

## Verification

- `npx tsc --noEmit`: clean.
- `npm run lint`: clean.
- `npm run build`: succeeds, all routes listed, no route collisions.
- Static scan for em-dashes, "independent"/"neutral"/"unbiased", named vendor/competitor strings,
  and the removed testimonial/logo references across every new/touched file: clean after two
  rounds (first pass caught three em-dashes in rendered checker copy and one in the finder notice
  page's title, fixed).
- Dev-server smoke test: every new page returns 200. The API's dry-run path could not be exercised
  end-to-end via `curl` because Cloudflare Turnstile correctly blocks an unauthenticated request
  before the dry-run guard is ever reached — this is the bot gate working as intended, not a gap.
  The real test needs a browser with the live Turnstile widget; see
  `docs/OT-CYBER-PLAN.md` Part A §6.5.1 for the exact steps.
- Not verified this pass: that every external citation URL actually resolves (would require a live
  fetch per link); recommend a manual click-through before go-live.
