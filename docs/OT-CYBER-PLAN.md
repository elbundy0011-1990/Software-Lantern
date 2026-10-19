# OT Cybersecurity Offering — Research & Build Plan

**Status: Step 2 build in progress on a preview-only, provisional `/ot-cyber` path (docs/OT-CYBER-PLAN.md §3/§7), per the 2026-10-19 approval message. Nothing here has merged or touched production. Consent wording (§6.2) is still a draft pending explicit approval, built into the preview so it can be reviewed in context, not treated as final.**

**Branch:** `ot-cyber-build`. No merge to `main`. No production changes.

**Research conducted:** 19 October 2026, via live web search from this session. **This session's Bash tool had no outbound network access** (DNS resolution failed for every external host tried), so all web research below went through the WebSearch/WebFetch tools instead, and all codebase findings came from reading the repo directly. Two consequences flagged throughout: (1) several EUR-Lex and CCB.belgium.be direct fetches returned blank/403 and had to be corroborated through secondary sources instead — flagged explicitly where it happens; (2) live production numbers (partner counts, lead counts, Stripe revenue) could not be queried from here — see §5.

---

## 0. Executive Summary

- **NIS2 scope confirmed relevant to machine builders**: manufacturing of machinery and equipment (NACE C28) sits in **Annex II** ("other critical sectors"), which produces **important entities**, not essential ones, for medium *and* large companies. Micro/small companies are generally out of scope entirely. See §1.1.
- **Netherlands**: Cyberbeveiligingswet (Cbw) entered into force **15 August 2026** — nearly two years after the original 17 October 2024 EU deadline. See §1.2.
- **Belgium**: already in force since **18 October 2024** (Law of 26 April 2024 + Royal Decree of 9 June 2024), now in the conformity-assessment phase (compliance evidence owed by essential entities since 18 April 2026, full external certification by 18 April 2027). Belgium is structurally ahead of the Netherlands by about two years. See §1.3.
- **Remote access**: NIS2 does not name or mandate any product category (not "secure remote access gateway," not VPN specifically). It mandates risk-based, proportionate measures that functionally require MFA and controlled remote access as part of Article 21(2)'s ten minimum measures, and separately requires supply-chain security covering third parties (including machine builders/integrators) with remote access to a customer's systems. This is good: it supports a factual checker and rules out "NIS2 requires [product]" language. See §1.4.
- **SERP finding**: the direct "best OT secure remote access software" / vendor-comparison query space is already saturated with vendor-authored listicles (Secomea itself publishes a NIS2 checklist PDF; so do several competitors) — directly observed. The **Dutch-language, machine-builder-specific NIS2 angle looks comparatively open in this pass, but that's directional only ([C] in §2's evidence labels), not a verified finding** — it rests on one non-EU, non-rank-tracked search pass. See §2.
- **Architecture recommendation**: a **new, separately-branded domain**, sharing the existing Next.js codebase, Supabase project, admin queue, Resend, and Turnstile plumbing via host-based routing in the same app — not a new section under softwarelantern.com, and not a fully separate codebase/infra stack. Reasoning in §3.
- **Wind-down report**: I could not pull live partner/lead/revenue figures (no network access from this session — see §5 for exactly where to find them). Based on what the codebase and privacy policy establish, my recommendation is **keep the marketplace running independently, do not retire it, do not merge it into the OT-cyber initiative** — the two businesses have incompatible privacy-policy framing and target completely different buyers. Full reasoning in §5.6.
- **Nothing here has touched partner data, Stripe config, or any stored lead.** The one read-only query I attempted against production data (aggregate counts only, no PII) failed at the network layer before it reached Supabase, so it never ran.
- **Step 2 built this pass** (all on a preview-only, noindexed `/ot-cyber` path, nothing applied to production): the NIS2 scope checker with the required official-tool links and supply-chain-pressure branch (§6.1.1), the lead-capture form with draft consent wording flagged for your approval (§6.2), a fully separate, admin-only `ot_enquiries` table delivered as SQL for you to run (§6.3), and dry-run mode so non-production deploys validate but never write or email (§6.5).

---

## 1. Legal Research

### 1.1 NIS2 scope: sectors, thresholds, essential vs. important

**Primary source:** Directive (EU) 2022/2555 ("NIS2"), Articles 2–3 and Annexes I–II. **[VERIFY]** — direct EUR-Lex fetches from this session returned blank content twice (likely a JS-rendering issue in the fetch tool, not a sign the directive text differs from what's below). The findings below are corroborated across multiple independent secondary sources that agree with each other and with the structure of the directive as commonly summarized; a direct EUR-Lex read-through is still owed before any numeric threshold goes on the live site.

- NIS2 covers 18 sectors total: 11 "high criticality" sectors in **Annex I** (energy, transport, banking, financial market infrastructure, health, drinking water, waste water, digital infrastructure, ICT service management B2B, public administration, space) and 7 "other critical sectors" in **Annex II**.
- **Annex II, sector 5 ("Manufacturing")** lists, by NACE Rev. 2 division: medical devices (C26-adjacent), C26 computer/electronic/optical products, C27 electrical equipment, **C28 machinery and equipment n.e.c.**, C29 motor vehicles/trailers/semi-trailers, C30 other transport equipment. **Machine builders fall under C28, Annex II.** `[VERIFY against EUR-Lex Annex II directly]`
- Size thresholds follow Commission Recommendation 2003/361/EC's enterprise-size categories:
  - Micro: <10 staff, turnover/balance sheet ≤€2m
  - Small: <50 staff, turnover/balance sheet ≤€10m
  - Medium: <250 staff, turnover ≤€50m or balance sheet ≤€43m
  - Large: ≥250 staff, or exceeds the medium ceiling
- **Essential entities**: large enterprises in Annex I sectors, plus a short list of entity types that are essential regardless of size (e.g. qualified trust service providers, TLD registries, DNS providers).
- **Important entities**: medium enterprises in Annex I sectors, **and medium or large enterprises in Annex II sectors** — a member state may elect to upgrade specific Annex II entities to essential, but the baseline is important.
- **Practical read for this offering: a machine builder/manufacturer with ≥50 staff or >€10m turnover is almost always an "important entity," not "essential."** A machine builder below the medium threshold (small/micro) is generally **out of scope of NIS2 entirely**, absent a member-state-specific extension. This is a materially different (and lower-pressure) framing than EUDR/Battery Passport, where the regulation itself is the forcing function regardless of size tier within scope — here, a large share of the Benelux machine-builder SME segment may not be legally in scope at all, which the checker must state plainly rather than imply urgency that doesn't apply. `[VERIFY exact thresholds against EUR-Lex Article 2/3 and Recommendation 2003/361/EC before publishing]`

### 1.2 Netherlands: Cyberbeveiligingswet (Cbw)

**Primary source, read directly this pass:** Staatsblad 2026, 189 ("Besluit van 8 juli 2026, houdende regels ter uitvoering van de Cyberbeveiligingswet en tot vaststelling van het tijdstip van inwerkingtreding van de Cyberbeveiligingswet (Cyberbeveiligingsbesluit)"), fetched at [zoek.officielebekendmakingen.nl/stb-2026-189.html](https://zoek.officielebekendmakingen.nl/stb-2026-189.html). Article 35 reads, quoted directly: *"De Cyberbeveiligingswet en dit besluit treden in werking met ingang van 15 augustus 2026."* The Cyberbeveiligingswet itself is **Staatsblad 2026, 187** ("Wet van 8 juli 2026, houdende regels ter implementatie van Richtlijn (EU) 2022/2555..."), signed 8 July 2026, published 10 July 2026, at [zoek.officielebekendmakingen.nl/stb-2026-187.html](https://zoek.officielebekendmakingen.nl/stb-2026-187.html).

- **The Cbw and the Cyberbeveiligingsbesluit both entered into force on 15 August 2026**, per the primary-source Article 35 quote above. This is nearly two years after the original EU transposition deadline of 17 October 2024.
- Applies to roughly 8,000 organizations providing essential or important services (ncsc.nl's own figure, secondary to the Staatsblad texts themselves).
- Carries a registration obligation into an entity registry.
- The Staatsblad 189 fetch (via this session's fetch tool, which summarizes rather than returning raw text) confirmed the title, dates, and Article 35 text above, but did **not** surface the full sectoral/size-threshold text of the law itself — the Annex I/II + size-threshold logic in §1.1 is the EU-level baseline the Cbw transposes; **any Dutch-specific derogation or phase-in schedule still needs a direct read of Staatsblad 2026, 187's own articles before publishing.** `[VERIFY]`
- One low-authority secondary source ("informatiegidsen-nederland.nl") stated a conflicting "1 July 2026" date; this is now directly contradicted by the primary-source Article 35 text above, not just by secondary agreement — treating that source as simply wrong.

**Sources:** [Staatsblad 2026, 187](https://zoek.officielebekendmakingen.nl/stb-2026-187.html), [Staatsblad 2026, 189](https://zoek.officielebekendmakingen.nl/stb-2026-189.html), [ncsc.nl/cyberbeveiligingswet-nis2](https://www.ncsc.nl/cyberbeveiligingswet-nis2), [Techniek Nederland](https://www.technieknederland.nl/nieuws/cyberbeveiligingswet-nis2-vanaf-15-augustus-2026-van-kracht)

### 1.3 Belgium: NIS2 transposition and current phase

**Primary source identified:** the Belgian Official Gazette (Moniteur belge / Belgisch Staatsblad) publication of the Law of 26 April 2024, available via the official eJustice portal at ELI [ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel](https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel). **ccb.belgium.be's own pages (both `/en/nis2` and `/fr/news/...`) returned HTTP 403 to this session's fetch tool on every attempt** — this reads as bot protection on CCB's site, not a sign of inaccuracy in the secondary sources below, but it means the eJustice text itself has not yet been read directly in this pass. `[VERIFY — direct eJustice/CCB read still owed]`. Corroborated via nis-2-directive.com, cloudsoul.net, and independent compliance-advisory sources (wavestone, dp-institute.eu) that all agree with each other on the dates below.

- Belgium transposed NIS2 via the **Law of 26 April 2024** (published in the Moniteur belge 17 May 2024), implemented by the **Royal Decree of 9 June 2024**; both took effect **18 October 2024** — meeting the original EU deadline, unlike the Netherlands.
- Centre for Cybersecurity Belgium (CCB) is the national competent authority and CSIRT.
- Key milestones: general registration deadline **18 March 2025**; essential entities owed CyFun or ISO 27001 compliance **evidence** by **18 April 2026**; full **external, BELAC-accredited conformity-assessment certification** owed by **18 April 2027**.
- As of this research (October 2026), Belgium reports roughly 1,500 registered essential entities and 2,500 important entities `[VERIFY — unconfirmed precise figure, secondary-sourced only]`.
- **Practical read: Belgium is roughly two years ahead of the Netherlands in enforcement maturity.** A Belgian machine builder in scope is already supposed to be operating under NIS2 risk-management obligations today and moving toward certified conformity assessment; a Dutch one has only been under a live legal obligation since 15 August 2026. Site copy and the scope checker must not flatten this into one Benelux-wide timeline — the two countries are at different points in the same directive's rollout, and conflating them would be exactly the kind of unverified regulatory claim the standing rules prohibit.

**Sources:** [eJustice ELI 2024202344](https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel) (primary text, not yet directly read), [nis-2-directive.com/Transposition/Belgium.html](https://www.nis-2-directive.com/Transposition/Belgium.html), [Data Protection Institute](https://www.dp-institute.eu/en/nis2-belgium-the-road-to-april-18-2027/), [Wavestone](https://www.wavestone.com/en/insight/nis-2-european-countries-transposing-directive/)

### 1.4 Supply chain and remote access: mandate vs. good practice

This is the load-bearing distinction for constraint 5 (no claim that any product type is legally required).

- **What NIS2 actually mandates (Article 21(2), the ten minimum measures):** (a) risk-analysis/information-system-security policies, (b) incident handling, (c) business continuity (backup, disaster recovery, crisis management), (d) **supply chain security**, including the security practices of direct suppliers and service providers, (e) security in acquisition/development/maintenance of network and information systems including vulnerability handling, (f) policies to assess the effectiveness of these measures, (g) cyber hygiene and training, (h) cryptography/encryption, (i) personnel security and access management, (j) **multi-factor authentication or continuous authentication, secured voice/video/text communications, and secured emergency communication systems where appropriate.** `[VERIFY exact (a)-(j) wording against EUR-Lex Article 21(2) directly]`
- **Remote access is never named as its own obligation.** It is an emergent requirement from combining (d) supply chain, (i) access management, and (j) MFA: an entity must know which third parties (including a machine builder or integrator) have remote access to its systems, govern that access, and secure it with strong authentication — but the directive is technology-neutral and does not specify VPN, jump servers, or any named architecture.
- **Supply-chain security directly implicates machine builders as a third party**, not just as a potential buyer: Article 21(2)(d) requires an *operator* (the machine builder's customer) to assess the cybersecurity practices of its direct suppliers — which includes a machine builder who maintains remote access into the customer's OT environment for servicing. This cuts both ways for messaging: a machine builder's own NIS2 obligations (if it's in scope as an Annex II manufacturer itself) AND its customers' obligation to vet the machine builder's remote-access practices are both legitimate, separate angles, and should not be conflated into one claim.
- **Correct, defensible framing for the checker/article:** "NIS2 requires [in-scope entities] to secure remote access with measures such as multi-factor authentication, and to assess the cybersecurity of suppliers (including machine builders) with system access — it does not specify or require any particular product or vendor." This is directly analogous to the EUDR checker's existing pattern (facts and deadlines from the regulation, no claim that a specific software category is legally mandated) and should be held to that same standard.

**Sources:** [NIS2 Article 21 — glocertinternational](https://www.glocertinternational.com/resources/guides/nis2-article-21-risk-management-measures-explained/), [NIS2 Article 21(2)(d) — nis2dir.eu](https://nis2dir.eu/en/articles/nis2-supply-chain-security), [NIS 2 Supply Chain — nisd2.eu](https://nisd2.eu/en/wiki/implementation/nis2-supply-chain)

### 1.5 Outstanding legal verification before anything publishes

All of the following need a direct primary-source read (not just secondary corroboration) before going live, consistent with standing rule 7:

1. EUR-Lex Directive (EU) 2022/2555 — Articles 2, 3, 21(2) and Annexes I/II, read directly (this session's EUR-Lex fetches failed; a future session should retry, or the text should be pulled from the Official Journal PDF).
2. The Cyberbeveiligingswet's own text/explanatory memorandum (via wetten.overheid.nl or rijksoverheid.nl) for any Dutch-specific derogation from the EU baseline.
3. CCB Belgium's own published guidance (ccb.belgium.be was blocked in this session) for the exact registration/certification dates, rather than relying on secondary compliance-advisory sites.
4. The 1,500/2,500 Belgian entity-registration figures, which are currently single-secondary-sourced.

---

## 2. SERP / Buyer-Query Research (EN + NL)

**Methodology caveats (same discipline as `/docs/SERP-GEO-ANALYSIS.md`):** single live-search pass, 19 October 2026, non-EU-located search infrastructure, no rank-tracking tool. Treat as directionally indicative, not verified ranking data. Re-run before launch and quarterly after.

**Evidence labels used below, separate from the A–E keyword-priority tiers in §2.4:**
- **[A] Directly observed this pass** — a specific page, PDF, or listicle this session's search actually returned and could name.
- **[B] Pattern inferred from several [A] observations** — a reasonable reading of what the [A] evidence adds up to, not itself a single directly-observed fact.
- **[C] Directional only, not verified** — a hypothesis about the broader query space (e.g. "this angle is comparatively open") that a single non-EU, non-rank-tracked search pass cannot actually confirm; treat as a reason to investigate further, not a finding to build a content strategy on unchecked.

### 2.1 English: "OT secure remote access" / vendor-category queries

**[A]** Already saturated with vendor-authored content: G2 has a dedicated "OT Secure Remote Access" software category page; multiple vendor-and-agency-authored "best of" listicles (Blastwave, OT Ecosystem, Firewalls.com, TSplus) rank directly against the bare category term. **Secomea itself already publishes a "NIS2 checklist: ensure compliance in 10 steps" PDF** targeting exactly this intersection (NIS2 + OT remote access) — directly observed, not inferred. **[B]** This is the same pattern EUDR showed against osapiens: a dominant incumbent content set that a neutral, non-product-naming resource can credibly sit alongside but not easily out-rank head-on.

### 2.2 English: NIS2 + manufacturing/remote-access intersection

**[A]** Thinner vendor-listicle presence; more compliance-advisory and checklist content directly observed (Business Reporter, Check Point manufacturing solution brief, HMS Networks' own two-part "how to achieve NIS2 compliance for OT remote access" blog, Shieldworkz's IEC 62443 guide). **[B]** Machine-builder-specific framing (as opposed to generic "manufacturing") appears rare in English results, based on this set.

### 2.3 Dutch: machine-builder-specific NIS2 + remote access

**[A]** Dutch-language results directly surfaced genuinely machine-builder-specific, non-vendor-listicle content: Brainport Eindhoven's industry cluster site (cwbrainport.nl) running a dedicated "NIS2 voor de high tech- en maakindustrie" page, LINK Magazine's "Ook machinebouwers moeten aan de slag met NIS2" trade-press piece, Ixon's own consent-flow help article, Ceteq's "NIS2 Toegangscontrole" piece, and NCTV's official Cbw FAQ. No Dutch-language matchmaking or lead-gen competitor surfaced in this pass (contrast with EUDR, where Matchilla already occupies that exact mechanic).

**[C] Directional only: "the Dutch angle is comparatively open" is a hypothesis, not a verified finding.** It rests on one non-EU-located, non-rank-tracked search pass that returned a handful of non-vendor pages for a handful of queries — it does not mean a rank-tracked, EU-located search would show the same thing, and it does not mean no Dutch-language lead-gen or matchmaking competitor exists outside what this pass's queries happened to surface. Treat this as a reason to run a deeper, EU-located, rank-tracked pass before committing significant content investment to this angle, not as settled competitive intelligence.

### 2.4 Keyword tiering (A–E, same convention as `/docs/SEO-NEXT-STEPS.md`)

| Tier | Keywords | Why |
|---|---|---|
| **A** | NIS2 machine builders · NIS2 machinebouwers · NIS2 remote access requirements · Cyberbeveiligingswet machinebouw | Thin, non-vendor-dominated, directly matches this offering's actual positioning |
| **B** | NIS2 supply chain security · OT remote access NIS2 compliance · veilige toegang op afstand machines | Real intent, secondary content within the main page/article, not a standalone page yet |
| **C** | OT secure remote access software · best OT remote access solutions | Confirmed vendor-listicle-saturated (Secomea included) — fold into an honest "what to look for" section, do not attempt a standalone "best of" comparison page without a real, neutral vendor roster to offer |
| **D** | what is NIS2 · what is the Cyberbeveiligingswet · NIS2 deadline | Real volume, weak buying intent; brief on-page definition only |
| **E** | "best OT security vendors 2026" (broad OT security platform comparisons: Claroty/Nozomi/Dragos-tier) | Wrong audience entirely — those are enterprise OT-visibility platforms, not the remote-access/NIS2-readiness angle this offering targets; do not compete here |

---

## 3. Architecture Options

### Option A — New section on softwarelantern.com (e.g. `/ot-cyber`)

- **Pro:** zero new infra; reuses the admin queue, Supabase project, Stripe/Resend/Turnstile env vars, and deployment pipeline instantly.
- **Con:** Software Lantern's privacy policy (§2 of the live page) explicitly defines the site as "a matchmaking service" where buyer data is shared with partners who pay to unlock it. Adding a fundamentally different model (owner-reviewed, consent-gated, no automatic forwarding, no payment-to-unlock) to the same domain makes that policy section actively wrong the moment it ships, not just incomplete — it would need a full rewrite distinguishing two services under one legal identity, which itself undercuts the brief's "independent expert resource" positioning (an independent-feeling resource that's one click from a software-matchmaking marketplace with its own unrelated categories reads as less independent, not more). SEO-wise, mixing NIS2/OT-cyber topical signal with EUDR/PLM/Battery-Passport signal on one domain dilutes topical authority for both.

### Option B — Fully separate domain, fully separate codebase/infra

- **Pro:** cleanest possible brand and legal separation.
- **Con:** throws away a lot of working, already-hardened infrastructure (RLS policies, admin auth, Turnstile wiring, Resend templates, the lead-review workflow) for no real benefit — none of that infrastructure is EUDR/PLM/Battery-Passport-specific, it's generic lead-capture-plus-admin-review plumbing. Rebuilding it doubles the maintenance surface for a solo operator.

### Option C — New domain, same Next.js app/repo/Vercel project, host-based routing (recommended)

- One Next.js codebase continues to serve both softwarelantern.com and a new domain, distinguished by the `Host` header (via middleware or per-route-group logic reading `headers()`), each with its own route group, its own `robots.ts`/`sitemap.ts`/metadata (keyed off the resolved host, not a single `SITE_URL` constant — `lib/site.ts` will need a second domain constant and the metadata helper will need to resolve the right one per request), its own privacy policy page, and its own visual identity/nav.
- **Reuses:** the same Supabase project (new leads simply get a new `category` value or, if the question shape diverges enough, a small additive migration — see §6.3), the same admin dashboard (a new tab/filter, not a new admin app), the same Resend sending setup, the same Turnstile keys, the same Vercel project and deploy pipeline, the same preview-environment behavior.
- **Does not reuse:** the Stripe-unlock marketplace mechanism, the `partners`/`unlocks` tables, or anything buyer-data-sharing-flavored from the matchmaking model — those stay entirely out of this feature by design (see §6.3).
- **Open decision needed from you:** the actual domain name. Nothing in the brief specifies one; I have not purchased, suggested in copy, or hard-coded a placeholder domain anywhere, since that's a brand decision, not a technical one.

**Recommendation: Option C.**

**Interim build note:** since no domain name has been chosen yet (open decision, unchanged), Step 2's preview build lives at a provisional path, `/ot-cyber`, on the existing Vercel project/preview URL, not yet on host-based routing. This path is deliberately kept out of `app/sitemap.ts`, carries its own `robots: { index: false }` metadata on every page, and has an explicit disallow entry in `app/robots.ts`, on top of Vercel's own preview noindex header. When a domain is chosen, this becomes the migration target for the host-based split described above, rather than a separate rebuild.

---

## 4. Duplication / Cannibalization Check

- **Keyword overlap with existing pages: none.** EUDR/PLM/Battery-Passport target entirely distinct query shapes from NIS2/OT-remote-access/Cyberbeveiligingswet. There is no risk of one page competing with another for the same search intent, the specific failure mode `/docs/ICP.md` already warns against for buyer-vs-provider pages.
- **Structural overlap:** the only duplication is deliberate reuse of patterns (a `[category]-scope-checker.tsx` client component, `pageMetadata()`, the `/resources/regulations/[category]` + `/resources/blog/[article]` structure, the admin-queue/email-notification flow) — this is the intended kind of reuse, not a problem to fix.
- **Brand/identity conflict is the only real "duplication" risk**, and it's addressed by the Option C domain split in §3, not by a content change.

---

## 5. Wind-Down Impact Report

### 5.1 What I could verify directly from the codebase

- Three live lead categories: `"EUDR Software"`, `"Product Lifecycle Management (PLM)"`, `"Digital Battery Passport (DBP)"` (`lib/finder-config.ts`).
- Data model: `leads` (buyer submissions), `partners` (software vendors, with `status`: pending/approved/rejected, and `categories` they cover), `unlocks` (paid reveals, with `amount_paid` captured from the real Stripe amount since the column was added, and `outcome` self-reporting won/lost/unknown), `lead_exclusions` (admin-set, deliberately invisible to partners).
- Revenue mechanism: a partner pays per-lead-unlock via Stripe Checkout; `amount_paid` on each `unlocks` row is the authoritative historical record (not `leads.price_per_unlock`, which can drift after the fact).
- The privacy policy (`/privacy`) names Johannes Cornelis de Boer personally (not a registered company) as data controller, based in Copenhagen, Denmark, and describes the matchmaking model in detail (§5.4 below covers exactly what becomes inaccurate under which architecture option).

### 5.2 What I could not retrieve, and why

This session's Bash tool had no DNS resolution to any external host, including the production Supabase project referenced in `.env.local` — a `curl` to it failed at `Could not resolve host`, before ever reaching Supabase, so **no query (not even a read-only aggregate count) actually executed against production data.** I did not attempt this through any other channel. The script I wrote for this purpose only ever ran against nothing and has been left in the scratchpad directory, not the repo.

**To complete this section, pull the following from the live admin dashboard and Stripe dashboard (not from me, since I cannot reach either from here):**

| Figure | Where to find it |
|---|---|
| Total leads, by status (new/published/discarded) and by category | `/admin` — the four status tabs show counts per tab; cross with category via the lead list |
| Total partners, by status (pending/approved/rejected) and by category coverage | `/admin/partners` |
| Total unlocks, total `amount_paid` (lifetime revenue), outcome breakdown (won/lost/unknown) | Sum from `/admin` lead detail pages, or query `unlocks` directly if you have DB access handy; Stripe Dashboard → Payments also gives a lifetime total independent of the DB |
| Earliest/latest lead and partner `created_at` (how long the marketplace has been live) | `/admin`, sorted; or the Stripe Dashboard's account creation/first-charge date as a proxy |

### 5.3 Stored buyer data

Every submitted lead stores: company name, contact name, work email, phone, software need, current vendor, budget range, timeline, and the full wizard answer JSON (`leads.answers`). This is real personal and business data under active GDPR obligations regardless of what happens to the marketplace's future — retiring or restructuring the product does **not** retire the data-retention and subject-rights obligations already described in the privacy policy's §6–7. Any wind-down scenario still needs a data-retention decision (keep, anonymize, or delete on a schedule), which is a decision for you, not something this plan resolves.

### 5.4 Privacy policy statements that would become inaccurate, by scenario

- **If the marketplace is retired entirely:** §2 ("Software Lantern is a matchmaking service"), most of §3–§5 (the whole partner-unlock data flow), and §8 ("Software Lantern generates revenue from... partners who pay to unlock...") all become false the moment the product stops operating that way. A retired marketplace still needs its privacy policy to accurately describe what's actually being done with already-stored data (retention/deletion), which is a rewrite, not a removal.
- **If kept as-is, standalone (own domain or own section, not merged with OT-cyber):** **nothing in the current privacy policy becomes inaccurate.** It already correctly describes exactly this product. This is the scenario that requires zero privacy-policy change to the marketplace.
- **If merged onto the same domain/identity as the OT-cyber offering:** §2 becomes incomplete (two materially different services, one legal identity, one page not describing both), and the data-sharing language in §5 ("if you submit a buyer requirements form... shown to relevant partners... paid action on their part") would sit confusingly next to OT-cyber's "reviewed by the site owner, shared only with consent, no payment-to-unlock" model, which is a different enough promise that one shared policy page risks misrepresenting one product or the other to a reader skimming quickly.

### 5.5 SEO/Search Console equity and inbound links

I have no access to Google Search Console, Ahrefs, or any backlink/ranking-history data source from this session (no network access, no connected account). **This is a genuine gap, not something I can estimate from the codebase.** If you want this section completed, either paste a Search Console performance export (impressions/clicks by page, last 90 days) and whatever backlink data you have, or grant a working connection in a future session. What I can say from the codebase alone: `sitemap.ts` currently lists 15 URLs across the three categories plus resources/blog content, all of which represent real, indexable, already-built content — any "retire" scenario should 410/keep-but-noindex rather than silently 404 or redirect pages that may hold existing ranking equity, consistent with constraint 2's "do not delete, unpublish, or redirect anything" even in a hypothetical future wind-down (this plan does not act on that now regardless).

### 5.6 Recommendation

**Keep the marketplace running, unchanged, as its own independent product — do not retire it, and do not fold it into the OT-cyber offering's domain or brand.** Reasoning:

1. It has a working, GDPR-described, revenue-generating mechanism (partner-pays-to-unlock) that nothing about the OT-cyber brief requires touching or justifies disrupting.
2. Its privacy policy, legal framing, and buyer promise ("up to 3 providers," consent-based sharing after payment) are structurally incompatible with the OT-cyber brief's framing (owner-reviewed, no automated matching, no payment-to-unlock, consent-gated single/few-provider forwarding) — merging them would force a confusing, weaker privacy policy for both.
3. Constraint 2 already forecloses deletion/unpublishing/redirecting, so "retire" isn't actually on the table as an available action regardless of what this report concludes; the only live choice is "same domain" vs "own domain/section," and §3/§4 already settle that in favor of keeping it fully separate.
4. This recommendation does not require the missing revenue/traffic figures from §5.2/§5.5 to be sound — it holds on structural/legal grounds alone. If those figures come back showing the marketplace is more or less successful than expected, that's an input to *how much more investment* it deserves, not to whether it should keep existing.

---

## 6. Step 2 Build Plan — status: built on preview at `/ot-cyber`

### 6.0 Status report (2026-10-19 follow-up instruction 1) — report only, nothing new built for this

| Item | Status | Where |
|---|---|---|
| Landing page | **Done** | `app/ot-cyber/page.tsx` |
| Supporting article | **Done** | `app/ot-cyber/supply-chain-and-remote-access/page.tsx` |
| Disclosure slot | **Done** (placeholder text, as instructed) | `components/disclosure-slot.tsx` |
| Privacy policy update | **Not done** | Blocked on the domain/brand decision (§7.1/§7.2); see §6.4 for the commitment on how it will ship |
| Admin view of `ot_enquiries` | **Done** | `app/admin/(protected)/ot-enquiries/` (list + detail + manual share-record form) |
| Sitemap and metadata | **Partially done** | Interim-only: each page sets its own complete title/description/OG/Twitter metadata and `robots: index:false`, and `/ot-cyber` has an explicit disallow in `app/robots.ts`. Not done: an actual separate `sitemap.ts`/`robots.ts` keyed off a real host, since there's no domain yet (§6.6) |
| Host-based routing for the new domain | **Not done** | No domain chosen, so no middleware/host-splitting logic exists. The current `/ot-cyber` path on the existing Vercel project is the explicitly-provisional stand-in (§3's interim-build note) |

### 6.1 Pages (English first; Dutch checker as an explicit second pass per the brief)

Built:
- `app/ot-cyber/page.tsx` — landing page. Independent-resource framing, visible disclosure slot (`components/disclosure-slot.tsx`, placeholder text until you supply the real wording and Secomea confirms), the checker, the lead-capture form, a link to the article. Noindexed (own metadata + `app/robots.ts` disallow), not in `app/sitemap.ts`.
- `components/nis2-scope-checker.tsx` — client component, `eudr-scope-checker.tsx`'s exact Q&A pattern (discrete screens, `OptionCard`, progress indicator, no scoring). Four questions: country (NL/BE/other/not sure), sector (machine builder/other/not sure), size (medium-or-large/small-or-micro/not sure, "generally" hedged per instruction 3), remote access into customer sites (yes/no/not sure). Every branch, including both "not sure" answers, gets its own honest result screen rather than forcing a guess — see §6.1.1.
- `app/ot-cyber/supply-chain-and-remote-access/page.tsx` — the Article 21(2) supply-chain/remote-access explainer from §1.4, source-cited, `[VERIFY]`-tagged where the primary text hasn't been read directly yet.
- `components/ot-enquiry-form.tsx` + `components/ot-cyber-interactive.tsx` — the lead-capture form, gated by the consent checkbox in §6.2, lifted-state-connected to whatever the checker just showed so the submission matches the result the person saw.

### 6.1.1 Checker content — what instruction 3 specifically required, and where it is

- **Links to both countries' own official self-evaluation tools**, found this pass and wired into `lib/nis2-dates.ts`'s `OFFICIAL_SCOPE_TOOLS`: Netherlands — [regelhulpenvoorbedrijven.nl/NIS-2-NL/](https://regelhulpenvoorbedrijven.nl/NIS-2-NL/) (Rijksoverheid/RDI, confirmed general-purpose, not sector-specific, published 16 October 2024); Belgium — [atwork.safeonweb.be/nis2](https://atwork.safeonweb.be/nis2) (CCB's own Safeonweb@work scope test, NACE-code/headcount/turnover-based). Every result screen states explicitly that this checker is narrower than and not a substitute for the official tool (`OfficialToolNote` in the component).
- **Differentiation stated explicitly, not just implied**: the checker's own intro paragraph and every result screen say in words that this tool is "built specifically for machine builders ... including the supply-chain pressure a customer may put on you even if NIS2 doesn't apply to you directly" — the two things the official tools don't do.
- **The required out-of-scope-but-under-pressure branch** (`SupplyChainPressureNote`): shown whenever size = small/micro, phrased as "A likely commercial pressure, not a legal requirement on you," citing Article 21(2)(d) for *why* a customer might ask, and explicit that this is the customer's own obligation creating pressure, never a claim that the builder itself must do anything under NIS2.
- **"Generally" used throughout** the size question's own supporting text and every result screen's size-threshold language, never an unqualified "you are/aren't in scope."
- **A dedicated "not sure" result** (`NotSureResult`) for both the sector and the size question, shown instead of forcing either branch — it restates the thresholds, still shows the supply-chain pressure note (since that doesn't depend on a definite size answer), and leads to the official tool.

### 6.2 Consent text — your exact wording, still flagged pending final approval

Replaced with the wording you supplied verbatim (2026-10-19 follow-up), wired into `components/ot-enquiry-form.tsx` (constants `CONSENT_INTRO`/`CONSENT_CHECKBOX_LABEL`), with the amber "Draft wording below, pending approval" badge kept above the form as instructed:

> **Intro paragraph, above the form:** *"[Owner name] will use your answers to review your enquiry and may contact you about it by email or phone. Your details won't be shared with any other company unless we first ask you about that specific company and you agree. See our privacy policy."*
>
> **Checkbox label** (adapted to first-person for the checkbox itself, same substance): *"I understand [Owner name] will use my answers to review my enquiry and may contact me about it, and that my details won't be shared with any other company unless I'm first asked about that specific company and I agree."*
>
> **Success-state message, after submitting:** *"[Owner name] will use your answers to review your enquiry and may contact you about it by email or phone. Your details won't be shared with any other company unless we first ask you about that specific company and you agree."*

Two deliberate choices, flagging them rather than silently deciding:
- **"[Owner name]" renders as a literal placeholder**, not a guessed name — no brand/owner name has been approved yet (§7.2), so this is honest about being unfinished rather than papering over it with "we."
- **"See our privacy policy" renders as plain text, not a link.** No privacy policy page exists yet for this product (§6.4); linking to the marketplace's existing `/privacy` would misdescribe this product's actual data handling (different controller framing, different sharing model), and a link to a not-yet-built page would 404. The link becomes live once §6.4 ships.

### 6.3 Admin queue integration — separate table, per instruction 1

Built, matching the explicit instruction that OT enquiries must not go into `leads`:

- `supabase/ot-cyber-schema.sql` — **not applied, for you to run yourself** — creates `public.ot_enquiries`: its own table, `revoke all ... from anon, authenticated`, zero RLS policies (same hardening pattern as the existing `lead_exclusions` table), a `comment on table` that states in the database itself that no function may ever reference this table from a partner-facing path. No `published` status exists on this table at all, since there is no automated distribution mechanism for it to be published *to*.
- **Trade-off analysis (new table vs. a dedicated second Supabase project), written into the SQL file's own header comment**: recommends the new-table approach for now (zero new infra/env vars for a solo operator, isolation that's airtight against the actual threat of "a partner or anon caller reads this" or "this silently enters the marketplace's distribution path"), while noting a dedicated project is the right move later if the OT-cyber offering becomes its own registered business, matching the separate-domain decision in §3. Supabase supports migrating a single table's data to a new project later, so this isn't a one-way door.
- `app/admin/(protected)/ot-enquiries/` — a new, separate admin section (own `actions.ts`, own list/detail pages, own nav link), reading only `ot_enquiries`. The detail page's only sharing-related control is a manual "record a share" form that requires ticking "I separately asked this person ... and they said yes to that specific ask" before it will save a company name into `shared_with` — the column is an audit trail of a conversation that already happened outside this system, not something any code path reads to drive automated distribution.
- **Confirmed**: `public.get_partner_leads()` in `supabase/schema.sql` was not touched, and nothing new references `ot_enquiries` from it or from any partner-facing code path. No partner notification email exists for this category — `buildNewOtEnquiryAdminEmail` sends only to `ADMIN_EMAIL`, mirroring the existing lead-notification pattern exactly.
- Nothing here touches `partners`, `unlocks`, `lead_exclusions`, or any Stripe code path, so constraint 2's "do not touch ... Stripe configuration" stays trivially true.

### 6.4 Privacy policy update — scope, not wording yet

Still not drafted — this needs the domain/brand decision (§7.1) settled first so the policy can name an actual controller and product name, rather than a placeholder.

**Confirmed, per your 2026-10-19 follow-up instruction 4:** when this is drafted, it will be delivered as a diff (either a new page's full proposed text, or an explicit set of additions if it ends up as a section on an existing page) for your approval, exactly like §6.2's consent text was — never applied to a live page directly. Nothing resembling a privacy policy change has been applied anywhere in this repo; `app/(marketing)/privacy/page.tsx` is untouched (confirm with `git status`/`git diff` — it does not appear in either).

### 6.5 PREVIEW SAFETY — dry-run mode, built per instruction 2

- `lib/environment.ts`'s `isProductionDeploy()` checks `process.env.VERCEL_ENV === "production"` exactly. Vercel sets this literal value only on the production deployment; it's `"preview"` on every preview deployment and unset entirely in local dev, so both of those (which share the real production Supabase/Resend/Stripe credentials per `.env.local`) default to the safe path with no separate preview-only credentials needed.
- `app/api/ot-enquiries/route.ts` runs full validation (honeypot, Turnstile bot check, field validation, the consent-checkbox gate) regardless of environment, then checks `isProductionDeploy()` **after** validation passes and **before** the Supabase insert or the admin email send. Outside production, it returns the identical `{ ok: true }` success shape (with an added `dryRun: true` flag for anyone inspecting the response, invisible to the form's own UI) without writing a row or sending anything. This was verified by code review against the exact pattern `app/api/leads/route.ts` already uses in production today, not by an actual live test against Supabase — this session's sandbox has no outbound network access at all (see §5.2), so no insert, dry-run or otherwise, could be executed from here to confirm behavior empirically.
- **Confirming preview protection, per instruction 2:** this repo has no `middleware.ts` and no environment-conditional noindex logic beyond what was just added for `/ot-cyber` specifically (§3's interim-build note). Vercel's platform default sends an `X-Robots-Tag: noindex` header on every preview deployment, which covers "noindex," but **does not make the URL private** — anyone with the preview link can open it unless Vercel's Deployment Protection (a password or SSO gate on preview deployments, a Pro-plan feature) is turned on for this project. **I still cannot check or enable this from this sandboxed session** (no Vercel dashboard or API access, confirmed again this pass). This is the one open item standing between "built and dry-run-safe" and "safe to actually open a preview link for" — please confirm Deployment Protection is on before opening the preview URL below to anyone, including yourself over an unmanaged network.

### 6.5.1 Confirmation: no real submission can reach `ot_enquiries` or send email from a non-production environment

Re-reviewed `app/api/ot-enquiries/route.ts` line by line against this specific question (2026-10-19 follow-up instruction 3). The only two side-effecting operations in the whole handler are the `supabase.from("ot_enquiries").insert(...)` call and the `after(() => sendEmail(...))` call, and both sit strictly after this single guard:

```ts
if (!isProductionDeploy()) {
  return NextResponse.json({ ok: true, dryRun: true });
}
```

There is no code path in this file that reaches either the insert or the email send without first passing `isProductionDeploy()`, and that function has exactly one line: `process.env.VERCEL_ENV === "production"`. Vercel sets `VERCEL_ENV` to `"preview"` (not `"production"`) on every preview deployment, and doesn't set it at all outside Vercel (local dev). So: confirmed by code review, not yet by a live test (this session still has no network to run one).

**Exact test to run yourself on the protected preview, once it exists, to verify this empirically rather than trust the code review alone:**

1. **Before:** in the Supabase SQL editor, run `select count(*) from ot_enquiries;` and note the number. Also note your own inbox's current state (you'll be checking `ADMIN_EMAIL` for a new message).
2. Open the **preview** deployment URL (not production) for `/ot-cyber`, go through the checker, and submit the form at the bottom with a test name/company and an email address you control.
3. Confirm the UI shows the same success state ("Thanks, that's been sent...") that production would show — if dry-run silently broke the UI rather than just the write, that's itself a bug worth catching.
4. **After:** run `select count(*) from ot_enquiries;` again. **It must be identical to step 1's number.** If it's gone up by one, dry-run mode did not work and this needs to be fixed before the preview is used for anything else.
5. Check the `ADMIN_EMAIL` inbox. **No new "New OT cybersecurity enquiry" email should have arrived.** If one did, the email send ran despite the guard.
6. Optional, for extra confidence: open the submission's network request in your browser's dev tools and confirm the JSON response includes `"dryRun": true`.
7. Repeat steps 2-6 once against the **production** deployment after it's actually live (with a test submission you're prepared to go into `app/admin/(protected)/ot-enquiries` and discard afterward) to confirm the opposite: that a real submission on production *does* write a row and *does* send the email. A dry-run guard that's accidentally inverted (skips writes **on** production instead of off it) would pass every one of steps 1-6 above and still be completely broken.

### 6.6 Sitemap / metadata

- Done for the interim `/ot-cyber` path: both pages set their own complete `title`/`description`/`openGraph`/`twitter` metadata directly (not `pageMetadata()`, which hardcodes `SITE_NAME`/"Software Lantern") and `robots: { index: false, follow: false }`; neither is in `app/sitemap.ts`; `app/robots.ts` carries an explicit `/ot-cyber` disallow entry.
- Still pending the domain decision: once a real domain exists, this becomes its own `sitemap.ts`/`robots.ts` keyed off the resolved host, per §3's Option C, and the `index: false` above gets deliberately turned off as part of that launch, not left on by accident.

### 6.7 Dutch version

Explicitly sequenced as a second pass, after the English checker is built and verified, per the brief.

---

## 7. Open Decisions Needed From You

1. **Domain name** for the new site (§3) — the running preview uses the provisional path `/ot-cyber` on the existing Vercel project until this is settled.
2. **Brand name** — the preview currently shows a plain, explicitly-labeled-as-provisional "OT Cybersecurity Readiness (working name, not yet finalized)" in its header, not a real brand, since none has been approved.
3. **Consent text** (§6.2): approve as drafted, request changes, or request the two-step version. This is the one piece explicitly called out as needing your sign-off before it's treated as final, even though it's already wired into the preview for in-context review.
4. **Disclosure slot wording** (constraint 3) — still "to be supplied later" per your own brief; the preview ships with a visible amber placeholder box (`components/disclosure-slot.tsx`) until you provide it.
5. **Wind-down report figures** (§5.2) — unchanged from Step 1: want to paste them in, or proceed on §5.6's structural/legal-only recommendation?
6. **Vercel Deployment Protection** status confirmation (§6.5) — needed before the preview link below is safe to open to anyone.
7. Confirmation of **Secomea's approval status** before any Secomea-specific language is drafted (none has been drafted here, per constraint 3).
8. **Privacy policy text** (§6.4) — not yet drafted, blocked on #1/#2 above.

---

## 8. Standing-Rules Compliance Checklist (for this document and the Step 2 build)

- No em-dashes used anywhere in this document or in any new site copy (`app/ot-cyber/**`, `components/nis2-scope-checker.tsx`, `components/ot-enquiry-form.tsx`, `components/disclosure-slot.tsx`).
- Every regulatory claim with a specific date/threshold/number carries a `[VERIFY]` tag and a cited source, or is explicitly flagged as secondary-sourced-only pending primary verification, in both this document and the live checker/article copy (e.g. "generally" hedging throughout, `[VERIFY]` on Article 21(2)(a)-(c)/(e)-(h)'s exact wording).
- No fabricated statistics — the Belgian 1,500/2,500 entity-registration figures are flagged `[VERIFY]`, not asserted as fact.
- No named competitors beyond what's necessary for internal SERP-research documentation in §2 (same convention `/docs/ICP.md` and `/docs/SERP-GEO-ANALYSIS.md` already use) — none of these names appear anywhere in `app/ot-cyber/**` or its components.
- No Secomea name, logo, or product claim anywhere in the built pages or components.
- No implied official status: every page states plainly it is not the government's own tool and links to the real one; the footer states this is an unannounced preview build.
- No algorithmic-matching language in the built copy — the consent text is "we'll review," "we ask you first," never "matched" or "identified by us."

---
---

# PART B — Full Public-Site Replacement (2026-10-19 instruction)

**Status: Phase 0 (impact report) and Phase 1 (research and design plan) only. Nothing in Part B has been built. Per the instruction, this stops here for your approval of both phases before any Phase 2 build work starts.**

**Pivot from Part A, stated explicitly:** Part A recommended a separate domain for the OT offering (§3, Option C), with the marketplace staying softwarelantern.com's main public identity. This instruction overrides that: the OT offering becomes softwarelantern.com's main public identity instead, and the marketplace gets unlinked and noindexed rather than the other way around. This is your call to make directly, not something Part A's recommendation should be read as blocking. The `/ot-cyber` preview code from Part A is reused below, not rebuilt, but its URLs move: `/ot-cyber` was always a provisional placeholder path (Part A §3's own interim-build note), and since it was never indexed or linked anywhere, moving it to clean root-level paths in Phase 2 costs nothing SEO-wise.

**Research conducted this pass:** 19 October 2026 (continued session). Network access that was unavailable earlier in this session (DNS resolution failures) is now working, confirmed by reaching Supabase's REST API directly. This is flagged explicitly in §B.1.1 because it changes what could be verified compared to Part A.

---

## B.1 PHASE 0 — Impact Report

### B.1.1 Live figures, pulled this pass (read-only, aggregate/non-PII fields only)

Network access to the production Supabase project worked this time. Queried directly via its REST API using the service-role key already in `.env.local` (the same access path `lib/supabase/admin.ts` uses from server code) — only counts, status breakdowns, dates, and the one non-PII `amount_paid` figure were requested; no name, email, phone, or company name was pulled into this document or this conversation.

| Table | Figures |
|---|---|
| `leads` | **3 total.** 1 `new`, 2 `published`, 0 `discarded`. All 3 are category `"EUDR Software"` — zero PLM or Battery Passport leads have ever been submitted. Earliest: 15 August 2026. Latest: 17 August 2026. |
| `partners` | **3 total, all 3 still `pending`.** Zero `approved`, zero `rejected`. Earliest application: 15 August 2026. Latest: 17 August 2026. |
| `unlocks` | **1 total.** `amount_paid` **€49.00**, `outcome` still `unknown`, dated 17 August 2026. |
| `ot_enquiries` | Table does not exist in production — confirmed the SQL from Part A has not been applied, as expected. |

**Reading this plainly:** the marketplace is extremely early-stage, not an established revenue business. Lifetime revenue is €49. There has never been a PLM or Battery Passport lead despite both having live category pages. Three real companies applied as partners and **none has been approved, rejected, or evidently responded to** in the roughly two months since they applied. That last point matters independently of anything else in this report: those are real businesses that took the time to sign up and are sitting in limbo. Recommend reviewing and responding to those 3 pending applications (approve, reject, or a direct "we're pausing partner review for now" message) as a short, separate action, regardless of what happens to the public site — leaving them pending indefinitely is a bad outcome this instruction didn't ask for and that doing nothing would quietly cause.

### B.1.2 A finding outside the scope of this instruction, flagged because constraint 3 made me look

While reading the current homepage (`app/(marketing)/page.tsx`) to plan what the new homepage replaces, I found a "Trust logos" section displaying three real, named companies' logos (PHD, Meraas, Kawasaki) under the caption "Buyers who have used our matching service," and a testimonial quoting a named person ("Benoit Gorand, Marketing Manager at Kawasaki") claiming *"Without Software Lantern we would still be looking for the right software."*

Set against B.1.1's actual figures — 3 leads ever, all EUDR, zero approved partners, €49 lifetime revenue — a genuine testimonial from a named Marketing Manager at Kawasaki describing a completed, satisfying matching experience is very hard to reconcile with what the data shows actually happened on this platform. I'm not asserting this is fabricated; I don't have the information to know whether there's a real relationship or conversation behind it that predates or sits outside what these three tables capture. But the arithmetic is uncomfortable enough that I think it needs your direct attention, independent of the OT project: **if this logo/testimonial isn't backed by a real, consenting relationship with that person and company, it should come down regardless of what happens to the rest of the site**, both as a matter of using a real identified person's name and because this exact pattern (a named company, a named person, an unverifiable quote) is precisely what constraint 3 on *this* task told me never to put on the new pages. It won't be carried over into anything built in Phase 2 either way.

### B.1.3 Scheduled or automatic emails, audited

Grepped every `sendEmail(` and `after(` call site in the codebase. There is no cron job and no time-based scheduled email anywhere in this repo (confirmed by searching for "cron"/"schedule" — the only hits were unrelated false positives in a blog post's body text and a code comment). Every email this system can send is triggered by one of these four events, and every one of them still works exactly as today if the public marketing pages are unlinked and noindexed (none of them depend on public navigation):

| Trigger | Recipient | Still fires if marketplace pages are unlinked? |
|---|---|---|
| New lead submitted (`/api/leads`) | `ADMIN_EMAIL` only (you) | Yes, if someone reaches `/finder` by a direct/old link — internal notification only, no risk |
| New partner signs up (`lib/portal-auth.ts`) | `ADMIN_EMAIL` only (you) | Yes, if someone reaches `/portal/signup` by a direct/old link — internal notification only, no risk |
| Admin manually clicks "Publish" on a lead (`app/admin/(protected)/actions.ts`) | **Real partner companies**, matched by category | Yes — this is the one real external email path, but it only fires from your own explicit admin action, never automatically. The 2 already-`published` leads and the 1 `new` lead from B.1.1 are each one click away from triggering this for real, matched partners, whether or not the public site changes |
| New OT enquiry submitted (Part A) | `ADMIN_EMAIL` only, production only | Unaffected by this instruction |

No change needed to any of this for the site replacement to be safe — the risk surface here is unrelated to public navigation, it's about who has admin access and when they click "Publish."

### B.1.4 SEO/Search Console equity, inbound links — still a genuine gap

Unchanged from Part A: no Search Console, Ahrefs, or backlink-data access from this session. If you want this section filled in with real numbers before deciding what happens to each old page, pull and share: Search Console's Pages/Performance report for the last 16 months (impressions and clicks per URL — this tells us which old pages, if any, are actually earning search traffic worth protecting), and Search Console's Links report (or Ahrefs/Semrush if you have it) for inbound links per URL (this tells us which old pages have backlink equity a 410 would simply destroy). Absent that data, §B.1.5 below reasons from first principles (how Google generally treats each page-handling option) rather than from this site's actual traffic, which is the honest limitation to flag before you decide.

### B.1.5 What happens to each old public page — options, trade-offs, recommendation per page

All four of your listed options, explained once, then applied per page:

- **Keep live, noindex, unlinked from new nav, removed from sitemap.** Reversible (flip noindex off, relink, re-add to sitemap, and it's exactly as before). Existing rankings fade over time since Google eventually drops pages it can't recrawl via links and sees noindex on, but nothing is destroyed instantly, and anyone with a direct link or bookmark still reaches a working page. Your stated default.
- **301 redirect** (to the new homepage, or to a topically closest new page). Passes most link equity to the target, fastest way to consolidate authority onto the new site, but it's a real structural claim ("this URL is now that URL") that's awkward here because an EUDR page 301ing to an OT-cybersecurity page has no topical relationship for Google to credit, which risks the redirect being treated as low-quality/manipulative rather than passing equity cleanly. Not reversible without visible churn (undoing a 301 after months reads as flip-flopping to Google).
- **410 Gone.** Fastest way to get a page fully out of the index, appropriate when a page's content is genuinely retired and you want Google to stop indexing it quickly. Destroys whatever ranking/link equity that specific URL held, with no reversibility (a 410'd-then-restored URL doesn't simply resume its old rankings).
- **Move to another domain.** Clean separation if the marketplace becomes its own standalone thing again later, but it's the most work (new DNS/Vercel project/env vars) and still loses most of the current URLs' equity in the move (search engines treat a domain migration as a new site unless done with a careful 301 migration plan, which reintroduces the 301 trade-offs above anyway).

| Page(s) | Recommendation | Why |
|---|---|---|
| Homepage `/` | **Replaced by the new OT homepage** (this instruction's whole point) | Not really an "old page to handle" — it's the thing being replaced |
| `/eudr`, `/plm`, `/battery-passport` | **Keep live, noindex, unlinked, out of sitemap** (your default) | These earn whatever search equity they have from category-specific terms the new OT site shares zero overlap with (confirmed in Part A §4); there's no reason to destroy that equity with a 410 when it costs nothing to just stop pointing at them. If B.1.4's Search Console data later shows they earn real traffic, that's a reason to reconsider standalone-marketplace investment, covered in Part A §5.6, not a reason to 410 them now |
| `/providers` | **Keep live, noindex, unlinked, out of sitemap** | Same reasoning; also the one page partners might still have bookmarked, and partner-facing flows (`/portal/*`) stay fully functional per constraint 8, so a partner clicking through from an old bookmark still lands somewhere coherent |
| `/finder` (+ `/finder/done`) | **Keep live, noindex, unlinked, out of sitemap** | Needs to keep working regardless: it's the live lead-capture mechanism for the 3 existing categories, and per constraint 8 it must not break for anyone who already has the link |
| `/resources/blog/*`, `/resources/regulations/*` | **Keep live, noindex, unlinked, out of sitemap** | Same reasoning as the category pages; these are informational content pages with their own potential search equity and zero topical relationship to redirect into |
| `/privacy` | **Stays live, stays indexed** (it's not a marketing page and must remain reachable/linked from the new footer too) | Covered separately in §B.1.6, this page gets an addition, not noindex |

**One page-handling item that is genuinely new work, not just a flag/noindex toggle:** the current homepage's "For providers" CTA and the footer's "Become a provider" / "Provider login" links need to come off whatever nav/footer the new homepage uses (constraint 8 already says this), while staying reachable at their existing URLs for anyone who already has them bookmarked, consistent with the table above.

### B.1.6 Privacy policy plan — diff, not applied

The current page (`app/(marketing)/privacy/page.tsx`) describes one service: the matchmaking marketplace. The moment the homepage changes, every new visitor to softwarelantern.com who clicks "Privacy Policy" reads a policy that doesn't describe what they just used. This needs fixing at the same time the homepage changes, not afterward.

**Approach: restructure into two clearly-labeled parts under one policy, not two separate pages.** One controller (still Johannes Cornelis de Boer), two products, each section says which product it's about. Below is the diff against the live file, section by section. `[Product name]` is a literal placeholder, same convention as Part A's `[Owner name]` — no brand name has been chosen for the OT line yet (open question, carried into §B.2.3).

**§1 "Who we are" — add a sentence, keep the rest:**
> *(unchanged, then append:)* This site currently operates two separate services under the same controller: the OT cybersecurity enquiry resource described below, and a software-matchmaking marketplace for EUDR, Fashion PLM, and Battery Passport software, kept live for existing partners and in-progress enquiries. Sections 2 to 9 below describe the OT cybersecurity service specifically; Section 10 describes the marketplace, kept for as long as that data and those partner relationships exist.

**§2 "What Software Lantern does" — replace entirely:**
> *(new text)* `[Product name]` is a content and enquiry resource about industrial cybersecurity: secure remote access to machines and OT systems, and the NIS2/Cyberbeveiligingswet, Cyber Resilience Act, and Machinery Regulation obligations that affect machine builders, factory and plant operators, and system integrators in the Netherlands, Belgium, and Luxembourg. If you submit an enquiry, we (the site owner) review it personally. We do not share your details with any other company unless we ask you about that specific company first and you agree. See Section 10 for the separate, differently-run software-matchmaking marketplace this site also operates.

**§3 "What personal data we collect" — add a new "(a) OT cybersecurity enquiries" subsection before the existing buyer/partner subsections, which get relabeled "(c)/(d), marketplace only":**
> *(new)* **a) If you submit an OT cybersecurity enquiry:** name, work email, company name, role, country (Netherlands, Belgium, Luxembourg, or other), phone number if provided, sector, whether you're a machine builder or an operator, your current remote-access approach if provided, timeline, free-text details, and your answers to the scope checker if you used it.

**§4 "legal basis" table — add one row:**
> *(new row)* Reviewing your OT cybersecurity enquiry and, only if you separately agree, sharing it with a specific named company | Enquiry form data | Consent (given when you submit the form, and again before any specific sharing)

**§5 "Who we share data with" — add, before the existing marketplace-specific sharing paragraph, which gets a "(marketplace only)" label:**
> *(new)* **OT cybersecurity enquiries:** we do not share your details with any other company automatically. If, after reviewing your enquiry, we think a specific company might be relevant, we will ask you about that company by name and only share your details if you agree, every time, for every company. Nothing is shared by default.

**§8 "Is this free to use?" — add a sentence:**
> *(append)* Submitting an OT cybersecurity enquiry is free, with no payment or obligation at any point.

**New §10, appended at the end (before "Contact us"):**
> *(new section)* **10. The software-matchmaking marketplace (legacy, kept for existing data)**
> Before this site became an OT cybersecurity resource, it operated as a matchmaking marketplace connecting buyers of EUDR, Fashion PLM, and Battery Passport software with software providers. That marketplace's pages are no longer linked from this site's navigation but remain reachable, unindexed, so that anyone with an existing link (including the providers who registered as partners) can still use them. We continue to: store and act on already-submitted buyer requirement forms; operate partner accounts, including reviewing pending applications; process lead-unlock payments via Stripe for partners who already have accounts; and honor every right described in Sections 6 to 9 of this policy for anyone whose data was collected through this marketplace. We will update this section if and when that data is fully wound down.

This is a draft for your approval, not applied anywhere — `app/(marketing)/privacy/page.tsx` is untouched in this session's working tree.

---

## B.2 PHASE 1 — Research and Design Plan

### B.2.1 Legal research: CRA, Machinery Regulation, IEC 62443 (new this pass)

All of this is in addition to Part A §1's NIS2/Cbw/Belgium research, which stands unchanged. **EUR-Lex direct fetches failed again this pass** (the fetch tool returns blank content for EUR-Lex specifically, regardless of network state — confirmed this is a tool-rendering issue, not a connectivity one, since the same tool successfully read Staatsblad and NCSC.nl pages in Part A). Every figure below is corroborated across multiple independent, mutually-agreeing secondary sources, same standard as Part A's Belgium research, and is still marked `[VERIFY]` pending an actual EUR-Lex read.

**Cyber Resilience Act — Regulation (EU) 2024/2847**, "horizontal cybersecurity requirements for products with digital elements." Adopted 23 October 2024, in force 12 November 2024. Staged application: notified-body provisions from 11 June 2026; **vulnerability/incident reporting obligations (24-hour reporting of actively exploited vulnerabilities) from 11 September 2026**; full application **11 December 2027**. Scope: products with digital elements whose intended or foreseeable use includes a direct or indirect network/device connection — this explicitly includes industrial control systems and connected machinery, and multiple independent sources (ei3.com, HMS Networks, machinerysafety101.com) specifically describe remote-access functionality on a machine as a "security-critical component" under the CRA, with responsibility for a weak or uncertified connection resting on the manufacturer. Excluded: medical devices, motor vehicles, civil aviation, marine equipment, defence. `[VERIFY against EUR-Lex 2024/2847 directly]`

**EU Machinery Regulation — Regulation (EU) 2023/1230**, replacing the Machinery Directive 2006/42/EC. **Corrected 2026-10-19:** the secondary-sourced 20 January 2027 figure below was wrong. Read directly against EUR-Lex this pass: Art. 54 states "It shall apply from 14 January 2027." Art. 51(2) repeals Directive 2006/42/EC "with effect from 14 January 2027" (the same date, no gap), and Art. 52(1) allows continued sale of machines already placed on the market under the old Directive before that date. New cybersecurity-adjacent essential health and safety requirements appear at **Annex III, sections 1.1.9 and 1.2.1**: manufacturers must show a cyberattack or data corruption cannot create a hazardous situation, and must provide security-relevant software updates for **10 years** after the machine is placed on the market. The exact Annex III section numbers and wording still need a direct EUR-Lex read.

**IEC 62443** (properly ISA/IEC 62443) is **a voluntary international standard, not a regulation** — confirmed directly, no ambiguity in the sources. No EU law makes conformance to it mandatory in itself. It becomes relevant commercially when a customer, insurer, or specific sector rule requires it contractually — the same "commercial pressure, not legal requirement" framing Part A established for NIS2 Article 21(2)(d) supply-chain pressure applies here too, and must be used identically: never "IEC 62443 is required," always "some customers or contracts may require it, even though no general law does."

**The one-sentence distinction worth building real site copy around, independently arrived at from the sources rather than copied from any one of them:** NIS2 regulates the *organization* (is your company, as an entity, managing cyber risk); the CRA regulates the *product* (is the machine itself, as something placed on the market, built securely); the Machinery Regulation regulates *safety*, newly extended to cover cyberattacks that create physical hazards. A machine builder can face all three at once, for the same machine, for different reasons — stating this plainly, without naming any vendor's take on it, is itself useful, differentiated content.

**Luxembourg NIS2 status** (needed since the enquiry form now includes LU as a country option, per the brief): transposed via the **Loi du 5 mai 2026** ("concernant des mesures destinées à assurer un niveau élevé de cybersécurité"), in force **10 May 2026**, competent authority the **Institut Luxembourgeois de Régulation (ILR)**, self-registration deadline **10 July 2026**. Corroborated across Deloitte Luxembourg, Elvinger Hoss, PwC Luxembourg, and Luxgap. `[VERIFY against Luxembourg's Journal Officiel directly]`

### B.2.2 Keyword and SERP research, EN + NL, with A/B/C evidence

Same evidence-label convention as Part A §2: **[A]** directly observed this pass, **[B]** a pattern inferred from several [A]s, **[C]** directional only, not verified by a rank-tracked or EU-located search. Single non-EU, non-rank-tracked search pass, 19 October 2026 — re-run before launch, same caveat as Part A.

- **[A]** "Secure remote access OT/ICS" and "secure vendor/third-party access to industrial systems" queries are dominated by vendor content (Secomea, Dispel, Cyolo, Claroty, TeamViewer Industrial, Ewon, plus consultancy listicles like OT Ecosystem's "Best 20/15" pages) — unchanged from Part A, confirmed again.
- **[A]** "Cyber Resilience Act machine builders" / "CRA for machine builders" is **also** vendor-and-consultancy dominated and more developed than Part A's narrower NIS2-only search suggested: ei3.com, IXON, HMS Networks, TXOne Europe, and machinerysafety101.com all have dedicated, fairly thorough CRA-for-machine-builders guides already live.
- **[B]** Combining regulations (NIS2 + CRA, or NIS2 + CRA + Machinery Regulation, specifically for machine builders) is a real, already-occupied content angle, not an empty gap — multiple of the sources above (accans.com, accevo.com, teamknocknock.com) explicitly frame "NIS2 and the CRA together" as their hook. **This revises Part A's "Dutch angle looks comparatively open" finding downward**: once CRA is added to the query mix, even the Dutch-language results include real competitor guides (accans.com, ixon.cloud's own knowledge hub). The honest framing now: this is a real, legitimate content space with existing serious entrants, not an empty field — differentiation has to come from genuine quality, source citation, and the cross-regulation synthesis done well, not from being first.
- **[C]** Directional only: whether a *lead-capture/enquiry-resource* site (as opposed to a vendor's own content marketing) exists yet in this exact Benelux/machine-builder/cross-regulation space is not confirmed either way by this pass's queries — none of the sources found are structured as a neutral enquiry funnel, all are vendor or consultancy content marketing, but a single search pass cannot rule out one existing that just didn't surface.
- **[A]** Dutch-language machine-builder-specific content (Brainport, LINK Magazine, Ceteq) from Part A still stands as directly observed and still thinner than the English CRA-inclusive results above.

**Keyword set to build around** (not a full A-E tiering like Part A's, since the brief asked for A/B/C evidence rather than a full keyword-priority table this time): "NIS2 machine builders" / "NIS2 machinebouwers," "Cyber Resilience Act machine builders" / "Cyber Resilience Act machinebouwers," "secure remote access machinery NIS2," "machineverordening cyberbeveiliging," "CE-markering cyberbeveiliging machines," "remote service machines NIS2 compliant." All [A]/[B] above; treat "best OT remote access software"-shaped bare vendor-comparison terms as [C]-tier/avoid, unchanged from Part A §2.4's tiering logic.

### B.2.3 Information architecture

**Reused, not rebuilt** (per the instruction): `components/nis2-scope-checker.tsx`, `components/ot-enquiry-form.tsx`, `components/ot-cyber-interactive.tsx`, `components/disclosure-slot.tsx`, `/api/ot-enquiries`, `supabase/ot-cyber-schema.sql`, `app/admin/(protected)/ot-enquiries/`, `lib/environment.ts`. Each gets extended (new checker branches for CRA/Machinery Regulation and the builder/operator/integrator split, new enquiry form fields, new SQL columns delivered as an additive migration, not a rewrite) rather than replaced.

**Proposed page list** (final URLs, replacing the provisional `/ot-cyber/*` prefix since that was never indexed or linked):

| Path | Purpose | Status |
|---|---|---|
| `/` | New homepage. Audience self-selection, the ledger signature element (§B.2.4), entry to the checker | Replaces current homepage |
| `/machine-builders` | Audience path: product-level obligations (CRA, Machinery Regulation), remote-access-as-security-critical-component framing | New |
| `/factory-operators` | Audience path: organizational obligations (NIS2/Cbw), vendor/supplier remote-access governance | New |
| `/system-integrators` | Audience path: sits between the other two — advises both builders and operators, remote-access practices affect both of their obligations | New |
| `/checker` | The NIS2/CRA/Machinery-Regulation scope checker, extended from `components/nis2-scope-checker.tsx`. Primary conversion tool, linked prominently from every audience path and the homepage | Extends existing |
| `/guides` | Guides hub (index) | New |
| `/guides/nis2-supply-chain-and-remote-access` | Extends the existing Part A article | Extends existing |
| `/guides/cyber-resilience-act-for-machine-builders` | New, per §B.2.1 | New |
| `/guides/machinery-regulation-cybersecurity` | New, per §B.2.1 | New |
| `/guides/iec-62443-explained` | New — explicitly frames it as voluntary, never "required" | New |
| `/who-runs-this` | Real "who runs this" page — name, background, why this exists, the disclosure slot's fuller context. This is the authority mechanism constraint 3 requires in place of stats/testimonials | New |
| `/enquiry` | Direct enquiry form, reachable without going through the checker first, same form/fields extended per §B.2.5 | Extends existing (currently only reachable after the checker) |
| `/privacy` | Updated per §B.1.6 | Extended |
| (unlinked, noindex) `/eudr`, `/plm`, `/battery-passport`, `/providers`, `/finder`, `/resources/*` | Per §B.1.5 | Unchanged, just unlinked |

**Lead flow:**
```
Homepage or audience path
        |
        v
  Self-identify (builder / operator / integrator)
        |
        v
   Scope checker (/checker) <------ reachable directly from guides too
        |
        v
  Result: regulatory facts for their answers + relevant guide link(s)
        |
        v
  CTA into /enquiry (same form, pre-filled with checker answers if they came from there)
        |
        v
  POST /api/ot-enquiries (extended fields, same dry-run guard)
        |
        v
  ot_enquiries row (production only) + admin email (production only)
        |
        v
  /admin/ot-enquiries — manual review, manual share-with-consent only
```

### B.2.4 Design plan

**Palette** (named hex, chosen explicitly against the current site's own gradient-hero/pill-button aesthetic, which is a generic B2B-SaaS template default):

| Role | Hex | Use |
|---|---|---|
| Background | `#f6f5f1` | Warm paper white, not sterile SaaS white |
| Ink | `#1a1d22` | Near-black graphite, body text and headlines |
| Structural / secondary text | `#3f4b52` | Borders, captions, secondary copy |
| Accent | `#9a3412` | Rust/burnt-orange, industrial-signage family. Links, CTAs, the ledger's timestamp marks. Used sparingly, never as a background fill |
| Status: in force / compliant | `#166534` | Deep green, ledger status dots only |
| Status: upcoming deadline | `#9a3412` | Same as accent, intentionally, so the ledger's "watch this" entries visually match the CTA color |
| Status: not yet determined | `#6b7280` | Neutral gray, ledger status dots only |

**Type:** keep **Instrument Sans** (already loaded, zero migration cost) for headlines and body. Add **IBM Plex Mono** (free, Google Fonts, via `next/font`) for dates, regulation citations, form field labels tied to technical data, and the ledger element itself. The pairing of a clean grotesk with a monospace for anything load-bearing/factual is the deliberate device that makes this read as a dossier, not a marketing page.

**Layout:** rectangular controls with a small radius (4-6px, not the current site's full pill buttons), hairline rule lines between sections (like a spec sheet, not soft drop-shadow cards), left-aligned text blocks rather than centered hero-with-illustration, no photography and no stock imagery anywhere.

**Signature element: the Compliance Ledger.** A recurring, monospace, terminal-log-styled strip of real regulatory milestones, styled like an actual OT remote-access session log (because that's the subject matter), populated only with real, cited dates, never fabricated activity:

```
10 MAY  2026  ●  Loi du 5 mai 2026 in force — Luxembourg (NIS2)        [VERIFY]
15 AUG  2026  ●  Cyberbeveiligingswet in force — Netherlands (NIS2)
11 SEP  2026  ○  CRA reporting obligations begin (EU-wide)             [VERIFY]
20 JAN  2027  ○  Machinery Regulation applies, no transition (EU-wide) [VERIFY]
11 DEC  2027  ○  CRA full application (EU-wide)                       [VERIFY]
```
(● = already in force, rendered in the "in force" green; ○ = upcoming, rendered in the "upcoming" rust; every row carries its own `[VERIFY]` tag inline exactly like this document does, not hidden in a footnote.) This appears, in full or truncated to 2-3 rows, in the homepage hero, at the top of the checker, and at the top of each audience path page — it's the one visual device that's unique to this specific subject (a real access/audit log, showing real regulatory events instead of fabricated activity), rather than a decorative pattern that could belong to any SaaS site.

**ASCII wireframe, homepage:**
```
+----------------------------------------------------------+
| [wordmark]                    Machine builders  Operators |
|                                Integrators   Guides  [EN|NL]|
+----------------------------------------------------------+
|                                                            |
|  Secure remote access to machines, under NIS2, the        |
|  Cyber Resilience Act, and the Machinery Regulation        |
|  ------------------------------------------------         |
|  For machine builders, factory operators, and system      |
|  integrators in the Netherlands, Belgium, and Luxembourg.  |
|                                                            |
|  [ Check your situation -> ]   [ Read the guides ]         |
|                                                            |
|  10 MAY 2026  . Loi du 5 mai 2026 in force (Luxembourg)    |
|  15 AUG 2026  . Cyberbeveiligingswet in force (NL)         |
|  11 SEP 2026  o CRA reporting obligations begin            |
|  ---------------------------------------------- (ledger)   |
+----------------------------------------------------------+
|  [ disclosure slot: placeholder text, full width ]          |
+----------------------------------------------------------+
|  Which of these is you?                                    |
|  +----------------+ +----------------+ +----------------+ |
|  | Machine builder| | Factory/plant  | | System         | |
|  | You build or   | | operator       | | integrator     | |
|  | sell machines  | | You run        | | You install or | |
|  |                | | production     | | service both   | |
|  | -> /machine-   | | -> /factory-   | | -> /system-    | |
|  |    builders    | |    operators   | |    integrators | |
|  +----------------+ +----------------+ +----------------+ |
+----------------------------------------------------------+
|  Three EU rules, three different things                    |
|  NIS2: your organization | CRA: your product | Machinery   |
|  Regulation: your product's safety                         |
|  [ one short paragraph each, no vendor names ]              |
+----------------------------------------------------------+
|  Guides                                    Who runs this    |
|  - NIS2 supply chain & remote access       [1-2 sentences,  |
|  - CRA for machine builders                 links to full   |
|  - Machinery Regulation cybersecurity        /who-runs-this] |
|  - IEC 62443, explained                                      |
+----------------------------------------------------------+
|  [ disclosure slot again, full width ]                      |
+----------------------------------------------------------+
|  footer: Guides  Who runs this  Privacy  [admin/portal NOT  |
|  linked, but still reachable by direct URL]                 |
+----------------------------------------------------------+
```

**Self-critique, before you see it as finished:**
- The dark-ink / single-rust-accent / monospace-for-data palette is itself becoming a recognizable "serious technical SaaS" convention (Vercel, Linear, Stripe's own docs all lean this direction now) — so the palette alone is not, by itself, a guarantee of standing out. What actually differentiates this is the **Compliance Ledger populated with real dates**, not the color choice. If the ledger gets cut or watered down in Phase 2 to save build time, this design degrades into exactly the generic technical-SaaS template it was trying to avoid, and that trade should not be made silently.
- The three-audience-card row ("Which of these is you?") is structurally identical to the exact "three feature cards" pattern the current homepage already uses under "Why us" and that most SaaS templates default to. It's kept here because it's the honest, simplest way to do audience self-selection, not because it's novel — flagging this rather than pretending the layout itself is original.
- Explicitly avoided and should stay avoided in Phase 2: a hero photo/illustration of "an engineer looking at a tablet in a factory" (the single most common stock-photo default for this exact subject matter), a certification-badge row, and any numeric stat tile ("X machines secured," "Y% faster") — all three would violate constraint 3 directly, and all three are also just generically overused regardless of the constraint.

### B.2.5 Conversion design

**Visitor journey, in order, matching the wireframe above:** (1) hero states the subject and the three regulations by name in one sentence, no feature list first; (2) the ledger immediately substantiates that this isn't vague marketing copy, it's dated and specific; (3) the disclosure slot appears before any persuasion happens, not buried at the bottom; (4) audience self-selection, three cards, no pre-judgment of which matters more; (5) the one-paragraph-each regulation framing (NIS2 vs CRA vs Machinery Regulation) answers "why three different things" before asking for anything; (6) guides and the "who runs this" link sit side by side, so authority-by-content and authority-by-transparency are presented together; (7) the checker is the primary conversion action, linked from the hero CTA, every audience page, and every guide, each time just below the main value proposition, not as an exit-intent popup or sticky bar.

**Form placement:** the checker is embedded inline at `/checker`, same pattern as Part A's `eudr-scope-checker.tsx`-derived component, ending in a CTA into `/enquiry`. The enquiry form itself lives at its own page (so it's linkable and reachable cold, not just as a checker appendix) and is also embedded at the bottom of `/checker`'s result screen pre-filled with the checker's answers, exactly like Part A's lifted-state pattern (`ot-cyber-interactive.tsx`), extended to carry the new fields through.

**Enquiry fields** (extends Part A's `ot_enquiries` schema additively, delivered as SQL for you to run, not applied):
- name, work email *(reuses the existing free-email-domain block, both client-side in the form and server-side in `/api/ot-enquiries`, unchanged from the pattern already in `app/api/leads/route.ts`/`lib/finder-config.ts`)*, company — unchanged from Part A
- **role** (new, free text or a short select: e.g. owner/founder, engineering, IT/security, operations, other)
- **country** (new, replaces the old NL/BE/other/not-sure checker-only field): NL, BE, LU, other — and LU's facts from §B.2.1 get wired into the checker's country branch, same pattern as NL/BE
- **sector** (new, short select, informs which guide to recommend)
- **builder or operator** (new, select: machine builder, factory/plant operator, system integrator, not sure) — drives which audience framing the admin sees and which guide gets suggested in the auto-reply-free success state
- **current remote-access method** (new, free text, optional, deliberately open-ended and non-leading, e.g. "What do you use today, if anything?" — never a dropdown of product categories, since constraint 1 forbids asserting or even implicitly ranking specific products)
- timeline (new field, short select: already looking, within 6 months, within 12 months, no specific timeline)
- free text (new, open "anything else" field)
- consent (unchanged from the approved wording, Part A §6.2, `[Owner name]` placeholder retained)

### B.2.6 Dutch plan

**URL structure:** path-prefixed, `/nl/...` mirroring the English tree exactly (`/nl/machinebouwers`, `/nl/fabrieksoperators` or similar, `/nl/checker`, `/nl/gidsen/...`), not a subdomain or ccTLD, consistent with how a single Next.js app already handles everything here and with how Part A's own Dutch-second-pass instruction was framed.

**hreflang:** `en` as the default/`x-default`, `nl` on its mirrored path, reciprocal `<link rel="alternate" hreflang="...">` tags on every paired page, added through the existing `pageMetadata()` helper (extended to accept an optional `alternates.languages` map) rather than a new helper.

**Translation order, once English is verified (per the instruction, Dutch is a second pass, not simultaneous):** 1) the checker (highest-conversion page, and NL-specific legal facts already exist in English that just need translating, not re-researching), 2) `/enquiry` and the consent text (legal-adjacent, needs care, short), 3) homepage, 4) `/factory-operators` and `/machine-builders` (Dutch buyer-side search intent skews toward machine builders specifically per Part A and §B.2.2's SERP findings), 5) guides, lowest priority since they're the most time-consuming to translate well and least likely to be the first page a Dutch searcher lands on compared to the checker.

### B.2.7 Analytics events

Reuses the existing `track()` convention from `@vercel/analytics` already live in `components/finder-wizard.tsx` (`track("finder_start", ...)` / `track("finder_complete", ...)`), extended with new event names rather than a new analytics mechanism:

- `checker_start` — fired when the first checker question is answered. Property: `audience` (builder/operator/integrator/not_sure) if already known from an audience-path entry point, nothing else.
- `checker_complete` — fired on reaching a result screen. Properties: `country`, `sector`, `in_scope_result` (in_scope/out_of_scope_generally/not_sure) — category-level values only, matching exactly what Part A's checker already tracks internally as state, never free text.
- `enquiry_submit` — fired on a successful (non-dry-run) submission. Property: `source` (checker/direct) only.

No name, email, phone, company name, or free-text field content in any event property, in either the checker or the enquiry form, on either environment.

### B.2.8 Parked: comparison table

Not designed, not built, per the instruction. Noting it exists as a future idea requiring your employer's separate approval before any work starts on it, so it doesn't get silently picked up in Phase 2 under the cover of "guides."

---
---

# PART C — Phase 2 Build (2026-10-19 approval)

**Status: built on the `ot-cyber-build` branch, committed, not pushed, not merged.** Full change-by-change detail is in `docs/PHASE-16-CHANGES.md`, written to this repo's existing PHASE-doc convention rather than duplicated here. Highlights against each numbered addition in the approval:

1. **Removed:** the old homepage file (named customer logos, the Kawasaki testimonial) is deleted outright as part of replacing the homepage, not edited — nothing from it was carried into any new page.
2. **Done, not struck:** `/finder` now shows a short notice. `/admin`, `/portal`, `/api/stripe/*`, and the auth routes are untouched and still work.
3. **Done:** `lib/compliance-ledger.ts` is the one file every ledger entry comes from, each with a citation URL, a `lastVerified` date, and a `verified` flag driving an inline `[VERIFY]`.
4. **Done:** the homepage hero leads directly into the ledger; IEC 62443 is stated as voluntary on the checker, the homepage's "three rules" section, and its own guide; no page claims a rule requires a product category.
5. **Done:** `[Owner name]` is now "Johannes Cornelis de Boer" everywhere in the consent text. The finalized privacy-policy diff was applied (not left unapplied this time, since the blocking placeholder was resolved) — see `app/(ot)/privacy/page.tsx` and §PHASE-16 item 5.
6. Dutch not started. Nothing pushed, nothing merged.

**Verified this pass, upgrading §B.1.4/§B.1.5's earlier "can't check" status:** network access worked in this session (it hadn't earlier), so every external citation URL used in the ledger and guides was actually fetched: all resolve (HTTP 200) except `atwork.safeonweb.be/nis2` (Belgium's official tool), which returns a 403 to automated requests with a tiny generic response body, consistent with the same domain's behavior throughout this research (ccb.belgium.be also blocked this session's tools). This reads as bot/geo protection, not a dead link, but a manual browser click-test before go-live is the honest way to be certain, not an assumption this document should make for you.
