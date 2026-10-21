"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import { RESULTS_CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";

const ACCENT = "#9a3412";

interface EmailFormState {
  name: string;
  company: string;
  email: string;
}
const EMPTY_EMAIL_FORM: EmailFormState = { name: "", company: "", email: "" };

// Shared action bar for both free results (the /checker brief and the
// /remote-access-check review sheet), in the fixed order the instruction set:
// download (print, nothing leaves the browser), copy as text (client-side),
// email a copy (work email + consent, reusing the existing results-email consent
// wording), talk it through (scrolls to the existing enquiry form rendered lower
// on the same page). No personal data in any analytics event: "outcome" is a
// short category string, never an answer value.
export function ResultActions({
  tool,
  outcome,
  downloadLabel,
  getCopyText,
  emailRequestBody,
  talkExplanation,
}: {
  tool: "checker" | "remote_access_check";
  outcome: string;
  downloadLabel: string;
  getCopyText: () => string;
  emailRequestBody: { answers: Record<string, unknown>; source: string; country?: string | null };
  talkExplanation: string;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [emailOpen, setEmailOpen] = useState(false);
  const [form, setForm] = useState<EmailFormState>(EMPTY_EMAIL_FORM);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleDownload = () => {
    track("brief_download", { tool, outcome });
    window.print();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyText());
      setCopyStatus("copied");
      track("brief_copy", { tool, outcome });
      setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2500);
    }
  };

  const handleTalk = () => {
    track("talk_request", { tool, outcome });
  };

  const submitEmail = async () => {
    const email = form.email.trim().toLowerCase();
    const domain = email.split("@")[1];
    if (!email || (domain && FREE_EMAIL_DOMAINS.includes(domain))) {
      setError("Please use your work email address.");
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
          country: emailRequestBody.country ?? null,
          answers: emailRequestBody.answers,
          contact: { name: form.name, company: form.company, email: form.email },
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
          source: emailRequestBody.source,
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
      track("brief_email_request", { tool, outcome });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <div className="mt-7 pt-6 border-t border-[#3f4b52]/[0.15]">
      <div className="flex flex-wrap gap-3 justify-center mb-3">
        <button
          onClick={handleDownload}
          className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-white"
          style={{ background: ACCENT }}
        >
          {downloadLabel}
        </button>
        <button
          onClick={handleCopy}
          className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-[#1a1d22] border border-[#3f4b52]/[0.3]"
        >
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Couldn't copy, try again" : "Copy as text"}
        </button>
        {!emailOpen && status !== "done" && (
          <button
            onClick={() => setEmailOpen(true)}
            className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-[#1a1d22] border border-[#3f4b52]/[0.3]"
          >
            Email me a copy
          </button>
        )}
        <a
          href="#ot-enquiry-form"
          onClick={handleTalk}
          className="rounded px-5 py-[11px] font-sans font-semibold text-[14px] text-[#1a1d22] border border-[#3f4b52]/[0.3]"
        >
          Talk it through
        </a>
      </div>
      <p className="text-[13px] text-[#3f4b52] text-center mb-2 max-w-[480px] mx-auto">{talkExplanation}</p>

      {emailOpen && status !== "done" && (
        <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-6 max-w-[480px] mx-auto mt-4">
          <p className="text-[13px] text-[#3f4b52] mb-4">
            We will send your answers, so we can build the email, to the work email address below.
            Your details won&apos;t be shared with any other company without asking you first. See
            our <Link href="/privacy#ot-service" className="underline font-semibold">privacy policy</Link>.
          </p>
          <div className="grid gap-3 mb-4">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name"
              aria-label="Your name"
              className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
            />
            <input
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Company name"
              aria-label="Company name"
              className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
            />
            <input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Work email (required)"
              aria-label="Work email, required"
              type="email"
              className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
            />
          </div>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            name="website"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute -left-[9999px] w-0 h-0"
          />
          <label className="flex items-start gap-2 mb-4 text-[13px] text-[#3f4b52]">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-[3px]" />
            {RESULTS_CONSENT_CHECKBOX_LABEL}
          </label>
          <TurnstileWidget ref={turnstileRef} onToken={setToken} />
          {error && <p className="text-[14px] text-[#b91c1c] mb-3">{error}</p>}
          <button
            onClick={submitEmail}
            disabled={!consent || status === "submitting"}
            className="w-full text-white rounded px-6 py-[13px] font-sans font-semibold text-[15px] disabled:opacity-50"
            style={{ background: ACCENT }}
          >
            {status === "submitting" ? "Sending…" : "Send it to my inbox"}
          </button>
        </div>
      )}

      {status === "done" && (
        <div className="rounded border p-6 max-w-[480px] mx-auto mt-4 text-center" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
          <p className="font-semibold text-[16px] mb-2 text-[#1a1d22]">Sent. Check your inbox.</p>
          {dryRun && <p className="text-[13px] text-[#3f4b52]">(Preview deployment: no email was actually sent.)</p>}
        </div>
      )}
    </div>
  );
}
