"use client";

import { useRef, useState } from "react";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import type { Nis2Country } from "@/lib/nis2-dates";

const ACCENT = "#0f766e";

// CONSENT WORDING — per the owner's exact text, still pending explicit
// final approval (the "pending approval" badge below stays up until
// that's given). "[Owner name]" is a deliberate literal placeholder, not a
// bug: no brand/owner name has been approved for this product yet (see
// docs/OT-CYBER-PLAN.md §7.2), so this renders exactly as written rather
// than guessing a name. The privacy-policy link below is plain text, not
// a hyperlink, because no privacy policy page exists for this product yet
// (§6.4/§7.8) — linking to the unrelated marketplace policy at /privacy
// would misdescribe this product's actual data handling, and a link to a
// page that doesn't exist would 404.
const CONSENT_INTRO =
  "[Owner name] will use your answers to review your enquiry and may contact you about it by email or phone. Your details won't be shared with any other company unless we first ask you about that specific company and you agree. See our privacy policy.";
const CONSENT_CHECKBOX_LABEL =
  "I understand [Owner name] will use my answers to review my enquiry and may contact me about it, and that my details won't be shared with any other company unless I'm first asked about that specific company and I agree.";

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export function OtEnquiryForm({ country, answers }: { country: Nis2Country | null; answers: Record<string, unknown> }) {
  const [form, setForm] = useState<FormState>({ name: "", company: "", email: "", phone: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const submit = async () => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/ot-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          answers,
          contact: form,
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
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border p-7 text-center" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="font-sans font-semibold text-[19px] mb-2">Thanks, that&apos;s been sent.</p>
        <p className="text-[15px] text-[#5c6573]">
          [Owner name] will use your answers to review your enquiry and may contact you about it by
          email or phone. Your details won&apos;t be shared with any other company unless we first
          ask you about that specific company and you agree.
        </p>
      </div>
    );
  }

  return (
    <section id="ot-enquiry-form" className="max-w-[640px] mx-auto">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em]" style={{ background: "#fef3c7", color: "#92400e" }}>
        Draft wording below, pending approval
      </div>
      <h3 className="font-sans font-semibold text-[22px] mb-2">Tell us about your situation</h3>
      <p className="text-[14px] text-[#5c6573] mb-5">{CONSENT_INTRO}</p>

      <div className="grid gap-3 mb-4">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          className="rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px]"
        />
        <input
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          placeholder="Company name"
          className="rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px]"
        />
        <input
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Work email"
          type="email"
          className="rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px]"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          placeholder="Phone number"
          className="rounded-lg border border-[#0d1117]/[0.14] px-3 py-2 text-[14px]"
        />
      </div>

      {/* Honeypot — hidden from real visitors, must stay empty */}
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -left-[9999px] w-0 h-0"
      />

      <label className="flex items-start gap-2 mb-4 text-[14px] text-[#3d4653]">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-[3px]" />
        {CONSENT_CHECKBOX_LABEL}
      </label>

      <TurnstileWidget ref={turnstileRef} onToken={setToken} />

      {error && <p className="text-[14px] text-[#b91c1c] mb-3">{error}</p>}

      <button
        onClick={submit}
        disabled={!consent || status === "submitting"}
        className="w-full text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] disabled:opacity-50"
        style={{ background: ACCENT }}
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
    </section>
  );
}
