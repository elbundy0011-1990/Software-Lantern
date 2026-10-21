# Claims discipline for the OT cybersecurity resource

Scope: `app/(ot)/**`, the OT-specific components (`nis2-scope-checker.tsx`,
`ot-enquiry-form.tsx`, `ot-cyber-interactive.tsx`, `compliance-ledger.tsx`,
`ot-logo.tsx`, `disclosure-slot.tsx`), and the OT-specific lib files
(`compliance-ledger.ts`, `nis2-dates.ts`, `consent-text.ts`,
`checker-session.ts`, `email-templates.ts`).

## The rule

**Nothing regulatory goes public without a verified claim behind it.**
No date, no "applies from," no "in force since," no article summary —
unless it traces back to exactly one place: `lib/compliance-ledger.ts`.

`scripts/check-claims.mjs` enforces this as a `prebuild` step. It fails
the build if:

1. A `COMPLIANCE_LEDGER` or `SUPPLEMENTARY_EVIDENCE` entry has
   `verified: true` without a citation URL, a check date
   (`lastVerifiedDisplay`), and either a quote or a record. A
   `"corroborated"` tier quote (see "Evidence tiers" below) also needs
   at least 3 `copyUrls`.
2. Any in-scope file contains `"[VERIFY]"`, `"pending verification"`,
   `"TODO"`, or a leftover bracket placeholder (e.g. `"[INSERT DATE]"`).
3. Any in-scope file other than `lib/compliance-ledger.ts` and the
   privacy policy's own "Last updated" line contains a literal
   day+month+year date. Every other date must be a JS expression
   referencing a ledger entry (`{entry.display}`, `{entry.evidence...}`),
   never retyped as a string.
4. Any in-scope file references a ledger entry whose `verified` flag is
   `false` (a pulled claim must never be looked up for display).

5. An entry citing EUR-Lex has no `ojReference` (the act's Official
   Journal reference, e.g. `"OJ L 333, 27.12.2022, p. 80"`).
6. An entry in `lib/incident-evidence.ts` lacks a `recordUrl`, `recordId`,
   `lastVerifiedDisplay`, `tier: "primary"`, `contested: false`, or at
   least one verbatim quote; or another in-scope file names a cited or
   excluded incident without importing from `lib/incident-evidence.ts`,
   or retypes one of its quotes.
7. A regional report file (`lib/whitepaper-content.ts`, `lib/incident-
   evidence.ts`, `lib/vendor-checklist-rows.ts`, `components/whitepaper/*`,
   the report page and its print source) retypes a ledger quote instead of rendering it from the
   ledger, contains an em-dash, uses "independent", "neutral" or
   "unbiased", or reads as a regulation requiring a purchase.

Run it on its own with `npm run check-claims`.

## EU texts read from the Publications Office

EUR-Lex blocks automated reads. Since 21 October 2026, a verbatim read
from the EU Publications Office repository
(`publications.europa.eu/resource/celex/<CELEX>`, which serves the
Official Journal text) counts as a **primary** read. The entry still
links the EUR-Lex ELI URL as `citationUrl`, and records the act's
`ojReference`.

## Guidance documents

Guidance is not law, but a quote from it follows the same rule: a
`SUPPLEMENTARY_EVIDENCE` entry with the verbatim text, the URL it was
read from, and a check date. The regional report quotes NIST SP 800-82
Rev. 3 (read from the NIST PDF) and the joint CISA, FBI, EPA and DOE
fact sheet on primary OT mitigations. cisa.gov refuses automated reads,
so that fact sheet was read from the copy published by the FBI's IC3,
one of its authoring agencies, and `citationUrl` is that copy. A copy
published by an authoring agency counts as a **primary** read.

Paywalled standards (IEC 62443) are never quoted or paraphrased as if
quoted. The report names them and says they are not quoted because the
standard is not freely available.

## Incident evidence

Real incidents follow the same discipline as regulatory claims, in
`lib/incident-evidence.ts`: a primary record only (an official hearing
record or a government agency alert), quoted verbatim, with the record's
URL, identifier, and check date. A case whose public record is contested
goes in `EXCLUDED_INCIDENTS` with the reason, and is never described as
an incident. Quotes that would name a vendor are left out; state their
point as Interpretation instead.

## Evidence tiers

Every quote-kind entry declares a `tier`:

- **`"primary"`**: the quote was read directly from the official text
  (EUR-Lex, a national gazette, Legilux) or is a gazette/register
  record. Public Source line: `Source: [name], checked [date]`, linking
  the official URL. This is the default, and what every entry on this
  site used before the tier system existed.
- **`"corroborated"`**: the official URL did not yield a confirmable
  direct read in this pass (a blocked fetch, a JS-rendering issue, or
  similar), so the wording is corroborated against **at least 3
  independent copies** of the same text instead, listed in `copyUrls`.
  Public Source line: `Source: [act and article]. Wording cross-checked
  against published copies, [date].`, still linking the official URL,
  not one of the copies. `scripts/check-claims.mjs` fails the build if
  a `"corroborated"` entry has fewer than 3 `copyUrls`.

Both tiers render through the same `sourceLineText(entry)` helper
exported from `lib/compliance-ledger.ts` — call that, never hand-write
the Source line, so the two tiers can never drift into a third,
unapproved phrasing.

A `"record"`-kind entry (a gazette/register record rather than a
sentence) has no tier; it's always treated as primary evidence, since
there's no "corroborated register entry" concept.

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
     `{ kind: "quote", tier: "primary", quotes: [{ article, text, translation? }] }`,
     `{ kind: "quote", tier: "corroborated", quotes: [...], copyUrls: [at least 3 URLs] }`
     when the official text wasn't directly confirmable (see "Evidence
     tiers" above) — `translation` is required whenever the quote isn't
     in English, labelled "Our translation" wherever it's shown — or
     `{ kind: "record", fields: [{ label, value }] }` for a
     gazette/register record.
   - `subjectLabel` / `subjectUrl`, only if the record's *subject*
     needs a different citation than the record itself (for example, a
     parliamentary bill summary explaining what a gazette record
     transposes).
   - `lastVerified` (ISO) / `lastVerifiedDisplay` (human date): the day
     you actually read the source (or last cross-checked the copies).
   - `verified: true`.
4. **If the claim isn't a dated timeline event** (a standing
   requirement like "Article 21(2)(d) covers supply-chain security,"
   not "this law took effect on X"), add it to
   `SUPPLEMENTARY_EVIDENCE` instead of `COMPLIANCE_LEDGER` — same
   `evidence` shape, no `date`/`display`/`status`, since it won't
   render as a ledger row.
5. **Reference it from the page**, never retype the date or quote:
   `const entry = COMPLIANCE_LEDGER.find((e) => e.id === "...")!`, then
   `{entry.display}`, `{entry.evidence.quotes[0].text}`, and
   `{sourceLineText(entry)}` linking `entry.citationUrl` — call the
   helper, don't hand-write the Source line.
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
