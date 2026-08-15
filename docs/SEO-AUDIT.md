# Software Lantern — SEO / GEO / Conversion Audit (Phase 1)

**Sources inspected:**
- Codebase (primary source of truth): `/root/software-lantern`, Next.js App Router, current `main` branch.
- Live deployment: `https://software-lantern.vercel.app` — confirmed reachable and confirmed to match the current codebase (spot-checked `/` and `/plm` `<title>`/meta output against the source).
- `https://www.softwarelantern.com` — **does not resolve** (connection failure on request). The custom domain is not live. All findings below are based on the codebase and the Vercel URL, not the custom domain.
- `/docs/ICP.md` — read in full; used as the basis for persona/keyword/intent judgments throughout this audit.

This document is Phase 1 only: **audit, not changes**. No copy, metadata, or structural changes have been made. Per the task's phased checkpoint requirement, this stops here for review before Phase 2 (keyword map).

---

## 1. Existing URL Structure

Public marketing routes:

```
/                    Homepage
/plm                 Fashion PLM category landing page
/finder              Matchmaking wizard (client-rendered, multi-step)
/finder?category=X   Wizard pre-set to a category (EUDR Software | Product Lifecycle Management (PLM) | Digital Battery Passport (DBP))
/finder/done          Post-submission confirmation (session-storage dependent, not deep-linkable)
/providers            Supply-side ("become a provider") page
```

Gated / non-marketing routes (should not be SEO targets, see Section 12):

```
/admin, /admin/login, /admin/leads/[id]     Admin panel
/portal, /portal/login, /portal/signup      Partner portal
/auth/callback                              Auth redirect handler
/api/*                                      API routes
```

**Key structural fact:** there is no dedicated URL for EUDR or Battery Passport content. Both categories are only reachable as a *query-string variant* of the shared `/finder` wizard route (`/finder?category=EUDR%20Software`, `/finder?category=Digital%20Battery%20Passport%20(DBP)`), not as their own page. See Section 15.

---

## 2. Existing Pages (inventory)

| Route | Purpose | Client/Server | Has own `metadata` export? |
|---|---|---|---|
| `/` | Homepage / hub | Server | No (inherits root layout) |
| `/plm` | Fashion PLM category page | Server | Yes |
| `/providers` | Vendor-side landing page | Server | Yes |
| `/finder` | Matchmaking wizard entry | Client (`"use client"`) | No (inherits root layout) |
| `/finder/done` | Post-submission confirmation | Client (`"use client"`) | No (inherits root layout) |
| `/admin/login`, `/portal/login`, `/portal/signup` | Auth forms | Client | No (inherits root layout) |

Only 3 of ~9 public-reachable routes have any page-specific metadata at all. The remaining 6 — including the entire `/finder` funnel, which is where every category's actual buying-intent traffic has to land today — all show the **identical generic homepage title and description**, regardless of which category the visitor came for.

---

## 3. Current Title Tags

| Route | Current `<title>` |
|---|---|
| `/` (and everything inheriting root layout: `/finder`, `/finder?category=*`, `/finder/done`, all auth pages) | `Software Lantern \| Tell us what software you need` |
| `/plm` | `PLM Software \| Software Lantern` |
| `/providers` | `Become a Provider \| Software Lantern` |

**Findings:**
- The homepage title is brand-forward and value-prop-forward but contains **no category keyword at all** — reasonable for a hub page, but means the homepage cannot realistically rank for any specific commercial query.
- `/plm`'s title says "PLM Software," not "Fashion PLM Software." This is a real intent-scoping risk: "PLM software" alone is a broad, heavily contested term dominated by general manufacturing/automotive/aerospace PLM vendors (Siemens Teamcenter, PTC Windchill, Dassault, etc.) — none of which are relevant to Software Lantern's actual ICP (fashion/apparel/footwear). The page is competing in the wrong search space while under-targeting the actual correctly-scoped term, "fashion PLM software" / "apparel PLM software," which is exactly what the ICP document identifies as the target buyer's real vocabulary.
- Every EUDR-intent and Battery-Passport-intent visitor who lands on `/finder?category=...` — via a footer link, a direct search click, or a shared URL — sees the generic homepage title/description in their browser tab and (more importantly) in what Google would index for that URL, since there's no differentiated metadata. This is a significant missed-keyword-targeting gap for two of the three current categories.
- No title currently exceeds recommended length, but none are optimized toward the "primary keyword + compelling commercial value proposition" framing the brief calls for (e.g. nothing currently says "compare providers," "get matched," or similar).

---

## 4. Current Meta Descriptions

| Route | Current description |
|---|---|
| `/` (and all inheriting pages) | "Tell us what software you need. We'll connect you with 3 providers that believe they have the right solution. Free for buyers, no obligation." |
| `/plm` | "Looking for PLM software? Tell us about your business and requirements. We'll connect you with up to 3 PLM providers that believe they can help." |
| `/providers` | "Talk to buyers who have already written down what they need. Apply as a Software Lantern provider." |

**Findings:**
- The homepage/root description is solid boilerplate for the brand generally but, again, has no category keyword and is being served verbatim on `/finder?category=EUDR...` and `/finder?category=Digital Battery Passport...` — a searcher clicking an EUDR-intent result would see zero mention of EUDR in the search snippet.
- `/plm`'s description repeats the "PLM software" (not "fashion PLM software") framing issue from Section 3.
- None of the descriptions currently work the free-for-buyers / "up to 3" mechanic as hard as they could as a *click-through* differentiator in the SERP snippet itself, though the underlying message is directionally right.

---

## 5. Current H1s

| Route | H1 text |
|---|---|
| `/` | "Tell us what software you need" |
| `/plm` | "Looking for PLM software?" |
| `/providers` | "Talk to buyers who have already written down what they need" |

**Findings:**
- Each page has exactly **one** H1 (good — no heading-structure violations found anywhere).
- `/` — fine as a hub H1; not a keyword target and shouldn't need to be.
- `/plm` — same "PLM" vs. "fashion PLM" scoping issue as the title tag; the H1 doesn't state *who it's for* (fashion/apparel/footwear) or *why Software Lantern is different* (the matching mechanic), missing two of the three elements the brief asks every commercial-page H1 to communicate (What + Who + Why-different).
- `/providers` — appropriate for its audience (vendors, not buyers); not a priority SEO target.
- No EUDR or Battery Passport page exists to have an H1 at all — this is the single largest heading-level gap on the site (see Section 15).

---

## 6–7. Current Primary Keyword Target & Search Intent (per page)

| Route | Inferred current keyword target | Actual search intent it could realistically satisfy | Intent match quality |
|---|---|---|---|
| `/` | None (brand/hub) | Branded search ("Software Lantern"), or a visitor arriving from another page | Fine for its role |
| `/plm` | "PLM software" (unintentionally, via title/H1 wording) | Should be: "fashion PLM software" / "apparel PLM software" (direct buying intent) | **Mismatched** — currently scoped too broadly |
| `/providers` | "become a software provider" / "sell to buyers" (vendor-side) | Vendor-side signup intent, not buyer search intent | Fine for its role, low SEO priority |
| `/finder?category=EUDR Software` | None — inherits homepage metadata | Should be: "EUDR compliance software," "EUDR software providers," etc. | **No targeting at all** |
| `/finder?category=Digital Battery Passport (DBP)` | None — inherits homepage metadata | Should be: "battery passport software," "digital battery passport software," etc. | **No targeting at all** |

This table is the clearest way to see the core finding of this audit: **two of Software Lantern's three current categories have no page that can realistically rank for their own core commercial keyword**, and the one category that does have a page (`/plm`) is scoped one level too broad.

---

## 8. Current SEO Weaknesses

1. **No dedicated landing page for EUDR or Battery Passport** (see Section 15 — this is the headline finding).
2. **`/plm` targets "PLM software" instead of "fashion PLM software"** — intent-scope mismatch against a much more contested, less relevant keyword space.
3. **No `robots.ts`** — no explicit crawl directives; admin/portal/API routes have no disallow rules.
4. **No `sitemap.ts`** — no sitemap at all, so nothing proactively tells search engines what the important indexable URLs are.
5. **No `metadataBase`** set in root layout — Open Graph/canonical URL resolution has no base to resolve relative URLs against.
6. **No canonical URLs configured anywhere** — including no canonical strategy for `/finder` vs. `/finder?category=X` variants, which risks Google treating query-string variants as separate, near-duplicate, thin-content pages competing with each other (see Section 13).
7. **No structured data anywhere in the codebase** — no Organization, WebSite, or BreadcrumbList schema (see Section 12 for GEO-specific structured data gaps).
8. **Generic favicon** — `app/favicon.ico` is the default Next.js scaffold icon, not a Software Lantern brand asset. Minor but a real trust/polish signal.
9. **No Open Graph or Twitter Card metadata anywhere** — shared links (including the ones prospective providers or buyers might share internally, e.g. "look at this EUDR matchmaking thing") render with no image/title/description card on social platforms or messaging apps, and some AI/GEO crawlers also read OG tags as a secondary signal of page identity.
10. **`/finder` and `/finder/done` have zero page-specific metadata** despite being the pages that actually carry conversion-critical, category-specific traffic.
11. **Footer "About," "Resources," and "Privacy" links all point to `/`** — these are not real pages. Beyond the UX issue, the absence of a real About page and Privacy policy is also a Section-12/E-E-A-T weakness (see below).

---

## 9. Current GEO (AI Search) Weaknesses

1. **No content anywhere currently answers the category-definition questions the brief lists as target GEO queries** — e.g., nothing on the site currently gives a clear, extractable answer to "What is EUDR compliance software?", "What is Battery Passport software?", or "How do I choose EUDR software?" `/plm` comes closest for its category but still doesn't explicitly define "what is fashion PLM software" in a directly extractable way.
2. **No structured Q&A-style content** (FAQ sections, definition call-outs) exists anywhere on the site — all current copy is persuasive/marketing-voiced, which is appropriate for humans but gives an AI answer engine little clean, quotable material to extract a factual answer from.
3. **No content currently explains "why a buyer might need help comparing providers"** as a standalone, extractable idea — the matching mechanic ("up to 3 providers") is stated but the *reasoning* (fragmented market, vendors differ meaningfully, hard to compare alone) is asserted rather than explained in a way that would help an AI system reason about when to recommend Software Lantern.
4. **No regulatory-source citations anywhere** for EUDR — there is currently no EUDR content on the site at all to cite, which is itself the gap, but this also means when EUDR content is created it must be built with sourcing discipline from the start (see ICP.md's `[VERIFY]` guidance and the "no legal advice" positioning guardrail).
5. **No entity-clarifying content distinguishing Software Lantern from a directory** — this distinction is core to the brief's positioning but currently lives only in on-page marketing copy aimed at humans, not in a form (e.g., a clear "how it works" / "how we're different from a directory" block with definitional language) that a GEO system would reliably extract and reuse when answering "what is Software Lantern."

---

## 10. Conversion Weaknesses

1. **EUDR and Battery Passport visitors land directly in an interactive form with no persuasive context first.** `/plm` gives visitors a full marketing narrative (problem framing, "what we'll match you on," FAQ, social proof via trust logos elsewhere on the homepage) before asking them to commit to a multi-step form. EUDR/Battery Passport visitors via `/finder?category=X` skip straight to question 1 of the wizard with zero framing — no restated value prop, no "here's what happens next," no trust-building. This is very likely a real conversion-rate gap, not just an SEO gap: a cold visitor from a Google search for "EUDR software providers" who lands straight on "What products do you import or sell?" has had no chance to confirm they're in the right place before being asked to commit time to a form.
2. **No visible trust/credibility signals on the `/finder` entry point** — no restatement of "free for buyers," no restatement of "up to 3 providers, never more," no reassurance about what happens with their data, right at the point where they're about to start disclosing business information.
3. **CTA language is already reasonably good and consistent** ("Find my software →", "Find EUDR software →", "Find my PLM →", "Find my DBP software →" all appear in nav/footer/homepage) — this is a strength, not a weakness, and should be preserved/extended rather than replaced.
4. **No dedicated urgency/forcing-function framing for EUDR or Battery Passport** anywhere pre-form, despite both categories having a strong regulatory forcing function per the ICP — this is exactly the kind of context a dedicated landing page (Section 15) would supply and that currently doesn't exist anywhere for these two categories.
5. **No SME-specific messaging or entry point exists at all** for the EUDR SME sub-persona defined in `/docs/ICP.md` Section 4.2 — every current EUDR touchpoint (footer link, wizard copy) is implicitly enterprise-voiced. A solo coffee-roaster founder searching "EUDR software for small business" has no landing experience built for them anywhere on the current site.

---

## 11. Internal Linking Weaknesses

1. **EUDR and Battery Passport links throughout the site (header dropdown, footer) all point to the same non-differentiated `/finder?category=X` wizard entry** rather than to a content-rich category page — meaning internal link equity has nowhere category-specific to accumulate for these two categories today.
2. **No internal links currently exist between categories despite genuine overlap** identified in `/docs/ICP.md` Section 10 (Fashion+EUDR via leather/cattle/rubber sourcing, PLM+Battery Passport, Product Compliance+PLM) — this is a missed topical-authority and cross-sell opportunity once dedicated category pages exist.
3. **Footer "About," "Resources," "Privacy" all link to `/`** — these are dead-end/placeholder internal links, not genuine internal linking value.
4. **No breadcrumb navigation anywhere** — not critical given the site's current shallow depth, but relevant once EUDR/Battery Passport pages (and any industry-specific pages) are added, both for UX and for BreadcrumbList structured data (Section 12/16).
5. **`/plm`'s "by industry" module links (Fashion & apparel, Footwear, Automotive, Aerospace, Medical device) all point to the same generic PLM finder entry** rather than to any industry-differentiated content — reasonable given no such pages exist yet, but worth noting as a pattern that will recur if/when industry-specific pages are considered (out of scope for this phase per the brief's anti-proliferation guidance).

---

## 12. Technical SEO Issues

1. No `app/sitemap.ts`.
2. No `app/robots.ts`.
3. No `metadataBase` in root `Metadata` export.
4. No canonical URL handling anywhere, including no strategy for the `/finder?category=X` query-parameter variants.
5. No `noindex` directive on any gated route (`/admin/**`, `/portal/**`) — these should not be crawlable/indexable, and currently nothing prevents it.
6. No structured data of any kind (Organization, WebSite, BreadcrumbList) anywhere in the codebase.
7. No Open Graph or Twitter metadata anywhere.
8. Only one `<img>`/`next/image` element exists on the entire public site (the PHD trust-bar logo on the homepage, which does have correct alt text) — the rest of the "logos" on the site are an inline SVG+text wordmark component, so there is minimal image-SEO surface area currently, which also means minimal image-alt risk today, but will need attention if/when new pages introduce more imagery.
9. `next.config.ts` is unmodified/default — no image domain restrictions, no redirects/rewrites configured, nothing here currently blocking or complicating SEO work.
10. Custom domain `softwarelantern.com` does not currently resolve — not an in-codebase issue, but a launch-readiness fact worth surfacing since canonical URLs, sitemap `baseUrl`, and `metadataBase` will all need to target the correct final production domain once DNS is live, and should not hardcode the Vercel preview URL.

---

## 13. Keyword Cannibalization Risks

1. **`/finder` vs. `/finder?category=EUDR...` vs. `/finder?category=Digital Battery Passport...` vs. `/finder?category=Product Lifecycle Management (PLM)...`** — all four currently render under the same route and (per Section 3–4) currently carry *identical* metadata inherited from root layout. If/when these are differentiated, they still share one physical route, which requires deliberate `generateMetadata`/canonical handling to avoid Google indexing near-duplicate variants against each other or diluting signal across them (see Phase 3 recommendations).
2. **`/plm` vs. any future `/eudr` or `/battery-passport` page** — no current risk since only one exists, but once all three category pages exist alongside the shared `/finder` wizard, each category page and its corresponding `/finder?category=X` entry point must have a clear, non-competing role (category page = the thing that ranks and sells the value prop; `/finder?category=X` = the transactional continuation, likely canonicalized or noindexed relative to the category page) rather than both trying to rank for the same query.
3. **No risk currently observed between `/plm` and `/providers`** — distinctly different intents (buyer vs. vendor), no overlap.

---

## 14. Missing High-Intent Keyword Opportunities (headline observations — full map in Phase 2)

This section flags *that* major gaps exist; the full prioritized keyword table is Phase 2 (`/docs/KEYWORD-MAP.md`), not this document.

- **No page currently targets any EUDR commercial keyword** ("EUDR compliance software," "EUDR software providers," "EUDR software for [commodity]," "EUDR software for SMEs," etc.) — zero coverage today despite EUDR being, per the ICP, a primary category with strong regulatory urgency.
- **No page currently targets any Battery Passport commercial keyword** ("battery passport software," "digital battery passport software," "battery passport compliance software," etc.) — zero coverage today.
- **`/plm` under-targets "fashion PLM software" / "apparel PLM software"** in favor of the broader, wrong-audience "PLM software" term (Section 3).
- **No page targets any EUDR SME-specific terminology** ("EUDR software for small business," "simple EUDR software," "EUDR tool for small importers," etc.) at all — this sub-persona, called out explicitly in the ICP, currently has zero dedicated search surface.
- **No comparison/alternatives-style content exists** anywhere ("[vendor] alternatives," "[category] software comparison") for any category — reasonable to not force this prematurely, but it's a Tier 2 opportunity worth evaluating in Phase 2.

---

## 15. Dedicated Category Page Check — EUDR & Battery Passport vs. `/plm`

**Explicit finding required by the brief:**

- **Fashion PLM** has a dedicated category landing page at `/plm` — full marketing narrative, FAQ, industry list, own metadata, own H1.
- **EUDR Compliance Software** has **no dedicated category page**. All EUDR entry points across the site (header dropdown, homepage category tile, footer link) route to `/finder?category=EUDR%20Software`, which drops the visitor straight into wizard question 1 with no preceding marketing content, no own metadata, and no own H1.
- **Battery Passport Software** has **no dedicated category page**. Same situation — all entry points route to `/finder?category=Digital%20Battery%20Passport%20(DBP)`.

This confirms the gap the task's pre-approved exception anticipated. Per the brief, building the one missing `/eudr` page and one missing `/battery-passport`-equivalent page is **pre-approved** as filling an existing template gap (mirroring `/plm`'s already-proven pattern), not a structural redesign, and is recommended for Phase 4 pending the Phase 3 implementation plan being reviewed first. No other new pages are proposed at this stage.

---

## 16. Recommended Improvements (headline list — detailed, prioritized version is Phase 3)

In rough priority order, to be formalized with P0–P3 labels in `/docs/SEO-IMPLEMENTATION-PLAN.md`:

1. Build dedicated `/eudr` and `/battery-passport` category pages mirroring `/plm`'s structure and depth (pre-approved exception).
2. Retarget `/plm`'s title, meta description, and H1 from "PLM software" to "Fashion PLM software" / "Apparel PLM software" framing.
3. Add `generateMetadata`/canonical handling so `/finder?category=X` states carry appropriate, non-cannibalizing metadata (or canonicalize back to the relevant category page — to be decided in Phase 3).
4. Add `app/sitemap.ts` and `app/robots.ts` using Next's native conventions, including `noindex` treatment for `/admin/**` and `/portal/**`.
5. Add `metadataBase`, Open Graph, and Twitter Card metadata to the root layout, with per-page overrides on category pages.
6. Add Organization and WebSite structured data (JSON-LD) site-wide; add BreadcrumbList once category pages exist.
7. Build EUDR SME-specific messaging into the new `/eudr` page (or a clearly-linked sub-section/page — to be decided in Phase 3) rather than defaulting the whole EUDR experience to enterprise framing, per `/docs/ICP.md` Section 4.3's explicit flag.
8. Add a brief persuasive/trust-building lead-in before the wizard's first question (or ensure category pages fully absorb this role so visitors never land cold on question 1).
9. Replace the footer's placeholder About/Resources/Privacy links with real pages or remove them until real pages exist — currently a trust and internal-linking weakness.
10. Add GEO-oriented definitional/Q&A content to each category page answering the specific questions listed in the brief ("What is EUDR compliance software?", "How do I choose EUDR software?", etc.), sourced carefully per `/docs/ICP.md`'s `[VERIFY]` discipline for any regulatory claim.
11. Replace the default Next.js favicon with a real Software Lantern brand asset.
12. Once dedicated category pages exist, add the cross-category internal links identified in `/docs/ICP.md` Section 10.

---

## Summary

The site's core structure, visual design, and matchmaking proposition are sound and should not change. The audit's central finding is narrow and specific: **two of three current categories (EUDR, Battery Passport) have no indexable, keyword-targeted, persuasive landing surface at all** — everything routes straight into an undifferentiated wizard — while the one category that does have a page (`/plm`) is scoped one level too broad in its targeting. Technical SEO foundations (sitemap, robots, canonical, structured data, Open Graph) are essentially unbuilt. None of this requires a redesign; it requires filling one confirmed template gap (per the pre-approved exception) and layering metadata/technical/GEO work onto the existing structure.

**This is the end of Phase 1. Awaiting review before proceeding to Phase 2 (keyword map).**
