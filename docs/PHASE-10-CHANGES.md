# Phase 10 — Em-Dash Removal + Standing Style Rule, First Blog Article

## 1. Sitewide em-dash removal

Searched every `.tsx`/`.ts` file for the em-dash character (—) and rewrote each instance with
whatever punctuation reads most naturally for that specific sentence, not a blind substitution.
Roughly 80 instances across the following live content:

- `/eudr`, `/plm`, `/battery-passport` (22, 10, 11 instances respectively)
- `/resources/regulations` hub, `/resources/regulations/eudr`, `/resources/regulations/battery-passport`
  (2, 14, 5 instances)
- `/privacy` (4 instances)
- Admin panel (`lead-edit-form.tsx`, admin leads list) and partner portal (`portal-dashboard.tsx`,
  login/signup pages) — user-facing UI copy and error messages
- `components/eudr-scope-checker.tsx` and `lib/eudr-dates.ts` — the scope checker's result copy and
  the shared `EUDR_SME_SIZE_NOTE` constant
- `lib/finder-config.ts` and `app/api/leads/route.ts` — the work-email-blocked error message
  (duplicated across client and server, both fixed)

Replacement approach varied by grammatical role: a parenthetical aside became parentheses (e.g.
"Operator — the business that..." → "Operator: the business that..." for definition-list-style
items, or true parentheses for asides mid-sentence); an elaboration or list introduction became a
colon; two independent clauses joined by a dash became a period; a loosely-connected clause became a
comma. No single substitute character was used throughout.

**Deliberately left untouched**: em-dashes inside code comments (`//`) and one server-only
`console.error` diagnostic string in `proxy.ts` — neither is user-facing site content, so neither is
"copy" in the sense this task was scoped to. A `"—"` used as an empty-value placeholder in the admin
leads list (`{lead.category || "—"}`) was changed to `"N/A"`, since it's a UI placeholder glyph, not
prose, but was still worth fixing to fully honor "no em-dashes anywhere."

**Standing style rule added** to `/docs/ICP.md`'s Positioning Principles section, in the same
language-discipline list as the "no competitor names" rule: no em-dashes in any future site copy, in
any phase, with the same "rewrite naturally per sentence, don't blind-substitute" guidance recorded
there for future reference.

**Verification**: `tsc`, `eslint`, and a full production build all passed clean. Checked the actual
rendered HTML (not just source) of every touched page via `curl` and confirmed zero em-dash bytes
remain in any of them.

---

## 2. First blog article

**Duplication check performed before writing anything.** The proposed topic ("EUDR Software: What
Features Should Companies Look For?") was checked against `/eudr`'s existing 12-category comparison
framework (built Phase 7) and against `KEYWORD-MAP.md`. Finding: genuine, confirmed cannibalization
risk, not a gray area — `KEYWORD-MAP.md` had already explicitly assigned "EUDR software features /
what to look for" to `/eudr` back in Phase 2, with the note "folds into the main category page rather
than needing separate content initially." "How to choose EUDR software" was also already claimed by
an existing FAQ on `/eudr`. Both terms were explicitly avoided as the article's primary target.

**Resolution**: proceeded per option (a) — the article is structured to genuinely differ from the
reference table, not restate it in longer form:
- Buyer-segment tracks (large operator/trader vs. small trader/producer) as the *organizing
  structure* of the whole piece, not a single footnote row like on `/eudr`
- A "questions to ask a provider" script (10 questions, each with a one-line reason it matters) — a
  content type that doesn't exist anywhere else on the site
- Narrative, sequential framing ("start with role and size, then work through what matters, then use
  this script"), explicitly pointing back to `/eudr`'s comparison framework as the detailed reference
  rather than restating its 12 categories

**Target keyword**: primary "questions to ask EUDR software providers" — confirmed absent from
`KEYWORD-MAP.md`, genuinely open territory. Secondary "how to evaluate EUDR software" used only in
intro prose, not as the page's primary target, since "how to choose EUDR software" is adjacent
territory already claimed by `/eudr`.

**Published at** `/resources/blog/eudr-software-questions-to-ask-providers`, linked from the blog hub
(replacing its "nothing published yet" placeholder) and added to `app/sitemap.ts`. Reuses
`EUDR_DEADLINES` from `lib/eudr-dates.ts` for the one date mentioned (large/medium operator deadline)
rather than hardcoding it. No new regulatory claims were made — every fact used (operator/trader
distinction, deadlines, geolocation point/polygon split, due diligence statement mechanics) was
already verified in earlier phases and is simply reused, cited consistently with `/eudr` and
`/resources/regulations/eudr`.

No competitor names appear anywhere in the article (swept). No em-dashes (swept, per the standing
rule established in Part 1 of this phase — this being new copy, the rule applied from the start
rather than needing cleanup after the fact).

**Verification**: `tsc`, `eslint` (required a follow-up pass to fix `react/no-unescaped-entities`
errors from plain apostrophes in JSX text, not `&apos;` — the convention every other page on this
site already uses), a full production build, and live-server rendering checks confirming the content,
internal links, deadline value, and zero em-dash bytes in the rendered HTML.

### Refinement round (still pending publish approval)

After the draft was shown, the user requested targeted refinements — implemented, not a rewrite:

1. **Two new provider questions added**: "How does the platform handle incomplete or changing
   supplier data?" and "What does implementation require from our team?" — both are practical
   vendor-evaluation questions, not regulatory claims, so no new primary-source verification was
   needed (see item 6 below).
2. **Every question (12 total) now has a third line** — what to specifically ask/look for in the
   provider's answer, alongside the existing "why this matters" line. Both kept to one sentence each,
   per instruction, so the script stays scannable rather than turning into a feature-by-feature guide.
   Styled in the site's existing indigo (`#4338ca`) to visually distinguish it from the gray "why"
   line, using only colors already established elsewhere on the site.
3. **Confirmed no standalone capabilities checklist was added** — the article still only points to
   `/eudr`'s 12-category table as the reference, never restates it, exactly as before.
4. **CTA copy replaced** with the exact text requested: "Tell us what your company needs and we'll
   put your requirements in front of relevant EUDR software providers." → `/finder?category=EUDR%20Software`.
   Flagging for the record: this phrasing sits close to (though I judge it as distinct from) the "we
   identify providers that are relevant" pattern that Phase 8's no-algorithmic-matching audit
   specifically flagged and rewrote sitewide, since Software Lantern is again the grammatical subject
   "putting" requirements "in front of relevant" providers. Implemented exactly as instructed, since
   it was a specific, verbatim request, not a general copy brief, but noting the tension here per this
   phase's own "flag genuine tensions with established principles" practice rather than silently
   complying without comment.
5. **Re-verified keyword ownership**: the `<title>`, meta description, H1, and intro paragraphs
   (where "questions to ask EUDR software providers" and "how to evaluate EUDR software" are
   established) were not touched by any of the above changes — confirmed by direct diff of the
   metadata block. No cannibalization drift introduced; the three-way split (`/eudr` transactional,
   `/resources/regulations/eudr` informational, this article commercial-investigation) still holds.
6. **New-claim verification**: neither new question, nor any of the 12 new "look for" lines, nor the
   CTA change asserts a new regulatory fact. All are practical software-buying advice. Nothing
   required primary-source re-verification.
7. **Em-dash check**: zero in source and zero in rendered HTML, re-confirmed after all edits.

### CTA — final revision

The flagged CTA phrasing (item 4 above) was replaced with: "Tell us what your company needs and
we'll publish your requirements to EUDR software providers in the category. The ones who believe
they're a fit will respond." This matches, word-for-word in structure, the same "publish to
providers in the category. [N] who believe they're a fit will respond." pattern already live on
`/eudr`, `/plm`, and `/battery-passport` — confirmed consistent with the established
publish-then-self-select language, not a regression. The instruction's own em-dash was restructured
into a period split (same treatment as the identical construction fixed on the three category pages
in Part 1 of this phase), per the standing style rule.

**Status: approved and published** — re-verified via `tsc`, `eslint`, a full production build, and
live-server rendering confirming the final CTA text and zero em-dash bytes in the rendered HTML.

---

## 3. Second blog article — Fashion PLM

Same process as the EUDR article: duplication check and keyword confirmation shown and approved
before writing full copy, no rewrite/find-replace of the EUDR piece.

**Duplication check**: `/plm` does not have an EUDR-style deep comparison framework (that Phase 7
treatment was never applied to `/plm`). It has a lighter "What your brief will cover" 4-card summary
and a short FAQ answer ("How do I choose a fashion PLM system?"). Lower duplication risk than EUDR,
but real content to differentiate from, not a blank slate.

**Keyword check**: checked all five candidates in the request against `KEYWORD-MAP.md`. "fashion PLM
software," "fashion PLM software comparison" are Tier 1/2 and explicitly assigned to `/plm`. "fashion
PLM software features" is not a literal map entry, but the adjacent workflow-tool cluster (tech pack
software, BOM management software, sample management software, costing software, supplier
collaboration software) is explicitly assigned to `/plm`'s existing section. "How to choose fashion
PLM software" is not documented in the map but is near-verbatim the live FAQ already on `/plm`.
"Fashion PLM software checklist" and "questions to ask PLM software providers" are open in both the
map and live content. Also checked `SERP-GEO-ANALYSIS.md` (existing research reused, no new search
needed) — comparison/listicle-style fashion PLM queries are heavily vendor-saturated (confirmed
competitor names, all excluded from this article per the standing rule), reinforcing that a
questions-to-ask script is genuinely differentiated from that space, same conclusion as EUDR.

**Confirmed target**: primary "questions to ask fashion PLM software providers," secondary "how to
evaluate fashion PLM software" used only in intro prose, mirroring the EUDR resolution.

**Buyer-segment tracks adapted, not copied**: EUDR's operator/trader framing is regulation-specific
and doesn't apply to PLM. Used *small or growing brand* vs. *multi-brand or multinational business*
instead, mirroring the segmentation already established in `/plm`'s own live copy.

**Content**: 11 questions, each with a "why this matters" and "what to look for in the answer" line,
covering every workflow area specified: materials/fabrics/trims, BOM management, tech packs, supplier
collaboration, sampling, costing, collection/season management, critical path/calendar management,
ERP integration, PLM-to-3D-design workflow, and multi-brand/multi-season complexity. Each question is
specific to the actual workflow (e.g. "how many steps to create a new colorway's BOM," not "does it
have BOM management?"). No claims about current vendor differentiation or market trends were made —
every "why it matters" line is grounded in structural, evergreen buyer-decision reasoning rather than
an assertion about what vendors currently do, which sidesteps the verification risk the request
flagged rather than requiring new research to clear it.

**CTA URL corrected**: the request specified `/finder?category=Product%20Lifecycle%20Management`,
but the actual category string used everywhere else on the site (matching `/plm`'s own CTA) is
`"Product Lifecycle Management (PLM)"`. Used the correct full string so the finder preloads the
category correctly, flagged and confirmed before writing.

**Published at** `/resources/blog/fashion-plm-software-questions-to-ask-providers`, linked from the
blog hub alongside the EUDR article, added to `app/sitemap.ts`. No competitor names (swept, including
every vendor name surfaced in the PLM SERP research). No em-dashes (swept, source and rendered HTML).

Per instruction, the Battery Passport article was **not** written this phase — held pending real
Search Console signal from these first two articles, consistent with the existing gate-on-data
discipline used for industry-specific subpages elsewhere in this project.

**Verification**: `tsc`, `eslint`, full production build, live-server rendering confirming all 11
questions, both buyer-segment tracks, the corrected CTA link, the hub listing, and zero em-dash bytes.

**Status: approved and published.**

---

## 4. Visual enrichment — regulation article + EUDR blog article

Enrichment of two existing pages (`/resources/regulations/eudr` and the EUDR blog article), not new
pages, not a merge. Plan (icon sections, table decision, FAQ questions) shown and approved before
implementing.

**New shared module** `components/icons.tsx`: eight simple, generic inline line icons (leaf,
document, shield, magnifying glass, calendar, exchange/arrows, checklist, building, box), same stroke
style as the icon already established in the deadline countdown component. `eudr-deadline-countdown.tsx`
now imports its calendar icon from this shared module instead of defining its own copy, removing
duplication rather than adding to it.

**Table decision**: attempted to verify EUR-Lex Annex I (which commodity maps to which derived
products) to build a "commodity → example products" table. **Failed after 2 fetch attempts**, same
truncation issue seen with long EUR-Lex documents elsewhere in this project. Since a table would imply
regulatory precision that couldn't be backed up, no table was added — the commodities section instead
became an icon-grid (leaf icon, 7 cards) achieving the requested visual richness without the unverified
claim. No other section was genuinely tabular enough to justify a table either, so this phase adds zero
new tables, a deliberate judgment call, not an oversight.

**`/resources/regulations/eudr` changes**:
- Byline added under the H1: "Written by Johannes Cornelis de Boer, founder of Software Lantern" —
  the name already published and verifiable on `/privacy`, no invented persona.
- "Who does EUDR apply to?" — the Operator/Trader list became 2 icon cards (document icon for
  Operator, exchange-arrows icon for Trader).
- "EUDR covers seven commodities" — became an icon-grid (leaf icon × 7), not a table, per the
  verification failure above.
- "EUDR requirements" — the 4-part list became icon cards (document, magnifying glass, shield,
  checklist).
- "EUDR deadlines" — became 2 icon cards using the calendar icon, matching the countdown component's
  visual pattern and accent colors (indigo / emerald). **Both cards read their dates directly from
  `EUDR_DEADLINES` in `lib/eudr-dates.ts`** — the same import already used elsewhere on this page — so
  there is no independent restatement and no drift risk from the countdown component, per the explicit
  confirmation requested before implementing.
- New FAQ section added (5 questions), every answer reusing only already-established facts already on
  this page or in `lib/eudr-dates.ts`: operator/trader distinction, the SME deadline and its
  operator-only scope, the low-risk simplified procedure, where the due diligence statement is filed,
  and the 2025/2650-supersedes-2024/3234 history. No penalties/enforcement question was added, since
  that hasn't been verified anywhere in this project and wasn't going to be guessed at.
- **CTA block left completely unchanged** (confirmed via direct diff) — no push toward commercial
  intent, no merge with the blog article's framing.

**Blog article changes**: same byline treatment; the two buyer-segment sections (large operator/trader,
small trader/producer) became icon cards (building icon, box icon), keeping their full existing text.
No FAQ, no table (nothing genuinely tabular there, and none was requested for this page).

**Standing rules**: no competitor names anywhere (swept, including Matchilla specifically, per the
explicit instruction not to reference the competitor this enrichment was prompted by reviewing — it
was never mentioned in any draft). No em-dashes (swept, source and rendered HTML, only remaining
instance sitewide is a pre-existing code comment in `eudr-deadline-countdown.tsx`, out of scope for the
live-copy rule). No pricing or budget figures added anywhere (checked directly, none present). No new
regulatory claims beyond what's already verified elsewhere in this project.

**Verification**: `tsc`, `eslint`, full production build (both pages still static, `/eudr`'s countdown
component unaffected by the icon-import refactor), live-server rendering confirming the byline, all
icon-card sections, all 7 commodity chips, the FAQ, correct date values, and zero em-dash bytes on both
pages.

## 5. Sitewide icon-card enrichment + new PLM comparison section

Extended `components/icons.tsx` with 16 new simple line icons (`MapPinIcon`, `SendIcon`,
`FolderIcon`, `PeopleIcon`, `PlugIcon`, `TagIcon`, `SwatchIcon`, `ChatIcon`, `FlagIcon`, `CubeIcon`,
`LayersIcon`, `ShirtIcon`, `BatteryIcon`, `TargetIcon`, `HandshakeIcon`, `ScaleIcon`), same 24x24,
~1.8 stroke style as the existing set. Reused existing icons wherever the concept repeated (e.g.
`BuildingIcon` for "company size fit" on both `/eudr` and `/plm`) rather than creating near-duplicates.

Applied icon-card treatment to every discrete factor/benefit list sitewide:

- **Homepage**: the 3 category cards' previously-empty colored circles now hold a real icon
  (`LeafIcon` for EUDR, `ShirtIcon` for Fashion PLM, `BatteryIcon` for DBP). The 4-item "Why use
  Software Lantern" grid got icons (`MagnifyingGlassIcon`, `TargetIcon`, `HandshakeIcon`, `TagIcon`).
- **Providers page**: the 4-item "Why providers work with us" grid got icons (`DocumentIcon`,
  `ScaleIcon`, `HandshakeIcon`, `ShieldIcon`).
- **`/eudr`**: the 12-factor "How to choose EUDR compliance software" grid, previously plain
  h3/p text, converted to icon cards (one icon per factor, no card border, matching the density of a
  12-item grid). The 4-card "What your brief will cover" section got icons.
- **`/plm`**: brand-new "How to choose fashion PLM software" section added, 12 factors in the same
  icon-card format as `/eudr`'s, inserted between "What is fashion PLM software" and "What your
  brief will cover" (mirroring `/eudr`'s section order). All 12 factors and their descriptions are
  drawn from content already established and verified in the fashion PLM blog article (materials/trim
  library, BOM management, tech packs, supplier collaboration, sampling, costing, season/collection
  planning, critical path, ERP integration, 3D design integration, multi-brand scalability, company
  size fit), not new claims. The 4-card "What your brief will cover" section also got icons.
- **`/battery-passport`**: the 4-card "What your brief will cover" section got icons, for
  consistency with the other two category pages, even though no "How to choose" section was
  requested for this page this pass.
- **Fashion PLM blog article**: the two buyer-segment sections (small/growing brand vs.
  multi-brand/multinational), previously plain `<h3>` headers, converted to the same `BuildingIcon`/
  `BoxIcon` icon-card treatment already used on the EUDR blog article, for parity.
- **Bylines added** (per explicit confirmation) to the Fashion PLM blog article and the Battery
  Passport regulation article: "Written by Johannes Cornelis de Boer, founder of Software Lantern",
  same text and placement as the two EUDR pages, matching the founder name already published on
  `/privacy`.

**Deliberately left untouched, for consistency**: the numbered step sequences (homepage "How it
works," providers "How it works for providers," providers "Our promise" 1-2-3 refund steps) stay
number-only, no icons. Numbers are the correct signifier for an ordered process, not a set of
parallel factors, and per the "all factors get one, or none do" rule, icon-ing two of the three
step-flows but not the third would itself be the inconsistent outcome.

No new regulatory or software-feature claims: every EUDR factor already existed in this file's copy
(just re-presented with an icon); every PLM factor is drawn from the already-verified blog article.
No competitor names, no em-dashes, no pricing/budget figures added anywhere in this pass.

**Verification**: `tsc --noEmit` clean, `eslint --max-warnings=0` clean, full production build (all
touched pages still static: `/`, `/plm`, `/eudr`, `/battery-passport`, `/providers`, both blog
articles, the Battery Passport regulation article). Production server + `curl` checks confirmed: 12
icon-card factors render on both `/eudr` and `/plm`, all new section headings and byline text render,
zero em-dash bytes across every touched page, no competitor names (including a Matchilla-specific
check) in any touched file, no pricing/budget-figure patterns in any touched file.
