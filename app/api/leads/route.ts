import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import { verifyTurnstile } from "@/lib/turnstile";

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
  if (FREE_EMAIL_DOMAINS.indexOf(domain) > -1) {
    return NextResponse.json({ error: "Please use a work email address." }, { status: 400 });
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
  const { error } = await supabase.from("leads").insert({
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
  });

  if (error) {
    return NextResponse.json({ error: "Could not save your submission." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
