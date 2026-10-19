"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import type { Nis2Country } from "@/lib/nis2-dates";
import type { Audience, Size, RemoteAccess } from "@/components/nis2-scope-checker";

const ACCENT = "#9a3412";

// CONSENT WORDING — final, per the 2026-10-19 instruction. Uses
// "Software Lantern," never the controller's personal name (that name
// stays only in the privacy policy's controller/contact sections, per the
// same instruction). "Privacy policy" links to the OT-specific section of
// the policy (app/(ot)/privacy/page.tsx's #ot-service anchor), not the
// page root, since that page also describes the unrelated legacy
// marketplace.
function ConsentText() {
  return (
    <>
      Software Lantern will use your answers to review your enquiry and may contact you about it
      by email or phone. Your details won&apos;t be shared with any other company unless we first
      ask you about that specific company and you agree. See our{" "}
      <Link href="/privacy#ot-service" className="underline font-semibold">privacy policy</Link>.
    </>
  );
}

const CONSENT_CHECKBOX_LABEL =
  "I understand Software Lantern will use my answers to review my enquiry and may contact me about it, and that my details won't be shared with any other company unless I'm first asked about that specific company and I agree.";

const ROLE_OPTIONS = ["Owner / founder", "Engineering", "IT / security", "Operations", "Other"];
const SECTOR_OPTIONS = [
  "Industrial machinery",
  "Food & beverage equipment",
  "Packaging",
  "Automotive / transport equipment",
  "Medical devices",
  "Other manufacturing",
  "Other",
];
const TIMELINE_OPTIONS = ["Already looking", "Within 6 months", "Within 12 months", "No specific timeline"];

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  sector: string;
  timeline: string;
  currentRemoteAccess: string;
  freeText: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  role: "",
  sector: "",
  timeline: "",
  currentRemoteAccess: "",
  freeText: "",
};

interface CheckerAnswers {
  country: Nis2Country | null;
  audience: Audience | null;
  size: Size | null;
  remoteAccess: RemoteAccess | null;
}

export function OtEnquiryForm({
  checkerAnswers,
  source,
}: {
  checkerAnswers?: CheckerAnswers;
  source: "checker" | "direct";
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [country, setCountry] = useState<Nis2Country | "">(checkerAnswers?.country ?? "");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const submit = async () => {
    // Work email and consent are required; validated client-side first for
    // a fast, clear message, and re-validated server-side in
    // app/api/ot-enquiries/route.ts regardless, since a client check can
    // always be bypassed by posting directly to the API.
    const email = form.email.trim().toLowerCase();
    if (!email) {
      setError("A work email address is required.");
      setStatus("error");
      return;
    }
    const domain = email.split("@")[1];
    if (domain && FREE_EMAIL_DOMAINS.includes(domain)) {
      setError("Please use your work email address, not a personal email provider.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setError("Please confirm the consent checkbox to continue.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/ot-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country || null,
          answers: checkerAnswers ?? {},
          contact: { name: form.name, company: form.company, email: form.email, phone: form.phone },
          role: form.role,
          sector: form.sector,
          builderOrOperator: checkerAnswers?.audience ?? null,
          currentRemoteAccess: form.currentRemoteAccess,
          timeline: form.timeline,
          freeText: form.freeText,
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        turnstileRef.current?.reset();
        return;
      }
      setStatus("done");
      track("enquiry_submit", { source });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (status === "done") {
    return (
      <div className="rounded border p-7 text-center" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="font-sans font-semibold text-[19px] mb-2 text-[#1a1d22]">Thanks, that&apos;s been sent.</p>
        <p className="text-[15px] text-[#3f4b52]"><ConsentText /></p>
      </div>
    );
  }

  return (
    <section id="ot-enquiry-form" className="max-w-[640px] mx-auto">
      <h3 className="font-sans font-semibold text-[22px] mb-2 text-[#1a1d22]">Tell us about your situation</h3>
      <p className="text-[14px] text-[#3f4b52] mb-5"><ConsentText /></p>

      <div className="grid gap-3 mb-4">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          required
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <input
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          placeholder="Company name"
          required
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <div>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="Work email (required)"
            type="email"
            required
            aria-required="true"
            className="w-full rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
          />
          <p className="mt-1 text-[12px] text-[#3f4b52]">
            Required. Please use your work email address, not a personal provider (e.g. Gmail).
          </p>
        </div>
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Phone number"
          required
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Your role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as Nis2Country)}
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Country</option>
          <option value="NL">Netherlands</option>
          <option value="BE">Belgium</option>
          <option value="LU">Luxembourg</option>
          <option value="other">Other</option>
        </select>
        <select
          value={form.sector}
          onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Sector</option>
          {SECTOR_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          value={form.currentRemoteAccess}
          onChange={(e) => setForm((f) => ({ ...f, currentRemoteAccess: e.target.value }))}
          placeholder="What do you use for remote access today, if anything?"
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <select
          value={form.timeline}
          onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Timeline</option>
          {TIMELINE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <textarea
          value={form.freeText}
          onChange={(e) => setForm((f) => ({ ...f, freeText: e.target.value }))}
          placeholder="Anything else you'd like to add"
          rows={3}
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
      </div>

      {/* Honeypot, hidden from real visitors, must stay empty */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] w-0 h-0"
      />

      <label className="flex items-start gap-2 mb-4 text-[14px] text-[#3f4b52]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          aria-required="true"
          className="mt-[3px]"
        />
        {CONSENT_CHECKBOX_LABEL}
      </label>

      <TurnstileWidget ref={turnstileRef} onToken={setToken} />

      {error && <p className="text-[14px] text-[#b91c1c] mb-3">{error}</p>}

      <button
        onClick={submit}
        disabled={!consent || status === "submitting"}
        className="w-full text-white rounded px-6 py-[13px] font-sans font-semibold text-[15px] disabled:opacity-50"
        style={{ background: ACCENT }}
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </section>
  );
}
