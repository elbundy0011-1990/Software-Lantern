# Phase 7 — EUDR Commercial Content Build-Out

Scope: buildable pieces only, per the Phase 7 brief. Excludes industry-specific subpages
(gated on real Search Console demand data) and outbound vendor/buyer development (founder's own
business-development work). Covers Steps 0 (status check) through 5.

---

## 0. Step 0 status — "no algorithmic matching" principle

**Already completed in the prior session, before this phase started.** Verified via `git log` and
direct inspection of `/docs/ICP.md` rather than assumed:

- **Principle persisted**: confirmed present in `/docs/ICP.md`'s "Positioning Principles" section
  (the "Software Lantern is not an automated software recommendation engine..." paragraph and its
  language-discipline bullets). This edit predates Phase 7 and was not modified in this phase.
- **Copy audit**: already completed and presented — 25 flagged instances across the homepage,
  `/eudr`, `/plm`, `/battery-passport`, `/finder`, and `/finder/done`, each with precise before/after
  wording, split into "core" (explicit matching/scoring claims), "borderline," and "reviewed/no
  change" categories. **Not yet implemented** — still awaiting approval.
- **Portal category-visibility investigation**: already completed and presented — confirmed
  `partners` has no category column today, confirmed `get_partner_leads()` returns all published
  leads regardless of category by design, and recommended a soft default-filter approach (add
  `categories text[]` to `partners`, capture at signup, default the portal's existing filter pills
  to it) over a hard filter, with reasoning. **Not yet implemented** — still awaiting approval.

Nothing further was done on Step 0 in this phase — no copy changes, no schema changes, no portal
changes. `/docs/EUDR-VENDOR-REFERENCE.md` (Step 3, below) was written as reference material that
would inform provider self-declaration *if and when* that work is approved, but does not itself
implement it.

**New finding this phase, not previously flagged**: while instrumenting the finder wizard for
Step 5, I noticed the wizard's own footer text on `/finder` reads *"Free for buyers · We only share
your brief with providers in this category."* This is a direct, literal claim about data-sharing
scope, and it's already inaccurate today given how `get_partner_leads()` actually works — every
partner can currently see every category's leads, not just their own. This wasn't in the original
25-instance audit (that pass didn't check this specific footer line) and wasn't touched in this
phase since it falls under the still-pending Step 0 approval, but it's a more direct accuracy
problem than most of the audited items — worth prioritizing when that approval comes through.

---

## 1. Regulatory date verification

Verified against EUR-Lex primary sources (the regulation text and its amendments directly), not
vendor blogs, per the standing project rule.

**Re-verified on urgent user request after this phase shipped**, via two independent direct fetches
of EUR-Lex (different URL/document formats for Regulation (EU) 2025/2650), specifically to rule out
30 December 2025 still standing. Both fetches returned identical verbatim text for the amended
Article 38: paragraph 2 sets the general date ("Articles 3 to 13, Articles 16 to 24 and Articles 26,
31 and 32 shall apply from 30 December 2026"); paragraph 3 sets the later date, and its exact wording
scopes it to **"operators, whether natural persons or micro- or small undertakings... who were
established as such by 31 December 2024"** — confirming, in the regulation's own words, that this
provision does not name traders, which directly validates the live copy's choice to say "micro and
small **operators**" rather than asserting trader parity. No correction was needed; the two headline
dates already live were confirmed accurate as written.

| Fact | Resolved value | Confidence |
|---|---|---|
| Large/medium operator & trader deadline | **30 December 2026** | High — confirmed directly from Regulation (EU) 2025/2650's text (Art. 38(2)), corroborated by the EU Commission's own DG TRADE announcement and independent legal-firm summaries (Stibbe, Lexology) |
| Micro/small enterprise deadline | **30 June 2027** | High for micro/small **operators** specifically (confirmed same sources). Medium/`[VERIFY]` for whether small/micro **traders** get the identical date, or whether the extension is scoped to a new, narrower "micro or small primary operator" category the amendment introduces — this distinction was not resolved with confidence, and is **not stated as fact anywhere in the new copy** |
| Regulation (EU) 2024/3234 | Confirmed real — the *first* one-year delay (adopted Dec 2024), setting large/medium → 30 Dec 2025, micro/small → 30 June 2026. **Now superseded** by 2025/2650, so these dates are obsolete and were not used in any new copy | High |
| Regulation (EU) 2025/2650 | Confirmed real (the founder's number was correct) — the *second* delay (adopted Dec 2025), pushing dates to 30 Dec 2026 / 30 June 2027, and making substantive changes: narrows the definition of "trader" to exclude a new "downstream operator" category, and introduces a "micro or small primary operator" category eligible for simplified declarations | High |
| Operator vs. trader definitions | Operator = first places a covered product on the EU market, or makes it available if produced in the EU. Trader = any other business making the product available further down the supply chain, with narrower obligations | High — these are stable regulatory definitions, not contested across sources the way dates were |

**Only the two headline dates (30 Dec 2026, 30 June 2027-for-operators) were used in new live
copy.** The trader-specific SME timing ambiguity was handled by never asserting trader/operator
parity on the 2027 date in copy — see the FAQ answer wording in Section 4 below.

---

## 2. Comparison framework added to `/eudr`

Added a new section, "How to choose EUDR compliance software," between the existing "What is EUDR
compliance software?" section and "What we'll match you on." Twelve evaluation categories, each
with a 2–4 sentence explanation of *why* it matters to a buyer (not just a feature list):

Supplier data collection · Geolocation (GPS/polygon handling) · Risk assessment methodology · Due
diligence statement (DDS) generation · TRACES/EU Information System submission · Document
management and audit trail · Supplier portal (self-service submission) · ERP integration ·
Commodity coverage · Operator vs. trader workflow support · Company size fit (SME vs. enterprise) ·
Pricing model and transparency.

All twelve categories were sanity-checked against real vendor research (`/docs/EUDR-VENDOR-
REFERENCE.md`, Step 3) before inclusion — every category is evidenced by at least 2–3 of the 16
genuine vendors researched, so none of these are assumed or generic filler. The section explicitly
states Software Lantern isn't claiming vendor-comparison authority ("No single vendor can neutrally
tell you how it compares to its competitors...") and frames the content as "what to look for," not
"here's how vendors rank" — no vendor is named, ranked, or claimed to have been evaluated.

---

## 3. Vendor reference document

Created **`/docs/EUDR-VENDOR-REFERENCE.md`** — internal only, explicitly marked as not for
publication, consistent with the Phase 6 "no competitor names in live copy" rule.

**All 17 founder-provided domains were researched** (research split into two parallel passes).
Findings:

- **16 of 18** (accounting for one domain correction) are genuine, real, EUDR-relevant software
  vendors of some kind — though **none are EUDR-only pure-plays**; all are broader ESG/compliance/
  GRC/SRM/traceability/ag-tech/ERP platforms with EUDR as one module or feature. The closest to
  EUDR-specific are Sourcemap, SourceTrace, Agridence, and live-eo.com's TradeAware product.
- **Excluded/flagged as non-vendor or unverifiable**:
  - **relatico.com** — genuine company, but built around Germany's LkSG and the upcoming CSDDD,
    not EUDR. No deforestation, geolocation, commodity, or DDS functionality found anywhere on
    their site. Recommended for exclusion from any EUDR-specific context.
  - **passionfruit.earth** — genuine company, but its confirmed product is general compliance-
    questionnaire automation for food suppliers, not EUDR-specific software. Their EUDR presence
    is blog/thought-leadership content only, with no evidence tying it to an actual product
    feature. Recommended to be treated as "EUDR-adjacent content presence," not a vendor.
  - **banqu.com** does not resolve to the real product — the actual site is **banqu.co**. Flagged
    as a domain correction, not an exclusion (the company itself is a genuine, verified vendor).
  - **mastersustainability.today** — the founder's specific instruction to verify directly (given
    prior research treated it as purely editorial) was followed: confirmed it hosts BOTH an
    editorial/comparison section AND a distinct, real commercial ESG compliance platform with
    EUDR as one of several modules. The founder was right to flag it as more than just editorial.

Every capability claim in the document is tagged confirmed-from-vendor's-own-site, inferred/
secondary-source, or `[VERIFY]` — nothing was fabricated. No vendor's product was described with a
feature that couldn't be evidenced.

---

## 4. GEO answer blocks added to `/eudr`

Four new FAQ entries added (the existing "How do I choose EUDR software?" entry was left
unchanged, since editing it touches phrasing gated on the still-pending Step 0 copy approval):

- **"What does EUDR software actually do?"**
- **"What should an EUDR software platform include?"** — references the new comparison framework
- **"What's the difference between EUDR software for operators vs. traders?"** — uses the verified
  operator/trader definitions and the confirmed 30 December 2026 large-entity date
- **"Do small businesses and SMEs need EUDR software?"** — uses the confirmed 30 June 2027 date,
  scoped only to "micro and small operators" (not asserting trader parity, per the Step 1 finding)

All four are concise, factual, and contain no claim that couldn't be traced to the Step 1
regulatory research.

---

## 5. Conversion tracking

**Confirmed nothing existed before this phase** — no analytics package in `package.json`, no
Google Analytics/GA4, PostHog, Plausible, Mixpanel, or any tracking script anywhere in the
codebase. No page-view tracking of any kind was in place.

Added **`@vercel/analytics`** (lightest-weight option given the site is already hosted on Vercel —
no new third-party script or heavier platform introduced):

- `<Analytics />` added to the root layout (`app/layout.tsx`) — gives automatic page-view tracking
  across the whole site with no further code needed.
- `track("finder_start", ...)` fires once on `FinderWizard` mount (with the preset category, if
  any), in `components/finder-wizard.tsx`.
- `track("finder_complete", ...)` fires immediately after a successful lead submission, right
  before the redirect to `/finder/done`, with the selected category.

Both events will appear in the Vercel Analytics dashboard once deployed; no additional
configuration is needed on Vercel's side beyond the project already being connected (confirmed
from earlier phases of this project).

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx eslint . --max-warnings=0` — clean.
- `rm -rf .next && npm run build` — production build succeeded, all routes built including
  `/eudr` as static.
- Dev server + `curl` against `/eudr` — confirmed the new comparison-framework heading, the
  operator/trader capability card, both regulatory dates, and all four new FAQ questions render
  in the live HTML.
- Grepped the edited `/eudr` page file for every vendor name from the founder's list and from
  Phase 5/6 competitor research — no matches, confirming the internal vendor reference document's
  contents did not leak into public copy.

## Not done in this phase

No industry-specific subpages built. No outbound vendor/buyer development work performed. No
Step 0 copy changes or portal-filtering feature built — both remain gated on your approval. No
changes to `/plm` or `/battery-passport` in this phase — Phase 7 was scoped to EUDR only.
