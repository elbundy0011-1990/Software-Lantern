# Regional report v2: outline and evidence register (Phase 1, for approval)

Status: APPROVED 21 October 2026 and built (Phase 2). Kept as the record of the plan.
Prepared 21 October 2026.

**Decisions at approval.** EU Publications Office texts count as primary reads, with the OJ
reference recorded in each ledger entry. Two incidents only (Colonial Pipeline, Ukraine 2015);
the Ukraine alert is cited by ID with no release date; the third-incident idea (X2) is dropped.
No Statbel cross-check. No benchmark section in this edition (section 6 below stays a proposal).
In the build, the Colonial Pipeline quote naming the incident-response firm was left out (no
vendor names); its point is stated as Interpretation.

**Thesis.** Industrial remote access is a governance problem (identities, machines, suppliers,
sites, lifecycle), not only a connectivity problem. The question is not "can the engineer get
in" but "who can get in, to what, until when, approved by whom, and what proves it afterwards".

**Readers.** Primary: OT security lead or CISO at a Benelux manufacturer. Secondary: OEM
service director (the supplier side of the same access).

**Labels used in the report.** Every item carries one label:
- **Data**: a verified fact from a primary source (ledger entry, official dataset, official record).
- **Interpretation**: our reading of what Data means for remote access. Shown as such.
- **Model**: arithmetic on reader-supplied or explicitly illustrative inputs. Never a finding.

**Rules carried through.** No invented statistics. No vendor or competitor names. Never
"independent", "neutral" or "unbiased". No em-dashes. No claim that NIS2, the CRA or the
Machinery Regulation requires buying any product: all three set outcomes and obligations, and
the report says so wherever a requirement is shown.

---

## 1. Outline (target 16 pages, range 14 to 18)

| # | Section | Pages | Content | Labels |
|---|---|---|---|---|
| 0 | Cover, how to read this report | 0.5 | Thesis in two sentences; the Data / Interpretation / Model key; edition and check date | |
| 1 | Executive briefing | 1.5 | Four findings, each: finding, evidence (register IDs), implication for the CISO and for the OEM | Data + Interpretation |
| 2 | How remote access actually spreads | 2 | Suppliers x sites x technicians. Access-sprawl model with editable inputs and shown arithmetic (spec in §3 below). Where sprawl hides: dealers and subcontractors, plant-side "temporary" accounts, standing tunnels | Model + Interpretation |
| 3 | How governance fails | 2 | Five failure patterns: shared accounts, standing access, unclear ownership, weak revocation, no evidence trail. Each: what it looks like, which rule or incident it maps to (register IDs), what "fixed" looks like | Data + Interpretation |
| 4 | Five-dimension assessment | 3 | Identity, scope, lifecycle, evidence, availability. (a) Self-assessment grid: reader marks each dimension verified / partial / unknown, with what counts as "verified" (evidence you could hand an auditor). (b) The six access architectures (VPN, remote support tools, jump hosts, cloud zero-trust brokers, OT gateways, hardware-enforced) against the five dimensions: per cell, what the architecture constrains by design, what depends on configuration, residual risk. Assumptions stated per architecture. No numeric scores, no ranking | Interpretation |
| 5 | Regulation to action | 3 | NIS2, CRA, Machinery Regulation. Per regulation: who is in scope; what it means for remote access; what evidence to keep. Ledger-verified claims only; an "Excluded (unverified)" box lists what was deliberately left out. Benelux authority, registration and incident clocks reused from the ledger (BE, NL; LU in a footnote) | Data + Interpretation (evidence lists are Interpretation: the laws set outcomes, not checklists) |
| 6 | Two public incidents | 1.5 | Colonial Pipeline 2021 and Ukraine 2015, each: what the primary record says (quoted), which governance dimension failed, what it does and does not show. Oldsmar 2021 dropped, with a one-line note why | Data + Interpretation |
| 7 | 90-day plan | 1.5 | Nine steps in three 30-day blocks; each with owner role, deliverable, verification (draft in §4 below) | Interpretation |
| 8 | Regional context (Eurostat) | 1 | One page: C28 size-class chart, BE and NL. Size-test caveat kept. Limitation stated: Belgian figures rest on Eurostat alone (no Statbel cross-check resolved); NL cross-checked against CBS | Data |
| A | Appendix: 25-point matrix | 2 | The existing 25 checklist rows, grouped under the five dimensions, with prioritisation: which answers are unacceptable and why (draft in §5 below) | Interpretation |
| B | Appendix: methodology and sources | 1 | Labels, evidence tiers, check dates, what was excluded and why, every source URL | |

Total: 19.5 slots incl. cover; layout target 16 printed pages by keeping §4(b) to one
landscape table and §5 to one page per regulation.

**Numbering fix (Part 6/7).** The current report says "Part 6" for the matrix in one place and
"Part 7" in another (`lib/whitepaper-content.ts` lines 189 and 208; the matrix is actually Part 6).
In v2, part numbers come from one ordered section list, and every cross-reference is generated
from that list by section id instead of typed as text, so a renumber can't leave a stale reference.

**Dropped from v1.** The "Trade-offs" section (folded into §4), the "Illustrative scenarios"
section (the model in §2 does this job with visible arithmetic), the two-countries comparison
as its own part (folded into §5 and §8).

### Executive findings (draft wording, for approval)

1. **Both verified incidents turned on valid access, not broken connectivity.** In Colonial
   Pipeline the entry point was a legacy VPN profile "not intended to be in use", with
   single-factor authentication (I1). In Ukraine 2015 the attackers used legitimate credentials
   over existing remote administration tools and VPN connections (I2). *Implication:* the
   control that mattered was identity and lifecycle, not the tunnel.
2. **The EU rules describe remote access as governance.** NIS2 names access control policies,
   asset management, supplier relationships and, where appropriate, multi-factor authentication,
   and makes management bodies approve and oversee the measures (R2 to R5). None prescribes a
   technology. *Implication:* the auditable artefact is a policy plus evidence, not a product.
3. **Product law moves part of the evidence burden to the machine builder.** The CRA requires
   products to protect against unauthorised access and record relevant access activity; the
   Machinery Regulation requires machinery to collect evidence of legitimate or illegitimate
   intervention in safety-relevant software (R11 to R14, R18). *Implication for the OEM:* the
   service channel becomes part of what is placed on the market.
4. **Most machine builders reach these rules through their customers.** By headcount, 8.9% (BE)
   and 9.5% (NL) of C28 enterprises have 50+ persons employed (E1), so most are not in NIS2 scope
   by size; NIS2 Article 21(2)(d) and 21(3) bring the questions to them through in-scope
   customers (R1, R4). *Implication:* the customer's questionnaire is the real compliance channel.
   (Size-test caveat shown with the figure.)

---

## 2. Evidence register

Tier: **primary** = read from the official text or record; **corroborated** = per docs/CLAIMS.md
(3+ copies). Status: **ledger** = already a verified entry in `lib/compliance-ledger.ts` or
`lib/eurostat-data.ts`; **verified, to add** = official text read 21 Oct 2026 for this plan, needs
a ledger entry before use; **excluded** = not used.

Note on EU texts: EUR-Lex returned a bot challenge (HTTP 202, WAF) on 21 Oct 2026, as the ledger
already records for earlier passes. The texts below were read from the Publications Office
Cellar (the official OJ repository, `publications.europa.eu/resource/celex/...`), which serves
the same consolidated OJ text. Proposed tier: primary, citing the EUR-Lex ELI URL as the ledger
does today. Confirm you accept Cellar as a primary read.

### Regulation

| ID | Claim (quote or record) | Source URL | Tier | Status | Label |
|---|---|---|---|---|---|
| R1 | NIS2 Art 21(2)(d): "supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers" | https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng | primary | ledger (`nis2-article-21-2-d`) | Data |
| R2 | NIS2 Art 21(2)(i): "human resources security, access control policies and asset management" | https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng | primary | verified, to add | Data |
| R3 | NIS2 Art 21(2)(j): "the use of multi-factor authentication or continuous authentication solutions, secured voice, video and text communications and secured emergency communication systems within the entity, where appropriate" | same | primary | verified, to add | Data |
| R4 | NIS2 Art 21(3): entities "take into account the vulnerabilities specific to each direct supplier and service provider and the overall quality of products and cybersecurity practices of their suppliers and service providers, including their secure development procedures" | same | primary | verified, to add | Data |
| R5 | NIS2 Art 20(1): management bodies "approve the cybersecurity risk-management measures ... oversee its implementation and can be held liable for infringements" | same | primary | verified, to add | Data |
| R6 | NIS2 Art 21(1) proportionality (exposure, size, likelihood, severity) | same | corroborated (can upgrade to primary from the Cellar read) | ledger (`nis2-art21-1`) | Data |
| R7 | NIS2 scope: Art 2(1) size rule, Art 3(2) important entities, Annex II 5(d) NACE C28 | https://eur-lex.europa.eu/eli/dir/2022/2555/2022-12-27 | primary / corroborated | ledger (`nis2-scope-art2-1`, `nis2-important-entities-art3-2`, `nis2-annex2-5d`) | Data |
| R8 | BE and NL: in force dates, authority, registration, 24h/72h/1-month reporting (LU in footnote) | ejustice.just.fgov.be, officielebekendmakingen.nl, ncsc.nl, rdi.nl, ilr.lu (URLs in ledger) | primary | ledger (`nis2-be`, `nis2-nl`, `be-nis2-*`, `nl-cbw-*`, `lu-*`) | Data |
| R9 | CRA Art 2(1) scope: products with digital elements with a data connection to a device or network | https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng | primary | ledger (`cra-scope-art2-1`) | Data |
| R10 | CRA Art 71(2) application dates (Art 14 reporting; full application) | same | primary | ledger (`cra-reporting`, `cra-full`) | Data |
| R11 | CRA Art 13(1): manufacturers ensure the product "has been designed, developed and produced in accordance with the essential cybersecurity requirements set out in Part I of Annex I" | same | primary | verified, to add | Data |
| R12 | CRA Annex I Part I (2)(d): "ensure protection from unauthorised access by appropriate control mechanisms, including but not limited to authentication, identity or access management systems, and report on possible unauthorised access" | same | primary | verified, to add | Data |
| R13 | CRA Annex I Part I (2)(j): "limit attack surfaces, including external interfaces" | same | primary | verified, to add | Data |
| R14 | CRA Annex I Part I (2)(l): "recording and monitoring relevant internal activity, including the access to or modification of data, services or functions, with an opt-out mechanism for the user" | same | primary | verified, to add | Data |
| R15 | CRA Art 13(8): "the support period shall be at least five years" (or expected use time if shorter) | same | primary | verified, to add | Data |
| R16 | CRA Art 14(1): manufacturer notifies "any actively exploited vulnerability" to the coordinating CSIRT and ENISA | same | primary | verified, to add (date already in ledger) | Data |
| R17 | CRA Annex III Class I: item 1 "Identity management systems and privileged access management software and hardware ..."; item 5 "Products with digital elements with the function of virtual private network (VPN)" | same | primary | verified, to add | Data |
| R18 | Machinery Reg. Annex III 1.1.9: connection "via any remote device that communicates with the machinery ... does not lead to a hazardous situation"; machinery "shall collect evidence of a legitimate or illegitimate intervention in the software or a modification of the software ... or its configuration" | https://eur-lex.europa.eu/eli/reg/2023/1230/oj/eng | primary | verified, to add | Data |
| R19 | Machinery Reg. Annex III 1.2.1(a): control systems withstand "reasonably foreseeable malicious attempts from third parties leading to a hazardous situation" | same | primary | verified, to add | Data |
| R20 | Machinery Reg. Art 18: whoever carries out a "substantial modification" (defined in Art 3 as including "physical or digital means") is considered a manufacturer | same | primary | verified, to add | Data |
| R21 | Machinery Reg. Art 54 application date; Art 51(2) repeal; Art 52(1) transition | same | primary | ledger (`machinery-regulation`) | Data |

### Incidents

| ID | Claim (quote or record) | Source URL | Tier | Status | Label |
|---|---|---|---|---|---|
| I1 | Colonial Pipeline, Senate HSGAC hearing, 8 June 2021 (S. Hrg. 117-429). Blount: "we believe the attacker exploited the legacy VPN profile that was not intended to be in use"; "in the case of this particular legacy VPN, it did only have single-factor authentication". Senator Hawley: attack "first detected only in the IT network, not in the OT network"; Blount: "Senator, that is correct"; "up to this point, Mandiant has not confirmed any evidence that they were in the OT system" | https://www.govinfo.gov/content/pkg/CHRG-117shrg46569/html/CHRG-117shrg46569.htm | primary (testimony record) | verified, to add | Data |
| I1-i | What it shows: lifecycle (an unused profile never revoked) and identity (single factor). What it does not show: OT compromise; the pipeline stop was a precaution | | | | Interpretation |
| I2 | Ukraine 2015, CISA alert IR-ALERT-H-16-056-01: "malicious remote operation of the breakers was conducted ... using either existing remote administration tools at the operating system level or remote industrial control system (ICS) client software via virtual private network (VPN) connections"; "the actors acquired legitimate credentials prior to the cyber-attack to facilitate remote access"; recommendation: "Remote access should be operator controlled, time limited, and procedurally similar to 'lock out, tag out.'" | https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01 | primary (agency alert) | verified, to add. Page shows only "Last Revised July 20, 2021"; original release date not displayed, so the report cites the alert by code and revision date | Data |
| I2-i | What it shows: standing remote paths plus harvested credentials; the agency's own fix is time-limited, operator-controlled access (lifecycle, availability) | | | | Interpretation |
| X1 | Oldsmar water 2021 | Original: FBI/CISA advisory AA21-042A. Contesting: former city manager (March 2023) said it was employee error; FBI told the Tampa Bay Times it was "not able to confirm" a targeted intrusion (reported, e.g., [Route Fifty](https://route-fifty.com/cybersecurity/2023/03/florida-city-water-cyber-incident-allegedly-caused-employee-error/384267), [ABC Action News](https://abcactionnews.com/news/local-news/i-team-investigates/fbi-and-former-city-manager-say-oldsmar-cyberattack-never-happened)) | | **excluded**: contested evidence | |
| X2 | Optional third case: CISA AA23-335A (internet-exposed PLCs with default passwords, 2023). Strong primary source, but the advisory is about one manufacturer's PLC line; using it means either naming a vendor (not allowed) or redacting to "a PLC line", which weakens traceability | https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-335a | primary | **excluded unless you approve the redacted form** | |

### Data

| ID | Claim | Source | Tier | Status | Label |
|---|---|---|---|---|---|
| E1 | C28 share of enterprises with 50+ persons employed, 2024: BE 8.90%, NL 9.52%; full size-class split | Eurostat `sbs_sc_ovw`, extracted 21 Oct 2026 (query URLs in docs/WHITEPAPER-DATA.md) | primary | ledger (`lib/eurostat-data.ts`) | Data |
| E2 | NL cross-check: CBS 81589NED, 50+ count 370 vs Eurostat 370 (different measurement, provisional period) | CBS OData (docs/WHITEPAPER-DATA.md) | primary | ledger | Data |
| E3 | Belgium: no Statbel cross-check resolved; Belgian figures rest on Eurostat alone | | | stated as limitation | |

### Excluded (listed in the report's "Excluded" box)

- Commission Implementing Regulation (EU) 2024/2690: applies to the digital-infrastructure entity
  types in NIS2 Art 21(5), not to manufacturers. Using it for this audience would overclaim.
- Belgian CyberFundamentals as a conformity route, and the Dutch implementing decree's specific
  measures: not yet verified from official text.
- CRA conformity-assessment route for Annex III Class I products (Art 32): not yet verified;
  R17 is shown without stating which procedure applies until it is.
- Any industry statistic on remote-access incidents, vendor counts or breach costs: none found
  from a primary source that meets the rules.

---

## 3. Access-sprawl model (Model, §2 of the report)

Labelled "Model: arithmetic on your inputs, not a finding" on the page and in the PDF.

Inputs (reader-editable on the web page; the PDF shows one worked example with inputs marked
"illustrative, not observed"):

| Input | Symbol |
|---|---|
| Suppliers with remote access | S |
| Sites | T |
| Technicians per supplier with access | E |
| Share of supplier access on shared (not named) accounts | h (0 to 1) |
| Technician changes per supplier per year (joiners plus leavers) | c |

Shown arithmetic:
- Person-to-site access paths: P = S x T x E
- Named accounts needed if every path is named: P
- Shared credentials if shared per supplier per site: S x T, each known by E people
- Credential rotations a year forced by staff changes on shared accounts: h x S x T x c
- People who can use one shared credential: E (so one leaver exposes E-person knowledge)

Worked example (illustrative inputs): S = 6, T = 3, E = 4 gives P = 72 paths; fully shared,
18 credentials each known by 4 people; with c = 2, that is 36 rotations a year to stay clean.
No default inputs are presented as typical or measured.

## 4. 90-day plan (draft)

| Days | Step | Owner role | Deliverable | Verification |
|---|---|---|---|---|
| 1-30 | Inventory every remote path (supplier, site, method, account type) | OT security lead | Remote access register | Every row traced to a firewall rule, gateway config or account; unknowns listed |
| 1-30 | Name an owner per path, plant side and supplier side | Plant manager with OEM service director | Ownership column in the register | No row without two named owners |
| 1-30 | Confirm which rules apply per country of operation, from the official sources | Compliance or legal | One-page scope note | Each statement cites a ledger source and check date |
| 31-60 | Replace shared accounts with named ones, or record why not | OT security lead with each supplier | Account change log | Zero shared accounts without a dated exception |
| 31-60 | Turn standing access into on-request, time-limited access where operations allow | Plant manager | Access procedure (approval, window, end) | Sample of sessions shows approval and closing time |
| 31-60 | Define the evidence kept per session and for how long | OT security lead | Logging and retention standard | One real session reconstructed from logs alone |
| 61-90 | Revocation test: remove a leaver's access end to end | Supplier service director | Revocation record | Access confirmed gone on every path within the target time |
| 61-90 | Score current setup against the 25-point matrix, mark unacceptable answers | OT security lead | Completed matrix | Each "unacceptable" has an owner and date |
| 61-90 | Management approval of the measures (NIS2 Art 20 where in scope) | Management body | Signed approval | Minutes or sign-off on file |

## 5. Appendix A: prioritisation of the 25-point matrix (draft)

Unacceptable answers (Interpretation, each tied to a dimension and a register ID):
- MFA optional or absent (identity; R3, R12, I1)
- Accounts shared between people (identity; R2, R12)
- Access cannot be scoped below the network level (scope; R13)
- Revocation needs the supplier's help, or takes longer than the reader's own target (lifecycle; I1)
- Customer cannot see who currently has access (lifecycle, evidence; R4)
- Sessions not logged, or logs not exportable (evidence; R14, R18)
- No answer on support period or update path for an installed component (lifecycle; R15)

Lower priority, important for fit not for risk: pricing model, onboarding time, dashboard
across customers, support regions.

---

## 6. Proposed, not built: anonymised benchmark section

- **Source:** remote-access-check answers stored in `ot_enquiries.answers.remoteAccessAnswers`
  (seven questions plus the optional trigger question), only from people who submitted.
- **Threshold:** omit the whole section below **N = 30** distinct organisations (deduplicated by
  email domain) in the edition window. Any breakdown (country, role) needs **10 or more** per
  cell, otherwise that breakdown is not shown. Below N = 50, show counts only, no percentages.
- **Labelling:** "Self-selected sample of people who used this site's check. Not representative
  of any population." Shown with N and the date range.
- **Blocking issue:** the current consent and privacy policy cover reviewing an enquiry and
  emailing results, not publishing aggregate statistics. Before any aggregation, the policy needs
  a stated purpose and legal basis for anonymised statistics. That is your decision.
- **Gap:** the check has no revocation or lifecycle question, so the benchmark could not cover
  that dimension. Adding one question would fix it.

---

## 7. Sections that need no new sources

- §2 access-sprawl model (Model; reader inputs only)
- §4 five-dimension assessment and architecture comparison (Interpretation; architecture
  descriptions reuse the existing remote-access-approaches guide and its existing citations)
- §7 90-day plan (Interpretation)
- §8 Eurostat page (existing `lib/eurostat-data.ts`)
- Appendix A matrix rows (existing `lib/vendor-checklist-rows.ts`) and prioritisation (Interpretation)
- Appendix B methodology
- In §5: every dated item and every BE/NL authority, registration and reporting fact (already in the ledger)

## 8. What is missing before Phase 2

1. Ledger entries for R2 to R5 and R11 to R20 (quotes verified, entries not yet written).
2. A place for incident evidence: the ledger and `scripts/check-claims.mjs` cover regulation
   only. I1 and I2 need an incident evidence structure (quote, record URL, check date) and the
   guard extended to the report files, so incident claims are held to the same rule.
3. Your call on Cellar as a primary read for EU texts (EUR-Lex blocks automated reads).
4. Your call on X2 (third incident in redacted form) or two incidents only.
5. Ukraine alert original release date (page shows only the 2021 revision).
6. Your call on the benchmark consent question (§6) before it is built.
7. Optional: Statbel cross-check for Belgium (otherwise the limitation stays stated).
