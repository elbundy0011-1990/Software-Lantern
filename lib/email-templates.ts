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

// TRIGGER 1: new lead submitted, sent only to ADMIN_EMAIL. Full detail is
// fine here since only the admin ever receives this one.
export function buildNewLeadAdminEmail(input: {
  leadId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  category: string | null;
  softwareNeed: string;
  currentVendor: string | null;
  timeline: string | null;
}): { subject: string; html: string } {
  const rows = [
    fieldRow("Company", input.companyName),
    fieldRow("Contact", input.contactName),
    fieldRow("Email", input.contactEmail),
    fieldRow("Category", input.category || "Not specified"),
  ];
  if (input.currentVendor) rows.push(fieldRow("Current vendor", input.currentVendor));
  if (input.timeline) rows.push(fieldRow("Timeline", input.timeline));

  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows.join("")}</table>
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Requirement summary</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3d4653;">${escapeHtml(input.softwareNeed || "No summary provided.")}</p>
  `;

  return {
    subject: `New lead: ${input.companyName} (${input.category || "uncategorized"})`,
    html: emailLayout({
      heading: "A new lead was submitted",
      bodyHtml,
      ctaHref: `${SITE_URL}/admin/leads/${input.leadId}`,
      ctaLabel: "Review this lead",
    }),
  };
}

// TRIGGER 3: a new partner signed up, sent only to ADMIN_EMAIL. New
// partners land in 'pending', so this is what closes the loop, an
// unreviewed application otherwise just sits silently in /admin/partners.
export function buildNewPartnerAdminEmail(input: {
  partnerId: string;
  companyName: string;
  contactEmail: string;
  categories: string[];
}): { subject: string; html: string } {
  const rows = [
    fieldRow("Company", input.companyName),
    fieldRow("Contact email", input.contactEmail),
    fieldRow("Categories", input.categories.length > 0 ? input.categories.join(", ") : "None selected"),
  ];

  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows.join("")}</table>
    <p style="margin:0;font-size:15px;line-height:1.6;color:#3d4653;">This application is pending review and won't see any leads or be able to unlock any until approved.</p>
  `;

  return {
    subject: `New provider application: ${input.companyName}`,
    html: emailLayout({
      heading: "A new provider applied",
      bodyHtml,
      ctaHref: `${SITE_URL}/admin/partners/${input.partnerId}`,
      ctaLabel: "Review this application",
    }),
  };
}

// TRIGGER 2: a lead was just published, sent individually to every matching,
// non-excluded partner. Content is deliberately narrower than everything
// get_partner_leads() exposes pre-unlock: category, timeline, one
// category-specific classification field (see
// partnerNotificationClassification() in lib/finder-config.ts), and a
// general summary only. No company name, contact details, current vendor,
// budget, or the raw answers blob, since this is the same paywalled data
// the portal gates behind payment, sent to an inbox instead of a page it's
// easier to reason about as private. current_vendor specifically stays out
// on purpose — that's the field the exclusion feature protects.
export function buildLeadPublishedPartnerEmail(input: {
  category: string | null;
  softwareNeed: string;
  timeline: string | null;
  classification: { label: string; value: string } | null;
}): { subject: string; html: string } {
  const categoryLabel = input.category || "your category";
  const rows: string[] = [];
  if (input.classification) rows.push(fieldRow(input.classification.label, input.classification.value));
  if (input.timeline) rows.push(fieldRow("Timeline", input.timeline));

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3d4653;">
      A new brief was just published in <strong>${escapeHtml(categoryLabel)}</strong>.
    </p>
    ${rows.length ? `<table style="width:100%;border-collapse:collapse;margin:0 0 20px;">${rows.join("")}</table>` : ""}
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#79818f;">Requirement summary</p>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#0d1117;background:#f6f7fb;border-radius:12px;padding:16px;">
      ${escapeHtml(input.softwareNeed || "See your portal for details.")}
    </p>
    <p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:#79818f;">
      Company and contact details unlock after purchase, same as every brief in your portal.
    </p>
  `;
  return {
    subject: `New ${categoryLabel} brief published`,
    html: emailLayout({
      heading: "A new brief matches your category",
      bodyHtml,
      ctaHref: `${SITE_URL}/portal`,
      ctaLabel: "View in your portal",
    }),
  };
}

// TRIGGER: a new OT cybersecurity / NIS2 enquiry was submitted, sent only
// to ADMIN_EMAIL. Deliberately mirrors buildNewLeadAdminEmail's shape but
// points at /admin/ot-enquiries, never at /admin/leads — this data lives
// in its own table (public.ot_enquiries) and this is the only email this
// system ever sends about it; there is no partner-notification equivalent
// for this category, by design (see supabase/ot-cyber-schema.sql).
export function buildNewOtEnquiryAdminEmail(input: {
  enquiryId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  country: string | null;
}): { subject: string; html: string } {
  const rows = [
    fieldRow("Company", input.companyName),
    fieldRow("Contact", input.contactName),
    fieldRow("Email", input.contactEmail),
    fieldRow("Country", input.country || "Not specified"),
  ];

  const bodyHtml = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows.join("")}</table>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#79818f;">
      This person has only agreed that you may review their answers. Nothing is shared with any
      other company unless you ask them separately and they say yes to that specific ask.
    </p>
  `;

  return {
    subject: `New OT cybersecurity enquiry: ${input.companyName}`,
    html: emailLayout({
      heading: "A new OT cybersecurity enquiry was submitted",
      bodyHtml,
      ctaHref: `${SITE_URL}/admin/ot-enquiries/${input.enquiryId}`,
      ctaLabel: "Review this enquiry",
    }),
  };
}

// TRIGGER: confirmation sent to the person who submitted an OT enquiry,
// production only, after the row is already stored (app/api/ot-enquiries/
// route.ts) — if this fails, the enquiry is still saved and the admin
// notification above still fires regardless, since the two are
// independent, separately-caught steps there, not sequential dependencies.
// Deliberately plain, not emailLayout's branded card: no heading
// treatment, no styled button, no product claims, no vendor names, one
// factual link. The wording itself is fixed by instruction, not
// paraphrased here, so it can't drift from what was actually approved.
export function buildOtEnquiryConfirmationEmail(): { subject: string; html: string } {
  const privacyUrl = `${SITE_URL}/privacy#ot-service`;
  return {
    subject: "We received your enquiry",
    html: `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px;font-size:15px;line-height:1.6;color:#0d1117;">
      <p style="margin:0 0 16px;">Thanks for your enquiry. Software Lantern will review it and may contact you by email.</p>
      <p style="margin:0 0 16px;">Your details won&#39;t be shared with any other company unless we first ask you about that specific company and you agree.</p>
      <p style="margin:0 0 16px;">Privacy policy: <a href="${privacyUrl}" style="color:#0d1117;">${privacyUrl}</a></p>
      <p style="margin:0;">If you&#39;d like your details deleted, reply to this email.</p>
    </div>
  </body>
</html>`,
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
