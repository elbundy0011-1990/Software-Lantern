# Software Lantern — SERP & GEO Analysis (Phase 5)

**Research conducted:** 16 August 2026, via live web search. **Read the methodology caveats below before using any finding in this document** — they are restated at the start of each major section, not just here, because they materially change what each finding means.

---

## Methodology & Caveats (governs the entire document)

1. **No rank-tracking tool was used or is available** (no Ahrefs, SEMrush, Search Console position data). Every claim about "what ranks" below is a **qualitative observation from a single live web-search pass**, not verified or tracked SERP data.
2. **Geographic/personalization bias is real, not theoretical.** These searches ran from this tool's infrastructure, which is not EU-located. EUDR and Battery Passport buyers overwhelmingly search from EU countries (Netherlands, Denmark, Germany, France for EUDR; Germany and other EU manufacturing hubs for Battery Passport). Google personalizes and localizes results by origin. Even from non-EU infrastructure, a striking number of German/EU vendors surfaced (Bosch, Siemens, AVL, Spherity, OMR Reviews) — which is itself a hint that an actual EU searcher would see a **further-skewed, more regional, possibly non-English** result set than what's captured here. Every ranking/competitor observation below should be treated as **directionally indicative, not a reliable proxy for the actual target buyer's SERP.**
3. **This is a single point-in-time snapshot (16 August 2026), not monitored data.** SERPs shift — several sources cited "2026"-dated listicles that get periodically republished, one regulatory deadline was cited inconsistently *within the same research pass* (see EUDR section), and the DPP central EU registry going live in 2026 was flagged as an event likely to reshuffle Battery Passport rankings shortly after this analysis. **Re-run this analysis quarterly**, not treat it as fixed.

---

## 1. SERP Intent Analysis

### 1.1 EUDR

| Keyword | Dominant page types ranking | Intent | Google favors | Content gap? |
|---|---|---|---|---|
| EUDR compliance software | Vendor product pages (osapiens, IntegrityNext, Source Intelligence, BanQu), vendor-authored "best of" listicles (Coolset, Passionfruit) | Commercial | Vendor pages over directories/regulatory sources — no .europa.eu result appeared | Yes — every listicle is vendor-authored and self-favoring; no neutral matcher present |
| EUDR software (bare) | Same set + Assent, VERSO | Commercial | Same | Same; matchilla.com (see §2) surfaced here — first sign of a real matchmaking competitor |
| EUDR software providers | Same set + Koltiva, Leadity, an unverified "34 providers" listicle claim | Commercial, provider-comparison framed | Listicle/enumeration content pulled in more here | Same |
| EUDR software for small business | **Materially different result set**: osapiens' own SME page, eudrready.eu, supplycanvas, eudr.co | Commercial, SME-qualified | Vendor pages explicitly SME-positioned | No — this space is **already populated** by real SME-positioned competitors (see §2); not an empty gap |
| EUDR software for SMEs | Same SME cluster + Coolset's SME page, OMR Reviews (DE-market directory) | Commercial, SME-qualified | Same | Same as above |
| EUDR traceability software | Same core vendor set + tracextech.com glossary page | Commercial, slight informational lean | Vendor pages, one definitional page cracked through | Feature-specific term; less differentiated opportunity than the category-level terms |
| EUDR due diligence software | Source Intelligence, osapiens, VERSO, IntegrityNext, Dilify (commodity-specific) | Commercial | Vendor pages | Same as category-level terms |

**Cross-query pattern:** osapiens appeared in **all 7** searches — the clear dominant incumbent. IntegrityNext, Source Intelligence, and Coolset appeared in most. Capterra and OMR Reviews were the only genuine third-party review/directory sites observed, and only for "best of"-style queries, not the bare category terms.

**Could Software Lantern provide a genuinely better result?** For the enterprise-framed terms: plausibly, but not because "matchmaking beats directories" — a real matchmaking competitor already exists in this exact category (Matchilla, see §2). The differentiation has to be **category specialization**, not the matching mechanic itself. For the SME-framed terms: the opportunity is real (confirmed by actual buyer-facing competitors already built around it) but **not uncontested** — eudrready.eu already owns a sharp version of this narrative, with published pricing. See §2 for what a credible response looks like.

### 1.2 Fashion PLM

| Keyword | Dominant page types ranking | Intent | Google favors | Content gap? |
|---|---|---|---|---|
| fashion PLM software | Vendor definitional pages (Lectra, Infor, Centric) + vendor listicles (Kōbō, Rechain, Creative Force) | Mixed informational/commercial | No neutral third party present | Every ranking page is vendor-owned and steers to that vendor |
| fashion PLM software providers | Fashinza listicle, **Technology Evaluation Centers (TEC)** — a genuine third-party evaluation directory, more vendor listicles | Commercial, provider-comparison | Listicle/comparison content over single-vendor pages | TEC is the closest thing to neutral content found across this entire research pass (all three categories) |
| fashion PLM comparison | Near-total listicle saturation: Uphance, TEC, Kōbō, Skema3D, WFX, Lectra, BlueCherry, Rechain | Strongly commercial, comparison-intent | Listicles almost exclusively | Most listicle-saturated query observed; every one is vendor-authored except TEC |
| apparel PLM software | Vendor product pages (AIMS360, ApparelMagic, Centric) + listicles | Mixed, slightly more product-page-favoring | Mixed | Same pattern |
| PLM software for fashion | Vendor definitional content (WFX, Lectra, Infor) + listicles | Informational-leaning | Mixed | Same pattern |

**Explicit check requested — bare "PLM software":** Confirmed. Top results are **100% general/industrial** (Siemens, Oracle, Dassault, SAP, a G2 manufacturing-PLM article) — zero fashion-specific results surfaced. This directly validates the earlier decision to retarget `/plm` from "PLM software" to "fashion PLM software"/"apparel PLM software" — targeting the bare term would have put the page in entirely the wrong competitive space.

**Could Software Lantern provide a genuinely better result?** Yes, with a caveat: no ranking page (except arguably TEC) does active requirement-based narrowing — every listicle is a vendor ranking itself favorably. But TEC already occupies real estate as a neutral evaluation tool, so "we're neutral" alone isn't sufficient differentiation; the response is fashion-specific depth TEC (a broad, cross-industry tool) likely doesn't match.

### 1.3 Battery Passport

| Keyword | Dominant page types ranking | Intent | Google favors | Content gap? |
|---|---|---|---|---|
| battery passport software | Vendor pages (AVL, Circularise, Bosch, carbmee) + genuinely informational/authoritative sources (globalbattery.org, thebatterypass.eu consortium, Wikipedia) | Mixed | Mixed — the only category where a non-commercial informational source (GBA) ranks strongly | No matchmaking content present |
| battery passport software providers | KPMG+Circulor press release, Circularise, Circuland, AVL, Bosch, Open Battery Passport | Commercial, provider-list intent | Vendor pages, not directories | Same |
| battery passport compliance software | Kiwa (certification body), Circularise, Circuland, Bosch, Siemens, a genuinely authoritative CEPS/EU policy PDF, GBA, Minespider, iPoint | Commercial, compliance-framed | Vendor pages + one authoritative regulatory source | Same |
| digital battery passport software | Same vendor set + **DPP Hero** (general DPP tool, not battery-specific, published pricing) | Commercial | Vendor pages | Confirms DPP-general tools genuinely compete for battery-specific queries (see below) |
| battery passport platform | AVL, **Dassault Systèmes 3DEXPERIENCE** (battery passport as one module of a full PLM suite), Denso, Open Battery Passport, GBA | Commercial, skews enterprise/industrial | Vendor pages, heavier industrial-platform presence | "Platform" phrasing pulls in much larger industrial players than "software" does |

**DPP-vs-Battery-Passport overlap — confirmed significant, not a minor edge case.** A dedicated check on "digital product passport software comparison" surfaced dpp-tool.com's own comparison guide, Spherity's provider list, Gartner's DPP review category, and Avelero's "DPP tools for fashion" — all of which also partially surface under the battery-specific queries above. One source explicitly characterized the DPP software market as "young and fragmented... most platforms weren't originally built as dedicated DPP software — they're traceability/carbon-accounting/supply-chain tools that added a DPP output." This is a genuine buyer confusion point (supports the matchmaking narrative) but means bare "DPP software" targeting would attract a lot of non-battery-relevant traffic — reinforces the existing decision to only target DPP terms in a battery-qualified way.

**Regulatory date observed:** Multiple independent sources (AVL, GBA, a CEPS policy PDF, Minespider) consistently cited **18 February 2027** under EU Regulation 2023/1542. Consistent enough across independent sources to be a reasonably strong signal — but per standing `[VERIFY]` discipline (and because this space's dates have moved before), confirm against the official EU regulation text before publishing it as a stated fact anywhere on the site.

**Could Software Lantern provide a genuinely better result?** Yes — this is the strongest content-gap finding of the three categories. No ranking page in any of the 5 searches resembles a neutral, requirements-based matcher; every result is a vendor page, a vendor-authored comparison, or a directory/aggregator (Gartner Peer Insights, Net Zero Compare) that lists many vendors without narrowing to the buyer's specific chain-position and data requirements.

---

## 2. Competitive SERP Gap

Format: 5–10 notable competitors per category, deduplicated across that category's keyword set. **All positioning/strength/weakness assessments are observations from this research pass**, not verified claims about these companies.

### 2.1 EUDR

| Competitor | Type | Positioning | CTA | Strength | Weakness | What Software Lantern could plausibly do differently |
|---|---|---|---|---|---|---|
| **osapiens** | Vendor | Market-leading, TRACES-integrated, multi-entity, "700+ leaders" claim | Demo request | Dominant incumbent across all 7 EUDR queries observed | Enterprise-oriented | Not a "beat osapiens" play — Software Lantern's opening is being the neutral first stop before a buyer commits to researching osapiens vs. competitors alone |
| **IntegrityNext** | Vendor | Automated DDS + direct TRACES submission | Demo/contact | Strong feature depth, ranks consistently | Single-vendor pitch | Same as above |
| **Source Intelligence** | Vendor | Satellite-powered risk screening | Contact/demo | Strong on risk-assessment specifically | Enterprise-oriented | n/a |
| **Coolset** | Vendor + content | Broader ESG suite (EUDR+CSRD+PPWR), self-authored "best 6" listicle ranking itself #1 | Sign up/demo | High content-marketing presence | Self-interested comparison content | Software Lantern's genuine neutrality (not selling software) is a real, defensible contrast to exactly this pattern |
| **eudrready.eu** | Vendor marketing as comparison content | Explicit SME narrative — names coffee roasters/artisan chocolate/furniture retailers directly, freemium €0–€79/mo vs. "competitors charging €12,000+ annually" | "Start free — EUDR scope check in 5 minutes" | Sharp, specific SME positioning; real pricing transparency (rare in this space) | It's vendor marketing dressed as a "comparison" — self-favoring on inspection | **Most important single finding for the EUDR SME section.** This narrative is already owned by a real vendor. Software Lantern isn't introducing a new insight by saying "enterprise tools are wrong for SMEs" — that's validated but not novel. The credible response is being the neutral comparison *of* EUDRReady and 2 other SME-fit options, not restating the same pitch a vendor already makes better, with pricing, on its own site |
| **matchilla.com (MatchZINE)** | **Direct matchmaking-model competitor** | Questionnaire → shortlist of 3 providers from 35+ vendor database, free for buyers, revenue from provider fees, broader ESG scope (not EUDR-only) | "Fill out the Match Assistant" | Nearly identical mechanic to Software Lantern's; broader vendor database; established market-intelligence claims (~700 ESG comparisons) | Broader ESG remit may mean less EUDR-specific depth per vertical | **Software Lantern's "we're a matchmaker, not a directory" pitch is not unique — this company already does it.** Realistic differentiation is category specialization: tightly-scoped, regulation-driven verticals with category-specific question flows, vs. Matchilla's broad ESG remit. This is a real but *unverified* hypothesis (their actual matching depth per category is unknown), not a guaranteed win — state it, don't oversell it |
| **Capterra** | Review/directory | Generic SaaS review listing | "Get pricing" | High domain authority | Thin on EUDR-specific nuance | Category-specific requirement-gathering (commodities, supplier count, geolocation maturity) is materially more tailored than a generic directory listing |
| **OMR Reviews** | Review/directory (DACH-focused) | "EUDR Software Comparison" category page | Browse listings | Regional relevance, plausible EU-searcher visibility | Directory format, not requirement-matched | Same as Capterra |

### 2.2 Fashion PLM

| Competitor | Type | Positioning | CTA | Strength | Weakness | What Software Lantern could plausibly do differently |
|---|---|---|---|---|---|---|
| **Centric Software** | Enterprise vendor | Market leader (LVMH/ASICS/Gymshark-tier) | Demo request | Strongest brand recognition, ranks broadly | Enterprise-only fit, likely overkill for smaller brands | Route smaller/mid-market brands to better-fit tools instead of the biggest name |
| **Lectra / Kubix Link** | Enterprise vendor | Definitional + comparison content strategy (acquired Gerber/YuniquePLM) | Contact/demo | Strong GEO-style definitional content | Same self-interested-listicle pattern as all vendors | Neutral framing where Lectra's own "best of" list structurally can't be |
| **WFX** | Mid-market vendor | 200+ vendor collaboration; publishes both guides and listicles | Demo | Dual content strategy | Still self-ranking in its own "top 7" post | — |
| **Bamboo Rose** | Enterprise vendor | Absorbed Backbone PLM (2023) | Contact | Enterprise credibility | Not clearly differentiated from Centric in search snippets | — |
| **ApparelMagic / AIMS360** | Vendor (combined PLM+ERP) | SMB-leaning | Demo | Clear small/mid-brand fit signal | Narrower brand recognition, same self-interest issue | — |
| **BlueCherry (CGS)** | Vendor | Publishes "Best PLM for Fashion Brands" guide | Contact | Long-standing industry presence | Self-favoring listicle | — |
| **Onbrand PLM** | Vendor | Aggressive listicle content strategy (multiple "best/top" posts) | Demo | High SERP presence via repeated publishing | Every listicle conveniently favors Onbrand | — |
| **Technology Evaluation Centers (TEC)** | **Third-party evaluation directory** | Broad software-comparison tool, not vendor-owned | Compare/evaluate tool | Only genuinely neutral resource found across this entire research pass (all 3 categories) | Breadth-over-curation — appears to be a broad comparison tool, not an active "answer questions, get 3 matches" mechanic | **This is the one to watch.** Differentiation is curation depth (≤3, requirement-matched, fashion-specific question flow) vs. TEC's broader, cross-industry comparison-tool approach |

### 2.3 Battery Passport

| Competitor | Type | Positioning | CTA | Strength | Weakness | What Software Lantern could plausibly do differently |
|---|---|---|---|---|---|---|
| **AVL Digital Battery Passport** | Enterprise vendor | Automotive-testing heritage | Contact/demo | Strong brand credibility, ranks across nearly every query | Enterprise-only, no visible SME path | Explicitly serve buyers AVL is the wrong fit for |
| **Circularise** | Vendor | Supply-chain traceability + passport module, deadline-framed CTA | "Battery Passport software for 2027 EU compliance" | Clear urgency framing | One vendor's perspective presented as definitive | Show multiple credible options |
| **Circuland** | Vendor | AI data extraction + passport assembly, explicit "EU 2023/1542 Compliant" | Solution page | Specific regulatory citation | Narrow (data-wrangling focus) | Match by which specific data burden matters most (traceability vs. carbon vs. SoH) |
| **Bosch (Battery in the Cloud)** | Major industrial vendor | Static + dynamic telemetry data | Product page | Huge brand trust, genuine dynamic-data (SoH) capability | Likely enterprise-only | Brand trust doesn't help a small buyer evaluate fit |
| **Global Battery Alliance** | Industry body, not a vendor | Neutral, standard-setting | None (informational) | High authority, genuinely neutral | Not a software provider — can't help implementation | Complementary, not really competing — Software Lantern is commercial-actionable where GBA is purely informational |
| **DPP-Tool** | Vendor + self-authored comparison content | Multi-category DPP, explicitly SME-priced (from €9/mo) | Self-serve signup | Transparent pricing, genuinely SME-accessible, ranks for "best of" queries with its own content | Self-authored comparison, inherently self-interested | Closest thing to a real competitor in spirit — neutral, requirements-based narrowing is the direct differentiator |
| **Spherity** | Vendor + self-authored "Top Providers" listicle | Germany/Europe-focused DPP identity | Contact | EU-specific framing, own listicle ranks well | Also self-interested | Same as DPP-Tool |
| **Gartner Peer Insights** | Review/directory | Peer-review-based comparison | None direct | High authority | Requires existing product usage — post-purchase, not pre-purchase | Software Lantern operates pre-purchase, based on stated requirements |
| **Dassault Systèmes (3DEXPERIENCE)** | Major industrial platform | Passport as one module of a full PLM suite | Enterprise sales | Deep capability for large OEMs | Almost certainly wrong-sized for anyone but large manufacturers | Explicitly help buyers avoid over-buying a full PLM suite when they just need passport compliance |

### 2.4 Cross-Category Synthesis — the Single Most Important Finding

**"We're a matchmaker, not a directory" is not, by itself, a unique or sufficient differentiation claim.** Real, functioning competitors already occupy some version of this position in every category researched: Matchilla (EUDR, direct model match), Technology Evaluation Centers (Fashion PLM, neutral comparison tool), and DPP-Tool/Spherity (Battery Passport, self-authored comparison content, not a true matcher but closer than pure vendor pages). The credible, defensible differentiation is **category specialization and depth** — a purpose-built EUDR/Fashion-PLM/Battery-Passport question flow that reflects real buying criteria in each vertical (commodity, supplier count, geolocation maturity for EUDR; product category, workflow scope for PLM; chain position, passport data scope for Battery Passport) — versus broader, generalist tools covering many categories shallowly. This should be stated as a genuine, testable hypothesis in site copy, not an unverified superiority claim (see Next Steps §3 for precise wording).

---

## 3. GEO / AI Search — Target Questions & Recommended Answer Coverage

**Same caveats apply:** these are the questions this research pass judges *likely* to be asked of an AI search system, based on the commercial query patterns observed above — not verified query-log data.

### 3.1 EUDR

| Question | Can Software Lantern answer credibly? | Where |
|---|---|---|
| "What is EUDR compliance software?" | Yes — already answered on `/eudr` | Existing GEO block |
| "How do I choose EUDR software?" | Yes — already an FAQ item on `/eudr` | Existing |
| "Which EUDR software is best for SMEs?" | **Partially.** Software Lantern doesn't rank/endorse specific vendors (by design — matches the "not a directory" positioning), so it can't name "the best" SME tool the way eudrready.eu's own marketing can. It *can* credibly answer "how to think about choosing" and "what SME-specific EUDR software looks like" without naming a winner. Do not fabricate a "best" answer to compete with vendor marketing on vendor marketing's terms. | `/eudr` SME section — reframe as evaluation criteria, not a named recommendation |
| "What are the main EUDR software providers?" | No — Software Lantern doesn't maintain or publish a vendor directory; answering this risks turning the page into exactly the "directory" positioning it's trying to avoid | Do not attempt to answer this directly on-page |
| "Is EUDR software different for small businesses than large importers?" | Yes, and this is now evidenced, not just hypothesized — eudrready.eu's own market positioning (found in this research pass) independently confirms real pricing/complexity differences exist | Strengthen the existing SME section with this framing |

### 3.2 Fashion PLM

| Question | Can Software Lantern answer credibly? | Where |
|---|---|---|
| "What is fashion PLM software?" | Yes — already answered on `/plm` | Existing |
| "What PLM software is best for fashion brands?" | Partially — same reasoning as EUDR: can explain evaluation criteria (company type, workflow scope, current tooling), should not fabricate a named "best" recommendation | `/plm` — frame as "what to match on," not a ranked list |
| "How do I compare fashion PLM platforms?" | Yes | Could be added as an explicit FAQ item (currently implicit in the page's framing, not a direct Q&A) |
| "Is fashion PLM different from general PLM software?" | Yes, and now confirmed by direct research (bare "PLM software" SERP is 100% general/industrial) | Worth an explicit sentence — this is a genuinely useful, evidence-backed distinction for both humans and AI systems |

### 3.3 Battery Passport

| Question | Can Software Lantern answer credibly? | Where |
|---|---|---|
| "What is Battery Passport software?" | Yes — already answered on `/battery-passport` | Existing |
| "Who provides Battery Passport software?" | No — same reasoning as "main EUDR providers"; don't turn the page into a directory | Do not attempt to answer directly |
| "How do I choose Battery Passport software?" | Yes — already an FAQ item | Existing |
| "What's the difference between a Battery Passport and a Digital Product Passport?" | Yes — already answered on `/battery-passport`, and this research pass **independently confirmed this is a genuinely confusing, high-value distinction to clarify** (DPP tools measurably compete for battery-specific queries) | Existing content is validated — no change needed, but worth reinforcing this is a differentiator, not just a definitional nicety |
| "When do companies need to comply with the EU Battery Regulation's passport requirement?" | Cautiously — 18 Feb 2027 was consistent across multiple independent sources in this pass, but must be verified against the official EU regulation text and dated/sourced on-page, not stated as a bare fact | New — recommend adding, but only once verified |

**What NOT to do (per instruction against generic AI filler):** none of the above should become a wall of FAQ schema stuffed with every conceivable question. The recommendation is a small number of genuinely load-bearing additions/reinforcements to existing pages, detailed with exact placement in `/docs/SEO-NEXT-STEPS.md` §5.
