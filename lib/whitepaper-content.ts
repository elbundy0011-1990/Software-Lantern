// Content for the regional report, second version: "Remote access is a governance
// problem." Shared, framework-agnostic data consumed by both the open web page
// (app/(ot)/reports/remote-access-belgium-netherlands) and the print/PDF source
// (app/(print)/reports/remote-access-belgium-netherlands/print). No JSX here, so
// it stays renderer-agnostic; components/whitepaper/report-sections.tsx renders it.
//
// Rules this file follows, and scripts/check-claims.mjs enforces where it can:
// - Every regulatory statement points at an entry in lib/compliance-ledger.ts and
//   every quote is rendered from there, never retyped here.
// - Every incident statement points at lib/incident-evidence.ts, same rule.
// - Every number is either computed from lib/eurostat-data.ts or is model
//   arithmetic on inputs labelled illustrative.
// - Every block carries one label: Data, Interpretation, or Model.
// - No vendor or competitor names. Nothing may suggest a regulation makes anyone buy
//   a product: the three acts set outcomes, and the report says so.

import { incidentById } from "@/lib/incident-evidence";
import { naceEntry, share50PlusPct } from "@/lib/eurostat-data";

export const REPORT_TITLE = "Remote Access Is a Governance Problem";
export const REPORT_SUBTITLE = "Securing remote access to industrial machines in Belgium and the Netherlands";
export const REPORT_EDITION = "Winter 2026/27 edition, revised";
export const REPORT_PATH = "/reports/remote-access-belgium-netherlands";

export const THESIS =
  "Industrial remote access is a governance problem: identities, machines, suppliers, sites and lifecycle, not only a connectivity problem. The question is not whether the engineer can get in, but who can get in, to what, until when, approved by whom, and what proves it afterwards.";

export const READERS =
  "Written for the OT security lead or CISO at a manufacturer in Belgium or the Netherlands, and for the service director at a machine builder who sits on the other end of the same connection.";

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export type ContentLabel = "Data" | "Interpretation" | "Model";

export const LABEL_KEY: { label: ContentLabel; meaning: string }[] = [
  { label: "Data", meaning: "A verified fact from a primary source: an official legal text, an official record, or an official dataset. Each carries its source and the date it was checked." },
  { label: "Interpretation", meaning: "Our reading of what the data means for remote access. Shown as such, so you can disagree with it." },
  { label: "Model", meaning: "Arithmetic on inputs you supply, or on inputs marked illustrative. A model is never a finding about anyone." },
];

// ---------------------------------------------------------------------------
// Sections: one ordered list. Part numbers and every cross-reference come from
// here, so a renumber cannot leave a stale "Part n" anywhere.
// ---------------------------------------------------------------------------

export const REPORT_SECTIONS = [
  { id: "briefing", number: "1", title: "Executive briefing" },
  { id: "sprawl", number: "2", title: "How remote access spreads" },
  { id: "failures", number: "3", title: "How governance fails" },
  { id: "assessment", number: "4", title: "A five-dimension assessment" },
  { id: "regulation", number: "5", title: "From regulation to action" },
  { id: "incidents", number: "6", title: "Two public incidents" },
  { id: "plan", number: "7", title: "A 90-day plan" },
  { id: "context", number: "8", title: "Regional context" },
  { id: "matrix", number: "A", title: "The 25-point matrix, prioritised" },
  { id: "method", number: "B", title: "Methodology and sources" },
] as const;

export type SectionId = (typeof REPORT_SECTIONS)[number]["id"];

export function sectionById(id: SectionId) {
  return REPORT_SECTIONS.find((s) => s.id === id)!;
}

// "Part 4" for a numbered part, "Appendix A" for an appendix.
export function partLabel(id: SectionId): string {
  const s = sectionById(id);
  return /^[0-9]+$/.test(s.number) ? `Part ${s.number}` : `Appendix ${s.number}`;
}

// ---------------------------------------------------------------------------
// Evidence references
// ---------------------------------------------------------------------------

export type EvidenceRef =
  | { kind: "ledger"; id: string } // COMPLIANCE_LEDGER or SUPPLEMENTARY_EVIDENCE
  | { kind: "incident"; id: string } // lib/incident-evidence.ts
  | { kind: "eurostat" }; // lib/eurostat-data.ts

const L = (id: string): EvidenceRef => ({ kind: "ledger", id });
const I = (id: string): EvidenceRef => ({ kind: "incident", id });

// ---------------------------------------------------------------------------
// Part 1: executive briefing
// ---------------------------------------------------------------------------

export interface Finding {
  id: string;
  headline: string;
  body: string;
  evidence: EvidenceRef[];
  forOperator: string;
  forBuilder: string;
}

const colonial = incidentById("colonial-pipeline-2021");
const ukraine = incidentById("ukraine-grid-2015");

export const FINDINGS: Finding[] = [
  {
    id: "valid-access",
    headline: "Both verified incidents turned on valid access, not on broken connectivity.",
    body: `In the ${colonial.name} case the chief executive testified that the attacker used a legacy VPN profile that was no longer meant to be in use, protected by a single factor. In the ${ukraine.year} attack on ${ukraine.name}, the agency alert records that the attackers held legitimate credentials and operated breakers over existing remote administration tools and VPN connections. ${partLabel("incidents")} quotes both records.`,
    evidence: [I(colonial.id), I(ukraine.id)],
    forOperator: "The control that mattered was who held a working credential and whether it should still have existed, not the strength of the tunnel.",
    forBuilder: "Every service account you leave behind at a customer site is part of the customer's attack surface, whether or not anyone uses it.",
  },
  {
    id: "rules-are-governance",
    headline: "The EU rules describe remote access as governance, not as a technology.",
    body: "NIS2 lists access control policies, asset management, supply chain security and, where appropriate, multi-factor authentication among the minimum measures, and makes management bodies approve and oversee them. None of these provisions names a product or a technology.",
    evidence: [L("nis2-art21-2-i-access-control"), L("nis2-art21-2-j-mfa"), L("nis2-article-21-2-d"), L("nis2-art20-1-governance")],
    forOperator: "What an auditor can ask for is a policy and the evidence that it is followed. The artefact is a register and a record, not a purchase order.",
    forBuilder: "Customers in scope will ask how your access is governed, because their own management has to approve how they manage supplier risk.",
  },
  {
    id: "evidence-moves-to-builder",
    headline: "Product law moves part of the evidence burden onto the machine builder.",
    body: "The Cyber Resilience Act requires products with digital elements to protect against unauthorised access and to record relevant access activity. The Machinery Regulation requires machinery to record evidence when its software or configuration is intervened in or modified, whether legitimately or not, and connections from remote devices must not lead to a hazardous situation.",
    evidence: [L("cra-annex1-2d-unauthorised-access"), L("cra-annex1-2l-activity-recording"), L("mr-annex3-1-1-9-corruption")],
    forOperator: "Ask the builder what the machine itself records about remote interventions, and how you can read it.",
    forBuilder: "The service channel shipped with a machine is part of what is placed on the market, so its access controls and records are design questions, not only service-desk questions.",
  },
  {
    id: "reach-through-customers",
    headline: "Most machine builders meet these rules through their customers first.",
    body: `By headcount, enterprises with 50 or more persons employed are ${share50PlusPct(naceEntry("BE", "C28"))}% of machinery and equipment manufacturers (NACE C28) in Belgium and ${share50PlusPct(naceEntry("NL", "C28"))}% in the Netherlands (${partLabel("context")}), so most are unlikely to be in NIS2 scope on size alone. NIS2 still brings the questions to them: in-scope customers must weigh the security practices of each direct supplier and service provider.`,
    evidence: [{ kind: "eurostat" }, L("nis2-scope-art2-1"), L("nis2-art21-3-suppliers")],
    forOperator: `Your supplier questionnaire is how the rules reach most of the builders you depend on. Make it ask governance questions (${partLabel("matrix")}), not product questions.`,
    forBuilder: "Expect the customer's questionnaire to be the real compliance channel, and prepare evidence once for all customers.",
  },
];

// ---------------------------------------------------------------------------
// Part 2: access-sprawl model (Model)
// ---------------------------------------------------------------------------

export interface ModelInputs {
  suppliers: number; // S
  sites: number; // T
  techniciansPerSupplier: number; // E
  sharedShare: number; // h, 0 to 1
  changesPerSupplierPerYear: number; // c
}

// Illustrative only. Not observed, not typical, not a default anyone measured.
export const ILLUSTRATIVE_INPUTS: ModelInputs = {
  suppliers: 6,
  sites: 3,
  techniciansPerSupplier: 4,
  sharedShare: 1,
  changesPerSupplierPerYear: 2,
};

export const MODEL_INPUT_DEFS: { key: keyof ModelInputs; symbol: string; label: string; min: number; max: number; step: number }[] = [
  { key: "suppliers", symbol: "S", label: "Suppliers with remote access", min: 1, max: 200, step: 1 },
  { key: "sites", symbol: "T", label: "Sites", min: 1, max: 100, step: 1 },
  { key: "techniciansPerSupplier", symbol: "E", label: "Technicians per supplier with access", min: 1, max: 200, step: 1 },
  { key: "sharedShare", symbol: "h", label: "Share of supplier-site access on shared (not named) accounts, 0 to 1", min: 0, max: 1, step: 0.05 },
  { key: "changesPerSupplierPerYear", symbol: "c", label: "Technician changes per supplier per year (joiners plus leavers)", min: 0, max: 100, step: 1 },
];

export interface ModelResult {
  paths: number; // P = S x T x E
  supplierSitePairs: number; // S x T
  sharedCredentials: number; // h x S x T
  rotationsPerYear: number; // h x S x T x c
  namedChangesPerYear: number; // (1 - h) x S x T x c
}

export function runModel(i: ModelInputs): ModelResult {
  const pairs = i.suppliers * i.sites;
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    paths: i.suppliers * i.sites * i.techniciansPerSupplier,
    supplierSitePairs: pairs,
    sharedCredentials: round(i.sharedShare * pairs),
    rotationsPerYear: round(i.sharedShare * pairs * i.changesPerSupplierPerYear),
    namedChangesPerYear: round((1 - i.sharedShare) * pairs * i.changesPerSupplierPerYear),
  };
}

export const MODEL_INTRO =
  "Remote access grows by multiplication, not addition. Each supplier brings its own technicians, and each of them may need to reach each site. This model does the arithmetic on your own numbers so the size of the governance job is visible before anyone discusses tools.";

export const MODEL_ASSUMPTIONS = [
  "Every technician of a supplier with access can reach every site that supplier serves. Where access is narrower, P is smaller; use your own inventory.",
  "A shared account is shared per supplier per site, so every technician of that supplier knows it.",
  "Each technician change at a supplier (a joiner or a leaver) touches that supplier's access at every site: a shared credential to rotate, or a named account to create or remove.",
];

export const MODEL_READING: string[] = [
  "Named accounts do not remove the administrative work: a technician change touches every site either way. They change what the work achieves. Removing one named account removes one person. Rotating a shared credential disrupts everyone else who uses it, so each rotation has a cost for people who did nothing wrong.",
  "A shared credential known by E people cannot show which of them connected. Every shared credential is a gap in the evidence trail as well as in identity.",
  `The model counts paths, not risk. A path that is closed between jobs and opened on request carries less exposure than a standing one; that is the availability dimension in ${partLabel("assessment")}.`,
];

export const SPRAWL_HIDING_PLACES: { name: string; text: string }[] = [
  { name: "Dealers and subcontractors", text: "The technicians who connect may work for a dealer or subcontractor of the supplier, so the plant may not know E, and it can change without the plant being told." },
  { name: "Temporary accounts on the plant side", text: "Accounts created for one commissioning job or one urgent repair, and never removed because nobody owned their removal." },
  { name: "Standing tunnels", text: "Connections left up between jobs because reconnecting is inconvenient, so access exists whether or not anyone is working." },
];

// ---------------------------------------------------------------------------
// Part 3: failure patterns (Data + Interpretation)
// ---------------------------------------------------------------------------

export interface FailurePattern {
  id: string;
  name: string;
  looksLike: string;
  evidence: EvidenceRef[];
  evidenceNote: string;
  fixed: string;
}

export const FAILURE_PATTERNS: FailurePattern[] = [
  {
    id: "shared-accounts",
    name: "Shared or single-factor accounts",
    looksLike: "One login per supplier, known by every technician, often with a password alone. The plant cannot say who connected, and a leaver keeps a working secret.",
    evidence: [L("nis2-art21-2-i-access-control"), L("nis2-art21-2-j-mfa"), L("cra-annex1-2d-unauthorised-access"), I("colonial-pipeline-2021"), I("ukraine-grid-2015")],
    evidenceNote: "NIS2 names access control policies and, where appropriate, multi-factor authentication. The CRA asks products to protect against unauthorised access through authentication, identity or access management. Both incidents turned on credentials that worked.",
    fixed: "One account per person, with a second factor, for supplier staff as well as your own. Exceptions are written down with a reason and an end date.",
  },
  {
    id: "standing-access",
    name: "Standing access",
    looksLike: "Access that is always on, so the path exists between jobs, overnight and at weekends.",
    evidence: [I("ukraine-grid-2015"), L("nis2-article-21-2-d")],
    evidenceNote: "The agency alert on the Ukrainian attack recommends that remote access be operator controlled and time limited. NIS2 makes the security of supplier relationships part of the minimum measures.",
    fixed: "Access opened on request, approved by the plant, with an end time, and an emergency path that is itself logged.",
  },
  {
    id: "unclear-ownership",
    name: "Unclear ownership",
    looksLike: "Nobody can name, for a given path, who on the plant side and who on the supplier side is responsible for it.",
    evidence: [L("nis2-art20-1-governance"), L("nis2-art21-3-suppliers")],
    evidenceNote: "NIS2 makes management bodies approve and oversee the risk-management measures, and requires in-scope entities to take account of each direct supplier's vulnerabilities and practices.",
    fixed: "Two named owners per path, one at the plant and one at the supplier, recorded in the remote access register.",
  },
  {
    id: "weak-revocation",
    name: "Weak revocation",
    looksLike: "Access is removed only when someone remembers, or only with the supplier's help. Old profiles survive changes of staff, projects and systems.",
    evidence: [I("colonial-pipeline-2021")],
    evidenceNote: "In the Colonial Pipeline testimony, the profile used was a legacy one that was not intended to be in use.",
    fixed: "A tested revocation: one leaver's access removed end to end, on every path, within a target time you set, and the result recorded.",
  },
  {
    id: "no-evidence",
    name: "No evidence trail",
    looksLike: "Sessions are not logged, or the logs sit with a third party and cannot be exported. After an incident nobody can reconstruct what happened.",
    evidence: [L("cra-annex1-2l-activity-recording"), L("mr-annex3-1-1-9-corruption"), L("mr-annex3-1-2-1-control-systems")],
    evidenceNote: "The CRA asks products to record relevant access activity. The Machinery Regulation asks machinery to collect evidence of intervention in its software and configuration, and to keep a tracing log of interventions and safety-software versions.",
    fixed: "A written logging standard: what is recorded per session, where, for how long, and who can export it. Proven by reconstructing one real session from the logs alone.",
  },
];

// ---------------------------------------------------------------------------
// Part 4: five-dimension assessment (Interpretation)
// ---------------------------------------------------------------------------

export type DimensionId = "identity" | "scope" | "lifecycle" | "evidence" | "availability";

export interface Dimension {
  id: DimensionId;
  name: string;
  question: string;
  verified: string;
  partial: string;
  unknown: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "identity",
    name: "Identity",
    question: "Is every remote session tied to one named person, with a second factor?",
    verified: "An account list mapping each account to one person, supplier staff included, and configuration showing the second factor is enforced.",
    partial: "Named accounts exist, but some are shared, or the second factor is optional.",
    unknown: "You cannot produce the account list for supplier access.",
  },
  {
    id: "scope",
    name: "Scope",
    question: "Can each person reach only the machines they service?",
    verified: "Rules or policies showing per-supplier or per-person targets, and a test showing a session cannot reach anything else.",
    partial: "Access is limited to a network segment, not to the machine.",
    unknown: "Nobody has checked what a remote session can reach.",
  },
  {
    id: "lifecycle",
    name: "Lifecycle",
    question: "Is access granted for a reason and removed when the reason ends?",
    verified: "Dated grant and removal records, including for supplier leavers, and one tested revocation.",
    partial: "Access is removed on request, but there is no record or no test.",
    unknown: "You do not know whether former supplier staff still have access.",
  },
  {
    id: "evidence",
    name: "Evidence",
    question: "Can you reconstruct who did what, and when, after the fact?",
    verified: "Session logs kept for a defined period, exportable by you, and one session reconstructed from them.",
    partial: "Connections are logged, but not what happened in the session, or the logs cannot be exported.",
    unknown: "You do not know where the logs are or how long they are kept.",
  },
  {
    id: "availability",
    name: "Availability",
    question: "Is access available when needed, and off when not?",
    verified: "A written procedure for opening access on request with approval and an end time, and a tested emergency path.",
    partial: "Access works when needed but is always on.",
    unknown: "You do not know when remote paths are open.",
  },
];

export const ASSESSMENT_RULE = `Mark a dimension verified only if you could hand the evidence to an auditor today. A belief that it is fine is partial at best. An unknown is not a failure; it is the first item on the plan in ${partLabel("plan")}.`;

export interface ArchitectureCell {
  design: string; // what the architecture constrains by design
  config: string; // what depends on configuration
  residual: string; // residual risk
}

export interface Architecture {
  id: string;
  name: string;
  assumption: string;
  cells: Record<DimensionId, ArchitectureCell>;
}

// Generic architecture types, as commonly deployed. No product, vendor or
// ranking. The assumption line says which variant each column describes.
export const ARCHITECTURES: Architecture[] = [
  {
    id: "vpn",
    name: "VPN into the customer network",
    assumption: "A client VPN terminating on the plant or corporate network.",
    cells: {
      identity: { design: "Authenticates a VPN account.", config: "Whether accounts are named and a second factor is enforced.", residual: "A valid credential opens the whole tunnel." },
      scope: { design: "Network-level reach.", config: "Firewall rules behind the VPN endpoint.", residual: "Reach is often wider than the machine being serviced." },
      lifecycle: { design: "Nothing beyond the account existing.", config: "Account expiry and a removal process.", residual: "Unused profiles persist until someone removes them." },
      evidence: { design: "Connection records: who connected and when.", config: "Whether activity inside the session is recorded elsewhere.", residual: "What was done in the session is usually not recorded by the VPN itself." },
      availability: { design: "Available whenever the account is valid.", config: "Enabling accounts only on request.", residual: "Standing access unless deliberately switched off." },
    },
  },
  {
    id: "remote-support",
    name: "Remote support tools",
    assumption: "Screen-sharing or remote-desktop software on a device at the plant, connected through a relay.",
    cells: {
      identity: { design: "Tool accounts or one-time session codes.", config: "Named accounts, second factor, whether ad hoc codes are allowed.", residual: "Session codes can be passed on." },
      scope: { design: "The one device running the software.", config: "What that device can reach onward.", residual: "The device can become a stepping stone." },
      lifecycle: { design: "Per session when someone at the device accepts it.", config: "Whether unattended access is enabled.", residual: "Unattended mode is standing access." },
      evidence: { design: "Session events, sometimes a recording.", config: "Recording switched on and retained.", residual: "Records may sit with the tool's operator unless exported." },
      availability: { design: "On demand when attended.", config: "Attended or unattended mode.", residual: "Attended mode depends on someone being at the device." },
    },
  },
  {
    id: "jump-host",
    name: "Jump hosts",
    assumption: "A hardened host between the external connection and the OT network, reached over a VPN or remote desktop.",
    cells: {
      identity: { design: "Logons at the host, separate from OT accounts.", config: "Named logons and a second factor at the host.", residual: "Shared administrator logons on the host." },
      scope: { design: "One choke point.", config: "What the host is allowed to reach.", residual: "A compromised host exposes everything it can reach." },
      lifecycle: { design: "One central place to remove access.", config: "Whether removal actually happens there.", residual: "The host itself must be kept patched." },
      evidence: { design: "One place to log.", config: "Session recording and retention.", residual: "Logs on the host can be changed by its administrators." },
      availability: { design: "Usually always on.", config: "Disabling accounts between jobs.", residual: "Access depends on one host being up." },
    },
  },
  {
    id: "zero-trust",
    name: "Cloud zero-trust brokers",
    assumption: "Per-user, per-resource policy evaluated by a cloud-hosted broker, with a connector inside the plant.",
    cells: {
      identity: { design: "Per user and device, usually through an identity provider.", config: "Second factor and device checks in that identity provider.", residual: "Inherits the identity provider's own weaknesses." },
      scope: { design: "Per-resource policies.", config: "How narrowly resources are defined.", residual: "Broad policies recreate network-level access." },
      lifecycle: { design: "Access follows identity provider membership.", config: "Who manages supplier identities.", residual: "Supplier accounts may sit outside your own leaver process." },
      evidence: { design: "Per-connection records.", config: "Retention and export to your own systems.", residual: "Records held by a third party." },
      availability: { design: "Policy-driven, can be time-bound.", config: "Time windows and approval steps.", residual: "Depends on the broker and internet access; not every customer's policies accept a cloud broker." },
    },
  },
  {
    id: "ot-gateway",
    name: "OT gateways",
    assumption: "A dedicated device at the edge of the OT network that terminates remote connections, managed by the builder or the operator.",
    cells: {
      identity: { design: "Gateway or management-portal accounts.", config: "Named accounts and a second factor.", residual: "Builder-side accounts may be managed by the builder alone." },
      scope: { design: "Terminates at the edge and reaches defined assets.", config: "Per-user asset lists.", residual: "Rules drift if nobody keeps them current." },
      lifecycle: { design: "Central account management in the portal.", config: "Who removes supplier users, and when.", residual: "Another device to keep patched for the machine's life." },
      evidence: { design: "Connection records at the gateway.", config: "Retention and whether the customer can read them.", residual: "Records may live only in the builder's portal." },
      availability: { design: "Can be enabled per session.", config: "On-request mode, local enable switch.", residual: "One more device that can fail." },
    },
  },
  {
    id: "hardware-enforced",
    name: "Hardware-enforced access",
    assumption: "A physical switch or key on site that must be engaged before a remote path can reach the machine, combined with one of the other architectures.",
    cells: {
      identity: { design: "None on its own.", config: "Identity controls of the path it gates.", residual: "Inherits that path's identity weaknesses." },
      scope: { design: "Physical cut per machine or cell.", config: "How it is wired.", residual: "Little beyond the gated path itself." },
      lifecycle: { design: "Access ends when the switch is off.", config: "A procedure for switching off.", residual: "A switch left on." },
      evidence: { design: "Physical state, sometimes logged.", config: "Whether switch state is recorded.", residual: "Who turned it on may go unrecorded." },
      availability: { design: "Needs a person on site.", config: "An on-call procedure.", residual: "Delay in urgent cases." },
    },
  },
];

export const ARCHITECTURE_NOTE =
  "Each architecture constrains some things by design and leaves others to configuration. None settles all five dimensions on its own, and the same architecture can be governed well or badly. There is no score and no ranking here: read across a row to see what you would still have to configure and evidence yourself.";

// ---------------------------------------------------------------------------
// Part 5: regulation to action (Data from the ledger + Interpretation)
// ---------------------------------------------------------------------------

export interface RegulationBlock {
  id: string;
  name: string;
  regulates: string;
  scope: EvidenceRef[]; // shown as citations, Data
  scopeNote: string; // Interpretation
  quotes: string[]; // ledger ids whose quotes are rendered, Data
  datesLedgerIds: string[]; // COMPLIANCE_LEDGER ids shown as dates, Data
  remoteAccessMeaning: string[]; // Interpretation
  evidenceToKeep: string[]; // Interpretation
}

export const NO_PRODUCT_MANDATE =
  "None of the provisions quoted in this part names a product, a technology or a supplier. They set outcomes and obligations. How you meet them is your decision, and an existing setup that is well governed and evidenced may already do so.";

export const REGULATION_BLOCKS: RegulationBlock[] = [
  {
    id: "nis2",
    name: "NIS2 (Directive (EU) 2022/2555)",
    regulates: "The organisation: how an in-scope entity manages cyber risk.",
    scope: [L("nis2-scope-art2-1"), L("nis2-important-entities-art3-2"), L("nis2-annex2-5d")],
    scopeNote: "Machinery manufacturers (NACE C28) are listed in Annex II. Whether a given company is in scope also depends on the size rule, applied to its linked group.",
    quotes: ["nis2-art20-1-governance", "nis2-art21-2-i-access-control", "nis2-art21-2-j-mfa", "nis2-art21-3-suppliers"],
    datesLedgerIds: ["nis2-be", "nis2-nl"],
    remoteAccessMeaning: [
      "Supplier remote access is part of supply chain security and of access control, so it belongs in the measures management approves.",
      "Multi-factor authentication is named, qualified by \"where appropriate\". Recording why it is or is not appropriate for each path is itself evidence.",
      "In-scope customers have to weigh each direct supplier's practices, which is why builders receive questionnaires.",
    ],
    evidenceToKeep: [
      "A remote access register: every path, its owners, its account type.",
      "Supplier assessments covering remote access.",
      "Configuration showing where a second factor is enforced, and the reasoning where it is not.",
      "Minutes or sign-off showing management approved the measures.",
    ],
  },
  {
    id: "cra",
    name: "Cyber Resilience Act (Regulation (EU) 2024/2847)",
    regulates: "The product: products with digital elements placed on the EU market.",
    scope: [L("cra-scope-art2-1"), L("cra-art13-1-essential-requirements")],
    scopeNote: "Where a machine or its remote service component is a product with digital elements, its manufacturer carries these obligations.",
    quotes: ["cra-annex1-2d-unauthorised-access", "cra-annex1-2j-attack-surface", "cra-annex1-2l-activity-recording", "cra-art13-8-support-period", "cra-art14-1-vulnerability-reporting"],
    datesLedgerIds: ["cra-reporting", "cra-full"],
    remoteAccessMeaning: [
      "A remote service function shipped with the product is part of what has to protect against unauthorised access and record relevant access activity.",
      "External interfaces count toward the attack surface the product has to limit. A remote access port is an external interface.",
      "Vulnerabilities in the product, its components included, have to be handled for the support period, so the remote access component's update path is part of the product's.",
    ],
    evidenceToKeep: [
      "For builders: the design record showing how the product's remote access meets Annex I, and the support period you have set.",
      "For operators: the builder's statement of support period and update path for each installed component.",
    ],
  },
  {
    id: "machinery",
    name: "Machinery Regulation (Regulation (EU) 2023/1230)",
    regulates: "Safety: machinery placed on the market, including protection against corruption and malicious attempts that could create a hazard.",
    scope: [L("mr-art10-1-manufacturer")],
    scopeNote: "The essential health and safety requirements in Annex III bind the manufacturer, and anyone who substantially modifies machinery becomes one.",
    quotes: ["mr-annex3-1-1-9-corruption", "mr-annex3-1-2-1-control-systems", "mr-art18-substantial-modification"],
    datesLedgerIds: ["machinery-regulation"],
    remoteAccessMeaning: [
      "A remote connection to the machine must not lead to a hazardous situation, which makes remote access a safety design question, not only an IT one.",
      "The machine has to collect evidence of intervention in its software and configuration. Remote changes are interventions.",
      "A modification by digital means can be substantial. An integrator or operator who changes safety-relevant behaviour remotely should check whether it has become the manufacturer.",
    ],
    evidenceToKeep: [
      "For builders: the risk assessment covering remote connection, and how the machine records interventions.",
      "For integrators and operators: a record of remote changes to safety-relevant software, and the assessment of whether any was a substantial modification.",
    ],
  },
];

export const ANNEX_III_NOTE =
  "The CRA also lists identity and privileged access management products, and products with a VPN function, among its important products (Class I). That classification affects how the manufacturers of those products demonstrate conformity. It does not oblige anyone to use such products.";

export const REGULATION_EXCLUDED: { item: string; reason: string }[] = [
  { item: "Commission Implementing Regulation (EU) 2024/2690", reason: "It applies to the digital-infrastructure entity types named in NIS2 Article 21(5), not to manufacturers. Using it for this audience would overclaim." },
  { item: "Belgium's CyberFundamentals framework as a conformity route", reason: "Not verified from an official text for this edition." },
  { item: "The specific measures in the Dutch implementing decree", reason: "Not verified from the official text for this edition." },
  { item: "Which CRA conformity-assessment procedure applies to Class I products", reason: "Not verified for this edition, so the report does not state one." },
  { item: "Industry statistics on remote-access incidents, supplier counts or breach costs", reason: "None found from a primary source that meets this report's rules." },
];

// ---------------------------------------------------------------------------
// Part 6: incidents (Data + Interpretation)
// ---------------------------------------------------------------------------

export interface IncidentReading {
  incidentId: string;
  dimensions: DimensionId[];
  shows: string;
  doesNotShow: string;
}

export const INCIDENT_READINGS: IncidentReading[] = [
  {
    incidentId: "colonial-pipeline-2021",
    dimensions: ["lifecycle", "identity"],
    shows: "Lifecycle and identity: a profile that was not meant to be in use still worked, and it needed only one factor.",
    doesNotShow: "It does not show a compromise of the operational network. The testimony confirms the attack was detected in the IT network; the chief executive also said that, at the time of the hearing, the investigation had not confirmed any evidence of the attackers in the OT system. It says nothing about the industrial remote access design.",
  },
  {
    incidentId: "ukraine-grid-2015",
    dimensions: ["identity", "availability", "lifecycle"],
    shows: "Identity and availability: valid credentials over existing, standing remote paths were enough to operate equipment. The agency's own recommendation is a governance one: operator-controlled, time-limited access.",
    doesNotShow: "It does not describe a manufacturer in Belgium or the Netherlands, and the alert does not say how the credentials were obtained beyond that they were acquired before the attack.",
  },
];

export const INCIDENT_INTRO =
  "Two cases, chosen because their primary records are public and uncontested and because each speaks to remote access. Each is shown as the record states it, then read against the five dimensions. They illustrate failure patterns; they are not a measure of how common those patterns are.";

// ---------------------------------------------------------------------------
// Part 7: 90-day plan (Interpretation)
// ---------------------------------------------------------------------------

export interface PlanStep {
  block: "Days 1 to 30" | "Days 31 to 60" | "Days 61 to 90";
  step: string;
  owner: string;
  deliverable: string;
  verification: string;
}

export const PLAN_STEPS: PlanStep[] = [
  { block: "Days 1 to 30", step: "Inventory every remote path: supplier, site, method, account type.", owner: "OT security lead", deliverable: "Remote access register", verification: "Every row traced to a firewall rule, gateway configuration or account; unknowns listed." },
  { block: "Days 1 to 30", step: "Name an owner for each path, on the plant side and the supplier side.", owner: "Plant manager with the builder's service director", deliverable: "Owner columns in the register", verification: "No row without two named owners." },
  { block: "Days 1 to 30", step: "Confirm which rules apply in each country of operation, from the official sources.", owner: "Compliance or legal", deliverable: "One-page scope note", verification: "Each statement cites an official source and a check date." },
  { block: "Days 31 to 60", step: "Replace shared accounts with named ones, or record why not.", owner: "OT security lead with each supplier", deliverable: "Account change log", verification: "No shared account without a dated exception." },
  { block: "Days 31 to 60", step: "Turn standing access into on-request, time-limited access where operations allow.", owner: "Plant manager", deliverable: "Access procedure: approval, window, end", verification: "A sample of sessions shows an approval and a closing time." },
  { block: "Days 31 to 60", step: "Define what evidence is kept for each session, and for how long.", owner: "OT security lead", deliverable: "Logging and retention standard", verification: "One real session reconstructed from the logs alone." },
  { block: "Days 61 to 90", step: "Run a revocation test: remove one leaver's access end to end.", owner: "Supplier's service director", deliverable: "Revocation record", verification: "Access confirmed gone on every path within the target time." },
  { block: "Days 61 to 90", step: `Score the current setup against the matrix in ${partLabel("matrix")} and mark unacceptable answers.`, owner: "OT security lead", deliverable: "Completed matrix", verification: "Each unacceptable answer has an owner and a date." },
  { block: "Days 61 to 90", step: "Put the measures to management for approval (NIS2 Article 20, where in scope).", owner: "Management body", deliverable: "Signed approval", verification: "Minutes or sign-off on file." },
];

// ---------------------------------------------------------------------------
// Part 8: regional context (Data)
// ---------------------------------------------------------------------------

// Headcount is one of three alternative NIS2 size tests, and the test counts
// linked and partner enterprises together; the figures here are a proxy for
// context, never a scope determination for any company.
export const SIZE_TEST_CAVEAT =
  "NIS2's size test is headcount, or annual turnover, or annual balance sheet total, and it counts linked and partner enterprises together. The counts here use headcount (persons employed) as a public, comparable proxy. They size the regional picture; they do not determine whether any specific company is in scope.";

export const CONTEXT_READING = `Most machinery manufacturers in both countries are small by headcount. For them, the rules in ${partLabel("regulation")} arrive mainly through the product rules and through in-scope customers' supplier questions, which is why the matrix in ${partLabel("matrix")} is written to be answerable by a small builder.`;

// ---------------------------------------------------------------------------
// Appendix A: matrix prioritisation (Interpretation)
// ---------------------------------------------------------------------------

export const MATRIX_GROUPS: { dimension: DimensionId | "fit"; title: string; rowIds: string[] }[] = [
  { dimension: "identity", title: "Identity", rowIds: ["mfa-mandatory", "named-accounts", "sso-integration"] },
  { dimension: "scope", title: "Scope", rowIds: ["access-scope", "multi-customer-isolation", "deployment-footprint"] },
  { dimension: "lifecycle", title: "Lifecycle", rowIds: ["access-grant-revoke", "customer-revoke", "customer-visibility"] },
  { dimension: "evidence", title: "Evidence", rowIds: ["log-content", "log-retention", "monitoring-export", "data-portability"] },
  { dimension: "availability", title: "Availability", rowIds: ["session-start-stop", "session-timeout", "low-bandwidth"] },
  {
    dimension: "fit",
    title: "Fit, not risk: important for choosing, lower priority for governance",
    rowIds: ["deployment-location", "protocol-support", "legacy-support", "multi-customer-dashboard", "onboarding-effort", "onboarding-time", "support-regions", "pricing-basis", "pricing-extras"],
  },
];

export const UNACCEPTABLE_ANSWERS: { answer: string; dimension: string; evidence: EvidenceRef[] }[] = [
  { answer: "Multi-factor authentication is optional or absent.", dimension: "Identity", evidence: [L("nis2-art21-2-j-mfa"), L("cra-annex1-2d-unauthorised-access"), I("colonial-pipeline-2021")] },
  { answer: "Accounts are shared between people.", dimension: "Identity", evidence: [L("nis2-art21-2-i-access-control"), L("cra-annex1-2d-unauthorised-access")] },
  { answer: "Access cannot be scoped below the network level.", dimension: "Scope", evidence: [L("cra-annex1-2j-attack-surface")] },
  { answer: "Revocation needs the supplier's help, or takes longer than your own target.", dimension: "Lifecycle", evidence: [I("colonial-pipeline-2021")] },
  { answer: "The customer cannot see who currently has access.", dimension: "Lifecycle, evidence", evidence: [L("nis2-art21-3-suppliers")] },
  { answer: "Sessions are not logged, or the logs cannot be exported.", dimension: "Evidence", evidence: [L("cra-annex1-2l-activity-recording"), L("mr-annex3-1-1-9-corruption")] },
  { answer: "No answer on the support period or update path of an installed component.", dimension: "Lifecycle", evidence: [L("cra-art13-8-support-period")] },
];

// ---------------------------------------------------------------------------
// Appendix B: methodology
// ---------------------------------------------------------------------------

export const METHOD_POINTS: string[] = [
  "Every regulatory quote, date and country fact comes from the compliance ledger kept for this site. Each entry holds the verbatim text, the official URL, the Official Journal reference for EU acts, and the date it was checked.",
  "EU legal texts were read from the EU Publications Office repository, which serves the Official Journal text, because the EUR-Lex site blocks automated reads. Citations link to the EUR-Lex page for each act so readers can open it in a browser.",
  "Incidents are cited only from primary records: an official hearing record and a government agency alert, each quoted verbatim with its identifier. Contested cases are excluded.",
  "Every enterprise figure comes from Eurostat's dissemination API. The Netherlands figure is cross-checked against a CBS business-register table. Belgian figures rest on Eurostat alone; no Statbel cross-check was made for this edition.",
  `The access-sprawl model in ${partLabel("sprawl")} is arithmetic on your inputs. The worked example uses illustrative inputs, not observed ones. No figure in this report is projected or estimated.`,
  "No benchmark of respondents is included in this edition.",
  "No vendor or competitor is named. Architectures are described as generic types, with the assumption stated for each, and are not scored or ranked.",
];

export const DISCLAIMER =
  "This is a general guide based on published sources. It is not legal or security advice. Confirm your specific obligations with the official sources cited or a qualified advisor.";
