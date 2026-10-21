import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail } from "@/lib/resend";
import {
  buildNewOtEnquiryAdminEmail,
  buildRoiCalculatorEmail,
  buildCountryReportEmail,
  buildCheckerBriefEmail,
  buildReviewSheetEmail,
} from "@/lib/email-templates";
import type { RoiMode, RoiFieldState } from "@/lib/roi-calculator";
import type { ReportCountry, CountryReportAnswers } from "@/lib/country-report";
import type { RemoteAccessAnswers } from "@/lib/remote-access-session";
import type { CheckerAnswers } from "@/lib/checker-session";
import { isProductionDeploy } from "@/lib/environment";
import { FREE_EMAIL_DOMAINS } from "@/lib/email-domains";
import { issueDownloadToken } from "@/lib/download-token";

interface OtEnquirySubmission {
  country: string | null;
  answers: Record<string, unknown>;
  contact: { name?: string; company?: string; email?: string };
  role?: string;
  timeline?: string;
  builderOrOperator?: string | null;
  currentRemoteAccess?: string;
  consentReviewGiven: boolean;
  website?: string; // honeypot — must arrive empty
  turnstileToken?: string;
  // "pack": the questionnaire-pack request form (components/
  // questionnaire-pack-form.tsx) — no checker involved, stored in the
  // existing answers jsonb rather than a new column, and the only
  // source that gets a signed download token back.
  // "calculator": the ROI calculator's "email me this calculation" —
  // sends buildRoiCalculatorEmail(), recomputed server-side from answers.roiMode/roiInputs rather
  // than trusting a client-submitted total.
  // "checklist": the vendor-demo comparison checklist request form —
  // same shape as "pack" (download token, no email attachment), just a
  // different private file and route (app/api/ot-enquiries/checklist).
  // "country_report": the remote-access-check country report's "email
  // me the full report" — sends buildCountryReportEmail(), recomputed
  // server-side from answers.remoteAccessAnswers/countryReportAnswers.
  // "checker_brief": "Email me a copy" on the /checker result (components/
  // result-actions.tsx) — sends buildCheckerBriefEmail(), recomputed
  // server-side from answers.checkerAnswers, never trusting a client-
  // rendered copy of the brief.
  // "review_sheet": "Email me a copy" on the /remote-access-check result
  // — sends buildReviewSheetEmail(), recomputed server-side from
  // answers.remoteAccessAnswers, same reasoning.
  // "whitepaper": the regional report's "Get the full PDF" form (components/
  // whitepaper-form.tsx) — same download-token pattern as "pack"/"checklist"
  // (a signed, expiring claim, not an email attachment), serving the PDF from
  // private/reports/ via app/api/ot-enquiries/whitepaper/route.ts.
  source?: "checker" | "direct" | "pack" | "calculator" | "checklist" | "country_report" | "checker_brief" | "review_sheet" | "whitepaper";
}

export async function POST(request: Request) {
  let body: OtEnquirySubmission;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field in.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const turnstileResult = await verifyTurnstile(body.turnstileToken, request);
  if (!turnstileResult.success) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 400 });
  }

  const contact = body.contact || {};
  const name = (contact.name || "").trim();
  const company = (contact.company || "").trim();
  const email = (contact.email || "").trim().toLowerCase();

  if (!name || !company) {
    return NextResponse.json({ error: "Name and company are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  // Work emails only, using the shared list in lib/email-domains.ts.
  const domain = email.split("@")[1];
  if (FREE_EMAIL_DOMAINS.includes(domain)) {
    return NextResponse.json({ error: "Please use your work email address." }, { status: 400 });
  }
  if (!body.consentReviewGiven) {
    return NextResponse.json(
      { error: "Please confirm you've read how your details will be used." },
      { status: 400 },
    );
  }

  // PREVIEW SAFETY: preview deployments (and local dev) share the same
  // production Supabase/Resend credentials as the live site, per
  // docs/OT-CYBER-PLAN.md §6.5. Everything above still runs for real on a
  // preview — bot verification, field validation, the work-email check,
  // the consent gate — only the two steps that would touch real
  // production state (writing a row, sending an email) are skipped
  // outside an actual production deploy. The caller gets the identical
  // success response either way.
  // The questionnaire pack and the vendor-demo checklist are both gated
  // by this same form shape, but aren't sent by email (per instruction)
  // — they're downloaded via a short-lived signed token instead, issued
  // here regardless of dry-run, since the token itself is just a
  // stateless claim ("this request just passed validation"), not a
  // database row, and the file it unlocks isn't sensitive — it's the
  // same file served to anyone who completes the form.
  const downloadToken =
    body.source === "pack" || body.source === "checklist" || body.source === "whitepaper" ? issueDownloadToken() : undefined;

  if (!isProductionDeploy()) {
    return NextResponse.json({ ok: true, dryRun: true, ...(downloadToken ? { downloadToken } : {}) });
  }

  const answers =
    body.source === "pack" ? { ...(body.answers || {}), source: "pack" } : body.answers || {};

  const supabase = createAdminClient();
  const { data: inserted, error } = await supabase
    .from("ot_enquiries")
    .insert({
      status: "new",
      country: body.country || null,
      company_name: company,
      contact_name: name,
      contact_email: email,
      answers,
      role: body.role || null,
      timeline: body.timeline || null,
      builder_or_operator: body.builderOrOperator || null,
      current_remote_access: body.currentRemoteAccess || null,
      consent_review_given: true,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

  // Admin notification: ADMIN_EMAIL only, never any other address. The
  // row is already committed above, so a failed send can't undo that.
  if (process.env.ADMIN_EMAIL) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const enquiryId = inserted.id;
    after(async () => {
      try {
        const { subject, html } = buildNewOtEnquiryAdminEmail({
          enquiryId,
          companyName: company,
          contactName: name,
          contactEmail: email,
          country: body.country || null,
        });
        await sendEmail({ to: adminEmail, subject, html });
      } catch (err) {
        console.error("Failed to send new-OT-enquiry admin notification", err);
      }
    });
  }

  // An email to the submitter goes out only when they explicitly asked for
  // one: "email me this calculation", "email me the full report", or
  // "email me a copy" of a brief or review sheet. A plain enquiry, and the
  // pack/checklist/whitepaper requests (delivered on screen via the
  // download token), get no email; the on-screen thank-you is the
  // acknowledgement. Independent try/catch, same as the admin email.
  const requested = buildRequestedVisitorEmail(body);
  if (requested) {
    after(async () => {
      try {
        await sendEmail({ to: email, ...requested() });
      } catch (err) {
        console.error("Failed to send requested OT email", err);
      }
    });
  }

  return NextResponse.json({ ok: true, ...(downloadToken ? { downloadToken } : {}) });
}

// Returns a builder for the email the visitor explicitly requested, or null
// when the submission didn't ask for one. Every email is recomputed
// server-side from the submitted answers, never from client-rendered output.
function buildRequestedVisitorEmail(body: OtEnquirySubmission): (() => { subject: string; html: string }) | null {
  const answers = body.answers || {};
  if (body.source === "calculator" && answers.roiMode && answers.roiInputs) {
    return () => buildRoiCalculatorEmail(answers.roiMode as RoiMode, answers.roiInputs as RoiFieldState);
  }
  if (body.source === "country_report" && answers.countryReportAnswers && (answers.countryReportAnswers as CountryReportAnswers).country) {
    const countryAnswers = answers.countryReportAnswers as CountryReportAnswers;
    return () =>
      buildCountryReportEmail(
        countryAnswers.country as ReportCountry,
        (answers.remoteAccessAnswers as RemoteAccessAnswers) ?? null,
        countryAnswers,
      );
  }
  if (body.source === "checker_brief" && answers.checkerAnswers) {
    return () => buildCheckerBriefEmail(answers.checkerAnswers as CheckerAnswers);
  }
  if (body.source === "review_sheet" && answers.remoteAccessAnswers) {
    return () => buildReviewSheetEmail(answers.remoteAccessAnswers as RemoteAccessAnswers);
  }
  return null;
}
