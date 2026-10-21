import "server-only";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  calculateMachineBuilderRoi,
  calculatePlantOperatorRoi,
  parseMachineBuilderFields,
  parsePlantOperatorFields,
  formatEur,
  type RoiMode,
  type RoiFieldState,
  type RoiResult,
} from "@/lib/roi-calculator";
import { remoteAccessAnswerRows, REMOTE_ACCESS_QUESTIONS, type RemoteAccessAnswers } from "@/lib/remote-access-session";
import { getCountrySection, evidenceSummary, sourceLineText, REPORT_COUNTRIES, type ReportCountry, type CountryReportAnswers } from "@/lib/country-report";
import { buildCheckerBrief } from "@/lib/checker-brief";
import type { CheckerAnswers } from "@/lib/checker-session";
import { buildReviewSheet } from "@/lib/review-sheet";
import { submissionKindOf } from "@/lib/submission-kind";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailLayout({
  heading,
  bodyHtml,
  ctaHref,
  ctaLabel,
}: {
  heading: string;
  bodyHtml: string;
  ctaHref: string;
  ctaLabel: string;
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
      <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4f46e5;">${SITE_NAME}</p>
      <div style="background:#ffffff;border:1px solid rgba(13,17,23,0.08);border-radius:16px;padding:32px;">
        <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:#0d1117;">${escapeHtml(heading)}</h1>
        ${bodyHtml}
        <a href="${ctaHref}" style="display:inline-block;margin-top:8px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:999px;padding:13px 26px;font-size:15px;font-weight:600;">${escapeHtml(ctaLabel)}</a>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#79818f;">${SITE_NAME}, ${SITE_URL.replace(/^https?:\/\//, "")}</p>
    </div>
  </body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;font-size:13px;font-weight:700;color:#79818f;width:130px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:15px;color:#0d1117;">${escapeHtml(value)}</td></tr>`;
}

// TRIGGER: a new OT submission of any kind, sent only to ADMIN_EMAIL. The
// subject and first rows say exactly what was requested (lib/submission-
// kind.ts, from the stored answers.source), so the inbox alone tells a
// whitepaper download from an enquiry. Points at /admin/ot-enquiries: this
// data lives in its own table (public.ot_enquiries, see supabase/ot-cyber-schema.sql).
export function buildNewOtEnquiryAdminEmail(input: {
  enquiryId: string;
  answers: Record<string, unknown>;
  companyName: string;
  contactName: string;
  contactEmail: string;
  country: string | null;
  role: string | null;
  timeline: string | null;
}): { subject: string; html: string } {
  const kind = submissionKindOf(input.answers);
  const a = input.answers;
  const countryAnswers = a.countryReportAnswers as Partial<CountryReportAnswers> | undefined;
  const text = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
  const pagePath = text(a.pagePath);
  const consent = (a.consent ?? {}) as { version?: string; acceptedAt?: string };
  const sites = text(a.sites) ?? text(countryAnswers?.numSites);
  const timeline = input.timeline ?? text(a.timing) ?? text(countryAnswers?.timeline);
  const notGiven = "Not provided";

  const rows = [
    fieldRow("Requested", kind.what),
    fieldRow("Document or tool", kind.document),
    fieldRow("Page", pagePath ? `${SITE_URL}${pagePath}` : "Unknown"),
    fieldRow("Company", input.companyName),
    fieldRow("Role", input.role ?? text(a.role) ?? notGiven),
    fieldRow("Country", input.country || notGiven),
    fieldRow("Sites", sites ?? notGiven),
    fieldRow("Timeline", timeline ?? notGiven),
    fieldRow("Consent text", consent.version ?? "Unknown"),
    fieldRow("Consent given", consent.acceptedAt ?? "Unknown"),
    fieldRow("Name", input.contactName),
    fieldRow("Work email", input.contactEmail),
  ];

  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows.join("")}</table>
  `;

  const who = input.companyName || input.contactEmail.split("@")[1] || "unknown";
  return {
    subject: `[${SITE_NAME}] ${kind.what} request: ${who}`,
    html: emailLayout({
      heading: `New ${kind.what} request`,
      bodyHtml,
      ctaHref: `${SITE_URL}/admin/ot-enquiries/${input.enquiryId}`,
      ctaLabel: "Open in admin",
    }),
  };
}

function roiResultRows(result: RoiResult): string {
  const lineRows = result.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;font-size:14px;color:#0d1117;">${escapeHtml(l.label)}<div style="font-size:12px;color:#79818f;margin-top:2px;">Formula: ${escapeHtml(l.formula)}</div></td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#0d1117;text-align:right;white-space:nowrap;">${escapeHtml(formatEur(l.amount))}</td></tr>`,
    )
    .join("");
  const totalRow = `<tr><td style="padding:10px 0 0;font-size:14px;font-weight:700;color:#0d1117;border-top:1px solid rgba(13,17,23,0.1);">Total estimated annual saving</td><td style="padding:10px 0 0;font-size:15px;font-weight:700;color:#4f46e5;text-align:right;white-space:nowrap;border-top:1px solid rgba(13,17,23,0.1);">${escapeHtml(formatEur(result.totalAnnualSavings))}</td></tr>`;
  const netRow =
    result.netAnnualSavings !== null
      ? `<tr><td style="padding:6px 0;font-size:14px;color:#0d1117;">Net, after the solution cost entered</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#0d1117;text-align:right;white-space:nowrap;">${escapeHtml(formatEur(result.netAnnualSavings))}</td></tr>`
      : "";
  const paybackRow =
    result.paybackMonths !== null
      ? `<tr><td style="padding:6px 0;font-size:14px;color:#0d1117;">Payback period</td><td style="padding:6px 0;font-size:14px;font-weight:700;color:#0d1117;text-align:right;white-space:nowrap;">${result.paybackMonths} months</td></tr>`
      : "";
  const contextRows = result.contextLines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;font-size:13px;color:#79818f;">${escapeHtml(l.label)}<div style="font-size:12px;color:#79818f;margin-top:2px;">Formula: ${escapeHtml(l.formula)}</div></td><td style="padding:6px 0;font-size:13px;font-weight:700;color:#79818f;text-align:right;white-space:nowrap;">${escapeHtml(formatEur(l.amount))}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;">${lineRows}${totalRow}${netRow}${paybackRow}${contextRows}</table>`;
}

// TRIGGER: "Email me this calculation" on /roi-calculator. Recomputes
// from the same raw field values the visitor typed, through the exact
// same lib/roi-calculator.ts functions the live page uses — never trusts
// a client-submitted total — so the number in this email is always the
// number the page actually showed, not a separately-typed restatement of
// it that could drift out of sync.
export function buildRoiCalculatorEmail(mode: RoiMode, fields: RoiFieldState): { subject: string; html: string } {
  const full =
    mode === "machine_builder"
      ? calculateMachineBuilderRoi(parseMachineBuilderFields(fields), 1)
      : calculatePlantOperatorRoi(parsePlantOperatorFields(fields), 1);
  const half =
    mode === "machine_builder"
      ? calculateMachineBuilderRoi(parseMachineBuilderFields(fields), 0.5)
      : calculatePlantOperatorRoi(parsePlantOperatorFields(fields), 0.5);

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#79818f;">
      These figures are an estimate calculated directly from the numbers you entered. They are not
      a guarantee, a benchmark, or data about any other company.
    </p>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Your estimate</p>
    <div style="margin:0 0 24px;">${roiResultRows(full)}</div>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Conservative check: at 50% of your own estimate</p>
    <div style="margin:0 0 8px;">${roiResultRows(half)}</div>
  `;

  return {
    subject: "Your remote access ROI calculation",
    html: emailLayout({
      heading: "Your remote access ROI calculation",
      bodyHtml,
      ctaHref: `${SITE_URL}/checker`,
      ctaLabel: "Check your situation",
    }),
  };
}

// TRIGGER: "Email me the full report for [country]" on /remote-access-
// check's country report (components/country-report-form.tsx). Restates
// the visitor's own answers, phrases the original 7-question check's
// topics as questions (REMOTE_ACCESS_QUESTIONS, shared with the
// on-screen result so the two never phrase a topic differently), adds
// the country section when one exists for the chosen country (NL, BE,
// LU — "other" gets none, by design, see lib/country-report.ts), and
// links to related guides. Every country-section claim traces to a
// lib/compliance-ledger.ts entry sourced only from an official domain or
// gazette, per instruction.
export function buildCountryReportEmail(
  country: ReportCountry,
  remoteAccessAnswers: RemoteAccessAnswers | null,
  countryAnswers: CountryReportAnswers,
): { subject: string; html: string } {
  const countryLabel = REPORT_COUNTRIES.find((c) => c.value === country)?.label ?? "your country";

  const areasHtml = REMOTE_ACCESS_QUESTIONS.map(
    (q) => `<li style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#0d1117;">${escapeHtml(q.question)}</li>`,
  ).join("");

  const remoteAccessRowsHtml = remoteAccessAnswers
    ? remoteAccessAnswerRows(remoteAccessAnswers)
        .map((r) => fieldRow(r.label, r.value))
        .join("")
    : "";

  const countryAnswerRows = [
    fieldRow("Role", countryAnswers.role),
    fieldRow("Sector", countryAnswers.sector),
    fieldRow("Number of sites or machines", countryAnswers.numSites),
    fieldRow("Who approves access", countryAnswers.accessApprover),
    fieldRow("Session logging", countryAnswers.sessionLoggingDuration),
    fieldRow("Incident process", countryAnswers.incidentProcess),
    fieldRow("Customer questionnaires per year", countryAnswers.questionnairesPerYear),
    fieldRow("Timeline to act", countryAnswers.timeline),
  ].join("");

  const section = getCountrySection(country);
  const countrySectionHtml = section
    ? `
    <p style="margin:24px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">${escapeHtml(countryLabel)}</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 4px;">
      ${fieldRow("In force", `${section.inForce.display}`)}
      ${fieldRow("Supervisory authority", evidenceSummary(section.authority))}
      ${fieldRow("Registration duty", evidenceSummary(section.registration))}
      ${fieldRow("Incident-reporting duty", evidenceSummary(section.incident))}
    </table>
    <p style="margin:0 0 20px;font-size:12px;line-height:1.6;color:#79818f;">
      <a href="${section.inForce.citationUrl}" style="color:#79818f;">${escapeHtml(sourceLineText(section.inForce))}</a><br>
      <a href="${section.authority.citationUrl}" style="color:#79818f;">${escapeHtml(sourceLineText(section.authority))}</a><br>
      <a href="${section.registration.citationUrl}" style="color:#79818f;">${escapeHtml(sourceLineText(section.registration))}</a><br>
      <a href="${section.incident.citationUrl}" style="color:#79818f;">${escapeHtml(sourceLineText(section.incident))}</a>
    </p>`
    : `<p style="margin:24px 0 20px;font-size:14px;line-height:1.6;color:#79818f;">No country section is available for &ldquo;${escapeHtml(countryLabel)}.&rdquo;</p>`;

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3d4653;">
      This is not a pass or fail, and it doesn't name or favor any product.
    </p>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Your answers</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${remoteAccessRowsHtml}${countryAnswerRows}</table>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Areas worth being ready to describe</p>
    <ul style="margin:0 0 20px;padding-left:18px;">${areasHtml}</ul>
    ${countrySectionHtml}
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Related guides</p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#0d1117;">
      <a href="${SITE_URL}/guides/nis2-supply-chain-and-remote-access" style="color:#0d1117;">NIS2 supply chain and remote access, explained</a><br>
      <a href="${SITE_URL}/guides/customer-security-questionnaire" style="color:#0d1117;">Preparing to answer a customer's security questionnaire</a>
    </p>
  `;

  return {
    subject: `Your remote access report for ${countryLabel}`,
    html: emailLayout({
      heading: `Your remote access report for ${countryLabel}`,
      bodyHtml,
      ctaHref: `${SITE_URL}/checker`,
      ctaLabel: "Check your situation",
    }),
  };
}

// TRIGGER: "Email me a copy" on the /checker result (components/result-
// actions.tsx, source "checker_brief"). Recomputes the brief server-side from the
// visitor's own four answers through the exact same lib/checker-brief.ts functions
// the on-screen result uses, so this email can never drift from, or show anything
// beyond, what the page itself displays. No score, no verdict, no vendor name.
export function buildCheckerBriefEmail(answers: CheckerAnswers): { subject: string; html: string } {
  const brief = buildCheckerBrief(answers);

  const regulationsHtml = brief.regulations
    .map(
      (r) => `
    <tr><td style="padding:10px 0;border-bottom:1px solid rgba(13,17,23,0.08);">
      <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0d1117;">${escapeHtml(r.name)}: ${escapeHtml(r.applicabilityLabel)}</p>
      <p style="margin:0 0 4px;font-size:13px;color:#3d4653;">${escapeHtml(r.explanation)}</p>
      ${r.sourceLine && r.citationUrl ? `<a href="${r.citationUrl}" style="font-size:12px;color:#79818f;">${escapeHtml(r.sourceLine)}</a>` : ""}
    </td></tr>`,
    )
    .join("");

  const datesHtml = brief.dates
    .map((d) => fieldRow(d.label, d.display ? `${d.display}${d.sourceLine ? ` (${d.sourceLine})` : ""}` : d.note || ""))
    .join("");

  const countryHtml = brief.countrySection
    ? `<table style="width:100%;border-collapse:collapse;margin:0 0 4px;">
      ${fieldRow("In force since", brief.countrySection.inForce.display)}
      ${fieldRow("Supervisory authority", brief.countrySection.authority.citationLabel)}
      ${fieldRow("Registration step", brief.countrySection.registration.citationLabel)}
      ${fieldRow("Incident-reporting duty", brief.countrySection.incident.citationLabel)}
    </table>`
    : `<p style="margin:0 0 12px;font-size:14px;color:#79818f;">No country-specific section is available. Official tool(s): ${
        brief.officialTools.map((t) => `<a href="${t.url}" style="color:#79818f;">${escapeHtml(t.name)}</a>`).join(", ") ||
        "see your country's own tool"
      }.</p>`;

  const questionsHtml = brief.customerQuestions
    .map((q) => `<li style="margin:0 0 8px;font-size:14px;color:#0d1117;">${escapeHtml(q.question)}</li>`)
    .join("");

  const nextStepsHtml = brief.nextSteps
    .map((s) => `<li style="margin:0 0 8px;font-size:14px;color:#0d1117;">${escapeHtml(s.text)}</li>`)
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3d4653;">
      This is a general guide, not legal advice. It deliberately says &ldquo;generally&rdquo; because
      real exceptions exist.
    </p>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Which rules likely apply</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${regulationsHtml}</table>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Dates that matter</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${datesHtml}</table>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Your country</p>
    ${countryHtml}
    <p style="margin:20px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">${escapeHtml(brief.customerQuestionsFraming)}</p>
    <ul style="margin:0 0 20px;padding-left:18px;">${questionsHtml}</ul>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Next steps</p>
    <ol style="margin:0;padding-left:18px;">${nextStepsHtml}</ol>
  `;

  return {
    subject: "Your brief: which EU rules apply to you",
    html: emailLayout({
      heading: "Your brief: which EU rules apply to you",
      bodyHtml,
      ctaHref: `${SITE_URL}/remote-access-check`,
      ctaLabel: "Build your remote access review sheet",
    }),
  };
}

// TRIGGER: "Email me a copy" on the /remote-access-check result (components/
// result-actions.tsx, source "review_sheet"). Recomputes the review sheet server-
// side from the visitor's own answers through the exact same lib/review-sheet.ts
// functions the on-screen result uses. No score, no verdict, no vendor name; the
// vendor-demo-requirements section always renders, titled as optional unless the
// eighth, optional question's answer was "replacing or upgrading," matching the
// on-screen expanded/collapsed state exactly (lib/review-sheet.ts's
// showVendorRequirementsExpanded).
const EMAIL_SECTION_TITLES: Record<string, string> = {
  questionsToResolve: "Questions to resolve",
  controlsToVerify: "Controls to verify",
  evidenceToPrepare: "Evidence to prepare",
  packRows: "Relevant questionnaire pack rows",
  vendorRequirements: "Vendor demo requirements",
};

export function buildReviewSheetEmail(answers: RemoteAccessAnswers): { subject: string; html: string } {
  const sheet = buildReviewSheet(answers);
  const sectionHeading = (title: string) =>
    `<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">${escapeHtml(title)}</p>`;

  const renderSection = (key: string): string => {
    if (key === "questionsToResolve") {
      if (!sheet.questionsToResolve.length) return "";
      const html = sheet.questionsToResolve
        .map((t) => `<li style="margin:0 0 8px;font-size:14px;color:#0d1117;">${escapeHtml(t.text)}</li>`)
        .join("");
      return `${sectionHeading(EMAIL_SECTION_TITLES[key])}<ul style="margin:0 0 20px;padding-left:18px;">${html}</ul>`;
    }
    if (key === "controlsToVerify") {
      const html = sheet.controlsToVerify
        .map((t) => `<li style="margin:0 0 8px;font-size:14px;color:#0d1117;">${escapeHtml(t.text)}</li>`)
        .join("");
      return `${sectionHeading(EMAIL_SECTION_TITLES[key])}<ul style="margin:0 0 20px;padding-left:18px;">${html}</ul>`;
    }
    if (key === "evidenceToPrepare") {
      const html = sheet.evidenceToPrepare.map((e) => `<li style="margin:0 0 8px;font-size:14px;color:#0d1117;">${escapeHtml(e)}</li>`).join("");
      return `${sectionHeading(EMAIL_SECTION_TITLES[key])}<ul style="margin:0 0 20px;padding-left:18px;">${html}</ul>`;
    }
    if (key === "packRows") {
      const html = sheet.packRows
        .map((r) => `<li style="margin:0 0 10px;font-size:14px;color:#0d1117;"><strong>[${escapeHtml(r.category)}]</strong> ${escapeHtml(r.question)}</li>`)
        .join("");
      return `${sectionHeading(EMAIL_SECTION_TITLES[key])}<ul style="margin:0 0 20px;padding-left:18px;">${html}</ul>`;
    }
    if (key === "vendorRequirements") {
      const title = sheet.showVendorRequirementsExpanded
        ? EMAIL_SECTION_TITLES[key]
        : `${EMAIL_SECTION_TITLES[key]} (optional, pre-filled from your answers above)`;
      const html = sheet.vendorRequirements
        .map(
          (v) =>
            `<li style="margin:0 0 10px;font-size:14px;color:#0d1117;"><strong>${escapeHtml(v.topic)}</strong> (${escapeHtml(v.today)}): ${escapeHtml(v.askTheVendor)}</li>`,
        )
        .join("");
      return `${sectionHeading(title)}<ul style="margin:0 0 20px;padding-left:18px;">${html}</ul>`;
    }
    return "";
  };

  const answerRowsHtml = sheet.answerRows.map((r) => fieldRow(r.label, r.value)).join("");
  const sectionsHtml = sheet.sectionOrder.map(renderSection).join("");

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#3d4653;">
      This is not a pass or fail, and it doesn&#39;t name or favor any product.
    </p>
    ${
      sheet.reviewPromptLabel
        ? `<p style="margin:0 0 20px;font-size:14px;color:#3d4653;">What prompted this review: <strong style="color:#0d1117;">${escapeHtml(sheet.reviewPromptLabel)}</strong></p>`
        : ""
    }
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Your answers</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${answerRowsHtml}</table>
    ${sectionsHtml}
  `;

  return {
    subject: "Your remote access review sheet",
    html: emailLayout({
      heading: "Your remote access review sheet",
      bodyHtml,
      ctaHref: `${SITE_URL}/questionnaire-pack`,
      ctaLabel: "Get the full questionnaire pack",
    }),
  };
}
