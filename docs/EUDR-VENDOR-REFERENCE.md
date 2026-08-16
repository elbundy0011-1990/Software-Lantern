# EUDR Vendor Reference (Internal Only)

**Status: internal reference document. Not for publication.** Per the "no competitor names in
live copy" rule established in `/docs/PHASE-6-CHANGES.md`, nothing in this document — vendor
names, comparisons, or claims — should appear anywhere in public site copy. It exists to (a)
sanity-check that the evaluation categories in `/eudr`'s "How to choose EUDR compliance software"
section reflect genuine, real-market capabilities, and (b) become reference material for a future
provider-tagging/self-declared-profile schema in the partner portal, *if and when* the no-algorithmic-
matching Step 0/2 portal work (see `/docs/PHASE-6-CHANGES.md` and the pending category-filtering
proposal) is approved and built. This document does not itself trigger building that feature.

**Research method**: two parallel research passes against each vendor's own website (product,
platform, and pricing pages where they exist), cross-checked against independent sources
(trade press, review sites) where available. Nothing here was fabricated or assumed — every claim
is tagged with a confidence level. Research conducted 2026-08-16; vendor sites change, so treat
this as a point-in-time snapshot, not a monitored feed.

**Confidence key**: ✅ confirmed from vendor's own site · 🔶 inferred / secondary source · `[VERIFY]`
not established with confidence · — not evidenced, omitted rather than guessed.

---

## Founder's list — verification summary

Of the 18 domains provided (17 listed + the corrected `banqu.co`), **16 are genuine, EUDR-relevant
software vendors** in some form. Two are notable exclusions/cautions:

- **relatico.com** — genuine SRM (Supplier Relationship Management) vendor, but built around
  Germany's LkSG and the upcoming CSDDD, **not EUDR**. No deforestation, geolocation, commodity, or
  DDS functionality found anywhere on their site. **Recommend excluding from any EUDR-specific
  context**; if referenced at all internally, flag clearly as "not an EUDR tool."
- **passionfruit.earth** — re-verified directly against the vendor's own site following founder
  feedback: this **is a genuine, real commercial software platform** (AI-powered supplier-
  questionnaire automation for food Quality/ESG/Technical teams — auto-fills Excel, Word, and
  online portals; has a demo-booking flow and a "3 min tour," not just editorial content). The
  founder is correct that it's a real product, not merely a review site. However, **EUDR is not
  mentioned anywhere on the site as a supported feature or use case** — the product is general
  compliance-questionnaire automation, not built for EUDR specifically. Their EUDR presence found
  in earlier research is blog/thought-leadership content, separate from the product itself.
  **Recommend treating Passionfruit as a genuine software vendor, but not yet a confirmed EUDR
  vendor** — worth a direct follow-up with them if the founder has reason to believe EUDR support
  exists but isn't reflected on the site.
- **banqu.com → banqu.co**: the founder's domain (`banqu.com`) does not resolve to the actual
  product; the real site is `banqu.co`. Flagging this correction for the record.
- **mastersustainability.today**: the founder was right to push back on treating this as pure
  editorial content — it hosts both a review/comparison section AND a distinct commercial ESG
  compliance platform (solutions/pricing/demo pages, customer logos), with EUDR as one module
  within a broader suite (alongside CSRD, VSME, CBAM, Carbon Accounting, SFDR, CSDDD, EU Taxonomy,
  EUTR, PPWR).

**None of the 16 genuine vendors are EUDR-only pure-plays** in the sense of "EUDR compliance is
the entire product." The closest to EUDR-specific are **Sourcemap**, **SourceTrace**,
**Agridence**, and **live-eo.com's TradeAware product** (the parent company, LiveEO, is a broader
Earth-observation firm, but TradeAware itself is marketed as "an end-to-end EUDR software
solution"). Every other vendor is a broader ESG/compliance/GRC/SRM/traceability/ag-tech/ERP
platform with EUDR bolted on as one module or feature.

---

## Vendor table

| Vendor | Domain | Genuine EUDR vendor? | EUDR-specific or broader platform | Target segment | Confidence |
|---|---|---|---|---|---|
| osapiens | osapiens.com | Yes | Broader (ESG/product-compliance platform; EUDR = one module) | Enterprise primary, "EASY START" SME tier ✅ | Medium-high |
| IntegrityNext | integritynext.com | Yes | Broader (supply-chain sustainability "orchestration platform") | Enterprise ✅ | Medium |
| Assent | assent.com | Yes | Broader (40+ compliance modules: REACH, RoHS, CSRD, conflict minerals, etc.) | Enterprise manufacturers ✅ | Medium |
| Sourcemap | sourcemap.com | Yes | Broader n-tier traceability platform, but strongest EUDR-specific feature depth of the "broader platform" group | Enterprise ✅ (Global 1000) | High |
| Source Intelligence | sourceintelligence.com | Yes | Broader (conflict minerals, UFLPA, EPR; EUDR = minor line item) | Enterprise/mid-market ✅ | Low-medium |
| SourceTrace | sourcetrace.com | Yes | Broader ag-tech/farm-management platform, dedicated EUDR page with real depth | Enterprise/institutional ✅ (Cargill, IFC, gov't) | Medium-high |
| Coolset | coolset.com | Yes | Broader ESG-reporting platform (CSRD, EUDR, CBAM, PPWR, VSME, EU Taxonomy) | Mid-market ✅ | Medium |
| Banqu | banqu.co (not .com — see note) | Yes | Blockchain traceability platform; go-to-market is close to EUDR-specific (per-commodity landing pages) | `[VERIFY]` | Medium |
| Passionfruit | passionfruit.earth | **Yes, real product — but not confirmed as EUDR software** | Not EUDR-specific — confirmed genuine AI-powered compliance-questionnaire platform; EUDR not mentioned anywhere on the vendor's own site as a feature | Food supplier Quality/ESG/Technical teams; SME vs. enterprise `[VERIFY]` | Medium — product genuineness confirmed directly, EUDR non-support also confirmed directly |
| Master Sustainability | mastersustainability.today | Yes | Broader ESG suite (EUDR, CSRD, VSME, CBAM, Carbon Accounting, SFDR, CSDDD, EU Taxonomy, EUTR, PPWR) | `[VERIFY]` | Medium |
| Meridia | meridia.land | Yes | Broader-but-adjacent geospatial risk-verification platform ("Meridia Verify®"); EUDR is a named use case, not the whole product | Enterprise ✅ (Cargill, ICE, LDC, Volcafé, ETG) | High |
| SAI360 | sai360.com | Yes | Broader (20+-module enterprise GRC platform); EUDR = one named solution | Enterprise ✅ (Fortune 500-heavy) | Medium |
| VERSO | verso.de | Yes | Broader German ESG/sustainability platform (EUDR, CBAM, CSDDD, CSRD, SFDR); consulting-bundled | **Mid-market** ✅ (explicitly "für den Mittelstand") | Medium |
| LiveEO / TradeAware | live-eo.com | Yes | Parent (LiveEO) is broader Earth-observation; **TradeAware product is EUDR-specific** ("end-to-end EUDR software solution") | Enterprise ✅ | High |
| Simvia (formerly Agriplace) | simvia.com | Yes | Broader food & beverage supply-chain compliance platform (CSRD, CSDDD, EUDR + certificate compliance) | `[VERIFY]`, leans enterprise (200,000+ suppliers claim) | Medium |
| Relatico | relatico.com | **No — excluded** | Not EUDR; LkSG/CSDDD-focused SRM | SME–Enterprise ✅ (but wrong domain) | High (exclusion confidence) |
| Agridence | agridence.com | Yes | Broader traceability platform, but one of the deepest confirmed EUDR-specific feature sets found | Enterprise ✅ (Mondelez, Continental, Goodyear, Sucafina) | High |
| TRACT | gettract.com | Yes, weakly | Broader forestry ERP system; EUDR is a minor feature among load-tracking/settlements/accounting tools | Enterprise-leaning ✅ | Low-medium |

---

## Capability matrix (Step 2 comparison-framework categories)

Legend: ✅ confirmed on vendor's own site · 🔶 inferred/secondary · `[VERIFY]` unconfirmed · — not evidenced

| Vendor | Supplier data collection | Geolocation | Risk assessment | DDS generation | TRACES/EU Info System | Doc mgmt/audit trail | Supplier portal | ERP integration | Commodity coverage stated | Operator/trader distinction |
|---|---|---|---|---|---|---|---|---|---|---|
| osapiens | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ (integration reported as harder than expected in one case study) | — | — |
| IntegrityNext | ✅ | — | ✅ | `[VERIFY]` | ✅ (SAP+TRACES case study) | — | 🔶 | ✅ (SAP) | — | — |
| Assent | 🔶 (general, not EUDR-specific detail) | — | — | — | — | — | — | — | — | — |
| Sourcemap | ✅ | ✅ (farm polygon data) | ✅ | ✅ | ✅ (live API to TRACES) | ✅ | ✅ | ✅ | `[VERIFY]` ("all in-scope commodities," vague) | — |
| Source Intelligence | — | — | — | — | — | — | — | ✅ (platform-wide, not EUDR-specific) | — | — |
| SourceTrace | ✅ (mobile farmer/land registration) | ✅ (GPS farm/plot mapping) | ✅ (satellite + deforestation cut-off check) | ✅ | `[VERIFY]` | ✅ | — | `[VERIFY]` | ✅ (coffee, cocoa, soy, palm oil, rubber, wood, cattle) | — |
| Coolset | ✅ | — | — | ✅ | — | — | — | — | — | — |
| Banqu | — | ✅ (polygon + satellite deforestation checks) | ✅ | — | — | ✅ (ledger-based) | — | ✅ (SAP-style) | ✅ (7 commodities named) | — |
| Passionfruit | 🔶 (generic, not EUDR-specific) | — | — | — | — | 🔶 | — | — | — | — |
| Master Sustainability | ✅ (supplier portals) | `[VERIFY]` | ✅ | ✅ (reporting) | `[VERIFY]` | 🔶 | ✅ | `[VERIFY]` | `[VERIFY]` | — |
| Meridia | — | ✅ (core product — satellite + plot risk scoring) | ✅ | `[VERIFY]` | `[VERIFY]` | ✅ (plot reclassification audit trail) | 🔶 (API/portal access) | `[VERIFY]` | ✅ (coffee, cocoa emphasized) | — |
| SAI360 | — | — | — | `[VERIFY]` | — | ✅ (general GRC) | — | — | — | — |
| VERSO | — | `[VERIFY]` | ✅ (supply-chain due diligence, general) | `[VERIFY]` | `[VERIFY]` | `[VERIFY]` | `[VERIFY]` | `[VERIFY]` | — | — |
| LiveEO (TradeAware) | 🔶 | ✅ (satellite + AI deforestation analytics) | ✅ (legal analysis) | ✅ | ✅ (explicitly named) | `[VERIFY]` | ✅ (supplier onboarding portals) | ✅ | `[VERIFY]` | — |
| Simvia | ✅ | `[VERIFY]` | ✅ | `[VERIFY]` | 🔶 (TRACES mentioned only re: organic certs, not confirmed for EUDR DDS — do not present as confirmed) | ✅ (certificate automation) | `[VERIFY]` | ✅ (SAP/MS Dynamics sync) | 🔶 ("food & beverage," not commodity-specific) | — |
| Relatico | — (not EUDR) | — | — | — | — | — | — | ✅ (general SRM, SAP) | — | — |
| Agridence | ✅ (AgriTrace mobile) | ✅ (offline polygon mapping) | ✅ (deforestation/legality/protected-area checks) | ✅ ("Declaration of Conformity" generation, filed to TRACES) | ✅ | ✅ (ISO 27001, GS1 EPCIS, human review before filing) | ✅ (named "Supplier Portal") | ✅ ("ConnectHub") | ✅ (rubber emphasized, + palm oil, cocoa, coffee, coconut, cashew, soy, timber, cattle/leather) | `[VERIFY]` (customer base spans roles, not explicitly framed) |
| TRACT | 🔶 (track-and-trace, general) | — | — | — | — | 🔶 | — | ✅ (QuickBooks, NetSuite, Samsara GPS) | — (forestry-specific by nature of the product, not stated as EUDR scope) | — |

**No vendor researched explicitly frames its product around the operator-vs-trader distinction**
in its own marketing — every confirmed "operator/trader" mention in this document originates from
the regulation itself (see Step 1 research), not from vendor positioning. This is a genuine content
gap in the market and supports Software Lantern's own decision to explain this distinction clearly
in the `/eudr` comparison framework and GEO answer blocks, since vendors aren't doing it.

---

## What this confirms for the Step 2 comparison framework

Every capability category used in `/eudr`'s "How to choose EUDR compliance software" section is
evidenced by at least 2–3 real vendors in this research (supplier data collection, geolocation,
risk assessment, DDS generation, TRACES/EU Information System submission, document/audit trail,
supplier portal, ERP integration, and commodity coverage). Pricing transparency is confirmed as
genuinely rare — not one of the 16 vendors researched publishes pricing on their site. Company-size
positioning varies meaningfully across the set (enterprise-heavy overall, with Coolset and VERSO
notably targeting mid-market, and osapiens offering a distinct SME tier) — this validates the
framework's "company size fit" category as a real, differentiating factor rather than a generic
truism.

## Notes for future provider-tagging / portal-filtering work (not built in this phase)

If the category-scoped portal visibility work from the no-algorithmic-matching investigation is
approved in a future phase, the capability matrix above is a reasonable starting point for what a
self-declared provider profile field set could look like (e.g. a partner checking which of these
categories their own product covers) — but that should be built from each *actual partner's* own
declaration, not backfilled from this external research, and this document should not be treated
as authoritative about what any of these companies' products do today by the time that work starts.
