// The country report: an extension to /remote-access-check (components/
// remote-access-situation-check.tsx, components/country-report-form.tsx)
// that adds a country and about 8 broader organizational questions on
// top of the existing 7-question situation check, then offers to email
// a fuller report. The on-screen result of the original 7 questions is
// unchanged; this is purely additive.
//
// The country section (supervisory authority, registration duty,
// incident-reporting duty) is sourced only from the ledger entries added
// 2026-10-20 for this feature (lib/compliance-ledger.ts,
// SUPPLEMENTARY_EVIDENCE ids "nl-cbw-*", "be-nis2-*", "lu-nis2-*"), which
// are themselves sourced only from official domains (rijksoverheid.nl,
// ncsc.nl, rdi.nl, ccb.belgium.be, safeonweb.be, ilr.lu, and national
// gazettes) per instruction. "other" gets no country section, since no
// such entries exist for it, and none should be invented.

import {
  COMPLIANCE_LEDGER,
  SUPPLEMENTARY_EVIDENCE,
  sourceLineText,
  type LedgerEntry,
  type SupplementaryQuote,
} from "./compliance-ledger";

export type ReportCountry = "NL" | "BE" | "LU" | "other";

export const REPORT_COUNTRIES: { value: ReportCountry; label: string }[] = [
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "LU", label: "Luxembourg" },
  { value: "other", label: "Other / not sure" },
];

export const ACCESS_APPROVER_OPTIONS = [
  "A specific named manager",
  "Whoever is on shift",
  "The customer approves each time",
  "No formal approval process",
  "Not sure",
] as const;

export const SESSION_LOGGING_DURATION_OPTIONS = [
  "Yes, kept for more than a year",
  "Yes, kept for under a year",
  "Sessions aren't logged",
  "Not sure",
] as const;

export const INCIDENT_PROCESS_OPTIONS = [
  "Yes, a written process",
  "An informal process, not written down",
  "No process yet",
  "Not sure",
] as const;

export const QUESTIONNAIRE_FREQUENCY_OPTIONS = ["None", "1 to 2", "3 to 5", "6 or more", "Not sure"] as const;

export const TIMELINE_OPTIONS = ["This quarter", "This year", "Just learning"] as const;

export interface CountryReportAnswers {
  country: ReportCountry | null;
  role: string;
  sector: string;
  numSites: string;
  accessApprover: string;
  sessionLoggingDuration: string;
  incidentProcess: string;
  questionnairesPerYear: string;
  timeline: string;
}

export const EMPTY_COUNTRY_REPORT_ANSWERS: CountryReportAnswers = {
  country: null,
  role: "",
  sector: "",
  numSites: "",
  accessApprover: "",
  sessionLoggingDuration: "",
  incidentProcess: "",
  questionnairesPerYear: "",
  timeline: "",
};

export function isCountryReportComplete(a: CountryReportAnswers): boolean {
  return Boolean(
    a.country &&
      a.role.trim() &&
      a.sector.trim() &&
      a.numSites.trim() &&
      a.accessApprover &&
      a.sessionLoggingDuration &&
      a.incidentProcess &&
      a.questionnairesPerYear &&
      a.timeline,
  );
}

// Ledger ids for the country section, added 2026-10-20. "other" has no
// entries and gets no country section — see docs/CLAIMS.md and the
// 2026-10-20 comment block in lib/compliance-ledger.ts for sourcing.
const COUNTRY_LEDGER_IDS: Record<"NL" | "BE" | "LU", { inForce: string; authority: string; registration: string; incident: string }> = {
  NL: {
    inForce: "nis2-nl",
    authority: "nl-cbw-supervisory-authority",
    registration: "nl-cbw-registration-duty",
    incident: "nl-cbw-incident-reporting-duty",
  },
  BE: {
    inForce: "nis2-be",
    authority: "be-nis2-supervisory-authority",
    registration: "be-nis2-registration-duty",
    incident: "be-nis2-incident-reporting-duty",
  },
  LU: {
    inForce: "nis2-lu",
    authority: "lu-nis2-supervisory-authority",
    registration: "lu-nis2-registration-duty",
    incident: "lu-nis2-incident-reporting-duty",
  },
};

export interface CountrySection {
  country: "NL" | "BE" | "LU";
  inForce: LedgerEntry;
  authority: SupplementaryQuote;
  registration: SupplementaryQuote;
  incident: SupplementaryQuote;
}

// A one-line plain-text rendering of what a SupplementaryQuote entry
// actually says (the translation when the source isn't English,
// otherwise the quoted text; a label: value join for a record entry),
// for the country-report email — sourceLineText() alone only cites
// where a claim came from, not what it says.
export function evidenceSummary(entry: SupplementaryQuote): string {
  if (entry.evidence.kind === "quote") {
    return entry.evidence.quotes.map((q) => q.translation ?? q.text).join(" ");
  }
  return entry.evidence.fields.map((f) => `${f.label}: ${f.value}`).join("; ");
}

export function getCountrySection(country: ReportCountry): CountrySection | null {
  if (country === "other") return null;
  const ids = COUNTRY_LEDGER_IDS[country];
  const inForce = COMPLIANCE_LEDGER.find((e) => e.id === ids.inForce);
  const authority = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === ids.authority);
  const registration = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === ids.registration);
  const incident = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === ids.incident);
  if (!inForce || !authority || !registration || !incident) return null;
  return { country, inForce, authority, registration, incident };
}

// Re-exported so callers (the email template) don't need their own
// import of lib/compliance-ledger.ts just for this one helper.
export { sourceLineText };
