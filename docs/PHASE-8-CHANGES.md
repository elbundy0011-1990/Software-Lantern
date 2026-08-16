# Phase 8 — No-Algorithmic-Matching Copy Rollout + Portal Category Defaults

Implements the Step 1 copy audit and Step 2 portal recommendation from the no-algorithmic-matching
review (see `/docs/PHASE-6-CHANGES.md` for where that review was first presented), approved as
proposed, plus two related fixes surfaced along the way.

---

## 1. Copy audit — implemented

All "core" items and the flagged "borderline" items from the original 25-instance audit were
applied. Two items were deliberately left unchanged, consistent with the original audit's own
reasoning:

- The homepage testimonial quote and the "our matching service" eyebrow line directly above it —
  editing a customer's direct quote would misrepresent what they said, and "matching service" here
  functions as a generic product-category label paired with that quote, not an operational claim.
- The finder contact-step help text ("...so we can match you to a company") — this refers to
  validating a buyer's work-email domain against a real company, a different sense of "match" than
  provider-matching, and wasn't proposed with a specific rewrite in the original audit.

Everything else from the audit was implemented as proposed, across:
`app/(marketing)/page.tsx`, `/eudr`, `/plm`, `/battery-passport`, `/finder/done`,
`components/finder-wizard.tsx`, `lib/finder-config.ts`.

**Submit button (item 23)**: the user was shown four phrasing options and picked **"Send my brief
to [category] providers →"** (dynamic per category via the existing `shortCategoryLabel()` helper)
over the original "Send my EUDR software brief →" proposal.

**Extended beyond the original 25 items, for consistency**: the recurring "Your matches arrive by
email within 24 hours" FAQ answer (present on all three category pages' "How long does it take?"
entry, not originally flagged) was updated to "Provider replies arrive by email within 24 hours" —
same fix pattern as the already-approved trust-line change, applied consistently everywhere the
phrase appeared.

## 2. Two additional accuracy fixes (requested alongside the audit)

- **`/finder` footer**: *"We only share your brief with providers in this category"* was a literal,
  already-false claim (per the original Step 2 investigation, every partner could see every
  category). Changed to *"Your brief is published to the provider portal for providers to review"*
  — accurate regardless of whether the Step 2 portal default (below) is in place, since the
  underlying mechanism doesn't actually restrict visibility, it only changes the default view.
- **`docs/ICP.md`**: the Phase 6 "actual differentiation" bullet *"Matching based on those actual
  requirements, not a generic feature checklist"* still framed matching as something Software
  Lantern does, in tension with the no-algorithmic-matching principle added later in the same
  section. Changed to *"Turning those actual requirements into a structured, provider-ready brief —
  not a generic feature checklist."*

## 3. EUDR vendor reference correction

Mid-batch, the founder flagged that passionfruit.earth does have a real software product — this was
re-verified directly against the vendor's own site (not re-delegated): confirmed it's a genuine,
commercial AI-powered compliance-questionnaire platform (demo booking, "3 min tour," not just
editorial content), but EUDR is still not mentioned anywhere on the site as a supported feature.
`docs/EUDR-VENDOR-REFERENCE.md` was updated to state both facts precisely — genuine software vendor,
not yet a confirmed EUDR vendor — rather than leaving the earlier "weak/not confirmed" characterization
that undersold the product's genuineness.

## 4. Step 2 — portal category-scoped default (soft filter, as recommended)

Implemented exactly as proposed in the original investigation — a default, not a hard restriction:

- **Schema** (`supabase/schema.sql`): added `categories text[] not null default '{}'` to `partners`
  via an explicit `alter table ... add column if not exists`, since the table already exists in the
  live project. `create_partner()` was given a new `p_categories text[] default '{}'` parameter —
  the old two-arg overload is explicitly `drop function if exists`-ed first so re-running the file
  doesn't leave a stale overload alongside the new three-arg version.
  **Applied to the live Supabase project and verified.** The user ran the minimal delta SQL (the
  `alter table` and the `create_partner()` replacement, isolated from the rest of `schema.sql`)
  directly against production, then tested the full signup flow end-to-end with a real account
  (jdb@insidersalpha.com): selected a category at signup, completed email confirmation, and signed
  in successfully — confirming the new `categories` column, the new `create_partner()` signature,
  and the signup form's category capture all work correctly in production.
- **Signup** (`app/portal/signup/page.tsx`): added a required multi-select (EUDR / Fashion PLM /
  Battery Passport, checkboxes) — submission is blocked with an inline error if none are selected.
  Selected short codes are passed through `supabase.auth.signUp`'s `options.data.categories`.
- **Partner creation** (`lib/portal-auth.ts`): `requirePartner()` now reads `categories` from the
  auth user's metadata and passes it to `create_partner()`; the existing-partner lookup now also
  selects `categories`.
- **Portal default** (`app/portal/(protected)/page.tsx`, `portal-dashboard.tsx`): the portal page
  now also calls `requirePartner()` (alongside the existing `get_partner_leads()` call, run in
  parallel via `Promise.all`) to get the signed-in partner's own `categories`, and passes it to
  `PortalDashboard` as a new `partnerCategories` prop. The dashboard's existing filter-pill state
  (`"All categories" | "EUDR" | "PLM" | "DBP"`, previously hardcoded to `"All categories"`) now
  defaults to the partner's own category **only when they declared exactly one** — a partner with
  zero or multiple declared categories still starts on "All categories," per the original
  recommendation to keep this a soft default rather than force a guess.

No changes were made to `get_partner_leads()`, RLS policies, or the anonymization logic — exactly as
scoped in the original recommendation. Existing partners (signed up before this change) will have
`categories = '{}'` and simply continue defaulting to "All categories" until they're asked to set
one (no migration/backfill was in scope here).

This is also what makes the `/finder` footer fix and the portal's existing "Live briefs in your
categories" / "New briefs in your categories land in this view" copy (left untouched, not part of
this batch) become true for a single-category partner, rather than aspirational — as intended.

**On the default-filter behavior specifically**: the user has confirmed this isn't a priority to
verify further — since "All categories" stays available as a filter pill to every partner
regardless of what they default to, nothing is actually restricted either way, so the exact default
shown on first load is a minor UX nicety, not a correctness question.

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx eslint . --max-warnings=0` — clean.
- `rm -rf .next && npm run build` — production build succeeded, all routes built.
- Dev server + `curl` against `/`, `/eudr`, `/plm`, `/battery-passport`, `/finder`, and
  `/portal/signup` — confirmed all new/changed copy strings render, including the dynamic submit
  button text and the new signup checkboxes.
- Grepped every file touched in this batch for every vendor/competitor name from Phase 5–7 research
  — no matches.

## Not done in this phase

- No backfill of `categories` for existing partner rows (out of scope; they'll simply see "All
  categories" as before until they set one).
- No settings page for a partner to change their categories after signup — not requested, and the
  original recommendation didn't call for it at this scale.

## Production status

**Live and verified**, as of the user's own end-to-end test: schema migration applied to the live
Supabase project, real-account signup (jdb@insidersalpha.com) completed successfully including
category selection, email confirmation, and sign-in.
