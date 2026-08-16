# Phase 9 — Navigation Restructure, Resources Section, Email Validation Hardening

## 1. Work-email validation — findings and fix

**Finding, as requested**: server-side enforcement already existed. `/api/leads/route.ts` imported the
same `FREE_EMAIL_DOMAINS` constant as the client wizard and re-checked it independently — so the
check could not have been bypassed by posting directly to the API. The gap was the *list itself*: a
hand-rolled 27-domain array.

**Fix**: replaced the hand-rolled array with [`free-email-domains`](https://www.npmjs.com/package/free-email-domains)
(Kikobeats, MIT, zero dependencies, ~13,300 domains, published within the last day at install time).
Both `lib/finder-config.ts`'s `validateStep()` (client) and `/api/leads/route.ts` (server) import the
same re-exported `FREE_EMAIL_DOMAINS` constant, so the single swap fixed both sides at once — no
separate server-side change was needed beyond the shared import already being in place.

No bundled TypeScript types exist for the package, so a minimal ambient declaration was added at
`types/free-email-domains.d.ts`.

**UI changes**:
- Blocked-state error message softened: *"Please use your work email address — we use it to connect
  your brief to the right providers."*
- Added an always-visible helper caption under the email field in the finder wizard: *"Personal email
  providers (Gmail, Yahoo, etc.) aren't accepted."*

**Documented limitation (not surfaced in user-facing copy, recorded here per your request)**: this is
a heuristic. It cannot distinguish a genuine company running Google Workspace on its own custom
domain (correctly passes) from someone using a personal `gmail.com` address (correctly blocked), and
it cannot catch a free provider that isn't in the list. A false negative here just means an
unqualified lead reaches the admin panel for manual review, not a security or data issue.

Verified directly: `gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `icloud.com`,
`protonmail.com`, `live.com`, `msn.com`, and `aol.com` (every domain you explicitly named) are all
blocked; `softwarelantern.com` and a made-up company domain both correctly pass.

---

## 2. Navigation restructure

- Removed the "Regulations" dropdown (`components/site-header.tsx`) — its three items redirected
  directly to `/eudr`, `/battery-passport`, and `/finder`, with no actual regulations content behind
  them. That behavior is gone.
- Added a "Resources" dropdown in its place, containing **Blog** (`/resources/blog`) and
  **Regulations** (`/resources/regulations`) — both now real content hubs, not redirects.

---

## 3. New routes

| Route | Purpose |
|---|---|
| `/resources/regulations` | Hub — lists both regulation articles |
| `/resources/regulations/eudr` | Standalone EUDR regulation article |
| `/resources/regulations/battery-passport` | Standalone Battery Passport regulation article |
| `/resources/blog` | Scaffold hub, no posts yet (not requested this phase) |

All four added to `app/sitemap.ts`. No PLM regulation page was created — confirmed correct per
`/docs/ICP.md`'s explicit operational-software-vs-regulatory-mandate distinction; any future PLM
educational content belongs under Blog.

---

## 4. Keyword targeting — cannibalization check (per the new standing principle below)

| New page | Target keywords (source: `/docs/KEYWORD-MAP.md`) | Existing page it could theoretically compete with | How distinctness was confirmed |
|---|---|---|---|
| `/resources/regulations` | None directly — navigational hub, not a search-landing page | — | N/A |
| `/resources/regulations/eudr` | "what is EUDR," "EUDR requirements," "EUDR due diligence statement," "EUDR deadline" (Tier 3, EUDR-Enterprise §1) | `/eudr` — targets "EUDR compliance software" (Tier 1/2, commercial/buying intent) | Different search intent tier per the keyword map's own classification: this article is regulation-level and informational; `/eudr` is software-level and commercial. Kept `/eudr`'s own brief GEO definition block unchanged and untouched — this article goes deeper on the regulation than a commercial page should, rather than duplicating `/eudr`'s phrasing |
| `/resources/regulations/battery-passport` | "what is a battery passport," "what is digital product passport," "battery passport requirements" (Tier 3, Battery Passport §6) | `/battery-passport` — targets "battery passport software" (Tier 1/2, commercial) | Same pattern as EUDR — regulation-level informational vs. software-level commercial. Reused (not duplicated) the DPP-vs-Battery-Passport distinction already live on `/battery-passport`, expanded rather than restated |
| `/resources/blog` | None yet — scaffold only | — | N/A |

**Standing principle, as requested — not just for this phase**: any time new content is added to this
site going forward, check it against every existing page's target keywords before publishing, and
record in that phase's `docs/PHASE-X-CHANGES.md` which keyword the new page targets and how it was
confirmed distinct. This phase is the first instance of that practice being applied explicitly and
recorded as a table, and should be the template for future phases.

Note that this represents an evolution from the original `/docs/KEYWORD-MAP.md` recommendation, which
suggested folding these Tier 3 informational keywords into brief on-page GEO blocks on `/eudr` and
`/battery-passport` rather than building standalone pages ("deliberately not a standalone content
investment," per the map's own notes on "what is EUDR"). Building dedicated articles is a deliberate
scope increase from that original plan, made explicitly in this phase — flagging it here for the
record, not as an unresolved conflict.

---

## 5. Regulatory verification

**EUDR article** — reused already-verified facts with no re-derivation needed: both deadline dates
and the operator/trader definitions come directly from `lib/eudr-dates.ts` and the EUR-Lex-verified
Article 13/29/38 research already on record (see `docs/PHASE-7-CHANGES.md`, `docs/PHASE-9-CHANGES.md`
predecessor notes in the EUDR scope checker work). No new primary-source verification was required.

**Battery Passport article — new verification performed this phase**. The "battery passport
requirements" keyword was flagged `[VERIFY]` in the keyword map and had never been checked. A direct
EUR-Lex fetch of Article 77 was attempted (multiple URL formats, including the consolidated-text
pattern that worked for EUDR) and **failed after 5 good-faith attempts** — the regulation is long
enough that every fetch truncated before reaching Article 77, a genuine tooling limitation, not a
skipped step.

Fell back to two independent secondary sources (one explicitly stating it was checked against
EUR-Lex), which corroborated a specific list of data categories the passport is expected to cover.
**This is recorded as medium confidence, not primary-source-verified** — the article's copy reflects
that explicitly: it's framed as "generally expected to cover things like..." rather than an
authoritative, article-numbered legal enumeration, with an explicit line telling readers to confirm
exact data fields against the regulation's annexes. This matches the same register the existing
`/battery-passport` commercial page already uses for its own (similarly general) description of
passport contents — no new claim was made with more precision than the site already carries elsewhere.

The battery categories in scope (EV, LMT, industrial >2kWh) and the 18 February 2027 date were
**not** re-derived — they're the same fact already verified and live on `/battery-passport`, now also
corroborated again by the two secondary sources above. Both pages now read this from a new shared
constant, `lib/battery-passport-dates.ts` (added this phase, matching the `lib/eudr-dates.ts` pattern)
— this wasn't explicitly requested, but since the date now had two separate hardcoded occurrences
across two files, the same drift-prevention rationale that applies to EUDR applies here.

No competitor names appear anywhere in the new content — swept all four new files plus the two
secondary-source domain names themselves (batteryregulation.eu, circularise.com) to confirm neither
made it into live copy, only into this internal changes doc.

---

## 6. CTAs

- EUDR article: two CTAs, as requested — *"Use our scope checker →"* linking to `/eudr#eudr-scope-checker`
  (the existing scope checker's anchor), and *"See software providers that handle EUDR compliance →"*
  linking to `/finder?category=EUDR%20Software`. No separate contact form built.
- Battery Passport article: one CTA — *"See software providers that handle Battery Passport
  compliance →"* linking to `/finder?category=Digital%20Battery%20Passport%20(DBP)`. No scope checker
  exists yet for Battery Passport, so no equivalent second link was added (nothing to link to).

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `npx eslint . --max-warnings=0` — clean.
- `rm -rf .next && npm run build` — production build succeeded; all four new routes built as static
  pages.
- Dev server + `curl` against all four new routes, the homepage, and the existing `/battery-passport`
  commercial page — confirmed correct rendering, correct dates, correct internal links, and that the
  shared date constant didn't change the commercial page's displayed date.
- Verified the email-domain block directly (not just via UI, since the relevant wizard steps aren't
  reachable via a plain `curl` of the initial page): every domain named in the request (gmail.com,
  yahoo.com, hotmail.com, outlook.com, icloud.com, aol.com, protonmail.com, live.com, msn.com) blocks
  correctly; real company domains pass.
- Grepped all new files for competitor names and the two secondary-source domains used in Battery
  Passport research — none present in live copy.

## Not done this phase

- No blog post drafted (scaffold only, as scoped — will draft if asked).
- No PLM regulation page (deliberately excluded, per ICP.md).
- No further primary-source attempt on Article 77 beyond the 5 already made — if exhaustive,
  article-numbered precision on battery passport data requirements is needed later, it will require a
  different fetching approach (e.g., a targeted excerpt rather than the full regulation).
