"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/email-domains";
import { RESULTS_CONSENT_SENTENCE, RESULTS_CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";
import type { RemoteAccessAnswers } from "@/lib/remote-access-session";
import {
  REPORT_COUNTRIES,
  ACCESS_APPROVER_OPTIONS,
  SESSION_LOGGING_DURATION_OPTIONS,
  INCIDENT_PROCESS_OPTIONS,
  QUESTIONNAIRE_FREQUENCY_OPTIONS,
  TIMELINE_OPTIONS,
  EMPTY_COUNTRY_REPORT_ANSWERS,
  isCountryReportComplete,
  type CountryReportAnswers,
  type ReportCountry,
} from "@/lib/country-report";

const ACCENT = "#9a3412";
const selectClass = "w-full rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px] bg-white";
const labelClass = "block text-[13px] font-semibold text-[#3f4b52] mb-1";

function CountryLabel({ country }: { country: ReportCountry | null }) {
  const found = REPORT_COUNTRIES.find((c) => c.value === country);
  return <>{found ? found.label : "your country"}</>;
}

interface EmailFormState {
  name: string;
  company: string;
  email: string;
}
const EMPTY_EMAIL_FORM: EmailFormState = { name: "", company: "", email: "" };

export function CountryReportForm({ remoteAccessAnswers }: { remoteAccessAnswers: RemoteAccessAnswers }) {
  const [answers, setAnswers] = useState<CountryReportAnswers>(EMPTY_COUNTRY_REPORT_ANSWERS);
  const [emailOpen, setEmailOpen] = useState(false);
  const [form, setForm] = useState<EmailFormState>(EMPTY_EMAIL_FORM);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const set = <K extends keyof CountryReportAnswers>(key: K, value: CountryReportAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const complete = isCountryReportComplete(answers);

  const submit = async () => {
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
          country: answers.country,
          role: answers.role,
          timeline: answers.timeline,
          answers: {
            tool: "country_report",
            country: answers.country,
            role: answers.role,
            timeline: answers.timeline,
            sites: answers.numSites,
            remoteAccessAnswers,
            countryReportAnswers: answers,
          },
          contact: { name: form.name, company: form.company, email: form.email },
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
          source: "country_report",
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
      track("report_email_request", { country: answers.country ?? "unknown" });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <section className="border-t border-[#3f4b52]/[0.15] pt-8">
      <h3 className="font-sans font-semibold text-[21px] mb-2 text-[#1a1d22]">
        Get the full report for your country
      </h3>
      <p className="text-[14px] leading-[1.6] text-[#3f4b52] mb-6 max-w-[560px]">
        A few more questions, plus your country, adds a country section (supervisory authority,
        registration duty, and incident-reporting duty, each cited) to an emailed report alongside
        everything above.
      </p>

      <div className="rounded border border-[#3f4b52]/[0.15] bg-[#f6f5f1] p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Country</label>
            <select
              value={answers.country ?? ""}
              onChange={(e) => set("country", (e.target.value || null) as ReportCountry | null)}
              className={selectClass}
            >
              <option value="" disabled>
                Select a country
              </option>
              {REPORT_COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Your role</label>
            <input
              value={answers.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="e.g. Service manager"
              className={selectClass}
            />
          </div>
          <div>
            <label className={labelClass}>Sector</label>
            <input
              value={answers.sector}
              onChange={(e) => set("sector", e.target.value)}
              placeholder="e.g. Packaging machinery"
              className={selectClass}
            />
          </div>
          <div>
            <label className={labelClass}>Number of sites or machines</label>
            <input
              value={answers.numSites}
              onChange={(e) => set("numSites", e.target.value)}
              placeholder="e.g. 40 machines across 12 customers"
              className={selectClass}
            />
          </div>
          <div>
            <label className={labelClass}>Who approves remote access today</label>
            <select value={answers.accessApprover} onChange={(e) => set("accessApprover", e.target.value)} className={selectClass}>
              <option value="" disabled>Select one</option>
              {ACCESS_APPROVER_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Whether sessions are logged, and for how long</label>
            <select value={answers.sessionLoggingDuration} onChange={(e) => set("sessionLoggingDuration", e.target.value)} className={selectClass}>
              <option value="" disabled>Select one</option>
              {SESSION_LOGGING_DURATION_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Your incident process</label>
            <select value={answers.incidentProcess} onChange={(e) => set("incidentProcess", e.target.value)} className={selectClass}>
              <option value="" disabled>Select one</option>
              {INCIDENT_PROCESS_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Customer security questionnaires per year</label>
            <select value={answers.questionnairesPerYear} onChange={(e) => set("questionnairesPerYear", e.target.value)} className={selectClass}>
              <option value="" disabled>Select one</option>
              {QUESTIONNAIRE_FREQUENCY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Timeline to act</label>
            <select value={answers.timeline} onChange={(e) => set("timeline", e.target.value)} className={selectClass}>
              <option value="" disabled>Select one</option>
              {TIMELINE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!complete && (
        <p className="text-[13px] text-[#3f4b52] mb-4">
          Fill in every field above to get the full report by email.
        </p>
      )}

      {complete && !emailOpen && (
        <button
          onClick={() => setEmailOpen(true)}
          className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
          style={{ background: ACCENT }}
        >
          Email me the full report for <CountryLabel country={answers.country} />
        </button>
      )}

      {complete && emailOpen && status !== "done" && (
        <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-6 max-w-[480px]">
          <p className="text-[13px] text-[#3f4b52] mb-4">{RESULTS_CONSENT_SENTENCE}</p>
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
            onClick={submit}
            disabled={!consent || status === "submitting"}
            className="w-full text-white rounded px-6 py-[13px] font-sans font-semibold text-[15px] disabled:opacity-50"
            style={{ background: ACCENT }}
          >
            {status === "submitting" ? "Sending…" : "Send the report to my inbox"}
          </button>
        </div>
      )}

      {status === "done" && (
        <div className="rounded border p-6 max-w-[480px]" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
          <p className="font-semibold text-[16px] mb-2 text-[#1a1d22]">Sent. Check your inbox.</p>
          {dryRun && <p className="text-[13px] text-[#3f4b52]">(Preview deployment: no email was actually sent.)</p>}
        </div>
      )}
    </section>
  );
}
