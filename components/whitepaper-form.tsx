"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/email-domains";
import { PACK_CONSENT_SENTENCE, PACK_CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";

const ACCENT = "#9a3412";

const ROLE_OPTIONS = ["Owner / founder", "Engineering", "IT / security", "Operations", "Other"];
const TIMING_OPTIONS = ["Just researching", "Within 6 months", "Within 3 months"];

function ConsentText() {
  return (
    <>
      {PACK_CONSENT_SENTENCE.replace(" See our privacy policy.", "")} See our{" "}
      <Link href="/privacy#ot-service" className="underline font-semibold">privacy policy</Link>.
    </>
  );
}

interface FormState {
  name: string;
  company: string;
  email: string;
  role: string;
  timing: string;
}

const EMPTY_FORM: FormState = { name: "", company: "", email: "", role: "", timing: "" };

// Same free-file-download shape as components/questionnaire-pack-form.tsx (work
// email, Turnstile, honeypot, a short-lived signed download link, dry-run outside
// production), plus two optional fields (role, project timing) this form alone
// asks for, since the brief calls for them specifically on the regional report.
export function WhitepaperForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const startedRef = useRef(false);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("enquiry_start", { source: "whitepaper" });
  };

  const submit = async () => {
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
    if (!form.name.trim() || !form.company.trim()) {
      setError("Please add your name and company.");
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
          country: null,
          answers: { tool: "whitepaper", role: form.role || null, timing: form.timing || null },
          contact: { name: form.name, company: form.company, email: form.email },
          role: form.role || undefined,
          timeline: form.timing || undefined,
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
          source: "whitepaper",
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
      setDryRun(Boolean(data.dryRun));
      if (data.downloadToken) {
        setDownloadUrl(`/api/ot-enquiries/whitepaper?token=${encodeURIComponent(data.downloadToken)}`);
      }
      track("whitepaper_download_request", {});
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (status === "done") {
    return (
      <div className="rounded border p-7 text-center" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="font-sans font-semibold text-[19px] mb-2 text-[#1a1d22]">Your report is ready.</p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-block mb-4 rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
            style={{ background: ACCENT }}
          >
            Download the PDF
          </a>
        )}
        {dryRun && (
          <p className="text-[13px] text-[#3f4b52] mb-2">
            (Preview deployment: no submission was stored and no email was sent, but the download
            above is real.)
          </p>
        )}
        <p className="text-[14px] text-[#3f4b52] mb-6"><ConsentText /></p>
        <div className="border-t border-[#3f4b52]/[0.15] pt-5">
          <p className="text-[13px] font-semibold text-[#1a1d22] mb-3">While you have it open:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/vendor-checklist" className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-[#1a1d22] border border-[#3f4b52]/[0.3]">
              Get the pre-filled vendor checklist
            </Link>
            <Link href="/remote-access-check" className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-[#1a1d22] border border-[#3f4b52]/[0.3]">
              Build your review sheet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="whitepaper-form" className="max-w-[560px] mx-auto">
      <h3 className="font-sans font-semibold text-[22px] mb-2 text-[#1a1d22]">Get the full PDF</h3>
      <p className="text-[14px] text-[#3f4b52] mb-5"><ConsentText /></p>

      <div className="grid gap-3 mb-4">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          onFocus={markStarted}
          placeholder="Your name"
          aria-label="Your name"
          required
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <input
          value={form.company}
          onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          onFocus={markStarted}
          placeholder="Company name"
          aria-label="Company name"
          required
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
        />
        <div>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onFocus={markStarted}
            placeholder="Work email (required)"
            aria-label="Work email, required"
            type="email"
            required
            aria-required="true"
            className="w-full rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
          />
          <p className="mt-1 text-[12px] text-[#3f4b52]">
            Required. Please use your work email address, not a personal provider (e.g. Gmail).
          </p>
        </div>
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          onFocus={markStarted}
          aria-label="Your role, optional"
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Your role (optional)</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={form.timing}
          onChange={(e) => setForm((f) => ({ ...f, timing: e.target.value }))}
          onFocus={markStarted}
          aria-label="Project timing, optional"
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Project timing (optional)</option>
          {TIMING_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
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
        {PACK_CONSENT_CHECKBOX_LABEL}
      </label>

      <TurnstileWidget ref={turnstileRef} onToken={setToken} />

      {error && <p className="text-[14px] text-[#b91c1c] mb-3">{error}</p>}

      <button
        onClick={submit}
        disabled={!consent || status === "submitting"}
        className="w-full text-white rounded px-6 py-[13px] font-sans font-semibold text-[15px] disabled:opacity-50"
        style={{ background: ACCENT }}
      >
        {status === "submitting" ? "Sending…" : "Get the PDF"}
      </button>
    </section>
  );
}
