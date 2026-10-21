// Real rows from private/vendor-demo-comparison-checklist.xlsx ("Vendor comparison
// checklist" sheet), copied verbatim, used by the regional report's buyer's
// evaluation matrix section (lib/whitepaper-content.ts) so that section shows
// genuine checklist content rather than a separately invented summary of it. No
// vendor name anywhere in this file or anywhere it's rendered: the three blank
// "Vendor A/B/C" columns in the actual spreadsheet are deliberately not reproduced
// here, since the report names no vendor and renders no verdict.

export interface VendorChecklistRow {
  id: string;
  category: string;
  criterion: string;
  why: string;
  askTheVendor: string;
}

export const VENDOR_CHECKLIST_ROWS: VendorChecklistRow[] = [
  {
    id: "access-scope",
    category: "Access model",
    criterion: "How access can be scoped",
    why: "A connection that reaches more than it needs to widens what a single compromised session could expose.",
    askTheVendor: "Can access be scoped to one machine, or does it always reach more of the network?",
  },
  {
    id: "access-grant-revoke",
    category: "Access model",
    criterion: "How access is granted and revoked",
    why: "Access that's slow to remove is access that outlives the reason it was given.",
    askTheVendor: "How is access granted for a new engineer, and how quickly can it be revoked?",
  },
  {
    id: "mfa-mandatory",
    category: "Identity and MFA",
    criterion: "Whether multi-factor authentication is required",
    why: "A password alone is one of the most commonly exploited single points of failure.",
    askTheVendor: "Is MFA mandatory for every connection, or optional and up to us?",
  },
  {
    id: "named-accounts",
    category: "Identity and MFA",
    criterion: "Whether accounts are named to a person or shared",
    why: "Shared accounts make it impossible to trace who actually connected.",
    askTheVendor: "Can two engineers share one login, or is every account tied to a named person?",
  },
  {
    id: "session-start-stop",
    category: "Session control",
    criterion: "Who can start and stop a session",
    why: "Customers increasingly expect to control a session they're exposed to, not just the vendor.",
    askTheVendor: "Can the customer end an active session themselves, at any time?",
  },
  {
    id: "session-timeout",
    category: "Session control",
    criterion: "Whether sessions time out automatically",
    why: "A session left open after the work is done is exposure with no offsetting benefit.",
    askTheVendor: "Does an idle session close itself, and after how long?",
  },
  {
    id: "log-content",
    category: "Logging and evidence",
    criterion: "What a session log actually captures",
    why: "Logs are the main way an incident gets reconstructed after the fact, if they capture enough to be useful.",
    askTheVendor: "What does the session log capture: keystrokes, a screen recording, or just connection times?",
  },
  {
    id: "log-retention",
    category: "Logging and evidence",
    criterion: "How long logs are kept, and who can export them",
    why: "A log that's deleted too soon, or that only the vendor can see, limits what it's actually worth as evidence.",
    askTheVendor: "How long are logs retained, and can we export our own copy?",
  },
  {
    id: "deployment-location",
    category: "Deployment options",
    criterion: "Whether it runs on-premises, in the cloud, or both",
    why: "Where the system runs affects what data leaves the customer's own environment and who else can see it.",
    askTheVendor: "Can this run entirely within our own network, or does it require a cloud component?",
  },
  {
    id: "deployment-footprint",
    category: "Deployment options",
    criterion: "What has to be installed on the machine itself",
    why: "Anything added to the machine is something that has to be maintained for the life of that machine.",
    askTheVendor: "What software or hardware has to be added to the machine, and who maintains it?",
  },
  {
    id: "protocol-support",
    category: "Supported protocols and devices",
    criterion: "Which industrial protocols and device types are supported",
    why: "A tool that doesn't speak the protocols already in use adds a second system to maintain instead of replacing one.",
    askTheVendor: "Which protocols and controller types does this actually support today, not on a future roadmap?",
  },
  {
    id: "legacy-support",
    category: "Supported protocols and devices",
    criterion: "Whether older or legacy equipment is supported",
    why: "Most fleets include equipment that predates whatever is being evaluated now.",
    askTheVendor: "Does this work with the equipment already installed, or only with newer models?",
  },
  {
    id: "low-bandwidth",
    category: "Low-bandwidth and offline sites",
    criterion: "How it behaves on a poor or intermittent connection",
    why: "Many industrial sites don't have office-grade connectivity, and a tool that assumes they do fails exactly where it's needed most.",
    askTheVendor: "What happens to an active session if the connection drops, and does it work at all on a low-bandwidth link?",
  },
  {
    id: "multi-customer-isolation",
    category: "Multi-customer management",
    criterion: "How access across different customers is kept separate",
    why: "A mistake that lets one customer's session reach another's systems is a serious failure, not a minor one.",
    askTheVendor: "How is one customer's access kept completely separate from another's?",
  },
  {
    id: "multi-customer-dashboard",
    category: "Multi-customer management",
    criterion: "Whether one dashboard can manage access across all customers",
    why: "Managing access site-by-site, with no unified view, is itself an operational burden worth counting.",
    askTheVendor: "Can access across every customer site be seen and managed from one place?",
  },
  {
    id: "customer-visibility",
    category: "Customer control over access",
    criterion: "Whether the customer can see who currently has access",
    why: "A customer's own security review depends on being able to see this themselves, not just take a vendor's word for it.",
    askTheVendor: "Can the customer see, in real time, exactly who currently has access?",
  },
  {
    id: "customer-revoke",
    category: "Customer control over access",
    criterion: "Whether the customer can pause or revoke access without help",
    why: "Depending on the vendor to remove access adds a delay a customer may not be able to accept during an incident.",
    askTheVendor: "Can the customer switch off access themselves, without contacting us first?",
  },
  {
    id: "onboarding-effort",
    category: "Onboarding effort",
    criterion: "What the customer has to do to get this running",
    why: "Setup effort is a real cost, especially across many sites, and is worth sizing before committing.",
    askTheVendor: "What does the customer actually have to do to get this running at a new site?",
  },
  {
    id: "onboarding-time",
    category: "Onboarding effort",
    criterion: "How long onboarding typically takes",
    why: "A rollout across many sites multiplies whatever the per-site setup time turns out to be.",
    askTheVendor: "Roughly how long does setup take, from agreement to a first working connection?",
  },
  {
    id: "sso-integration",
    category: "Integrations with identity and monitoring tools",
    criterion: "Whether it connects to an existing identity provider",
    why: "A separate set of accounts is another thing to manage, and another thing that can be forgotten when someone leaves.",
    askTheVendor: "Can this use an existing single sign-on, or does it need its own separate accounts?",
  },
  {
    id: "monitoring-export",
    category: "Integrations with identity and monitoring tools",
    criterion: "Whether session data can feed existing monitoring tools",
    why: "Logs that stay siloed in one tool are less likely to actually get reviewed alongside everything else.",
    askTheVendor: "Can session and log data be exported into the monitoring tools already in use?",
  },
  {
    id: "support-regions",
    category: "Support and regions",
    criterion: "What support is available, and where data is processed",
    why: "Support hours and data location both affect how a problem at 2am, or a data-residency question, actually gets handled.",
    askTheVendor: "What hours is support available, in what time zones, and in which countries is data stored and processed?",
  },
  {
    id: "pricing-basis",
    category: "Pricing model clarity",
    criterion: "Whether pricing is per user, per site, or per connection",
    why: "A pricing basis that doesn't match how the tool is actually used tends to surprise everyone once it scales.",
    askTheVendor: "Is pricing based on users, sites, machines, or something else, and is that stated plainly?",
  },
  {
    id: "pricing-extras",
    category: "Pricing model clarity",
    criterion: "Whether there are costs beyond the headline price",
    why: "A quote that omits support, extra users, or extra sites isn't the real cost of running this.",
    askTheVendor: "Are there separate costs for support, extra users, or extra sites beyond the quoted price?",
  },
  {
    id: "data-portability",
    category: "Data portability",
    criterion: "Whether logs and configuration can be exported if switching providers",
    why: "Being unable to take your own records with you is a real cost of switching later, worth knowing up front.",
    askTheVendor: "If this is stopped, can the logs and configuration be exported, or are they locked in?",
  },
];
