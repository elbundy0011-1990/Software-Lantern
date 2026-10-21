// Real rows from private/customer-security-questionnaire-pack.xlsx ("Questionnaire
// pack" sheet), copied verbatim so the free review sheet on /remote-access-check can
// show genuinely relevant rows selected by the visitor's own answers, rather than a
// separately-invented summary of what the paid-via-email pack contains. Five of these
// thirty rows already appear as SAMPLE_ROWS in app/(ot)/questionnaire-pack/page.tsx
// (rows access-1, auth-1, logging-1, incident-1, sub-1 below); the rest were not
// previously shown anywhere on the site.
//
// Deterministic, no AI: selectReviewSheetRows() below is a fixed lookup table from
// each of the seven remote-access-check answers to specific row ids, not a generated
// or scored result.

import type { RemoteAccessAnswers } from "./remote-access-session";

export interface PackRow {
  id: string;
  category: string;
  question: string;
  why: string;
  evidence: string;
}

export const QUESTIONNAIRE_PACK_ROWS: PackRow[] = [
  {
    id: "access-1",
    category: "Access control",
    question: "Who has remote access to our systems, and how is that list kept up to date?",
    why: "Wants a current, accurate inventory of who can reach their systems.",
    evidence: "A current list of people or accounts with remote access, and how often it's reviewed.",
  },
  {
    id: "access-2",
    category: "Access control",
    question: "How is access removed when someone leaves or changes role?",
    why: "Stale access is a common way former staff or contractors retain unneeded reach.",
    evidence: "Your offboarding or access-removal process, and how quickly it happens.",
  },
  {
    id: "access-3",
    category: "Access control",
    question: "Is access limited to only what's needed for the job?",
    why: "Broad access increases what a single compromised account can reach.",
    evidence: "How access is scoped per person or per task.",
  },
  {
    id: "access-4",
    category: "Access control",
    question: "Can access be switched off or paused by us, the customer?",
    why: "Customers want control over when a third party can reach their systems.",
    evidence: "Whether access is customer-initiated, vendor-initiated, or both, and how.",
  },
  {
    id: "auth-1",
    category: "Authentication",
    question: "Is multi-factor authentication required for remote access?",
    why: "A password alone is the most commonly exploited single point of failure.",
    evidence: "Whether MFA is in place, and for which accounts.",
  },
  {
    id: "auth-2",
    category: "Authentication",
    question: "Are accounts unique per person, or shared?",
    why: "Shared credentials make it impossible to trace who actually connected.",
    evidence: "Your account-provisioning approach (named vs. shared).",
  },
  {
    id: "auth-3",
    category: "Authentication",
    question: "How are credentials stored and rotated?",
    why: "Reused or long-lived credentials widen the window if one is exposed.",
    evidence: "Your password or credential management practice.",
  },
  {
    id: "logging-1",
    category: "Logging",
    question: "Are remote sessions logged?",
    why: "Logs are the main way an incident gets reconstructed after the fact.",
    evidence: "Whether session logging is in place and what it captures.",
  },
  {
    id: "logging-2",
    category: "Logging",
    question: "How long are those logs kept?",
    why: "A log that's deleted too soon can't help investigate a delayed discovery.",
    evidence: "Your log retention period.",
  },
  {
    id: "logging-3",
    category: "Logging",
    question: "Who can review the logs, and how often are they reviewed?",
    why: "A log nobody looks at only helps after something has already gone wrong.",
    evidence: "Who has access to review logs, and whether review is routine or reactive.",
  },
  {
    id: "vuln-1",
    category: "Vulnerability handling",
    question: "How do you find out about vulnerabilities in the software or hardware you use for remote access?",
    why: "Customers want to know you're not relying on luck to hear about a problem.",
    evidence: "How you track vendor advisories or security updates for your own tools.",
  },
  {
    id: "vuln-2",
    category: "Vulnerability handling",
    question: "How quickly are known vulnerabilities patched?",
    why: "The gap between a vulnerability being known and being fixed is when it's most often exploited.",
    evidence: "Your patching timeline or process, even if informal.",
  },
  {
    id: "vuln-3",
    category: "Vulnerability handling",
    question: "Do you run any vulnerability scanning on the systems you use to connect?",
    why: "Finding issues before they're exploited is cheaper than finding them after.",
    evidence: "Whether scanning happens, and how often.",
  },
  {
    id: "vuln-4",
    category: "Vulnerability handling",
    question: "What happens if a vulnerability is found in equipment you've already shipped or installed?",
    why: "Customers want to know support doesn't stop at the sale.",
    evidence: "Your process for notifying customers and issuing fixes after deployment.",
  },
  {
    id: "incident-1",
    category: "Incident reporting",
    question: "What counts as an incident, in your process?",
    why: "Without a shared definition, something significant can go unreported.",
    evidence: "How you define and recognize an incident.",
  },
  {
    id: "incident-2",
    category: "Incident reporting",
    question: "Who do you tell, and how quickly, if something goes wrong during a remote session?",
    why: "A delayed report narrows the customer's own window to respond.",
    evidence: "Your notification process and typical timeline.",
  },
  {
    id: "incident-3",
    category: "Incident reporting",
    question: "Have you had a remote-access-related incident before, and what happened?",
    why: "Past history is often the most concrete evidence of how a process actually works under pressure.",
    evidence: "An honest answer, even if the answer is \"no\" or \"not that we're aware of.\"",
  },
  {
    id: "incident-4",
    category: "Incident reporting",
    question: "Do you have a documented incident response process?",
    why: "A process written down is more likely to be followed consistently than one held in someone's head.",
    evidence: "Whether a written process exists, even a short one.",
  },
  {
    id: "sub-1",
    category: "Subcontractors",
    question: "Does anyone other than your own staff connect remotely, such as a dealer or subcontractor?",
    why: "A customer's risk extends to everyone who can reach their systems, not just your direct employees.",
    evidence: "A list of any third parties with remote access on your behalf.",
  },
  {
    id: "sub-2",
    category: "Subcontractors",
    question: "How do you vet a subcontractor before giving them access?",
    why: "The same questions being asked of you get asked, in turn, of anyone you rely on.",
    evidence: "Your own process for assessing a subcontractor, if any.",
  },
  {
    id: "sub-3",
    category: "Subcontractors",
    question: "Are subcontractors bound by the same access rules as your own staff?",
    why: "A weaker rule for a third party is a weaker rule for the customer, regardless of who it applies to.",
    evidence: "Whether subcontractor access follows the same named-account, logging, and MFA practices.",
  },
  {
    id: "sub-4",
    category: "Subcontractors",
    question: "Who is accountable if a subcontractor's access causes a problem?",
    why: "Customers want a single point of accountability, not a dispute about whose responsibility it was.",
    evidence: "How responsibility is assigned in your subcontractor agreements, if addressed at all.",
  },
  {
    id: "data-1",
    category: "Data",
    question: "What data can you see or access during a remote session?",
    why: "Customers want to know the scope of exposure, not just that access exists.",
    evidence: "A description of what a typical session can see (machine data, operational data, anything else).",
  },
  {
    id: "data-2",
    category: "Data",
    question: "Is any data copied, stored, or transmitted outside the customer's own systems during a session?",
    why: "Data leaving the customer's environment changes who else might be exposed if something goes wrong.",
    evidence: "Whether data is stored locally, in a cloud service, or not retained at all.",
  },
  {
    id: "data-3",
    category: "Data",
    question: "How is data protected in transit during a remote session?",
    why: "An unencrypted connection can be intercepted even if the endpoints themselves are secure.",
    evidence: "Whether the connection is encrypted, and how.",
  },
  {
    id: "data-4",
    category: "Data",
    question: "Is any of this data shared with anyone else?",
    why: "Customers want to know their operational data isn't being used or shared beyond the service relationship.",
    evidence: "Your own data-sharing practice, if any.",
  },
  {
    id: "doc-1",
    category: "Documentation",
    question: "Do you have a written policy covering remote access?",
    why: "A written policy is evidence a practice is deliberate, not incidental.",
    evidence: "Whether a policy document exists, even an informal one.",
  },
  {
    id: "doc-2",
    category: "Documentation",
    question: "Can you provide evidence of the practices described above, not just a description of them?",
    why: "Customers increasingly expect to see evidence, not take a description on trust.",
    evidence: "Whatever records, logs, or documents back up your answers to this questionnaire.",
  },
  {
    id: "doc-3",
    category: "Documentation",
    question: "Has anyone outside your company reviewed your security practices (a certification, an audit, an assessment)?",
    why: "Independent review carries more weight than a self-description.",
    evidence: "Any certification, audit, or assessment you can point to, if one exists.",
  },
  {
    id: "doc-4",
    category: "Documentation",
    question: "Who is the right contact at your company for security questions like these?",
    why: "Customers want an ongoing point of contact, not a one-time answer.",
    evidence: "A named contact or role responsible for security questions.",
  },
];

export function rowById(id: string): PackRow {
  const row = QUESTIONNAIRE_PACK_ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`Unknown questionnaire pack row id: ${id}`);
  return row;
}

// Fixed lookup table, not a score: each of the seven answers maps to one or two
// specific row ids. Order matters (it's also the display order), duplicates are
// dropped, and the result is capped to 8-12 rows as instructed.
export function selectReviewSheetRows(a: RemoteAccessAnswers): PackRow[] {
  const ids: string[] = [];
  const add = (...rowIds: string[]) => ids.push(...rowIds);

  switch (a.connectionMethod) {
    case "always_on_vpn":
      add("access-4", "access-1");
      break;
    case "remote_desktop":
      add("access-1", "auth-2");
      break;
    case "vendor_modem":
      add("sub-1", "sub-3", "access-4");
      break;
    case "on_site_only":
      add("doc-1");
      break;
    case "other":
      add("access-1", "doc-1");
      break;
    default:
      add("access-1");
  }

  switch (a.accessDecision) {
    case "customer_each_time":
      add("access-4");
      break;
    case "we_decide":
    case "always_on":
      add("access-4", "access-3");
      break;
    default:
      add("access-4");
  }

  switch (a.credentials) {
    case "shared":
      add("auth-2", "auth-3");
      break;
    default:
      add("auth-2");
  }

  switch (a.sessionLogging) {
    case "yes":
      add("logging-2", "logging-3");
      break;
    default:
      add("logging-1");
  }

  switch (a.mfa) {
    case "no":
      add("auth-1", "auth-3");
      break;
    default:
      add("auth-1");
  }

  switch (a.reach) {
    case "whole_network":
      add("data-1", "access-3", "data-2");
      break;
    default:
      add("data-1");
  }

  switch (a.customerQuestions) {
    case "often":
      add("doc-2", "doc-4");
      break;
    case "sometimes":
      add("doc-2");
      break;
    case "never":
      add("doc-1", "doc-3");
      break;
    default:
      add("doc-1");
  }

  // Two topics the seven questions never touch directly, included on every
  // review sheet so vulnerability handling and incident process are always
  // represented, not just whatever the connection/access answers happened to
  // surface.
  add("incident-1", "vuln-2");

  const seen = new Set<string>();
  const deduped = ids.filter((id) => (seen.has(id) ? false : (seen.add(id), true)));
  return deduped.slice(0, 12).map(rowById);
}

export interface VendorRequirement {
  topic: string;
  today: string;
  askTheVendor: string;
}

// Pre-filled from the six security-posture answers regardless of what prompted
// the review (lib/review-sheet.ts decides whether to show this expanded, by
// default, or as an optional link, based on the eighth, optional question).
export function vendorDemoRequirements(a: RemoteAccessAnswers): VendorRequirement[] {
  const na = "Not asked in this check";
  return [
    {
      topic: "Connection method",
      today: a.connectionMethod === "vendor_modem" ? "A vendor-supplied modem or gateway" : na,
      askTheVendor: "How would service engineers connect under this vendor's solution, and who controls when that connection is possible?",
    },
    {
      topic: "Who can switch access on",
      today:
        a.accessDecision === "customer_each_time"
          ? "Today: the customer switches it on each time"
          : a.accessDecision === "we_decide"
            ? "Today: the vendor's engineers decide, without asking each time"
            : a.accessDecision === "always_on"
              ? "Today: it's always on"
              : na,
      askTheVendor: "Can the customer require approval each time, or pause access themselves, with this vendor's tooling?",
    },
    {
      topic: "Named or shared accounts",
      today: a.credentials === "named" ? "Today: named to a specific person" : a.credentials === "shared" ? "Today: shared between people" : na,
      askTheVendor: "Does the vendor support accounts named to a specific person rather than shared credentials?",
    },
    {
      topic: "Session logging",
      today: a.sessionLogging === "yes" ? "Today: sessions are logged and kept" : a.sessionLogging === "no" ? "Today: sessions aren't logged" : na,
      askTheVendor: "Are sessions logged with this vendor's tooling, and for how long are logs kept?",
    },
    {
      topic: "Multi-factor authentication",
      today: a.mfa === "yes" ? "Today: MFA is required" : a.mfa === "no" ? "Today: MFA isn't required" : na,
      askTheVendor: "Does connecting through this vendor require more than a single password?",
    },
    {
      topic: "Reach of a connection",
      today: a.reach === "one_machine" ? "Today: just the one machine being serviced" : a.reach === "whole_network" ? "Today: more of the network" : na,
      askTheVendor: "Can this vendor scope access to a single machine, or does it necessarily reach more of the network?",
    },
    {
      topic: "Vulnerability handling",
      today: na,
      askTheVendor: "How quickly does the vendor patch known vulnerabilities in their own remote-access tooling?",
    },
    {
      topic: "Incident process",
      today: na,
      askTheVendor: "Does the vendor have a documented incident response process, and how quickly would they tell you about an incident?",
    },
    {
      topic: "Evidence",
      today: na,
      askTheVendor: "Can the vendor provide evidence of these practices, not just a description of them?",
    },
  ];
}
