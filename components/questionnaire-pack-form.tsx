"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import { PACK_CONSENT_SENTENCE, PACK_CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";

const ACCENT = "#9a3412";

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
}

const EMPTY_FORM: FormState = { name: "", company: "", email: "" };

export function QuestionnairePackForm() {
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
    track("enquiry_start", { source: "pack" });
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
          answers: {},
          contact: { name: form.name, company: form.company, email: form.email },
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
          source: "pack",
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
        setDownloadUrl(`/api/ot-enquiries/questionnaire-pack?token=${encodeURIComponent(data.downloadToken)}`);
      }
      track("enquiry_submit", { source: "pack" });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (status === "done") {
    return (
      <div className="rounded border p-7 text-center" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="font-sans font-semibold text-[19px] mb-2 text-[#1a1d22]">Your file is ready.</p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="inline-block mb-4 rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
            style={{ background: ACCENT }}
          >
            Download the questionnaire pack
          </a>
        )}
        {dryRun && (
          <p className="text-[13px] text-[#3f4b52] mb-2">
            (Preview deployment: no submission was stored and no email was sent, but the download
            above is real.)
          </p>
        )}
        <p className="text-[14px] text-[#3f4b52]"><ConsentText /></p>
      </div>
    );
  }

  return (
    <section id="questionnaire-pack-form" className="max-w-[560px] mx-auto">
      <h3 className="font-sans font-semibold text-[22px] mb-2 text-[#1a1d22]">Get the questionnaire pack</h3>
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
        {status === "submitting" ? "Sending…" : "Get the file"}
      </button>
    </section>
  );
}
