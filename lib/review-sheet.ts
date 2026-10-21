// Pure content builders for the /remote-access-check result (the "review sheet"),
// shared by the on-screen result (components/remote-access-situation-check.tsx) and
// the "email me a copy" template (lib/email-templates.ts) so the two can never
// describe the same answers differently. Deterministic lookup tables over the
// seven required answers plus the eighth, optional "what prompted this review"
// answer, no AI, no score, no verdict. The eighth answer only ever reorders or
// expands content that's already computed from the first seven; it never hides
// anything a visitor who skips it would otherwise see.

import {
  remoteAccessAnswerRows,
  describeRemoteAccessAnswers,
  reviewPromptLabel,
  type RemoteAccessAnswers,
} from "./remote-access-session";
import { selectReviewSheetRows, vendorDemoRequirements, type PackRow, type VendorRequirement } from "./questionnaire-pack-rows";

export type Topic = "connection" | "access_decision" | "credentials" | "logging" | "mfa" | "reach";

export interface ReviewSheetTask {
  text: string;
  topic: Topic;
}

// Topics the visitor marked "not sure" (or, for connection method, "something
// else"), framed as something to pin down before a customer asks.
export function questionsToResolve(a: RemoteAccessAnswers): ReviewSheetTask[] {
  const tasks: ReviewSheetTask[] = [];
  if (a.connectionMethod === "not_sure") {
    tasks.push({ topic: "connection", text: "Confirm how service engineers actually connect to a machine today, by method." });
  }
  if (a.connectionMethod === "other") {
    tasks.push({ topic: "connection", text: "Write down, in one line, what the \"something else\" connection method actually is." });
  }
  if (a.accessDecision === "not_sure") {
    tasks.push({ topic: "access_decision", text: "Confirm who decides when remote access is switched on, and how." });
  }
  if (a.credentials === "not_sure") {
    tasks.push({ topic: "credentials", text: "Confirm whether the accounts used to connect are named to a person or shared." });
  }
  if (a.sessionLogging === "not_sure") {
    tasks.push({ topic: "logging", text: "Confirm whether remote sessions are logged, and where that log is kept." });
  }
  if (a.mfa === "not_sure") {
    tasks.push({ topic: "mfa", text: "Confirm whether connecting requires more than a single password." });
  }
  if (a.reach === "not_sure") {
    tasks.push({ topic: "reach", text: "Confirm what a remote connection can actually reach once it's open." });
  }
  return tasks;
}

// Topics the visitor did answer, framed as something to double-check rather than
// restated as a pass/fail: a defined answer is still worth confirming it holds in
// practice, independent of what the answer actually was.
export function controlsToVerify(a: RemoteAccessAnswers): ReviewSheetTask[] {
  const tasks: ReviewSheetTask[] = [];
  if (a.connectionMethod && a.connectionMethod !== "not_sure" && a.connectionMethod !== "other") {
    tasks.push({ topic: "connection", text: "Verify the connection method in use matches what's documented, and that the documentation is current." });
  }
  if (a.accessDecision && a.accessDecision !== "not_sure") {
    tasks.push({ topic: "access_decision", text: "Verify who can switch access on in practice matches who is supposed to be able to." });
  }
  if (a.credentials && a.credentials !== "not_sure") {
    tasks.push({
      topic: "credentials",
      text:
        a.credentials === "shared"
          ? "Verify which people actually share each shared account, and why."
          : "Verify every named account is still tied to someone currently authorized.",
    });
  }
  if (a.sessionLogging && a.sessionLogging !== "not_sure") {
    tasks.push({
      topic: "logging",
      text:
        a.sessionLogging === "yes"
          ? "Verify how long session logs are kept, and who can review them."
          : "Verify whether session logging is technically possible with the current setup, even if it isn't switched on.",
    });
  }
  if (a.mfa && a.mfa !== "not_sure") {
    tasks.push({
      topic: "mfa",
      text:
        a.mfa === "yes"
          ? "Verify multi-factor authentication is required for every account that can connect, not just some."
          : "Verify what would be needed to add a second factor to this connection method.",
    });
  }
  if (a.reach && a.reach !== "not_sure") {
    tasks.push({
      topic: "reach",
      text:
        a.reach === "whole_network"
          ? "Verify whether access could be scoped down to just the machine being serviced."
          : "Verify access genuinely stops at the one machine, and doesn't incidentally reach further.",
    });
  }
  return tasks;
}

// Stable partition: priority-topic tasks first, everything else after, each
// group keeping its own original relative order. Used only for the "incident"
// review prompt, which asks who approved access and whether it was logged
// before anything else was answered or checked.
function prioritizeTopics(tasks: ReviewSheetTask[], priority: Topic[]): ReviewSheetTask[] {
  const isPriority = (t: ReviewSheetTask) => priority.includes(t.topic);
  return [...tasks.filter(isPriority), ...tasks.filter((t) => !isPriority(t))];
}

// The evidence-to-prepare column of the selected questionnaire pack rows,
// deduplicated in the order those rows appear.
export function evidenceToPrepare(rows: PackRow[]): string[] {
  const seen = new Set<string>();
  return rows.map((r) => r.evidence).filter((e) => (seen.has(e) ? false : (seen.add(e), true)));
}

// Which block renders first on the page/in the email. Reordering only, never
// hiding: every section still appears for every visitor, this just changes
// where. "incident" keeps the default block order and instead reorders the
// items inside questionsToResolve/controlsToVerify (see prioritizeTopics above).
export type SectionKey = "questionsToResolve" | "controlsToVerify" | "evidenceToPrepare" | "packRows" | "vendorRequirements";

const DEFAULT_SECTION_ORDER: SectionKey[] = ["questionsToResolve", "controlsToVerify", "evidenceToPrepare", "packRows", "vendorRequirements"];

function sectionOrderFor(a: RemoteAccessAnswers): SectionKey[] {
  if (a.reviewPrompt === "customer_questionnaire") {
    return ["packRows", "questionsToResolve", "controlsToVerify", "evidenceToPrepare", "vendorRequirements"];
  }
  if (a.reviewPrompt === "replacing_upgrading") {
    return ["vendorRequirements", "questionsToResolve", "controlsToVerify", "evidenceToPrepare", "packRows"];
  }
  return DEFAULT_SECTION_ORDER;
}

export interface ReviewSheetContent {
  summary: string;
  reviewPromptLabel: string | null;
  answerRows: { label: string; value: string }[];
  questionsToResolve: ReviewSheetTask[];
  controlsToVerify: ReviewSheetTask[];
  evidenceToPrepare: string[];
  packRows: PackRow[];
  vendorRequirements: VendorRequirement[];
  // True only when "Replacing or upgrading our remote access" was the answer:
  // the vendor-demo requirements list renders expanded, by default, instead of
  // behind the optional link everyone else sees.
  showVendorRequirementsExpanded: boolean;
  sectionOrder: SectionKey[];
}

export function buildReviewSheet(a: RemoteAccessAnswers): ReviewSheetContent {
  const packRows = selectReviewSheetRows(a);
  const isIncident = a.reviewPrompt === "incident";
  const incidentPriority: Topic[] = ["access_decision", "logging"];

  let resolve = questionsToResolve(a);
  let verify = controlsToVerify(a);
  if (isIncident) {
    resolve = prioritizeTopics(resolve, incidentPriority);
    verify = prioritizeTopics(verify, incidentPriority);
  }

  return {
    summary: describeRemoteAccessAnswers(a),
    reviewPromptLabel: reviewPromptLabel(a),
    answerRows: remoteAccessAnswerRows(a),
    questionsToResolve: resolve,
    controlsToVerify: verify,
    evidenceToPrepare: evidenceToPrepare(packRows),
    packRows,
    vendorRequirements: vendorDemoRequirements(a),
    showVendorRequirementsExpanded: a.reviewPrompt === "replacing_upgrading",
    sectionOrder: sectionOrderFor(a),
  };
}

const SECTION_TITLES: Record<SectionKey, string> = {
  questionsToResolve: "QUESTIONS TO RESOLVE",
  controlsToVerify: "CONTROLS TO VERIFY",
  evidenceToPrepare: "EVIDENCE TO PREPARE",
  packRows: "RELEVANT QUESTIONNAIRE PACK ROWS",
  vendorRequirements: "VENDOR DEMO REQUIREMENTS",
};

export function reviewSheetToText(a: RemoteAccessAnswers): string {
  const c = buildReviewSheet(a);
  const lines: string[] = [];
  lines.push("YOUR REMOTE ACCESS REVIEW SHEET");
  lines.push("");
  lines.push(c.summary);
  if (c.reviewPromptLabel) lines.push(`What prompted this review: ${c.reviewPromptLabel}`);
  lines.push("");
  lines.push("YOUR ANSWERS");
  for (const r of c.answerRows) lines.push(`- ${r.label}: ${r.value}`);

  const renderSection = (key: SectionKey) => {
    if (key === "questionsToResolve") {
      if (!c.questionsToResolve.length) return;
      lines.push("");
      lines.push(SECTION_TITLES[key]);
      for (const t of c.questionsToResolve) lines.push(`- ${t.text}`);
    } else if (key === "controlsToVerify") {
      lines.push("");
      lines.push(SECTION_TITLES[key]);
      for (const t of c.controlsToVerify) lines.push(`- ${t.text}`);
    } else if (key === "evidenceToPrepare") {
      lines.push("");
      lines.push(SECTION_TITLES[key]);
      for (const e of c.evidenceToPrepare) lines.push(`- ${e}`);
    } else if (key === "packRows") {
      lines.push("");
      lines.push(SECTION_TITLES[key]);
      for (const row of c.packRows) lines.push(`- [${row.category}] ${row.question}`);
    } else if (key === "vendorRequirements") {
      lines.push("");
      lines.push(
        c.showVendorRequirementsExpanded
          ? SECTION_TITLES[key]
          : `${SECTION_TITLES[key]} (optional, pre-filled from your answers above)`,
      );
      for (const v of c.vendorRequirements) lines.push(`- ${v.topic} (${v.today}): ${v.askTheVendor}`);
    }
  };

  for (const key of c.sectionOrder) renderSection(key);

  lines.push("");
  lines.push("This is not a pass or fail, and it doesn't name or favor any product. A customer's own");
  lines.push("questionnaire will ask about these same topics in its own words.");
  return lines.join("\n");
}
