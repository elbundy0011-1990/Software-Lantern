# Claims discipline for the OT cybersecurity resource

Scope: `app/(ot)/**`, the OT-specific components (`nis2-scope-checker.tsx`,
`ot-enquiry-form.tsx`, `ot-cyber-interactive.tsx`, `compliance-ledger.tsx`,
`ot-logo.tsx`, `disclosure-slot.tsx`), and the OT-specific lib files
(`compliance-ledger.ts`, `nis2-dates.ts`, `consent-text.ts`,
`checker-session.ts`, `email-templates.ts`). The legacy EUDR/Fashion
PLM/Battery Passport marketplace is a separate product with its own
sourcing discipline (`lib/eudr-dates.ts`, `lib/battery-passport-dates.ts`,
`docs/ICP.md`) and is out of scope here.

## The rule

**Nothing regulatory goes public without a verified claim behind it.**
No date, no "applies from," no "in force since," no article summary —
unless it traces back to exactly one place: `lib/compliance-ledger.ts`.

`scripts/check-claims.mjs` enforces this as a `prebuild` step. It fails
the build if:

1. A `COMPLIANCE_LEDGER` or `SUPPLEMENTARY_EVIDENCE` entry has
   `verified: true` without a citation URL, a check date
   (`lastVerifiedDisplay`), and either a quote or a record.
2. Any in-scope file contains `"[VERIFY]"`, `"pending verification"`,
   `"TODO"`, or a leftover bracket placeholder (e.g. `"[INSERT DATE]"`).
3. Any in-scope file other than `lib/compliance-ledger.ts` and the
   privacy policy's own "Last updated" line contains a literal
   day+month+year date. Every other date must be a JS expression
   referencing a ledger entry (`{entry.display}`, `{entry.evidence...}`),
   never retyped as a string.
4. Any in-scope file references a ledger entry whose `verified` flag is
   `false` (a pulled claim must never be looked up for display).

Run it on its own with `npm run check-claims`.

## How to add a claim

1. **Get the primary source.** A verbatim quote from the official text
   (law, regulation, directive, gazette), or — when the fact is a
   gazette/register record rather than a sentence (signature date,
   publication date, parliamentary document number) — the record's
   fields as published.
2. **Get the URL.** Link to the official text or register directly
   (EUR-Lex, a national gazette, Legilux, etc.), not a secondary
   tracker or summary site.
3. **Add or update the entry in `lib/compliance-ledger.ts`:**
   - `citationLabel` / `citationUrl`: the primary source and its link.
   - `evidence`: either
     `{ kind: "quote", quotes: [{ article, text, translation? }] }` —
     `translation` is required whenever the quote isn't in English,
     labelled "Our translation" wherever it's shown — or
     `{ kind: "record", fields: [{ label, value }] }` for a
     gazette/register record.
   - `subjectLabel` / `subjectUrl`, only if the record's *subject*
     needs a different citation than the record itself (for example, a
     parliamentary bill summary explaining what a gazette record
     transposes).
   - `lastVerified` (ISO) / `lastVerifiedDisplay` (human date): the day
     you actually read the source.
   - `verified: true`.
4. **If the claim isn't a dated timeline event** (a standing
   requirement like "Article 21(2)(d) covers supply-chain security,"
   not "this law took effect on X"), add it to
   `SUPPLEMENTARY_EVIDENCE` instead of `COMPLIANCE_LEDGER` — same
   fields, no `date`/`display`/`status`, since it won't render as a
   ledger row.
5. **Reference it from the page**, never retype the date or quote:
   `const entry = COMPLIANCE_LEDGER.find((e) => e.id === "...")!`, then
   `{entry.display}`, `{entry.evidence.quotes[0].text}`, and
   `Source: {entry.citationLabel}, checked {entry.lastVerifiedDisplay}`
   linking `entry.citationUrl`.
6. **Run `npm run check-claims`** before committing.

## Until you have a primary source

Set `verified: false` (or leave an entry out of `SUPPLEMENTARY_EVIDENCE`
entirely). `components/compliance-ledger.tsx` and
`components/nis2-scope-checker.tsx` withhold unverified ledger entries
from every public render automatically — nothing else needs to change
for the claim to stay hidden. Write no date, no quote fragment, and no
"pending"/"[VERIFY]" marker anywhere else on the site in the meantime;
if removing the claim leaves a sentence incomplete, rewrite the
sentence instead of leaving a placeholder.
