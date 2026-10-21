// Pure content builders for the /remote-access-check result (the "review sheet"),
// shared by the on-screen result (components/remote-access-situation-check.tsx) and
// the "email me a copy" template (lib/email-templates.ts) so the two can never
// describe the same answers differently. Deterministic lookup tables over the seven
// answers, no AI, no score, no verdict.

import {
  remoteAccessAnswerRows,
  describeRemoteAccessAnswers,
  type RemoteAccessAnswers,
} from "./remote-access-session";
import {
  selectReviewSheetRows,
  vendorDemoRequirements,
  showsVendorEvaluation,
  type PackRow,
  type VendorRequirement,
} from "./questionnaire-pack-rows";

export interface ReviewSheetTask {
  text: string;
}

// Topics the visitor marked "not sure" (or, for connection method, "something
// else"), framed as something to pin down before a customer asks.
export function questionsToResolve(a: RemoteAccessAnswers): ReviewSheetTask[] {
  const tasks: ReviewSheetTask[] = [];
  if (a.connectionMethod === "not_sure") {
    tasks.push({ text: "Confirm how service engineers actually connect to a machine today, by method." });
  }
  if (a.connectionMethod === "other") {
    tasks.push({ text: "Write down, in one line, what the \"something else\" connection method actually is." });
  }
  if (a.accessDecision === "not_sure") {
    tasks.push({ text: "Confirm who decides when remote access is switched on, and how." });
  }
  if (a.credentials === "not_sure") {
    tasks.push({ text: "Confirm whether the accounts used to connect are named to a person or shared." });
  }
  if (a.sessionLogging === "not_sure") {
    tasks.push({ text: "Confirm whether remote sessions are logged, and where that log is kept." });
  }
  if (a.mfa === "not_sure") {
    tasks.push({ text: "Confirm whether connecting requires more than a single password." });
  }
  if (a.reach === "not_sure") {
    tasks.push({ text: "Confirm what a remote connection can actually reach once it's open." });
  }
  return tasks;
}

// Topics the visitor did answer, framed as something to double-check rather than
// restated as a pass/fail: a defined answer is still worth confirming it holds in
// practice, independent of what the answer actually was.
export function controlsToVerify(a: RemoteAccessAnswers): ReviewSheetTask[] {
  const tasks: ReviewSheetTask[] = [];
  if (a.connectionMethod && a.connectionMethod !== "not_sure" && a.connectionMethod !== "other") {
    tasks.push({ text: "Verify the connection method in use matches what's documented, and that the documentation is current." });
  }
  if (a.accessDecision && a.accessDecision !== "not_sure") {
    tasks.push({ text: "Verify who can switch access on in practice matches who is supposed to be able to." });
  }
  if (a.credentials && a.credentials !== "not_sure") {
    tasks.push({
      text:
        a.credentials === "shared"
          ? "Verify which people actually share each shared account, and why."
          : "Verify every named account is still tied to someone currently authorized.",
    });
  }
  if (a.sessionLogging && a.sessionLogging !== "not_sure") {
    tasks.push({
      text:
        a.sessionLogging === "yes"
          ? "Verify how long session logs are kept, and who can review them."
          : "Verify whether session logging is technically possible with the current setup, even if it isn't switched on.",
    });
  }
  if (a.mfa && a.mfa !== "not_sure") {
    tasks.push({
      text:
        a.mfa === "yes"
          ? "Verify multi-factor authentication is required for every account that can connect, not just some."
          : "Verify what would be needed to add a second factor to this connection method.",
    });
  }
  if (a.reach && a.reach !== "not_sure") {
    tasks.push({
      text:
        a.reach === "whole_network"
          ? "Verify whether access could be scoped down to just the machine being serviced."
          : "Verify access genuinely stops at the one machine, and doesn't incidentally reach further.",
    });
  }
  return tasks;
}

// The evidence-to-prepare column of the selected questionnaire pack rows,
// deduplicated in the order those rows appear.
export function evidenceToPrepare(rows: PackRow[]): string[] {
  const seen = new Set<string>();
  return rows.map((r) => r.evidence).filter((e) => (seen.has(e) ? false : (seen.add(e), true)));
}

export interface ReviewSheetContent {
  summary: string;
  answerRows: { label: string; value: string }[];
  questionsToResolve: ReviewSheetTask[];
  controlsToVerify: ReviewSheetTask[];
  evidenceToPrepare: string[];
  packRows: PackRow[];
  showVendorRequirements: boolean;
  vendorRequirements: VendorRequirement[];
}

export function buildReviewSheet(a: RemoteAccessAnswers): ReviewSheetContent {
  const packRows = selectReviewSheetRows(a);
  return {
    summary: describeRemoteAccessAnswers(a),
    answerRows: remoteAccessAnswerRows(a),
    questionsToResolve: questionsToResolve(a),
    controlsToVerify: controlsToVerify(a),
    evidenceToPrepare: evidenceToPrepare(packRows),
    packRows,
    showVendorRequirements: showsVendorEvaluation(a),
    vendorRequirements: vendorDemoRequirements(a),
  };
}

export function reviewSheetToText(a: RemoteAccessAnswers): string {
  const c = buildReviewSheet(a);
  const lines: string[] = [];
  lines.push("YOUR REMOTE ACCESS REVIEW SHEET");
  lines.push("");
  lines.push(c.summary);
  lines.push("");
  lines.push("YOUR ANSWERS");
  for (const r of c.answerRows) lines.push(`- ${r.label}: ${r.value}`);
  lines.push("");
  if (c.questionsToResolve.length) {
    lines.push("QUESTIONS TO RESOLVE");
    for (const t of c.questionsToResolve) lines.push(`- ${t.text}`);
    lines.push("");
  }
  lines.push("CONTROLS TO VERIFY");
  for (const t of c.controlsToVerify) lines.push(`- ${t.text}`);
  lines.push("");
  lines.push("EVIDENCE TO PREPARE");
  for (const e of c.evidenceToPrepare) lines.push(`- ${e}`);
  lines.push("");
  lines.push("RELEVANT QUESTIONNAIRE PACK ROWS");
  for (const row of c.packRows) lines.push(`- [${row.category}] ${row.question}`);
  if (c.showVendorRequirements) {
    lines.push("");
    lines.push("VENDOR DEMO REQUIREMENTS (since you noted a vendor-supplied modem or gateway)");
    for (const v of c.vendorRequirements) lines.push(`- ${v.topic} (${v.today}): ${v.askTheVendor}`);
  }
  lines.push("");
  lines.push("This is not a pass or fail, and it doesn't name or favor any product. A customer's own");
  lines.push("questionnaire will ask about these same topics in its own words.");
  return lines.join("\n");
}
