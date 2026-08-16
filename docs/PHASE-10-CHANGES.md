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

**Status: awaiting approval to commit and push.**
