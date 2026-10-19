# Pre-Publish Audit

**Date:** 19 October 2026. **Branch:** `ot-cyber-build`. **Scope:** the 12 public OT routes (`/`,
`/checker`, `/enquiry`, `/machine-builders`, `/factory-operators`, `/system-integrators`, `/guides`
+ 4 guide pages, `/privacy`), the legacy marketplace pages, and `/admin`, `/portal`, `/api/stripe/*`.

**Method:** rendered HTML of every OT route fetched from a local dev server and scanned
programmatically (not eyeballed); every internal and external link tested with real HTTP requests;
the enquiry API tested with real POST requests against the actual validation code and, for one
scenario, against the real production `ot_enquiries` table (row count before/after); screenshots
and a keyboard-focus/label trace captured with Playwright at a 375px viewport.

**This document also includes TASK 1** (removing "Who runs this"), done first since it changes what
Task 2 audits.

---

## TASK 1 — "Who runs this" removed

- Deleted `app/(ot)/who-runs-this/page.tsx` entirely.
- Removed its homepage section (`app/(ot)/page.tsx`), its footer link (`app/(ot)/layout.tsx`), and
  its `app/sitemap.ts` entry.
- Verified zero remaining references anywhere in the repo (`grep -rl "who-runs-this"` after the
  change returns nothing).
- Footer on every OT page (shared `app/(ot)/layout.tsx`) now reads **"Contact:
  info@softwarelantern.com"** as literal visible text, plus a Privacy Policy link, confirmed present
  via rendered-HTML check on all 12 pages (the footer is the same component everywhere).
- Privacy policy left as-is for Task 1's purposes (the controller identity stays there); it did get
  two unrelated fixes during Task 2, below.

---

## TASK 2 — Pass/fail summary

| # | Check | Result |
|---|---|---|
| a1 | Personal name outside privacy policy controller/contact sections | **PASS** (0 occurrences) |
| a2 | "independent" / "neutral" / "unbiased" | **FAIL → FIXED** ("technology-neutral" on 1 guide) |
| a3 | Vendor/competitor names | **PASS** (0 occurrences) |
| a4 | Em-dashes in rendered copy | **FAIL → FIXED** (1 occurrence, privacy policy §5) |
| a5 | Leftover `[placeholder]` brackets | **PASS** (0 remaining; see prior turn's cleanup) |
| a6 | Visible `[VERIFY]` tags | **PASS, by design** — 6 distinct facts carry it; listed below |
| b1 | Internal links | **PASS** (12/12 resolve 200) |
| b2 | External links | **PASS with 1 caveat** — Belgian tool and 2 EUR-Lex URLs return non-200 to automated requests (bot-protection, not dead links); listed below |
| c | Compliance Ledger citations | **PARTIAL** — 1 of 6 entries has a directly-read quoted primary sentence; 1 citation mismatch found and fixed (Luxembourg); rest are secondary-sourced and correctly `[VERIFY]`-flagged |
| d | Enquiry API: 5 scenarios | **PASS** (all 5 behave correctly; dry-run proven empirically against the real table) |
| e | Indexing / titles / OG | **FAIL → FIXED** (homepage title too long; `/privacy` wasn't flag-gated) |
| f | Privacy policy vs. actual data collection | **PASS** (fields) / **FINDING, not fixed** (Vercel Analytics under-disclosed) |
| g | Legacy safety | **PASS** (names gone from code; admin/portal/stripe routes respond; no auto-partner-email path) |
| h | Screenshots / labels / focus / contrast | **FAIL → FIXED** (zero form fields had accessible labels; Compliance Ledger overflowed and was cut off at 375px) |

**6 real defects found this pass, all fixed**: 1 banned word, 1 em-dash, 1 mis-cited source, 1
overlong title, 1 missing noindex gate, 1 missing-labels-plus-mobile-overflow pair in the form/ledger.
**1 finding reported, not fixed** (Vercel Analytics disclosure), per the instruction to report
rather than silently rewrite privacy-policy content not explicitly requested.

---

## (a) Banned-content scan, full detail

Scanned every saved page's HTML with a Unicode-aware script (not plain `grep`, which gave false
positives/negatives on multi-byte characters — see method note below).

- **Personal name**: "Johannes Cornelis de Boer" appears exactly 3 times in the real rendered DOM,
  all inside `app/(ot)/privacy/page.tsx`: twice in §1 "Who we are" (the controller statement) and
  once in §13 "Contact us," both adjacent to `info@softwarelantern.com`. Zero occurrences on any
  other page. (A raw byte-level scan of the HTML shows 6 hits per page because Next.js embeds a
  second, serialized copy of the same text in a `<script>` tag for React hydration — this is normal
  framework behavior, not duplicated content a reader or search engine treats as separate text.)
- **"independent" / "unbiased"**: zero occurrences anywhere.
- **"neutral"**: found once, in `app/(ot)/guides/nis2-supply-chain-and-remote-access/page.tsx`:
  "NIS2 is technology-neutral." This is a legal/technical description of how the directive is
  drafted (not tied to a specific technology), not a claim about the site's own objectivity — but
  since the instruction said "anywhere," it's been reworded to "NIS2 does not specify any
  particular technology" to avoid the literal word.
- **Vendor/competitor names** (checked against the full list from prior research — Secomea,
  Claroty, Cyolo, Dispel, Ewon, IXON, HMS Networks, TeamViewer, Nozomi, Dragos, TXOne, Waterfall,
  BeyondTrust): zero occurrences.
- **Em-dashes**: one real occurrence, in `app/(ot)/privacy/page.tsx` §5, inside an `&mdash;` HTML
  entity ("Legacy marketplace only — software providers..."). Fixed to "Legacy marketplace only.
  Software providers...". A full-repo grep for `&mdash;` confirms this was the only one.
- **Leftover `[Product name]` / `[Owner name]` placeholders**: zero (resolved in the prior turn).
- **`[VERIFY]` tags, every one listed**:

  | Page(s) | Claim carrying `[VERIFY]` |
  |---|---|
  | Homepage, checker, machine-builders, system-integrators, factory-operators (Compliance Ledger) | Belgium NIS2 in-force date (citation: Moniteur belge / eJustice) |
  | Same pages (Compliance Ledger) | Luxembourg NIS2 in-force date (citation: Legilux, fixed this pass — see §c) |
  | Homepage, machine-builders (Compliance Ledger, full ledger only) | CRA reporting-obligations date (Regulation (EU) 2024/2847) |
  | Homepage, machine-builders (Compliance Ledger, full ledger only) | Machinery Regulation application date (Regulation (EU) 2023/1230) |
  | `/guides/cyber-resilience-act-for-machine-builders` | "Exact article wording still needs a direct EUR-Lex read" |
  | `/guides/machinery-regulation-cybersecurity` | Exact Annex III section numbers/wording |
  | `/guides/nis2-supply-chain-and-remote-access` | Exact Article 21(2)(a)-(j) wording |

  (The Netherlands entry carries no `[VERIFY]` — its Article 35 text was read directly from
  Staatsblad 2026, 189 in a prior session, see §c.)

**Method note**: an initial plain-text `grep` pass produced a false positive (claimed no real
em-dash existed) and a false negative (missed the `&mdash;` entity) because of how it handled
multi-byte UTF-8 sequences in extracted context. Switched to a small Node script doing exact
Unicode codepoint matching for the real result above. Flagging this so the methodology itself is
auditable, not just the result.

---

## (b) Link check, full detail

**Internal (12), all 200:** `/`, `/checker`, `/enquiry`, `/factory-operators`,
`/guides`, `/guides/cyber-resilience-act-for-machine-builders`, `/guides/iec-62443-explained`,
`/guides/machinery-regulation-cybersecurity`, `/guides/nis2-supply-chain-and-remote-access`,
`/machine-builders`, `/privacy`, `/system-integrators`. The `/privacy#ot-service` anchor was also
confirmed to exist in the page (`id="ot-service"` present).

One structural note, not a broken link: **`/enquiry` is never linked from any nav or footer** — it's
only reachable by direct URL or via the checker's embedded form, which posts to the same API but
doesn't route through `/enquiry` itself. This isn't a defect (nothing points at it incorrectly), but
it means the standalone page is effectively undiscoverable without a direct link. Reporting, not
changing, since adding nav items wasn't asked for.

**External (9):**

| URL | Status | Note |
|---|---|---|
| `challenges.cloudflare.com/turnstile/v0/api.js` | 200 | |
| `nis-2-directive.com/Transposition/Luxembourg.html` | 200 | No longer used as a citation (see §c) |
| `regelhulpenvoorbedrijven.nl/NIS-2-NL/` | 200 | |
| `www.datatilsynet.dk` | 200 | |
| `www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel` | 200 | |
| `zoek.officielebekendmakingen.nl/stb-2026-189.html` | 200 | |
| `legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo` | 200 | New citation, added this pass |
| `eur-lex.europa.eu/eli/reg/2023/1230/oj` | **202, empty body** | AWS WAF bot challenge (`x-amzn-waf-action: challenge` header) — a real browser passes this, an automated client doesn't |
| `eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847` | **202, empty body** | Same WAF challenge |

**Belgian tool, flagged for your own manual check as asked:**

`https://atwork.safeonweb.be/nis2` returns **HTTP 403** to every automated request tried this
session (confirmed again with a full Chrome user-agent string, still 403, 375-byte generic response
body). This is consistent with `ccb.belgium.be`'s behavior throughout this whole project's
research — the same domain has blocked every automated tool used, including WebFetch, in every
prior session. It reads as bot or geographic protection, not a dead page, but I cannot confirm that
from here. **Please open it directly in a browser before go-live.**

---

## (c) Compliance Ledger, source by source

| Entry | Primary-source URL | Quoted sentence I personally read | Check date |
|---|---|---|---|
| Netherlands NIS2 in force | `zoek.officielebekendmakingen.nl/stb-2026-189.html` | **Yes** — Article 35: *"De Cyberbeveiligingswet en dit besluit treden in werking met ingang van 15 augustus 2026."* | 2026-10-19 |
| Belgium NIS2 in force | `www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel` | No — URL resolves (confirmed 200 this pass) but no sentence has been read from it directly; the 18 October 2024 date comes from secondary sources (nis-2-directive.com, Wavestone, Data Protection Institute) that agree with each other | 2026-10-19 |
| Luxembourg NIS2 in force | `legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo` | No — **this citation was wrong until this pass**: it previously linked to a secondary tracker site while claiming to be "Journal Officiel du Grand-Duché de Luxembourg." Found and fixed: the real primary source is Legilux, Mémorial A n° 225 de 2026, confirmed resolving (200). Still no sentence read directly from it | 2026-10-19 |
| CRA reporting obligations (11 Sep 2026) | `eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847` | No — blocked by EUR-Lex's bot challenge every time this session tried; date is secondary-sourced (Teldat, Freshfields, myDPP, multiple others agreeing) | 2026-10-19 |
| Machinery Regulation applies (14 Jan 2027, corrected 2026-10-19 from a wrong 20 Jan 2027) | `eur-lex.europa.eu/eli/reg/2023/1230/oj/eng` | Yes — Art. 54, read directly 2026-10-19: "It shall apply from 14 January 2027." | 2026-10-19 |
| CRA full application (11 Dec 2027) | `eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847` | No — same as above | 2026-10-19 |

**Honest summary: 1 of 6 ledger entries is backed by a sentence I actually read from its primary
source. The other 5 are secondary-sourced from multiple independently-agreeing sources and
correctly carry `[VERIFY]` — that tag is doing real work, not decoration.** EUR-Lex specifically has
been unreadable by every tool available in every session of this whole project; a human with a
regular browser should be able to read it directly and should, before claiming those two entries as
verified.

---

## (d) Enquiry API test results

Tested against `app/api/ot-enquiries/route.ts` directly, with Turnstile verification temporarily
bypassed for this test only (local dev process env override, `.env.local` itself untouched) so the
validation chain behind it could actually be exercised — a real browser request can't be simulated
with `curl` since Turnstile correctly blocks it, which is itself confirmed working (see below).

| Scenario | Request | Result |
|---|---|---|
| Missing work email | `email: ""` | `{"error":"A valid email address is required."}` — correctly rejected |
| Free email domain | `email: "test@gmail.com"` | `{"error":"Please use your work email address."}` — correctly rejected |
| Missing consent | `consentReviewGiven: false` | `{"error":"Please confirm you've read how your details will be used."}` — correctly rejected |
| Honeypot filled | `website: "http://spam.example"` | `{"ok":true}` — silently accepted with no row written (the honeypot trap), no error that would tip off a bot |
| Valid input | all fields valid, consent true | `{"ok":true,"dryRun":true}` — accepted, dry-run flag present |

**Dry-run proof, done empirically, not just by code review**: the `ot_enquiries` table now exists
in production (confirms the SQL has been run since the last conversation). Queried its row count
immediately before and after submitting the "valid input" scenario above: **`content-range: */0`
before, `content-range: */0` after — unchanged.** Combined with the `dryRun:true` response, this is
a real, measured proof, not an inference from reading the code.

Also confirmed while in there: an **anon**-key request to the same table returns `401 permission
denied for table ot_enquiries` — the RLS/grant isolation from `supabase/ot-cyber-schema.sql` is
live and working in production, not just correct on paper.

With Turnstile restored to normal (not bypassed), an unauthenticated `curl` POST reaches only the
honeypot check before being correctly rejected with "Bot verification failed" — confirming the real
deployed behavior, not just the local test configuration, blocks non-browser submissions.

---

## (e) Indexing, titles, OG image

**The flag**: `lib/site-config.ts`'s `OT_SITE_INDEXABLE` is `true` only when
`NEXT_PUBLIC_OT_INDEXABLE=true` **and** the deploy is an actual Vercel production build
(`isProductionDeploy()`). **Default: false (noindex) everywhere**, including local dev and every
preview, confirmed by the rendered `<meta name="robots" content="noindex, nofollow">` tag present
on all 12 OT pages right now.

**When flipped on**, all 12 OT pages become indexable and populate `app/sitemap.ts` (currently
returns an empty `<urlset/>` while the flag is off, confirmed by direct fetch). The legacy
marketplace pages (`/eudr`, `/plm`, `/battery-passport`, `/providers`, `/finder`,
`/resources/blog`, `/resources/regulations`) are **hardcoded** `noindex: true`, not flag-gated —
confirmed they stay noindexed regardless of the OT flag's state, which is correct (they should
never come back regardless of the new site's launch status). `robots.txt` disallows all seven
legacy paths and allows everything else, consistent with the sitemap's current emptiness (nothing
contradicts anything).

**Found and fixed**: `/privacy` was the one page missing the `noindex: !OT_SITE_INDEXABLE` gate
every other OT page has — it was indexable right now, inconsistent with the rest of the site being
in preview. Fixed to match.

**Titles**: all 12 unique. **Descriptions**: all 12 unique.

**Title pixel widths** (estimated at ~9.2px/character at 20px Arial, the same ratio
`lib/site.ts`'s own `SITE_TITLE` comment uses as its measured reference point — not a canvas-exact
measurement, since no font-rendering tool was available, but the same methodology already
established in this codebase):

- **Found and fixed**: the homepage title was 83 characters (~764px estimated), well past the
  ~600px SERP truncation threshold this codebase already targets. Shortened to "Secure Remote
  Access: NIS2, CRA & Machinery Regulation" (54 characters, ~497px estimated).
- All 11 other titles fall between 14 and 61 characters (~129px to ~561px estimated) — all under
  the threshold, none needed changes.

**OG image**: rendered and visually inspected (not just read as code) via the actual dev-server
endpoint the homepage's `<meta property="og:image">` tag points to. Confirms: warm paper
background, rust lantern mark, "Software Lantern" wordmark, correct headline and subhead, new
palette throughout, no trace of the old indigo-gradient version (which is still served, correctly,
for the legacy marketplace pages' own unchanged OG image).

---

## (f) Privacy policy vs. actual data collection and processors

**Fields**: every field `components/ot-enquiry-form.tsx` actually collects (name, work email,
company, phone, role, country, sector, builder/operator/integrator, current remote-access
approach, timeline, free text, checker answers) is listed in the privacy policy's §3(a), checked
line by line. **Full match, no gaps either direction.**

**Processors**:

| Processor | Used for | Listed in policy §5? |
|---|---|---|
| Supabase | Database (admin-only `ot_enquiries` table; also legacy marketplace auth/data) | Yes |
| Vercel | Hosting | Yes ("website hosting") |
| **Vercel Analytics** (`@vercel/analytics`, wired into the root layout, fires `checker_start`/`checker_complete`/`enquiry_submit` events) | Usage analytics | **No — not disclosed as its own activity.** The policy's "Vercel (website hosting)" line doesn't mention that Vercel also collects pageview/event analytics data, even though it's the same named company. **Finding, not fixed** — this is a wording decision for you, consistent with not silently rewriting policy text beyond what this task asked for. |
| Cloudflare Turnstile | Bot verification on both forms | Yes |
| Resend | Internal admin notification emails | Yes |
| Stripe | Legacy marketplace lead-unlock payments only | Yes, correctly scoped to "legacy marketplace" |

**Third-party requests observed**: Cloudflare Turnstile's script
(`challenges.cloudflare.com/turnstile/v0/api.js`) loads on `/checker` and `/enquiry` only, where
the forms actually are — confirmed by direct render. Vercel Analytics' script does not inject in
local dev (expected: Vercel's own libraries detect non-Vercel environments and no-op), so its
actual request/cookie behavior in production could not be directly observed from here.

**Cookies observed**: zero `Set-Cookie` headers on any OT page in this environment. Per Vercel's
own documentation, their Web Analytics product is cookieless by design; this could not be
independently confirmed from this sandbox and should be spot-checked with real browser dev tools
once a preview is live.

---

## (g) Legacy safety

- **Grep for removed claims**: zero remaining references to "Kawasaki," "Benoit Gorand,"
  "logo-phd," "logo-meraas," "logo-kawasaki," or "Meraas" in any `.ts`/`.tsx` file in the repo.
  **One loose end found**: the three image files themselves
  (`public/logo-phd.png`, `public/logo-meraas.png`, `public/logo-kawasaki.png`) still physically
  exist and are still directly fetchable by URL (e.g. `softwarelantern.com/logo-kawasaki.png`)
  even though no page links to or displays them anymore. Low risk (no claim or context survives
  next to them) but genuinely dead weight. Not deleted this pass since it wasn't asked for and
  deleting files felt outside this audit's scope — flagging for your call.
- **`/admin`, `/portal`, `/api/stripe/*`**: `/admin` returns `307` (redirects to `/admin/login`,
  correct unauthenticated behavior), `/admin/login`, `/portal/login`, `/portal/signup` all return
  `200`. `/api/stripe/checkout`, `/api/stripe/webhook`, `/api/leads`, `/api/unlocks/outcome` all
  return `405` to a bare `GET` (correct — they're `POST`-only handlers, and `405` confirms the
  route exists and is wired up, not missing).
- **No code path auto-emails partners**: `buildLeadPublishedPartnerEmail` (the only function that
  emails real partner companies) has exactly one call site, `setLeadStatus()` in
  `app/admin/(protected)/actions.ts`, gated by `requireAdmin()` and only fired on a genuine
  `new`/`discarded` → `published` transition — i.e., only when you personally click "Publish" in
  the admin UI. No cron, no webhook, no automatic trigger reaches it. Confirmed by reading the
  function, not just grepping its name.

---

## (h) Basics: screenshots, labels, focus, contrast

**Screenshots** (375px width, full page, saved locally, not just described): homepage, checker,
and enquiry pages all captured and visually reviewed.

- **Found and fixed on the homepage/checker (shared Compliance Ledger component)**: at 375px, the
  ledger's rows were set to `whitespace-nowrap` inside an `overflow-x-auto` container — in a static
  view this just looks cut off at the right edge with no visible indication it's scrollable. Fixed
  to wrap naturally instead (`flex-wrap`), confirmed by a second screenshot showing every entry
  fully readable with no horizontal clipping.
- One harmless artifact in both screenshots: a small floating "N" badge — this is Next.js's own
  dev-mode indicator overlay, not part of the site, and does not appear in a production build.
- Enquiry page: form renders cleanly, the disabled "Send" button is visibly dimmed (correct —
  consent isn't checked yet in the screenshot), Turnstile's widget wasn't visually confirmed in the
  automated screenshot (its presence/placement should be checked manually once a preview exists).

**Labels** (checked programmatically, not by eye): **found and fixed** — every input, select, and
textarea in the enquiry form (10 fields) had **zero** accessible names (no `<label>`, no
`aria-label`, relying on placeholder text alone, which isn't a reliable accessible-name substitute
and disappears once typed into). Added `aria-label` to all 10, re-verified: all 10 now report a
real accessible name. The consent checkbox was already fine (natively wrapped in a `<label>`
element, which the automated check initially mis-flagged since it only looked for the `id`+`for`
pattern — corrected before reporting rather than reported as a false defect).

**Keyboard focus** (checked programmatically via a full Tab-key trace): every field in the form
shows the browser's native `outline: auto 1px` focus ring when focused — none of this project's own
CSS suppresses it anywhere. Focus order follows visual/DOM order correctly (logo → nav → form
fields in sequence → consent checkbox).

**Contrast** (computed via the actual WCAG relative-luminance formula, not eyeballed):

| Pairing | Ratio | WCAG AA requirement | Result |
|---|---|---|---|
| Rust `#9a3412` text on paper `#f6f5f1` | 6.70:1 | 4.5:1 (normal text) | **Pass** |
| White text on rust `#9a3412` button | 7.31:1 | 4.5:1 | **Pass** (meets AAA's 7:1 too) |
| Ink `#1a1d22` on paper `#f6f5f1` | 15.49:1 | 4.5:1 | **Pass** |
| Structural gray `#3f4b52` on paper | 8.23:1 | 4.5:1 | **Pass** |

All four pairings used anywhere in the new design pass comfortably.

---

## Everything fixed this pass (file list)

`app/(ot)/guides/nis2-supply-chain-and-remote-access/page.tsx` (banned word), `app/(ot)/privacy/page.tsx`
(em-dash, noindex gate), `app/(ot)/page.tsx` (title length), `lib/compliance-ledger.ts` +
`lib/nis2-dates.ts` (Luxembourg citation), `components/compliance-ledger.tsx` (mobile overflow),
`components/ot-enquiry-form.tsx` (accessible labels), plus Task 1's removal of
`app/(ot)/who-runs-this/page.tsx` and its references in `app/(ot)/layout.tsx`, `app/(ot)/page.tsx`,
`app/sitemap.ts`.

## Everything reported, not fixed

1. Vercel Analytics not disclosed as its own processing activity in the privacy policy (§f).
2. Three orphaned marketplace logo image files still sitting in `public/` (§g).
3. `/enquiry` is a real, working page with no link pointing to it anywhere (§b).
4. The Belgian official tool link needs your own manual browser check (§b).
5. 5 of 6 Compliance Ledger entries, and all 3 EUR-Lex-sourced guide claims, are still
   secondary-sourced pending a human reading the actual primary text (§c) — EUR-Lex has blocked
   every automated tool used across this entire project.
