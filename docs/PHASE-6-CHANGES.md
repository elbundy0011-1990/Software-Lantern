# Phase 6 — Implemented Changes

Implementation of the validated P0/P1 items from `/docs/SERP-GEO-ANALYSIS.md` and
`/docs/SEO-NEXT-STEPS.md`. Scope: copy and content changes to the three existing
category pages only. No new pages, no new categories, no pricing/product changes.

Governing constraint for this phase (persisted permanently in `/docs/ICP.md`, see
item 11 below): the matchmaking mechanic ("answer questions → get matched with up
to 3 providers") is not a unique differentiator — live research found functioning
competitors running a similar model in all three categories. Copy was rewritten to
lead with category-specific expertise, genuine requirement-understanding, and
navigating fragmented markets, with the matchmaking mechanic kept as the delivery
method, not the pitch.

---

## 1. Exact pages changed

- `app/(marketing)/eudr/page.tsx`
- `app/(marketing)/plm/page.tsx`
- `app/(marketing)/battery-passport/page.tsx`
- `docs/ICP.md` (new "Positioning Principles" section — see item 11)

No other routes, components, or shared layout files were touched.

---

## 2. SEO changes

- PLM breadcrumb corrected from "PLM software" to "Fashion PLM software" —
  aligns the visible breadcrumb with the page's actual keyword focus and title tag,
  which already said "Fashion PLM software."
- All three hero H1/lead paragraphs rewritten to open with the buyer's problem
  (market fragmentation, comparison difficulty) rather than the mechanic, which
  keeps primary keywords in the first ~200 words while improving on-topic relevance.
- No changes to `<title>`, meta description, canonical, or OG tags — those were
  already validated in Phase 4/5 and were not flagged as issues in Phase 5 research.

## 3. GEO changes (AI-answer-engine optimization)

Each page's "What is X software?" block gained an additional paragraph explicitly
answering the "which one is right for me" sub-question, since GEO research found
AI answer engines reward direct, self-contained answers to buyer-variability
questions:

- **EUDR**: new paragraph on how fit varies by buyer size (large importer w/
  compliance staff vs. smaller trader) and by commodity/sourcing-region focus.
- **PLM**: new paragraph on how fit varies by collection complexity, SKU count,
  and sourcing model.
- **Battery Passport**: new paragraph on how the DPP-vs-battery-passport starting
  point depends on value-chain position and existing data maturity.

## 4. Differentiation changes (the core Phase 6 strategic change)

Applied uniformly across all three hero sections and GEO blocks:

- Removed the framing "we match you with 3 providers, unlike a directory" as a
  standalone selling point.
- Replaced with a two-part structure on every page: (a) the *problem* — the
  category is crowded/fragmented and comparing options alone is slow — followed by
  (b) what Software Lantern actually does about it — identifying providers that
  are relevant to the buyer's *specific* situation, explicitly not a ranked list
  and not a claim of "best."
- Trust line under each hero CTA changed from `"Free for buyers · No obligation ·
  A few quick questions"` to `"Free for buyers · No obligation · Matches by email
  within 24 hours"` on all three pages — removes emphasis on the questionnaire
  mechanic itself, replaces it with a concrete buyer-relevant outcome (speed).
- Language discipline applied throughout: no "best," "perfect," "guaranteed," or
  "top" claims anywhere in the new copy. Consistent use of "providers that appear
  relevant," "plausible fit," "believe they can help."

## 5. CTA changes

**Conclusion: existing CTAs were reviewed and kept as-is.** Button copy ("Find
EUDR software →", "Find my PLM →", "Find battery passport software →") and the
bottom-of-page CTA bands were already outcome-oriented and specific per category,
which Phase 5 research did not flag as a problem. Changing button copy carries
conversion risk with no identified upside from the research, so no CTA text was
changed. The only CTA-adjacent change is the trust-line rewrite described in
item 4, which sits directly under the primary CTA on all three pages.

## 6. FAQ changes

- **EUDR**: no new FAQ items (existing set — including "What EUDR software is
  suitable for small businesses?" — already covered the P1 gaps identified in
  Phase 5).
- **PLM**: two new FAQ items added:
  - "How do I choose a fashion PLM system?"
  - "What's the difference between general PLM and fashion PLM?"
  (Targets the general-vs-fashion PLM disambiguation gap identified in Phase 5
  SERP research.)
- **Battery Passport**: one new FAQ item added:
  - "Is Battery Passport software the same as Digital Product Passport software?"
  (Targets the DPP/battery-passport disambiguation gap identified in Phase 5.)

## 7. EUDR SME changes

- Section H2 changed from "EUDR software for small businesses" to "EUDR software
  for small businesses and SMEs" — broadens keyword coverage to the "SME" term
  used by part of this audience without losing the plain-English "small
  businesses" phrasing.
- Body copy reframed around "genuinely different requirements, not just a smaller
  budget" — removes any implication that the SME product is simply a cheaper/
  lesser version, consistent with ICP.md's SME sub-persona definition, and avoids
  "cheapest/simplest/best" claims per the language-discipline rule.

## 8. Regulatory claims reviewed

Per the standing rule that unverified regulatory dates/specifics must not be
invented, a fork agent was dispatched this phase specifically to attempt
primary-source (EUR-Lex) verification of Battery Passport regulatory details
before adding anything new:

- **Added**: "(EU 2023/1542, Article 77)" citation on `/battery-passport` —
  confirmed against the primary source.
- **Added (update, post-initial-publish)**: the 18 February 2027 digital battery
  passport date, scoped precisely to EV batteries, LMT batteries (e-bikes/
  e-scooters), and industrial batteries above 2 kWh — added to the opening
  paragraph once independently confirmed across multiple sources (including
  thebatterypass.eu, which cites the regulation directly), tied to Article 77.
  At initial Phase 6 publish, this date had been deliberately withheld because
  the primary-source fetch needed to verify it (EUR-Lex, around Article 96) was
  inconclusive/truncated; it was added in a follow-up edit once verification
  cleared.
- **Known but deliberately not added to live copy**: two adjacent, easily
  conflated dates from the same regulation, noted here for future accuracy but
  out of scope for this page's current copy: (1) carbon footprint declarations
  for industrial batteries above 2 kWh became mandatory from 18 February 2026;
  (2) critical raw material due diligence obligations were postponed via
  Regulation (EU) 2025/1561 to 18 August 2027. Neither is the digital-passport
  date and neither should be merged with it if referencing the regulation's
  timeline elsewhere on the site in future phases.
- No new regulatory claims were added to the EUDR page beyond what was already
  live and previously verified; the existing disclaimer paragraph was only
  lightly copy-edited for flow, not for substance.

## 9. Internal links added

- **EUDR → PLM**: added ("...fashion, footwear, or accessories product
  development involving EUDR-relevant materials like leather or rubber, you may
  also want fashion PLM software") — genuine conceptual relationship: EUDR-in-
  scope materials (leather, rubber) are direct PLM-category inputs.
- **PLM → EUDR**: added, the reverse of the above, on the PLM page's GEO block.

Both directions were added because the relationship is real and specific
(shared regulated materials), not because the two pages are merely adjacent
categories.

## 10. Recommendations deliberately NOT implemented, and why

- **PLM ↔ Battery Passport cross-link**: NOT added, despite ICP.md's §10
  cross-category note suggesting a PLM/Battery-Passport relationship exists at
  the market level. That note describes a general pattern (companies sometimes
  need both PLM and DPP/battery-passport tooling) that does not map to Software
  Lantern's actual product: `/plm` here is specifically **fashion** PLM, not
  general/industrial PLM. A battery manufacturer's PLM needs (if any) would not
  be served by a fashion-specific PLM tool, so linking battery-passport visitors
  to `/plm` would be actively misleading rather than helpful. No link was added
  in either direction between these two pages.
- **EUDR ↔ Battery Passport cross-link**: NOT added. No genuine conceptual
  overlap was identified between EUDR (deforestation/commodity due diligence) and
  Battery Passport (battery lifecycle/materials passport) buyer needs strong
  enough to justify a link under the "only where genuine conceptual relationship
  exists" rule — unlike the EUDR↔PLM relationship, which shares a concrete
  material (leather/rubber), there is no equivalent concrete link here.
- **Compliance date on Battery Passport page**: NOT added — see item 8.
- **CTA button copy changes**: NOT made — see item 5.

## 11. Where the "matchmaking mechanic is not a differentiator" finding was persisted

Added as a new, permanent, binding section in `/docs/ICP.md` — **"Positioning
Principles (Read Before Writing Any Copy)"** — inserted immediately after the
Executive Summary and before the main ICP section, so it is read before any future
copy/messaging decision. It states the finding, names the four actual
differentiators (category-specific expertise, genuine requirement-understanding,
navigating fragmented markets, requirement-based matching), and sets binding
language-discipline rules (no "best/guaranteed/perfect" claims, no competitor
names in live copy, buyer stays in control). This is intended to govern all future
copy work, not just this phase's three pages.

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx eslint . --max-warnings=0` — clean.
- `rm -rf .next && npm run build` — production build succeeded, all three pages
  prerendered as static content, no errors.
- Dev server + `curl` against all three live routes — all return `200`.
- Rendered HTML checked directly (via `curl` + `grep`) for: new trust-line text,
  new cross-links, new FAQ questions, the Article 77 citation, absence of any
  2027 date, and absence of a `/plm` link on the battery-passport page.
- Grepped all three edited page files and `docs/ICP.md` for competitor names
  identified in Phase 5 research (matchilla, eudrready, Technology Evaluation
  Centers/TEC, osapiens, Centric, AVL, DPP-Tool, Spherity) — no matches.

---

## Not done in this phase (out of scope per Phase 6 instructions)

No new pages, no new categories, no pricing changes, no changes to `/`, `/finder`,
`/providers`, or any admin/portal code. Per instructions, stopping here — no
further phase should proceed without explicit approval.
