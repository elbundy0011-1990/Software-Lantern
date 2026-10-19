import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail } from "@/lib/resend";
import { buildNewOtEnquiryAdminEmail } from "@/lib/email-templates";
import { isProductionDeploy } from "@/lib/environment";

interface OtEnquirySubmission {
  country: string | null;
  answers: Record<string, string | string[]>;
  contact: { name?: string; company?: string; email?: string; phone?: string };
  consentReviewGiven: boolean;
  website?: string; // honeypot — must arrive empty
  turnstileToken?: string;
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
  const phoneDigits = (contact.phone || "").replace(/[^0-9]/g, "");

  if (!name || !company) {
    return NextResponse.json({ error: "Name and company are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (phoneDigits.length < 7) {
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
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
  // preview — bot verification, field validation, the consent gate — only
  // the two steps that would touch real production state (writing a row,
  // sending an email) are skipped outside an actual production deploy. The
  // caller gets the identical success response either way, so this is
  // invisible to anyone testing the form.
  if (!isProductionDeploy()) {
    return NextResponse.json({ ok: true, dryRun: true });
  }

  const supabase = createAdminClient();
  const { data: inserted, error } = await supabase
    .from("ot_enquiries")
    .insert({
      status: "new",
      country: body.country || null,
      company_name: company,
      contact_name: name,
      contact_email: email,
      contact_phone: contact.phone || null,
      answers: body.answers || {},
      consent_review_given: true,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

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

  return NextResponse.json({ ok: true });
}
