// The vendor demo comparison checklist, version 2: the one source for its
// groups, rows, priorities and demo scenarios. Everything that shows the
// checklist reads from here, so its categories cannot drift apart:
// - private/vendor-demo-comparison-checklist.xlsx, generated from this file by
//   scripts/build-vendor-checklist-xlsx.ts (served by app/api/ot-enquiries/
//   checklist/route.ts after a signed-token check);
// - the regional report's Appendix A (components/whitepaper/report-sections.tsx);
// - the /vendor-checklist page and the "what to compare before a vendor demo"
//   guide.
//
// Rows are grouped under the regional report's five governance dimensions plus
// one "Fit and commercial" group. No vendor names, no suggested right answers,
// and no regulatory claims: anything regulatory belongs in lib/compliance-
// ledger.ts first.

export type ChecklistGroupId = "identity" | "scope" | "lifecycle" | "evidence" | "availability" | "fit";

export interface ChecklistGroup {
  id: ChecklistGroupId;
  title: string;
  summary: string;
}

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  { id: "identity", title: "Identity", summary: "Whether every session is tied to one named person, with a second factor." },
  { id: "scope", title: "Scope", summary: "What a connection can reach, and what it can change, once it is made." },
  { id: "lifecycle", title: "Lifecycle", summary: "How access is inventoried, granted, seen and removed when the reason for it ends." },
  { id: "evidence", title: "Evidence", summary: "What is recorded about each session, for how long, and whether you can take it with you." },
  { id: "availability", title: "Availability", summary: "Whether access exists only when it is needed and approved, and how it behaves when something fails." },
  { id: "fit", title: "Fit and commercial", summary: "Deployment, protocols, onboarding, support and price. Important for choosing, lower priority for governance." },
];

export type Priority = "Must" | "Should" | "Nice";
export const PRIORITIES: Priority[] = ["Must", "Should", "Nice"];

export type BuyerTypeId = "builder" | "operator" | "integrator";

export const BUYER_TYPES: { id: BuyerTypeId; label: string; priorityHeader: string }[] = [
  { id: "builder", label: "Machine builder", priorityHeader: "Priority: Machine builder" },
  { id: "operator", label: "Factory operator", priorityHeader: "Priority: Operator" },
  { id: "integrator", label: "Integrator", priorityHeader: "Priority: Integrator" },
];

export const EVIDENCE_STATUSES = ["Verified in demo", "Documented only", "Claimed", "Not answered", "Not applicable"] as const;

export const EVIDENCE_STATUS_MEANINGS: { status: (typeof EVIDENCE_STATUSES)[number]; meaning: string }[] = [
  { status: "Verified in demo", meaning: "You saw it work, live, on a system you could direct." },
  { status: "Documented only", meaning: "It is in written documentation, a contract or a configuration export, but you have not seen it work." },
  { status: "Claimed", meaning: "The vendor said so, in a meeting or a slide, with nothing you can check." },
  { status: "Not answered", meaning: "Asked and not answered, or not asked yet. A blank status counts the same." },
  { status: "Not applicable", meaning: "The row does not apply to your setup. Write down why in Notes." },
];

export interface VendorChecklistRow {
  id: string;
  group: ChecklistGroupId;
  criterion: string;
  why: string;
  askTheVendor: string;
  evidence: string; // evidence to request
  weakAnswer: string; // what a weak answer looks like
  priority: Record<BuyerTypeId, Priority>; // defaults; the buyer edits them in the spreadsheet
}

const P = (builder: Priority, operator: Priority, integrator: Priority) => ({ builder, operator, integrator });

export const VENDOR_CHECKLIST_ROWS: VendorChecklistRow[] = [
  // Identity
  {
    id: "mfa-mandatory",
    group: "identity",
    criterion: "Whether multi-factor authentication is required",
    why: "A password alone is one of the most commonly exploited single points of failure.",
    askTheVendor: "Is MFA mandatory for every connection, or optional and up to us?",
    evidence: "Configuration showing a second factor enforced for every account, supplier accounts included, with no per-user opt-out.",
    weakAnswer: "MFA is available but optional, or enforced only for administrators.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "named-accounts",
    group: "identity",
    criterion: "Whether accounts are named to a person or shared",
    why: "Shared accounts make it impossible to trace who actually connected.",
    askTheVendor: "Can two engineers share one login, or is every account tied to a named person?",
    evidence: "The user list of a live or test tenant, showing one account per person.",
    weakAnswer: "One login per customer or per team, or accounts that are named but shared in practice.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "sso-integration",
    group: "identity",
    criterion: "Whether it connects to an existing identity provider",
    why: "A separate set of accounts is another thing to manage, and another thing that can be forgotten when someone leaves.",
    askTheVendor: "Can this use an existing single sign-on, or does it need its own separate accounts?",
    evidence: "The list of supported identity providers, and a login through one of them in the demo.",
    weakAnswer: "Only local accounts kept inside the tool, with no link to anyone's leaver process.",
    priority: P("Should", "Should", "Should"),
  },
  // Scope
  {
    id: "access-scope",
    group: "scope",
    criterion: "How access can be scoped",
    why: "A connection that reaches more than it needs to widens what a single compromised session could expose.",
    askTheVendor: "Can access be scoped to one machine, or does it always reach more of the network?",
    evidence: "A demo where a user limited to one machine cannot reach a second machine on the same network.",
    weakAnswer: "Access is to the whole site network, and narrowing it is left to the customer's firewall.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "multi-customer-isolation",
    group: "scope",
    criterion: "How access across different customers is kept separate",
    why: "A mistake that lets one customer's session reach another's systems is a serious failure, not a minor one.",
    askTheVendor: "How is one customer's access kept completely separate from another's?",
    evidence: "A description of how tenants are separated, and a demo that a user of one customer sees nothing of another.",
    weakAnswer: "Separation relies on naming conventions, or on technicians picking the right entry from one list.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "file-transfer-control",
    group: "scope",
    criterion: "Whether file transfer and program changes through the connection can be restricted and logged",
    why: "A session that can move files or change a controller program can change how the machine behaves, which is more than looking at it.",
    askTheVendor: "Can file transfer and program changes be switched off per user or per machine, and is each one recorded?",
    evidence: "A demo of a blocked file transfer, and the log entry for one that was allowed.",
    weakAnswer: "File transfer is on or off for everyone, or transfers are not recorded.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "deployment-footprint",
    group: "scope",
    criterion: "What has to be installed on the machine itself",
    why: "Anything added to the machine is something that has to be maintained for the life of that machine.",
    askTheVendor: "What software or hardware has to be added to the machine, and who maintains it?",
    evidence: "A list of what is installed on or next to the machine, and who patches it for the machine's life.",
    weakAnswer: "An agent or a box is required, and nobody commits to keeping it updated.",
    priority: P("Should", "Must", "Should"),
  },
  // Lifecycle
  {
    id: "path-inventory",
    group: "lifecycle",
    criterion: "Whether all access paths are inventoried and owned",
    why: "A path nobody knows about is a path nobody removes.",
    askTheVendor: "Can we list every remote path to our machines through this, with an owner for each, and export that list?",
    evidence: "An exported list of users, machines and connections, with an owner for each.",
    weakAnswer: "The list exists only inside the vendor's support team, or only machine by machine.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "access-grant-revoke",
    group: "lifecycle",
    criterion: "How access is granted and revoked",
    why: "Access that's slow to remove is access that outlives the reason it was given.",
    askTheVendor: "How is access granted for a new engineer, and how quickly can it be revoked?",
    evidence: "A demo of granting access to a new engineer and revoking it, timed.",
    weakAnswer: "Revocation is a ticket to the vendor's support desk.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "leaver-offboarding",
    group: "lifecycle",
    criterion: "Whether a departing engineer can be removed end to end",
    why: "A leaver who keeps a working account, a saved credential or a device that still connects keeps access nobody intended.",
    askTheVendor: "When an engineer leaves, what has to be done to remove every way they could connect, and who does it?",
    evidence: "A written leaver procedure, and a demo of removing one user from every site at once.",
    weakAnswer: "Removal is repeated site by site, or depends on the engineer's employer remembering to tell someone.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "customer-revoke",
    group: "lifecycle",
    criterion: "Whether the customer can pause or revoke access without help",
    why: "Depending on the vendor to remove access adds a delay a customer may not be able to accept during an incident.",
    askTheVendor: "Can the customer switch off access themselves, without contacting us first?",
    evidence: "A demo of the customer switching access off from their own side.",
    weakAnswer: "The customer has to call the vendor or the machine builder to switch access off.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "customer-visibility",
    group: "lifecycle",
    criterion: "Whether the customer can see who currently has access",
    why: "A customer's own security review depends on being able to see this themselves, not just take a vendor's word for it.",
    askTheVendor: "Can the customer see, in real time, exactly who currently has access?",
    evidence: "The customer-side view of current users and sessions, shown live.",
    weakAnswer: "Visibility only through a report the vendor sends on request.",
    priority: P("Should", "Must", "Should"),
  },
  // Evidence
  {
    id: "log-content",
    group: "evidence",
    criterion: "What a session log actually captures",
    why: "Logs are the main way an incident gets reconstructed after the fact, if they capture enough to be useful.",
    askTheVendor: "What does the session log capture: keystrokes, a screen recording, or just connection times?",
    evidence: "A sample session log from the demo, and a recording if one is offered.",
    weakAnswer: "Only connection start and end times.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "log-retention",
    group: "evidence",
    criterion: "How long logs are kept, and who can export them",
    why: "A log that's deleted too soon, or that only the vendor can see, limits what it's actually worth as evidence.",
    askTheVendor: "How long are logs retained, and can we export our own copy?",
    evidence: "The retention period in writing, and an export done during the demo.",
    weakAnswer: "Retention is not stated, or only the vendor can export.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "monitoring-export",
    group: "evidence",
    criterion: "Whether session data can feed existing monitoring tools",
    why: "Logs that stay siloed in one tool are less likely to actually get reviewed alongside everything else.",
    askTheVendor: "Can session and log data be exported into the monitoring tools already in use?",
    evidence: "Documentation of the export format or interface, and a working export.",
    weakAnswer: "Export only as a manual download, or not at all.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "data-portability",
    group: "evidence",
    criterion: "Whether logs and configuration can be exported if switching providers",
    why: "Being unable to take your own records with you is a real cost of switching later, worth knowing up front.",
    askTheVendor: "If this is stopped, can the logs and configuration be exported, or are they locked in?",
    evidence: "An export of logs and configuration in a documented format that can be read without the tool.",
    weakAnswer: "Data is available only while the contract runs.",
    priority: P("Should", "Should", "Should"),
  },
  // Availability
  {
    id: "session-approval",
    group: "availability",
    criterion: "Whether a session needs approval before it starts",
    why: "Approval turns standing access into access that exists only when someone at the plant has agreed to it.",
    askTheVendor: "Can a session be set to wait for approval from someone at the plant, and is that approval recorded?",
    evidence: "A demo of a session request waiting for approval, and the record of who approved it and when.",
    weakAnswer: "Approval is a phone call outside the tool, with nothing recorded.",
    priority: P("Should", "Must", "Should"),
  },
  {
    id: "session-start-stop",
    group: "availability",
    criterion: "Who can start and stop a session",
    why: "Customers increasingly expect to control a session they're exposed to, not just the vendor.",
    askTheVendor: "Can the customer end an active session themselves, at any time?",
    evidence: "A demo of the customer ending an active session.",
    weakAnswer: "Only the technician can end a session.",
    priority: P("Must", "Must", "Must"),
  },
  {
    id: "session-timeout",
    group: "availability",
    criterion: "Whether sessions time out automatically",
    why: "A session left open after the work is done is exposure with no offsetting benefit.",
    askTheVendor: "Does an idle session close itself, and after how long?",
    evidence: "The timeout setting, and an idle session closing during the demo.",
    weakAnswer: "Sessions stay open until someone closes them.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "break-glass",
    group: "availability",
    criterion: "Whether emergency (break-glass) access has an approval and an end time",
    why: "Urgent repairs are when shortcuts get taken, so the emergency path needs its own controls rather than none.",
    askTheVendor: "How does emergency access work out of hours: who approves it, when does it end, and how is it recorded?",
    evidence: "A demo of emergency access being granted, ending at the set time on its own, and appearing in the log.",
    weakAnswer: "Emergency access is a standing account kept aside for urgent cases.",
    priority: P("Must", "Must", "Should"),
  },
  {
    id: "low-bandwidth",
    group: "availability",
    criterion: "How it behaves on a poor or intermittent connection",
    why: "Many industrial sites don't have office-grade connectivity, and a tool that assumes they do fails exactly where it's needed most.",
    askTheVendor: "What happens to an active session if the connection drops, and does it work at all on a low-bandwidth link?",
    evidence: "A demo on a throttled or interrupted link.",
    weakAnswer: "Behaviour on poor links is untested or not documented.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "platform-outage",
    group: "availability",
    criterion: "How it behaves when the platform, cloud or identity service is unavailable",
    why: "If remote access depends on a service outside the plant, an outage there can block an urgent repair or leave open sessions in an unknown state.",
    askTheVendor: "If your cloud service or our identity provider is down, can anyone still connect, and what happens to sessions already open?",
    evidence: "Documented outage behaviour, and any local fallback with how it is controlled and recorded.",
    weakAnswer: "No answer, or a fallback that skips the normal controls and leaves no record.",
    priority: P("Must", "Should", "Should"),
  },
  // Fit and commercial
  {
    id: "deployment-location",
    group: "fit",
    criterion: "Whether it runs on-premises, in the cloud, or both",
    why: "Where the system runs affects what data leaves the customer's own environment and who else can see it.",
    askTheVendor: "Can this run entirely within our own network, or does it require a cloud component?",
    evidence: "An architecture diagram showing which components run where.",
    weakAnswer: "A cloud component is required but does not appear in the architecture shown.",
    priority: P("Should", "Must", "Should"),
  },
  {
    id: "protocol-support",
    group: "fit",
    criterion: "Which industrial protocols and device types are supported",
    why: "A tool that doesn't speak the protocols already in use adds a second system to maintain instead of replacing one.",
    askTheVendor: "Which protocols and controller types does this actually support today, not on a future roadmap?",
    evidence: "A list of supported protocols and controller types, and a test on your own equipment.",
    weakAnswer: "\"Most protocols\", with no list.",
    priority: P("Must", "Should", "Must"),
  },
  {
    id: "legacy-support",
    group: "fit",
    criterion: "Whether older or legacy equipment is supported",
    why: "Most fleets include equipment that predates whatever is being evaluated now.",
    askTheVendor: "Does this work with the equipment already installed, or only with newer models?",
    evidence: "A demo on an older model from your own fleet.",
    weakAnswer: "Supported on current models only.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "multi-customer-dashboard",
    group: "fit",
    criterion: "Whether one dashboard can manage access across all customers",
    why: "Managing access site-by-site, with no unified view, is itself an operational burden worth counting.",
    askTheVendor: "Can access across every customer site be seen and managed from one place?",
    evidence: "A demo of the view across several customers or sites.",
    weakAnswer: "A separate login for every customer site.",
    priority: P("Should", "Nice", "Should"),
  },
  {
    id: "onboarding-effort",
    group: "fit",
    criterion: "What the customer has to do to get this running",
    why: "Setup effort is a real cost, especially across many sites, and is worth sizing before committing.",
    askTheVendor: "What does the customer actually have to do to get this running at a new site?",
    evidence: "A written onboarding checklist for one site.",
    weakAnswer: "Customer effort described as minimal, with no list.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "onboarding-time",
    group: "fit",
    criterion: "How long onboarding typically takes",
    why: "A rollout across many sites multiplies whatever the per-site setup time turns out to be.",
    askTheVendor: "Roughly how long does setup take, from agreement to a first working connection?",
    evidence: "A typical timeline for a site of your size, in writing.",
    weakAnswer: "No estimate.",
    priority: P("Nice", "Nice", "Nice"),
  },
  {
    id: "support-regions",
    group: "fit",
    criterion: "What support is available, and where data is processed",
    why: "Support hours and data location both affect how a problem at 2am, or a data-residency question, actually gets handled.",
    askTheVendor: "What hours is support available, in what time zones, and in which countries is data stored and processed?",
    evidence: "Support terms stating hours, time zones and data locations.",
    weakAnswer: "Data location not stated.",
    priority: P("Should", "Should", "Should"),
  },
  {
    id: "pricing-basis",
    group: "fit",
    criterion: "Whether pricing is per user, per site, or per connection",
    why: "A pricing basis that doesn't match how the tool is actually used tends to surprise everyone once it scales.",
    askTheVendor: "Is pricing based on users, sites, machines, or something else, and is that stated plainly?",
    evidence: "A written price list that names the pricing unit.",
    weakAnswer: "Pricing only on request, deal by deal.",
    priority: P("Should", "Nice", "Should"),
  },
  {
    id: "pricing-extras",
    group: "fit",
    criterion: "Whether there are costs beyond the headline price",
    why: "A quote that omits support, extra users, or extra sites isn't the real cost of running this.",
    askTheVendor: "Are there separate costs for support, extra users, or extra sites beyond the quoted price?",
    evidence: "A quote that itemises support, extra users and extra sites.",
    weakAnswer: "A headline price only.",
    priority: P("Should", "Should", "Should"),
  },
];

export const CHECKLIST_ROW_COUNT = VENDOR_CHECKLIST_ROWS.length;

export function checklistRowsByGroup(group: ChecklistGroupId): VendorChecklistRow[] {
  return VENDOR_CHECKLIST_ROWS.filter((r) => r.group === group);
}

export interface DemoScenario {
  id: string;
  title: string;
  ask: string; // what to ask the vendor to do
  expect: string; // evidence to expect
  followUps: string;
  groups: ChecklistGroupId[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "revoke-active",
    title: "Revoke an active session",
    ask: "Start a session as a technician, then have a customer-side user revoke it while it is running.",
    expect: "The session ends within seconds, the technician cannot reconnect, and the log shows who revoked it and when.",
    followUps: "How long until revocation takes effect on every path? Could the technician reconnect another way?",
    groups: ["lifecycle", "availability"],
  },
  {
    id: "scope-one-machine",
    title: "Restrict access to one machine",
    ask: "Give a user access to one machine only, then try to reach a second machine on the same network from that session.",
    expect: "The second machine is unreachable, and the attempt is refused and recorded.",
    followUps: "Is the restriction enforced by the tool or by our firewall? Can a user widen their own scope?",
    groups: ["scope"],
  },
  {
    id: "leaver",
    title: "Remove a departing engineer end to end",
    ask: "Remove one engineer who has access at several sites, then try every way they could connect.",
    expect: "Access removed in one action or one documented procedure; no login, saved credential or device still works.",
    followUps: "What about accounts on the plant side or at a subcontractor? Who is told, and how?",
    groups: ["lifecycle", "identity"],
  },
  {
    id: "reconstruct",
    title: "Reconstruct a past session from the logs",
    ask: "Pick a session from earlier in the demo and reconstruct who connected, to what, when, and what they did, using only the logs.",
    expect: "Identity, target, start and end, and the actions or a recording, without asking the technician.",
    followUps: "How long are these logs kept? Can we export them ourselves? Can an administrator change them?",
    groups: ["evidence"],
  },
  {
    id: "drop-connection",
    title: "Drop the connection mid-session",
    ask: "Interrupt the network link during an active session, then restore it.",
    expect: "No half-finished change left running, a reconnect that asks for authentication again, and the interruption in the log.",
    followUps: "What happens to a file transfer or program download in progress? What does the machine do meanwhile?",
    groups: ["availability"],
  },
  {
    id: "emergency",
    title: "Emergency access with approval and an end time",
    ask: "Request emergency access as if out of hours, approve it, and let it run to its end time.",
    expect: "An approval record, access that ends at the set time without anyone removing it, and the whole event in the log.",
    followUps: "Who can approve? What if the approver cannot be reached? Can the end time be extended, and is that recorded?",
    groups: ["availability", "evidence"],
  },
  {
    id: "export",
    title: "Export logs and configuration",
    ask: "Export the session logs and the access configuration for one site.",
    expect: "Files in a documented format you can read without the tool, covering users, permissions and sessions.",
    followUps: "Is export available at every price tier? Does it still work after the contract ends?",
    groups: ["evidence", "fit"],
  },
];

// The spreadsheet's sheets, in order, with what each holds. The generator names
// its sheets from here and the /vendor-checklist page describes them from here.
export const CHECKLIST_SHEETS = [
  { id: "readme", name: "Read me first", body: "How to use it, what each evidence status means, and why it is guidance, not a security audit." },
  { id: "context", name: "Context", body: "Your buyer type, sites, machines, external suppliers and current access methods, and whether remote support is business-critical." },
  { id: "requirements", name: "Requirements", body: `The ${CHECKLIST_ROW_COUNT} rows with why each matters, what to ask, the evidence to request, what a weak answer looks like, and a default priority for machine builders, operators and integrators.` },
  { id: "vendors", name: "Vendor comparison", body: `Three vendor columns, each with the answer, an evidence status (${EVIDENCE_STATUSES.join(", ")}) and notes.` },
  { id: "demo", name: "Demo script", body: `${DEMO_SCENARIOS.length} scenarios to ask for live, with the evidence to expect and follow-up questions.` },
  { id: "summary", name: "Summary", body: "Formulas only, no overall score: per vendor, the Must rows for your buyer type and how many are verified in a demo, documented, only claimed or not answered, plus the Must rows still open." },
  { id: "plan", name: "Action plan", body: "The unresolved Must rows with the evidence to collect, stakeholders, next step, owner and date." },
] as const;

export type ChecklistSheetId = (typeof CHECKLIST_SHEETS)[number]["id"];

export function checklistSheetName(id: ChecklistSheetId): string {
  return CHECKLIST_SHEETS.find((s) => s.id === id)!.name;
}
