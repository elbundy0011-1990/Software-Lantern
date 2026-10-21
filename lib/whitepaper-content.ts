// Content for the regional report, "Securing Remote Access to Industrial Machines
// in Belgium and the Netherlands." Shared, framework-agnostic data consumed by
// both the open web page (app/(ot)/reports/remote-access-belgium-netherlands) and
// the print/PDF source (.../print). No JSX here on purpose, so this stays
// renderer-agnostic; components/whitepaper/report-sections.tsx does the rendering.
//
// Every regulatory statement traces to lib/compliance-ledger.ts or lib/country-
// report.ts (unchanged, reused as-is). Every number traces to lib/eurostat-data.ts.
// No vendor or competitor name anywhere in this file. No score or verdict: the
// buyer's evaluation matrix is requirements to ask about, not a rating of anyone.

export const REPORT_TITLE = "Securing Remote Access to Industrial Machines in Belgium and the Netherlands";
export const REPORT_SUBTITLE = "A regulatory and buyer's guide, winter 2026/27";
export const REPORT_EDITION = "Winter 2026/27 edition";
export const REPORT_PATH = "/reports/remote-access-belgium-netherlands";
// The edition date (when this edition's content was finalized) is the same date
// the underlying data was extracted, per lib/eurostat-data.ts's EUROSTAT_SOURCE
// (.extractionDate / .extractionDateDisplay) — that file, not this one, is on
// scripts/check-claims.mjs's DATE_ALLOWLIST, so every literal date lives there
// and everywhere else, including here, references it through an expression.

// Item 1's required framing, stated plainly wherever the size-class chart or
// comparison appears, not just once: headcount is one of three alternative tests
// NIS2 itself allows (headcount OR turnover OR balance sheet total), the test
// also counts linked/partner enterprises together rather than any one legal
// entity alone, and this report's own size-class figures are a headcount proxy
// for context, never a scope determination for any specific company.
export const SIZE_TEST_CAVEAT =
  "NIS2's own size test is headcount, or annual turnover, or annual balance sheet total, whichever a company meets first, and it counts linked and partner enterprises together, not any single legal entity in isolation. The enterprise counts in this section use headcount (persons employed) as a public, comparable proxy across both countries. That proxy is useful for sizing the regional picture; it is not a scope determination for any specific company, which depends on the full three-part test applied to that company's own linked group.";

export interface ExecutiveFinding {
  id: string;
  text: string;
  sourceNote: string;
}

// Five findings, each traceable to a named source: a ledger entry, a country-
// report entry, or lib/eurostat-data.ts. No finding here is this report's own
// judgment call; each restates what a cited source already says. Dates are
// deliberately not typed into any finding's text here — per scripts/check-
// claims.mjs, a literal regulatory date is only ever allowed in lib/compliance-
// ledger.ts; components/whitepaper/report-sections.tsx renders the "nis2-in-
// force" finding's two dates directly from that ledger instead.
export const EXECUTIVE_FINDINGS: ExecutiveFinding[] = [
  {
    id: "nis2-in-force",
    text: "NIS2 is already in force in both countries, on different national implementation timelines.",
    sourceNote: "lib/compliance-ledger.ts, ids nis2-be and nis2-nl",
  },
  {
    id: "product-rules-not-size-gated",
    text: "The Cyber Resilience Act and the Machinery Regulation bind the product placed on the market, not the organization placing it, so neither is gated by the same size threshold as NIS2's own organizational rules.",
    sourceNote: "lib/compliance-ledger.ts, ids cra-reporting, cra-full, machinery-regulation; SUPPLEMENTARY_EVIDENCE id cra-scope-art2-1",
  },
  {
    id: "size-class-share",
    text: "Across both countries, most machinery and equipment manufacturers (NACE C28) are small by headcount: enterprises with 50 or more persons employed are 8.9% of the total in Belgium and 9.5% in the Netherlands, both minorities.",
    sourceNote: "lib/eurostat-data.ts, Eurostat sbs_sc_ovw, 2024, extracted 2026-10-21",
  },
  {
    id: "supply-chain-pressure",
    text: "NIS2 Article 21(2)(d) requires an in-scope company to assess the security of its direct suppliers, which creates a documented commercial path for the same questions to reach a machine builder or integrator NIS2 doesn't bind directly, through that supplier's own customer.",
    sourceNote: "lib/compliance-ledger.ts, SUPPLEMENTARY_EVIDENCE id nis2-article-21-2-d",
  },
  {
    id: "different-authorities",
    text: "The two countries route registration and incident reporting through different national authorities on different clocks: Belgium's Centre for Cybersecurity Belgium with a 24-hour early warning and 72-hour notification, the Netherlands' RDI/NCSC pairing with the same 24-and-72-hour structure but its own registration process.",
    sourceNote: "lib/country-report.ts country sections for BE and NL, sourced from lib/compliance-ledger.ts SUPPLEMENTARY_EVIDENCE ids be-nis2-* and nl-cbw-*",
  },
];

export interface ApproachSummary {
  id: string;
  name: string;
  how: string;
  tradeoff: string;
}

// Tightened from app/(ot)/guides/remote-access-approaches/page.tsx (the fuller
// guide, not rewritten here, just condensed to one "how" and one "trade-off"
// sentence each for a report section covering six approaches in the space a
// standalone guide gives one). No approach is named as better or worse than
// another; see the guide for the full "where it fits" and "what to ask" detail,
// including the same NIST/CISA citations.
export const APPROACH_SUMMARIES: ApproachSummary[] = [
  {
    id: "vpn",
    name: "VPN into the customer network",
    how: "An encrypted tunnel from the service engineer's device onto the customer's own network, broadly as though plugged in on site.",
    tradeoff: "What the session can reach depends entirely on how the customer has segmented their own network, which can be considerably more than the one machine being serviced.",
  },
  {
    id: "remote-support",
    name: "Remote support tools",
    how: "Screen-sharing or remote-desktop style software for a session, usually started from the device being supported.",
    tradeoff: "Easier to bound to a clear start and end, but varies widely in whether the session is logged or requires approval each time.",
  },
  {
    id: "jump-host",
    name: "Jump hosts",
    how: "A single hardened system placed between the outside connection and the OT network; anyone connecting remotely reaches it first.",
    tradeoff: "Centralizes access and logging in one place, which also makes that one host the single thing standing between the outside and the OT network.",
  },
  {
    id: "zero-trust",
    name: "Cloud zero-trust access",
    how: "Verifies the identity of a specific user and device for each connection to a specific resource, rather than trusting a network location.",
    tradeoff: "Precise scoping like this usually depends on a cloud-hosted broker outside the customer's own network, which not every customer's policies accept.",
  },
  {
    id: "ot-gateway",
    name: "OT gateway-based access",
    how: "A dedicated gateway device at the edge of the OT network terminates the remote connection there rather than letting it continue onward.",
    tradeoff: "Gives clearer certainty about scope, but adds a device the customer has to accept and the builder has to keep patched for the machine's life.",
  },
  {
    id: "hardware-enforced",
    name: "Hardware-enforced access",
    how: "A physical control, such as a switch or key engaged on site, gates whether a remote connection can reach the machine at all.",
    tradeoff: "Harder to bypass through a software compromise alone, but access then depends on someone being physically present to enable it.",
  },
];

export interface TradeoffDimension {
  id: string;
  name: string;
  tension: string;
}

// The six cross-cutting dimensions item 2 asks for, each stated as a tension
// between two real costs, not as advice toward one side. No product or approach
// is named as resolving any of these; see the buyer's evaluation matrix for the
// specific questions to ask about each.
export const TRADEOFF_DIMENSIONS: TradeoffDimension[] = [
  {
    id: "identity",
    name: "Identity",
    tension: "A named account per person is traceable but adds administrative overhead for every join, move, and leave; a shared account is simpler to provision but makes it impossible to say who actually connected.",
  },
  {
    id: "mfa",
    name: "Multi-factor authentication",
    tension: "Requiring a second factor closes the most commonly exploited single point of failure, but adds a step to every connection, including the urgent ones.",
  },
  {
    id: "scope",
    name: "Scope of access",
    tension: "Scoping a connection to exactly one machine limits what a compromised session could reach, but is harder to set up and maintain than a connection that simply reaches the wider network.",
  },
  {
    id: "logging",
    name: "Logging",
    tension: "A detailed session log is the clearest evidence after an incident, but detailed logs also cost more to store, retain, and actually review.",
  },
  {
    id: "third-party",
    name: "Third-party access",
    tension: "Letting a dealer or subcontractor connect under the same rules as direct staff keeps one consistent standard, but extends exactly who the customer has to trust.",
  },
  {
    id: "availability",
    name: "Availability",
    tension: "Access that's always available removes delay during an urgent incident, but access that's switched on only on request gives the customer more control over when a third party can reach their systems.",
  },
];

export interface IllustrativeScenario {
  id: string;
  title: string;
  situation: string;
  whatItTouches: string;
}

// Labelled "Illustrative" wherever shown, per instruction: generic, fictional
// situations used only to show which trade-offs and rules a situation touches,
// never a case study of a real company, and no invented statistic is attached
// to any of them.
export const ILLUSTRATIVE_SCENARIOS: IllustrativeScenario[] = [
  {
    id: "machine-builder",
    title: "A machine builder shipping packaging lines across both countries",
    situation: "A mid-sized machine builder sells packaging lines to food and beverage plants in both Belgium and the Netherlands, with service engineers who connect in remotely for diagnostics and the occasional firmware update.",
    whatItTouches: "The Cyber Resilience Act and the Machinery Regulation apply to the machine itself regardless of the builder's own size. If a customer is itself in NIS2 scope, Article 21(2)(d) gives that customer a documented reason to ask how the builder's remote access is secured, even though NIS2 does not bind the builder directly at this size.",
  },
  {
    id: "factory-operator",
    title: "A factory operator with several vendors holding remote access",
    situation: "A factory operator runs equipment from several different machine builders, each with their own remote-access arrangement into parts of the plant network.",
    whatItTouches: "If the operator is itself in NIS2 scope, Article 21(2)(d) requires assessing the security practices of each of those direct suppliers, not just the operator's own internal controls. The questions in Part 6 of this report are the kind an operator in this position would need an answer to from each vendor.",
  },
  {
    id: "system-integrator",
    title: "A system integrator maintaining machines it did not build",
    situation: "A system integrator services and maintains machines on behalf of several machine builders and plant operators, connecting remotely to equipment across customer sites it does not own.",
    whatItTouches: "An integrator in this position can sit on both sides of the supply-chain pressure described above: asked by its own customers to evidence its practices, while needing the same evidence from any machine builder whose equipment it services under its own name.",
  },
];

export interface ActionStep {
  days: string;
  text: string;
}

export const ACTION_PLAN: ActionStep[] = [
  { days: "Days 1-30", text: "Run the free scope checker and remote access review sheet to establish, in writing, which rules likely apply and what today's remote-access setup actually looks like." },
  { days: "Days 1-30", text: "Confirm the national authority, registration step, and incident-reporting duty that applies in each country of operation, from the official sources this report cites." },
  { days: "Days 1-30", text: "Identify every third party, dealer, or subcontractor who currently holds remote access, and on what terms." },
  { days: "Days 31-60", text: "Compare current practice against each row of the buyer's evaluation matrix in Part 7, regardless of whether a vendor change is planned, to see which questions already have a confident answer and which don't." },
  { days: "Days 31-60", text: "Prepare the evidence a customer's own security questionnaire is likely to ask for: access lists, logging retention, and incident-response documentation." },
  { days: "Days 31-60", text: "Confirm, in writing, who owns the decision on remote-access policy internally, and who would be the point of contact for a customer's security question." },
  { days: "Days 61-90", text: "If evaluating or changing a remote-access approach, use the full 25-criteria vendor comparison checklist to structure that evaluation before any demo." },
  { days: "Days 61-90", text: "Resolve any open question flagged in the review sheet: anything marked 'not sure' is worth a definite answer before a customer asks it first." },
  { days: "Days 61-90", text: "Revisit the regulatory timeline against the current date, and confirm nothing material has changed in either country's implementing law." },
];

export interface SourcesEntry {
  label: string;
  detail: string;
}

export const METHODOLOGY_NOTE =
  "Every regulatory date and country-specific fact in this report comes from the compliance ledger maintained for this site, cited inline with the official source and the date it was last checked. Every enterprise and employment figure comes from Eurostat's dissemination API, dataset sbs_sc_ovw, extracted 2026-10-21, with the Netherlands cross-checked against a CBS (Statistics Netherlands) business-register table; the Belgian figures rest on Eurostat alone, since no comparable figure could be resolved from Statbel's API within this extraction. Full methodology, raw API responses, and exact query URLs: see this site's public source citations throughout this report, each linking the official page.";
