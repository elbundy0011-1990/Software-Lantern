import type { ConsentKind } from "@/lib/consent-text";

// Every way a visitor can submit to /api/ot-enquiries, and what each one is
// asking for. The admin notification subject, its body and the /admin list
// all read "what" from here, so they always agree with each other.
export type SubmissionSource =
  | "checker"
  | "direct"
  | "pack"
  | "calculator"
  | "checklist"
  | "country_report"
  | "checker_brief"
  | "review_sheet"
  | "whitepaper";

export interface SubmissionKind {
  source: SubmissionSource;
  // Short label used in the email subject and the admin list.
  what: string;
  // The specific document or tool, for the email body.
  document: string;
  consent: ConsentKind;
}

export const SUBMISSION_KINDS: Record<SubmissionSource, Omit<SubmissionKind, "source">> = {
  whitepaper: {
    what: "Whitepaper (regional report)",
    document: "Regional report: remote access security in Belgium and the Netherlands (PDF)",
    consent: "file",
  },
  checklist: { what: "Vendor checklist", document: "Vendor demo comparison checklist", consent: "file" },
  pack: { what: "Questionnaire pack", document: "Customer security questionnaire pack", consent: "file" },
  calculator: { what: "ROI calculator result", document: "ROI calculator, emailed calculation", consent: "results" },
  country_report: { what: "Country report", document: "Remote access check, emailed country report", consent: "results" },
  checker_brief: {
    what: "Remote access check brief/review sheet",
    document: "NIS2 checker brief, emailed copy",
    consent: "results",
  },
  review_sheet: {
    what: "Remote access check brief/review sheet",
    document: "Remote access check review sheet, emailed copy",
    consent: "results",
  },
  checker: { what: "General enquiry", document: "Enquiry form, with checker answers attached", consent: "enquiry" },
  direct: { what: "General enquiry", document: "Enquiry form", consent: "enquiry" },
};

// answers.tool values written before answers.source existed.
const LEGACY_TOOL_SOURCES: Record<string, SubmissionSource> = {
  roi_calculator: "calculator",
  whitepaper: "whitepaper",
  country_report: "country_report",
  checker_brief: "checker_brief",
  review_sheet: "review_sheet",
  pack: "pack",
  checklist: "checklist",
};

export function isSubmissionSource(value: unknown): value is SubmissionSource {
  return typeof value === "string" && value in SUBMISSION_KINDS;
}

// Reads the stored answers jsonb: answers.source first, then the older
// answers.tool, and a plain enquiry when neither is there (the enquiry form
// never set either before answers.source was added).
export function submissionKindOf(answers: Record<string, unknown> | null | undefined): SubmissionKind {
  const stored = answers?.source;
  const tool = answers?.tool;
  const source: SubmissionSource = isSubmissionSource(stored)
    ? stored
    : typeof tool === "string" && LEGACY_TOOL_SOURCES[tool]
      ? LEGACY_TOOL_SOURCES[tool]
      : "direct";
  return { source, ...SUBMISSION_KINDS[source] };
}
