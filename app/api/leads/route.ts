import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendEmail } from "@/lib/resend";
import { buildNewLeadAdminEmail } from "@/lib/email-templates";

interface LeadSubmission {
  category: string | null;
  answers: Record<string, string | string[]>;
  contact: { name?: string; company?: string; email?: string; phone?: string };
  website?: string; // honeypot — must arrive empty
  turnstileToken?: string;
}

export async function POST(request: Request) {
  let body: LeadSubmission;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field in.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
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
    return NextResponse.json({ error: "A valid work email is required." }, { status: 400 });
  }
  const domain = email.split("@")[1];
  if (FREE_EMAIL_DOMAINS.includes(domain)) {
    return NextResponse.json(
      { error: "Please use your work email address. We use it to connect your brief to the right providers." },
      { status: 400 },
    );
  }
  if (phoneDigits.length < 7) {
    return NextResponse.json({ error: "A valid phone number is required." }, { status: 400 });
  }

  const answers = body.answers || {};
  const softwareNeed =
    (typeof answers.missing === "string" && answers.missing) ||
    (typeof answers.industry !== "undefined" ? String(answers.industry) : "") ||
    "";
  const currentVendor =
    answers.usingSoftware === "Yes" && typeof answers.vendor === "string" ? answers.vendor : null;
  const timeline = typeof answers.timing === "string" ? answers.timing : null;

  const supabase = await createClient();
  const { data: inserted, error } = await supabase
    .from("leads")
    .insert({
      status: "new",
      company_name: company,
      contact_name: name,
      contact_email: email,
      contact_phone: contact.phone || null,
      category: body.category || null,
      software_need: softwareNeed || null,
      current_vendor: currentVendor,
      timeline,
      answers,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

  // Scheduled via after() so a slow or down Resend never adds latency to
  // (or fails) a lead submission that already succeeded — sendEmail itself
  // never throws, but this stays best-effort regardless.
  if (process.env.ADMIN_EMAIL) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const leadId = inserted.id;
    after(async () => {
      try {
        const { subject, html } = buildNewLeadAdminEmail({
          leadId,
          companyName: company,
          contactName: name,
          contactEmail: email,
          category: body.category || null,
          softwareNeed: softwareNeed || "",
          currentVendor,
          timeline,
        });
        await sendEmail({ to: adminEmail, subject, html });
      } catch (err) {
        console.error("Failed to send new-lead admin notification", err);
      }
    });
  }

  return NextResponse.json({ ok: true });
}
