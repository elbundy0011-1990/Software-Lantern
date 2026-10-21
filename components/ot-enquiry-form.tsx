"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/finder-config";
import { CONSENT_SENTENCE, CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";
import {
  EMPTY_CHECKER_ANSWERS,
  hasAnyCheckerAnswer,
  getCheckerAnswersSnapshot,
  getCheckerAnswersServerSnapshot,
  subscribeCheckerAnswers,
  type CheckerAnswers,
} from "@/lib/checker-session";
import {
  EMPTY_REMOTE_ACCESS_ANSWERS,
  hasAnyRemoteAccessAnswer,
  getRemoteAccessAnswersSnapshot,
  getRemoteAccessAnswersServerSnapshot,
  subscribeRemoteAccessAnswers,
  describeRemoteAccessAnswers,
  type RemoteAccessAnswers,
} from "@/lib/remote-access-session";
import { describeCheckerAnswers } from "@/components/nis2-scope-checker";

const ACCENT = "#9a3412";

// CONSENT WORDING — final, per the 2026-10-19 instruction, shared with
// the result-screen CTA blocks (components/nis2-scope-checker.tsx) and
// the confirmation email (lib/email-templates.ts) via lib/consent-text.ts
// so it can't drift between the three. "Privacy policy" links to the
// OT-specific section of the policy (app/(ot)/privacy/page.tsx's
// #ot-service anchor), not the page root, since that page also describes
// the unrelated legacy marketplace.
function ConsentText() {
  return (
    <>
      {CONSENT_SENTENCE} See our{" "}
      <Link href="/privacy#ot-service" className="underline font-semibold">privacy policy</Link>.
    </>
  );
}

const ROLE_OPTIONS = ["Owner / founder", "Engineering", "IT / security", "Operations", "Other"];

interface FormState {
  name: string;
  company: string;
  email: string;
  role: string;
  remoteAccessToday: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  email: "",
  role: "",
  remoteAccessToday: "",
};

export function OtEnquiryForm({
  checkerAnswers,
  remoteAccessAnswers,
  showCheckerNudge = true,
}: {
  // Live answers from the NIS2 checker on the same page (components/ot-
  // cyber-interactive.tsx). When omitted (opening /enquiry directly), the
  // form falls back to whatever's in sessionStorage from an earlier
  // checker session, per lib/checker-session.ts.
  checkerAnswers?: CheckerAnswers;
  // Same idea, for the remote-access situation check (components/remote-
  // access-check-interactive.tsx) via lib/remote-access-session.ts — a
  // second, independent store so the two tools never need to agree on
  // one answer shape.
  remoteAccessAnswers?: RemoteAccessAnswers;
  // The "check your situation first" nudge only makes sense when this
  // form isn't already sitting right below a tool on the same page.
  showCheckerNudge?: boolean;
}) {
  const storedAnswers = useSyncExternalStore(
    subscribeCheckerAnswers,
    getCheckerAnswersSnapshot,
    getCheckerAnswersServerSnapshot,
  );
  const storedRemoteAccessAnswers = useSyncExternalStore(
    subscribeRemoteAccessAnswers,
    getRemoteAccessAnswersSnapshot,
    getRemoteAccessAnswersServerSnapshot,
  );
  const effectiveAnswers = checkerAnswers ?? storedAnswers ?? EMPTY_CHECKER_ANSWERS;
  const effectiveRemoteAccessAnswers = remoteAccessAnswers ?? storedRemoteAccessAnswers ?? EMPTY_REMOTE_ACCESS_ANSWERS;
  const hasCheckerAnswer = hasAnyCheckerAnswer(effectiveAnswers);
  const hasRemoteAccessAnswer = hasAnyRemoteAccessAnswer(effectiveRemoteAccessAnswers);
  const sourceIsChecker = hasCheckerAnswer || hasRemoteAccessAnswer;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);
  const startedRef = useRef(false);

  // Fires once, on the first real interaction with the form (not on
  // mount — on /checker this component renders before anyone has
  // answered the checker, which would otherwise always log "direct").
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("enquiry_start", { source: sourceIsChecker ? "checker" : "direct" });
  };

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
          country: effectiveAnswers.country || null,
          answers: hasRemoteAccessAnswer
            ? { ...effectiveAnswers, remoteAccessCheck: effectiveRemoteAccessAnswers }
            : effectiveAnswers,
          contact: { name: form.name, company: form.company, email: form.email },
          role: form.role,
          builderOrOperator: effectiveAnswers.audience ?? null,
          currentRemoteAccess: form.remoteAccessToday,
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
      track("enquiry_submit", { source: sourceIsChecker ? "checker" : "direct" });
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
      {sourceIsChecker ? (
        <div className="rounded border border-[#3f4b52]/[0.2] bg-[#f6f5f1] p-4 mb-5">
          <p className="text-[12px] font-bold tracking-[0.07em] uppercase text-[#3f4b52] mb-1">Your result</p>
          {hasCheckerAnswer && <p className="text-[14px] text-[#1a1d22]">{describeCheckerAnswers(effectiveAnswers)}</p>}
          {hasRemoteAccessAnswer && (
            <p className="text-[14px] text-[#1a1d22]">{describeRemoteAccessAnswers(effectiveRemoteAccessAnswers)}</p>
          )}
        </div>
      ) : (
        showCheckerNudge && (
          <p className="text-[14px] text-[#3f4b52] mb-5">
            Not sure where you stand?{" "}
            <Link href="/checker" className="underline font-semibold" style={{ color: ACCENT }}>
              Check your situation first (2 minutes)
            </Link>
            .
          </p>
        )
      )}

      {sourceIsChecker && (
        <p className="text-[15px] font-semibold text-[#1a1d22] mb-2">
          A short conversation about your result. We will contact you by email to arrange it.
        </p>
      )}
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
          aria-label="Your role"
          className="rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] text-[#1a1d22]"
        >
          <option value="">Your role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          value={form.remoteAccessToday}
          onChange={(e) => setForm((f) => ({ ...f, remoteAccessToday: e.target.value }))}
          onFocus={markStarted}
          placeholder="What does remote access to your machines look like today? (optional)"
          aria-label="What does remote access to your machines look like today? Optional."
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
