# Software Lantern — Ideal Customer Profile & Buyer Persona Document

**Status:** Source of truth for buyer targeting and positioning.
**Scope:** softwarelantern.com — homepage, category pages, landing pages, matchmaking form, SEO/GEO content, CTAs.
**Do not use this document for:** legal/regulatory claims made on the live site without independent verification against primary sources (European Commission, relevant national competent authorities). Everywhere a specific date, threshold, vendor count, or market statistic would strengthen a claim, this document marks it `[VERIFY]` rather than inventing it — the live site should do the same until verified.

---

## 1. Executive Summary

Software Lantern is a B2B matchmaking marketplace, not a software directory. The product does one thing: a buyer describes what they need in a short structured form, and Software Lantern identifies up to **3** software providers that appear to fit — never a ranked list of dozens, never a generic comparison grid.

This matters for every downstream decision (copy, SEO, forms, CTAs) because the entire value proposition depends on the buyer feeling *understood*, not *searched at*. A directory wins on breadth of listings. Software Lantern wins on narrowing choice in markets that are genuinely hard to navigate — specialized, fragmented, regulated, or operationally complex software categories where a generic "browse all vendors" experience fails the buyer.

Three categories today, each with a distinct primary forcing function:

| Category | Primary forcing function | Nature of the problem |
|---|---|---|
| EUDR Compliance Software | EU regulation (deadline-driven) | Regulatory / legal risk |
| Fashion PLM Software | Operational growth / complexity | Operational / product-development |
| Battery Passport Software | EU regulation (deadline-driven) | Regulatory + product-data + supply-chain |

EUDR is further split into **two distinct sub-personas** — Enterprise/Mid-Market and SME — because they have different budgets, different problem owners, different objections, and arguably need different matched providers. Treating "EUDR buyer" as one persona would mean either the messaging or the matching quality is wrong for a large share of visitors. See Section 4.

This document is the reference for *who* the site should be built for. It intentionally does not prescribe exact page layouts or copy — it prescribes the buyer reality that layouts and copy must be built around.

---

## Positioning Principles (Read Before Writing Any Copy)

**The matchmaking mechanic — "answer some questions, get matched with up to 3 providers" — is not a unique differentiator.** Live SERP/GEO research (see `/docs/SERP-GEO-ANALYSIS.md` for the full research) confirmed that functioning competitors already run a similar questionnaire-to-shortlist model in every one of Software Lantern's three categories. The mechanic is real and should stay central to the product, but it is the *delivery mechanism*, not the moat — do not write copy that positions "we match you with 3 providers, unlike a directory" as the primary reason to choose Software Lantern.

**The actual differentiation is:**
- Category-specific expertise (EUDR / Fashion PLM / Battery Passport specifically, not generic B2B software matching)
- Genuinely understanding the buyer's specific requirements (industry, company size, supply chain, technical/data needs — not a one-size-fits-all form)
- Helping buyers navigate markets that are fragmented and hard to compare alone
- Turning those actual requirements into a structured, provider-ready brief — not a generic feature checklist

**Language discipline that follows from this:**
- Never claim to know which provider is objectively "best," "guaranteed," or a "perfect" fit. Use "relevant providers," "potential fit," "based on your requirements," "providers that may fit your needs."
- Never name a competitor (by company name or product name) in live, public-facing site copy. Competitive research informs internal strategy only — see `/docs/SERP-GEO-ANALYSIS.md` and `/docs/SEO-NEXT-STEPS.md`, which are internal documents, not source material for site copy.
- The buyer stays in control: Software Lantern narrows the field and explains why; the buyer compares and decides.
- **No em-dashes (—) in any site copy, in any phase, going forward.** Rewrite with whatever reads most naturally for that specific sentence — a comma, a period splitting it into two sentences, a colon, or parentheses. Never do a blind find-replace with one substitute character, since em-dashes do different grammatical jobs in different sentences (an aside takes parentheses, an elaboration takes a colon, two independent clauses take a period). This applies to live, user-facing copy specifically — code comments and internal-only logs are not in scope. A full sitewide sweep and fix was completed in Phase 10 (see `/docs/PHASE-10-CHANGES.md`); this rule exists so future phases don't reintroduce them.

**Software Lantern is not an automated software recommendation engine, and does not run algorithmic matching or provider scoring.** The actual mechanism is: a buyer submits structured requirements through the Finder → the resulting lead is published to the relevant category's provider portal → providers review the lead and self-select whether to respond, claim, or purchase it, because they have the product expertise to judge their own fit — not Software Lantern. Software Lantern's job is to produce a high-quality, structured requirement and get it in front of the right providers efficiently; determining fit is the provider's call, not an algorithm's. This is a deliberate architectural decision, not a missing feature.

**Language discipline that follows from this:**
- Do not describe or imply automated/algorithmic matching, fit-scoring, filtering, or ranking of providers — Software Lantern does not compute or claim to know provider fit.
- Avoid phrasing where Software Lantern is the grammatical subject of "matching" or "identifying" providers on the buyer's behalf (e.g. "we identify providers that fit," "we match you with...") if it implies an automated process happening on our side. Prefer framing where the mechanism is visible: Software Lantern publishes a clear, structured requirement; providers review it and decide for themselves.
- The provider portal is core marketplace infrastructure, not a passive display — future copy and product work should treat provider self-selection as the actual mechanism, not an implementation detail to gloss over.

Any future work on copy, messaging, landing pages, features, or the provider portal should treat this section as binding, not just directional.

---

## 2. Overall Software Lantern ICP

Across every category, the ideal visitor has all (or nearly all) of the following:

1. **A concrete software problem**, not a vague "let's see what's out there" curiosity.
2. **A forcing function** — regulatory deadline, operational pain that has become urgent, or a growth inflection that broke the current process.
3. **A fragmented, hard-to-navigate vendor market** — enough credible vendors that comparison is genuinely difficult, and vendors differ enough (industry focus, feature depth, price point) that "just pick the top Google result" produces a bad outcome.
4. **A named person responsible** for solving the problem (even if that person is a generalist wearing many hats, as in the EUDR SME persona).
5. **Meaningful budget** relative to the category — this varies enormously by category and sub-persona (see Section 7); "meaningful" for an SME EUDR buyer is not the same number as for an enterprise Battery Passport buyer.
6. **Realistic urgency** — an active or upcoming evaluation, implementation need inside roughly 3–12 months, not "maybe next year."
7. **Existing process that is manifestly inadequate** — spreadsheets, email, a legacy system being outgrown, or literally nothing yet.

The ideal-company filter, restated simply:

> A meaningful problem + budget + urgency + multiple vendors to choose from + real difficulty evaluating them + a person actively responsible for solving it.

**Company-size instinct (default, refined per category in Section 7):** favor mid-market and larger companies over micro-companies — *except* where a category has a genuine, underserved SME segment (EUDR does; see Section 4.2). The filter is not "small company = bad fit," it's "company with no real budget or no real urgency = bad fit," and those two things correlate with size differently in different categories.

---

## 3. Buyer Persona Framework (applies to every category)

Do not assume a single "buyer" per company. For every category and sub-persona below, distinguish:

| Role | Definition |
|---|---|
| **Problem owner** | Whoever feels the pain day-to-day and is accountable for it not being solved. |
| **Primary end-user** | Who actually uses the software once bought. |
| **Decision-maker** | Who has final sign-off on which vendor is selected. |
| **Economic buyer** | Who controls/approves the budget line. |
| **Technical evaluator** | Who assesses integrations, data model, security, implementation feasibility. |
| **Compliance/regulatory stakeholder** | Who signs off that the solution actually satisfies the regulatory requirement (regulated categories only). |
| **Influencer** | Adjacent stakeholder whose objection can stall a deal even without formal authority (e.g., IT flagging a security concern, Legal flagging a data-processing concern). |

These roles frequently collapse into one or two people at smaller companies and fragment into five-plus people at larger ones. Company size is the single biggest driver of how many distinct people are actually involved — which is itself one of the reasons the EUDR persona had to be split (see Section 4).

---

## 4. Category: EUDR Compliance Software

**Important positioning guardrail (applies everywhere EUDR is discussed on the site):** Software Lantern does not make companies legally compliant and does not provide legal advice, regulatory certification, or a compliance guarantee. Software Lantern helps a company identify and compare software providers whose platforms *may* fit their EUDR-related requirements. Any regulatory claim (deadlines, thresholds, obligations) must cite or link an authoritative source (European Commission EUDR pages, official EU Regulation text, or relevant national competent authority) and should be marked `[VERIFY]` in this document and re-checked before publishing, since EUDR's application timeline has already shifted once and may shift again — do not hardcode a date into evergreen copy without a "last verified" note.

EUDR buyers split into two sub-personas with materially different budgets, problem owners, objections, and (plausibly) different vendor matches. Do not default to the enterprise persona because it's more familiar or produces bigger deals — the SME segment is a large share of real search traffic and, per the brief for this document, is currently **underserved by existing EUDR software vendors**, most of whom price and design for the enterprise segment `[stated in source brief as a known, documented gap — do not need independent verification to state the strategic conclusion, but do not attach a specific number/percentage to it without a source]`. That gap is a meaningful part of the strategic reason EUDR was chosen as Software Lantern's first vertical, and the site should not quietly let the SME segment fall through the cracks in favor of the more familiar enterprise narrative.

### 4.1 Sub-persona A — Enterprise / Mid-Market EUDR Buyer

**Who they are:** Larger importers, traders, and manufacturers of EUDR-relevant commodities with existing compliance infrastructure and dedicated sustainability/compliance headcount.

**Target industries:** Paper & Forest Products; Food Production; Import & Export; Timber Importers; Timber & Wood Products; Coffee; Cocoa; Rubber; Palm Oil; Soy; Cattle/Leather; Furniture; Consumer Goods; and other companies importing, manufacturing, trading, or placing EUDR-relevant products on the EU market at meaningful scale.

**Primary buyer / problem-owner roles:** Head of Sustainability, Head of Compliance, Head of Procurement, Head of Sourcing. Do not assume any one of these is always the owner — determine likely ownership from company size, industry, and org structure (a large food company likely routes through Sustainability or Compliance; a large timber trader may route through Sourcing or Trade Compliance).

**Secondary / influencer roles:** Head of ESG, Head of Supply Chain, Supply Chain Director, Trade Compliance Manager, Customs/Import Compliance Manager, Regulatory Affairs, Sustainability Manager, ESG Manager, Supplier Compliance Manager, Responsible Sourcing Manager, Operations Director, Legal/Compliance.

**Persona framework:**

| Role | Likely owner |
|---|---|
| Problem owner | Head of Sustainability / Compliance / Procurement / Sourcing (size- and industry-dependent) |
| Primary end-user | Compliance Manager, Sustainability Manager, or Supplier Compliance Manager |
| Decision-maker | Problem owner, often with sign-off from a senior exec |
| Economic buyer | COO, CFO, Procurement Director, or another senior executive |
| Technical evaluator | IT / Data / Supply Chain (for ERP/system integration and data model fit) |
| Regulatory stakeholder | Legal/Compliance, Regulatory Affairs |
| Influencer | IT (integration risk), Legal (liability/audit-trail sufficiency) |

**Buying triggers:** approaching or newly-clarified EUDR deadline `[VERIFY current date before publishing]`; need to stand up a due-diligence process from scratch; need supplier data collection at scale; need geolocation data collection; need traceability to plot of origin; need systematic risk assessment; need to generate and manage Due Diligence Statements; need integration with the EU Information System; current process is Excel/email-based and won't scale; large supplier base; large number of affected SKUs; uncertainty about which vendor fits; existing process (manual or a first-generation tool) is too hard to maintain; preparing for an audit or increased regulatory scrutiny.

**Pain points:** supplier data incomplete or scattered across systems; difficulty collecting geolocation data from upstream suppliers; risk assessment done manually; poor traceability to origin; no cross-supplier visibility; too much Excel/email; hard to maintain a defensible audit trail; regulatory uncertainty; genuine difficulty telling EUDR vendors apart (feature depth, geography focus, industry focus, integration depth all vary).

**Desired outcomes:** a defensible, audit-ready due-diligence process; minimized legal and reputational risk; clean integration with existing ERP/procurement/supply-chain systems; a system suppliers will actually populate; confidence that the chosen platform will still be relevant as the regulation's enforcement approach matures.

**Buyer objections:** "We already have a partial process/spreadsheet system — is switching worth it?"; "How do you choose the 3 providers, and are you just taking payment to push vendors at us?"; "Will our data be shared before we've agreed to anything?"; "Is this actually free for us?"; "How is this different from just searching ourselves?"; "Can you really tell us which vendor fits our specific commodity/geography mix?"

**High-intent search behavior:** "EUDR software", "EUDR compliance software", "EUDR due diligence software", "EUDR software providers", "best EUDR software", "EUDR software comparison", "EUDR software for [coffee/cocoa/timber/palm oil/rubber/soy/cattle]", "EUDR traceability software", "EUDR geolocation software", "EUDR software pricing", "[specific vendor] alternatives", "EUDR software vs [competitor]", "how to choose EUDR software", "EUDR Information System integration software".

**Recommended messaging:** lead with the forcing function and the choice-overload problem, not with product features: *"EUDR compliance software is a fragmented, fast-moving market. Tell us about your suppliers, products, and current process — we'll connect you with up to 3 providers that believe they can meet your requirements."* Reinforce that Software Lantern is not the compliance authority and does not replace legal advice.

**Recommended CTA:** "Find My 3 EUDR Software Matches" or "Get Matched With EUDR Providers" — avoid generic "Get Started," the CTA should restate the specific value (3 matches, EUDR-specific).

**Recommended matchmaking form fields (enterprise flow):** industry/commodity (multi-select: coffee, cocoa, rubber, soy, palm oil, wood, cattle, other), role in supply chain (importer/manufacturer/trader/distributor/downstream operator), approximate supplier count, approximate SKU count in scope, sourcing regions, current geolocation-data maturity, current ERP/procurement system, hardest current pain point (open text), compliance timeline, contact details. *(This already matches the live wizard's EUDR flow closely — see cross-reference note below.)*

### 4.2 Sub-persona B — SME EUDR Buyer

**Who they are:** Small importers, traders, and producers of EUDR-relevant commodities — e.g. small coffee roasters, artisan food producers, small furniture or timber traders — without a dedicated compliance function. This is not "enterprise buyer, smaller company" — it is a **structurally different buyer**: no named "Head of Compliance," a single generalist (often the owner/founder or an operations generalist) personally handling this alongside a dozen other responsibilities, and materially higher price sensitivity.

**Target industries:** the same commodity list as 4.1 (coffee, cocoa, rubber, palm oil, soy, cattle/leather, timber/wood, paper products, furniture), but at small-business scale — independent roasters, small food producers, small furniture makers/traders, small timber importers.

**Primary buyer / problem-owner role:** Owner/Founder, or a generalist Operations/Office Manager who has been handed compliance as one of several responsibilities. There is often no one with "compliance" in their title at all.

**Secondary roles:** Bookkeeper/finance generalist, external accountant or trade-compliance consultant the business already uses, occasionally a family member or co-founder handling admin.

**Persona framework:**

| Role | Likely owner |
|---|---|
| Problem owner | Owner/Founder or generalist Ops person |
| Primary end-user | Same person — SME buyers rarely have a separate implementation team |
| Decision-maker | Owner/Founder, typically alone |
| Economic buyer | Owner/Founder — budget authority and problem ownership are usually the same person |
| Technical evaluator | Often the same person again, or an external consultant/bookkeeper they already trust |
| Regulatory stakeholder | External advisor (accountant, trade consultant) if anyone, otherwise none — this is itself a risk factor the buyer is often aware of and anxious about |
| Influencer | External advisor, or a larger customer/buyer downstream who is pushing them to demonstrate compliance |

**Buying triggers:** a customer or buyer downstream is now asking for proof of EUDR readiness; a looming deadline the owner has become aware of, often later than enterprise buyers `[VERIFY current date before publishing]`; realizing spreadsheets genuinely will not scale to what's being asked of them; fear of losing EU market access; a competitor or peer business mentioned using a specific tool.

**Pain points:** no internal expertise at all, not just an inefficient process; enterprise-tier EUDR platforms are priced and designed for teams they don't have; genuine confusion about what's actually required of a business their size; anxiety about getting it wrong with no compliance team to catch mistakes; time — this person is doing compliance in the margins of running the business.

**Desired outcomes:** a simple, affordable, largely self-serve tool that gets them compliant without hiring anyone; confidence they won't lose access to EU customers; something they can set up and run themselves without a lengthy enterprise sales/implementation cycle.

**Buyer objections:** "Enterprise EUDR software is way more than we can afford or need"; "I don't have time to evaluate a dozen vendors, I have a business to run"; "Is there even a tool built for a business my size, or am I going to be sold something oversized?"; "Can I trust a free matchmaking service, or is this going to result in a sales onslaught?"

**High-intent search behavior:** "EUDR software for small business", "cheap EUDR software", "EUDR compliance for small importers", "EUDR software small coffee roaster", "do I need EUDR software", "simple EUDR compliance tool", "EUDR software pricing", "affordable EUDR software", "EUDR requirements small business `[VERIFY]`". Note the intent signature differs meaningfully from the enterprise segment — more "do I need this / what's the minimum" framing, less "which platform is best-in-class."

**Recommended messaging:** explicitly acknowledge the segment exists and is underserved: *"Most EUDR software is built for large importers with compliance teams. If you're a small business trying to figure out what you actually need, tell us about your business and we'll match you with providers that fit a business your size."* Emphasize simplicity, affordability, and speed over feature depth.

**Recommended CTA:** a softer, less "enterprise procurement" framing than 4.1 — e.g. "Find EUDR Software That Fits My Business" rather than "Find My 3 EUDR Software Matches," which can read as an enterprise-procurement phrase to a solo founder.

**Recommended matchmaking form fields (SME flow):** same core questions as 4.1 but shorter and reframed in plain language (avoid "role in supply chain" jargon — ask "what does your business do" instead), plus an explicit rough team-size / no-dedicated-compliance-person signal, and a budget-sensitivity question the enterprise flow may not need as prominently.

### 4.3 Routing Between the Two EUDR Sub-Personas — Flag for Implementation

The two sub-personas need **different landing page copy and, ideally, a different (or branching) matchmaking form** — this is a real product gap today, not just a documentation nuance:

- **Landing page copy:** a single EUDR landing page trying to speak to both a Head of Sustainability at a large importer and a solo coffee-roaster founder will likely undersell to one of them. Recommend either two distinct landing pages (e.g. an SME-oriented entry point reachable from SME-intent search terms) or a single page with an early, low-friction self-segmentation moment ("Which best describes you?").
- **Form question to add:** the current finder wizard does not ask company size or supplier count *before* branching messaging — it asks supplier count as one of several EUDR questions mid-flow, but doesn't use it to change tone, CTA, or (later) which providers get recommended. Recommend adding an early qualifying question (company size and/or supplier count) specifically so the flow can route to different messaging/results framing for enterprise vs. SME, rather than defaulting every EUDR visitor into enterprise-flavored copy.
- **Provider matching:** if/when Software Lantern's provider roster includes vendors explicitly positioned for SMEs, the matching logic should weight sub-persona, not just commodity/industry — an SME buyer matched to 3 enterprise-tier platforms is a bad outcome even if the commodities line up.

This section exists specifically so future work (site or wizard changes) doesn't silently default the SME persona out just because the enterprise persona is more fully fleshed out elsewhere on the site today.

---

## 5. Category: Fashion PLM Software

**Nature of the problem:** primarily operational and product-development, not regulatory. This changes the tone considerably from EUDR/Battery Passport — less urgency-from-deadline, more urgency-from-growing-pains.

**Target companies:** fashion brands; apparel manufacturers; clothing companies; footwear companies; accessories companies; fashion retailers with significant product development; fashion companies with complex supplier networks; growing fashion companies managing multiple collections/SKUs.

**Primary buyer / problem-owner roles:** Head of Product Development, Product Director, Head of Sourcing, Head of Supply Chain, Head of Operations.

**Secondary / influencer roles:** COO, Head of Design, Product Development Manager, Sourcing Director, Supply Chain Director, Procurement Director, Operations Director, Digital Transformation Director, IT Director/CIO, and Sustainability/Product Compliance roles where PLM is connected to product-data requirements (a natural adjacency to both EUDR and Battery Passport — see Section 10).

**Persona framework:**

| Role | Likely owner |
|---|---|
| Problem owner | Head of Product Development or Head of Sourcing |
| Primary end-user | Product Development Manager, design and sourcing teams, supplier-facing staff |
| Decision-maker | Head of Product Development / Product Director, often jointly with Operations |
| Economic buyer | COO or CEO, or Operations leadership at mid-market companies |
| Technical evaluator | IT Director/CIO or Digital Transformation Director |
| Regulatory stakeholder | Not primary, but increasingly relevant as product-compliance data (materials, sustainability) gets pulled into PLM |
| Influencer | Design (workflow fit), Sourcing (supplier collaboration fit) |

**Buying triggers:** rapid company growth; increasing SKU/collection complexity; too many suppliers to coordinate manually; moving off spreadsheets; a broader ERP implementation creating pressure to modernize PLM alongside it; product development team expansion; need for better supplier collaboration; need for centralized product data; need to improve speed-to-market; replacing a legacy/outgrown PLM; implementing a first PLM system; rising sustainability/product-compliance data requirements pulling more data into the product record.

**Pain points:** Excel-based product development; unmanaged tech packs; BOM management chaos; inconsistent product costing; disorganized sample management; poor supplier collaboration; scattered material management; hard-to-manage collection complexity; product data spread across disconnected systems; poor lifecycle visibility; too many manual handoffs; difficulty scaling product development processes; difficulty coordinating a growing supplier base; slow speed-to-market relative to competitors.

**Desired outcomes:** faster, more predictable product development cycles; a single source of truth for product/BOM/costing data; suppliers who can collaborate directly in-system instead of over email; a system that scales with collection/SKU growth without breaking; measurable speed-to-market improvement.

**Buyer objections:** "We've survived on spreadsheets so far, is this worth the disruption?"; "How long does implementation actually take?"; "Will our team actually adopt it, or will it become shelfware?"; "Can this handle our specific product category (footwear vs. apparel vs. accessories) well?"; "How is a matchmaking service better than just demoing the 3 platforms everyone already recommends?"

**High-intent search behavior:** "PLM software", "fashion PLM software", "apparel PLM software", "footwear PLM software", "best PLM software for fashion", "PLM software comparison", "PLM software pricing", "PLM software for [fashion/footwear/apparel]", "[specific vendor] alternatives", "PLM implementation", "how to choose PLM software", "replace legacy PLM", "tech pack software", "BOM management software fashion".

**Recommended messaging:** lead with the operational pain and growth narrative rather than a feature list: *"PLM means something different depending on your category and supply chain. Tell us about your business and we'll connect you with up to 3 PLM providers that believe they fit."* This matches the existing `/plm` landing page copy already live on the site and should stay consistent with it.

**Recommended CTA:** "Find My PLM Match" or "Find My 3 PLM Matches" — the existing site already uses "Find my PLM →" consistently; keep that voice.

**Recommended matchmaking form fields:** company type/industry (fashion/apparel, footwear, automotive-adjacent, aerospace, medical devices, consumer goods, industrial manufacturing, other — matches current wizard), functional scope needed (product development, tech packs, BOM, materials, supplier collaboration, costing, sampling, sustainability), current software/process, biggest current gap, user count, implementation timeline, contact details. *(Matches the current live wizard closely.)*

---

## 6. Category: Battery Passport Software

**Nature of the problem:** primarily regulatory, product-data, and supply-chain/lifecycle-data — closer to EUDR in urgency structure than to PLM, but with a stronger product-engineering and data-infrastructure dimension.

**Important positioning guardrail (same as EUDR):** Software Lantern helps companies find and compare Battery Passport / Digital Product Passport software providers. It does not provide compliance certification and does not guarantee legal compliance. Any specific regulatory deadline or threshold referenced on the site (including EU Battery Regulation digital battery passport requirements) must be marked `[VERIFY]` and checked against the official EU source before publishing, and re-checked periodically — regulatory implementing/delegated acts in this area are still maturing.

**Target companies:** battery manufacturers; battery cell manufacturers; battery pack manufacturers; EV battery companies; electric vehicle manufacturers; light means of transport manufacturers (e-bikes, e-scooters); industrial battery manufacturers; stationary energy storage companies; energy storage system manufacturers; automotive companies involved in batteries; battery recyclers/lifecycle companies where relevant.

**Primary buyer / problem-owner roles:** Head of Product Compliance, Head of Regulatory Affairs, Head of Sustainability, Head of Product, Head of Compliance.

**Secondary / influencer roles:** ESG Director, Sustainability Director, Head of Engineering, Battery Engineering Director, Supply Chain Director, Procurement Director, Quality Director, Data/Digital Transformation Director, Regulatory Compliance Manager, Product Lifecycle Manager.

**Persona framework:**

| Role | Likely owner |
|---|---|
| Problem owner | Product Compliance, Regulatory Affairs, or Sustainability leadership |
| Primary end-user | Regulatory Compliance Manager, Product Lifecycle Manager |
| Decision-maker | Problem owner, jointly with Engineering for data-model/integration feasibility |
| Economic buyer | Product, Operations, or Executive leadership |
| Technical evaluator | Engineering / IT / Data (battery lifecycle data, ERP/PLM/MES integration) |
| Regulatory stakeholder | Regulatory Affairs, Legal |
| Influencer | Engineering (data feasibility), Supply Chain (supplier data collection burden) |

**Buying triggers:** EU Battery Regulation obligations approaching `[VERIFY current date/thresholds before publishing]`; need to collect and structure battery lifecycle data; need supplier/product data at scale; carbon footprint reporting requirements; raw material and recycled-content data requirements; State of Health data requirements; battery lifecycle traceability needs; QR/digital-identity requirements; need to integrate passport data with existing ERP/PLM/MES systems; upcoming regulatory deadlines creating internal pressure; no internal infrastructure exists yet for this data; battery/product data currently fragmented across suppliers and internal systems.

**Pain points:** no existing system for lifecycle or passport data; supplier data collection is manual and incomplete; carbon footprint and recycled-content data hard to source and verify; State of Health data not systematically captured; integration complexity with existing ERP/PLM/MES; genuine difficulty distinguishing vendors who differ significantly in scope (pure passport/QR tooling vs. full lifecycle-data platforms vs. carbon-accounting-first tools).

**Desired outcomes:** a compliant, audit-ready digital battery passport; clean data flow from suppliers and internal systems into the passport without duplicate manual entry; a platform that will hold up as implementing regulations mature; minimized engineering burden to stand it up.

**Buyer objections:** "The regulation itself is still evolving — will this platform keep up?"; "How much engineering effort does integration actually take?"; "Can this handle our specific chemistry/product category?"; "Are we being matched with vendors who actually understand batteries, or generic 'digital product passport' tools?"

**High-intent search behavior:** "battery passport software", "digital battery passport software", "EU battery regulation software", "battery passport providers", "battery passport software comparison", "battery lifecycle data software", "battery carbon footprint software", "battery passport QR code software", "[specific vendor] alternatives", "digital product passport software battery", "battery passport implementation".

**Recommended messaging:** *"Battery Passport software spans everything from carbon accounting to full lifecycle platforms. Tell us about your product and data needs — we'll connect you with up to 3 providers that believe they fit."*

**Recommended CTA:** "Find My Battery Passport Match" / "Get Matched With Battery Passport Providers."

**Recommended matchmaking form fields:** position in battery value chain (cell manufacturer, pack assembler, automotive OEM, energy storage, materials supplier, recycler, other), what the passport needs to carry (material traceability, carbon footprint, due diligence data, State of Health, compliance reporting, QR/access rules, supply-chain data collection), current software/process, biggest current gap, user count, implementation timeline, contact details.

---

## 7. Company-Size Priorities

Company-size priority is **category-dependent**, not a single global rule:

| Category / sub-persona | Priority sizing | Rationale |
|---|---|---|
| EUDR — Enterprise/Mid-Market | Mid-market to large | Budget for full-featured platforms; dedicated compliance headcount to act on the match |
| EUDR — SME | Small business (explicitly prioritized, not deprioritized) | Real, underserved demand; smaller deal size but real market and currently poor vendor fit elsewhere |
| Fashion PLM | Mid-market to large; growth-stage smaller brands with real complexity are still viable | PLM only makes sense once SKU/collection complexity crosses a real threshold — very early-stage brands are a weak fit regardless of ambition |
| Battery Passport | Mid-market to large | Meaningful engineering/data investment implied; very small operations unlikely to have standalone battery products in scope yet |

General instinct outside EUDR-SME: prioritize companies large enough to have a *real* software requirement, but not so large that they already run a mature internal procurement process that doesn't need a matchmaking layer (those buyers are more likely to run a formal RFP than fill out a web form).

---

## 8. Geographic Priorities

- **EUDR:** EU-facing trade is the core driver — importers/traders/manufacturers placing relevant products on the EU market, regardless of where the company itself is headquartered (a Latin American coffee exporter or a US furniture importer selling into the EU is as relevant as an EU-based company). `[VERIFY: confirm current site geographic targeting/language coverage before over-indexing copy on any single region.]`
- **Battery Passport:** similarly EU-regulation-driven, but the buyer base is more likely to be headquartered in major manufacturing regions (EU, and global manufacturers selling into the EU) — same "who is placing product on the EU market" logic as EUDR.
- **Fashion PLM:** not regulation-bound, so geography should follow wherever the fashion/apparel/footwear industry has real density and English-language (or eventually localized) search demand — no inherent EU-only constraint.

Do not assume EUDR/Battery Passport = "EU companies only" — assume "companies whose products touch the EU market," which is a broader and more accurate targeting frame.

---

## 9. Poor-Fit ICP (exclude / deprioritize)

Across all categories:

- Very small companies with no meaningful software budget (outside the deliberately-included EUDR SME segment, which has *some* budget, just a small one — the exclusion is "no budget at all," not "small budget").
- Visitors looking only for free software.
- Students.
- Consultants or analysts researching the market for a report, not for their own company's purchase.
- Visitors with no active software requirement (pure browsing/educational intent).
- Visitors seeking only generic educational content with no purchase intent.
- Companies outside the relevant category/industry entirely.
- Buyers who have already selected a vendor and are just double-checking.
- Companies whose requirements cannot realistically be met by the current vendor ecosystem in that category (e.g., a need far outside what any known provider offers).

---

## 10. Cross-Category Opportunities

- **Fashion + EUDR:** fashion companies sourcing EUDR-relevant raw materials (leather/cattle, rubber, some packaging/wood-adjacent inputs) may need both PLM and EUDR-related software. A fashion buyer already on the PLM journey who mentions cattle/leather or rubber sourcing is a plausible EUDR cross-sell/cross-content opportunity.
- **Fashion + Battery Passport:** relevant for companies in wearable electronics or accessories/products that contain batteries (e.g., certain footwear or accessory tech, though this is a narrower overlap than the other two).
- **PLM + Battery Passport:** battery manufacturers increasingly need product-lifecycle-management discipline alongside battery-passport-specific infrastructure — a Battery Passport buyer describing broader product-development pain (not just passport/compliance data) is a plausible PLM cross-sell.
- **Product Compliance + PLM:** PLM platforms increasingly hold product, material, supplier, and compliance data together — as sustainability/compliance data requirements grow (across all three categories), the line between "PLM" and "compliance software" blurs. Category pages and internal linking should acknowledge this rather than treating the three categories as fully siloed.

Recommend internal linking between category pages wherever a genuine overlap exists (e.g., a mention of "leather and rubber sourcing" on the EUDR page could link to the PLM page for fashion-specific visitors, and vice versa) rather than treating each category as an isolated funnel.

---

## 11. SEO / GEO Implications

1. **Prioritize commercial buyer intent** over generic educational queries — someone searching "what is EUDR" is lower-intent than someone searching "EUDR software comparison."
2. **Speak directly to the relevant buyer role** in landing page copy — a Head of Compliance and a solo SME founder should not read identical copy (see Section 4.3).
3. **Explain the business problem before the software features.** Every category page should establish "here's the situation you're in" before "here's what to look for in a platform."
4. **Name the forcing function explicitly** — regulation and deadline for EUDR/Battery Passport, growth/complexity for PLM.
5. **Make the visitor feel industry-understood**, not generically addressed — commodity-specific, product-category-specific, or chain-position-specific language performs better than generic "compliance software" language.
6. **Avoid directory language** ("browse our listings," "compare all vendors") — the site's differentiation is narrowing choice, not maximizing browsable inventory.
7. **State the "up to 3 providers" mechanic explicitly and often** — it is the core differentiator and should appear in hero copy, category page copy, and CTA-adjacent microcopy.
8. **Make the matchmaking CTA prominent** on every page that could plausibly attract buyer-intent traffic, not just the homepage.
9. **Build industry/use-case landing pages only where genuine search intent exists** (e.g., "EUDR software for coffee importers," "PLM software for footwear brands," "EUDR software for small business") — do not create pages speculatively.
10. **Avoid thin SEO pages built solely for keyword targeting** — every page should offer real, specific value to the buyer role it targets.
11. **Content should demonstrate genuine category expertise** (the buying triggers, pain points, and role-specific framing in Sections 4–6 are the raw material for this) rather than reading as generic AI-generated filler.
12. **Give each category its own buyer journey and messaging voice** — do not template one funnel across all three and swap the noun.
13. **Build topical authority per category** through interlinked, genuinely useful content (buying-trigger content, comparison-framework content, role-specific content) rather than isolated one-off pages.
14. **Optimize for both traditional search and AI/GEO discovery** — write content that directly and extractably answers the specific commercial questions in the "high-intent search behavior" sections above (Sections 4–6), since these are exactly the query shapes an AI answer engine is likely to be asked and to summarize from.
15. **Answer specific commercial questions**, not generic "what is X" explainer content — e.g. "how to choose EUDR software for a small coffee business" is a better content target than "what is EUDR."
16. **Never position Software Lantern as a compliance/legal authority.** Any regulatory claim must be sourced to an authoritative reference and should carry a "last verified" date given how EUDR's and the Battery Regulation's implementing timelines have moved.

---

## 12. Website Messaging — The Psychological Funnel

The intended progression for every category:

1. "I have a software problem."
2. "This market is complicated and there are many providers."
3. "Software Lantern understands what I actually need."
4. "I don't have to research all of them myself."
5. "I can tell Software Lantern what I need."
6. "They'll introduce me to up to 3 relevant providers."
7. "That's easier than doing all the research myself."

Homepage and category pages should not front-load technical detail — establish the problem and the "narrowed to 3" mechanic before going deep on any category's specifics.

**Primary CTA options (select per category per Sections 4–6 above):**

- "Find My 3 Software Matches" — best as a category-agnostic homepage CTA.
- "Tell Us What You Need" — good early-funnel, low-commitment framing; works well for the EUDR SME persona specifically, since it reads as lower-pressure than "procurement" language.
- "Get Matched With 3 Providers" — strong mid-funnel/category-page CTA once the visitor already understands the mechanic.
- "Find the Right Software" — safest generic fallback; weakest differentiation, use sparingly.

---

## 13. Comparison Table — EUDR (Enterprise) vs. EUDR (SME) vs. Fashion PLM vs. Battery Passport

| Dimension | EUDR — Enterprise | EUDR — SME | Fashion PLM | Battery Passport |
|---|---|---|---|---|
| Forcing function | Regulatory deadline `[VERIFY]` | Regulatory deadline `[VERIFY]` + downstream customer pressure | Operational growth/complexity | Regulatory deadline `[VERIFY]` |
| Problem owner | Named specialist (Sustainability/Compliance/Sourcing) | Owner/Founder or generalist Ops | Head of Product Development / Sourcing | Product Compliance / Regulatory Affairs / Sustainability |
| Economic buyer | Senior exec (COO/CFO/Procurement Director) | Same as problem owner | COO/CEO or Operations leadership | Product/Operations/Executive leadership |
| # distinct stakeholders typically involved | High (3–6+) | Low (often 1) | Medium (2–4) | Medium–high (3–5) |
| Budget sensitivity | Moderate | High | Moderate | Moderate–low |
| Buying cycle framing | Procurement-style evaluation | Fast, self-serve-leaning decision | Growth/operational investment | Compliance + engineering investment |
| Core objection | "Which of many vendors actually fits us?" | "Is there anything built/priced for a business my size?" | "Is switching from spreadsheets worth the disruption?" | "Will this keep up as regulation matures?" |
| Site copy tone | Professional, procurement-literate | Plain-language, reassuring, low-friction | Operational, growth-oriented | Technical-but-accessible, compliance-forward |
| Vendor-fit risk if mismatched | Wasted evaluation time | Buyer priced out / overwhelmed, may churn from the funnel entirely | Poor category/workflow fit | Poor integration/data-model fit |

---

## 14. Recommended Priority Order of Buyer Personas

**Overall, across categories (highest strategic priority first):**

1. EUDR — Enterprise/Mid-Market (largest deal sizes, best-understood persona, strongest existing content/wizard fit today)
2. Battery Passport (regulatory urgency comparable to EUDR, smaller but well-defined buyer pool)
3. EUDR — SME (high volume of real intent, currently underserved by vendors, but smaller deal sizes and a segment the site is not yet fully built for — see Section 4.3 gaps)
4. Fashion PLM (large addressable market, but lower urgency than the regulation-driven categories since there's no hard deadline forcing a decision)

**Within EUDR specifically:** do not treat this as "Enterprise first, SME later" in a way that lets SME slip permanently — the recommendation above is a *build-sequencing* priority (enterprise messaging/wizard is more mature today), not a signal that the SME segment matters less strategically. Per Section 4, SME EUDR is a genuine, currently underserved opportunity and should be explicitly planned for, not indefinitely deferred.

**Within Fashion PLM:** prioritize growth-stage and established mid-market brands with real SKU/collection complexity over very early-stage brands evaluating PLM prematurely.

**Within Battery Passport:** prioritize buyers who can articulate a specific data/compliance requirement (carbon footprint, SoH, material traceability, etc.) over undifferentiated "just researching" traffic, since the vendor landscape here is more specialized/fragmented than EUDR's.

---

## Appendix A — Cross-Reference to the Current Live Product

As of this document's writing, the live finder wizard (`lib/finder-config.ts`) already implements question flows closely matching Sections 4.1, 5, and 6's recommended form fields for EUDR, PLM, and Battery Passport respectively. Known gaps this document surfaces for future work:

- No enterprise/SME branching question or messaging split for EUDR (Section 4.3) — the current EUDR flow and `/finder` entry points implicitly assume the enterprise persona.
- No dedicated SME-oriented EUDR landing page or CTA variant.
- No cross-category linking between EUDR/PLM/Battery Passport pages despite the real overlaps in Section 10.
- Category pages beyond `/plm` (i.e. dedicated `/eudr` and `/battery-passport`-equivalent pages) do not yet exist as standalone landing pages — see `lib/finder-config.ts`'s `categoryInfoLink()`, which currently falls back to a generic "how it works" link for EUDR and Battery Passport precisely because these dedicated pages don't exist yet.

## Appendix B — Items Requiring Verification Before Publishing Related Copy

- Current EUDR Regulation application/enforcement date(s) and any company-size-based phase-in.
- Current EU Battery Regulation digital battery passport applicability date and scope thresholds.
- Any specific vendor names, vendor counts, or market-size statistics for any of the three categories.
- Any claim about the EUDR SME vendor-market gap being quantified (a specific percentage, count, or study) — the *directional* claim is treated as given per this document's brief, but no number should be published without a source.
- Geographic scope claims (which countries/regions the EUDR and Battery Regulation obligations actually reach) beyond the general "placing product on the EU market" framing used in Section 8.

For all of the above, prefer official sources: the European Commission's EUDR pages, the official EU Regulation texts (EUDR and the EU Batteries Regulation 2023/1542), and relevant national competent authorities. Do not cite secondary/vendor-authored summaries as the source of a factual claim on the live site.
