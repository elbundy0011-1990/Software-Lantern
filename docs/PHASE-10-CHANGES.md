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

<!-- Completed after the duplication check and keyword confirmation below were presented and approved. -->
