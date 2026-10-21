"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { TurnstileWidget, type TurnstileWidgetHandle } from "@/components/turnstile-widget";
import { FREE_EMAIL_DOMAINS } from "@/lib/email-domains";
import { RESULTS_CONSENT_SENTENCE, RESULTS_CONSENT_CHECKBOX_LABEL } from "@/lib/consent-text";
import {
  calculateMachineBuilderRoi,
  calculatePlantOperatorRoi,
  parseMachineBuilderFields,
  parsePlantOperatorFields,
  formatEur,
  type RoiMode,
  type MachineBuilderInputs,
  type PlantOperatorInputs,
  type RoiResult,
  type RoiFieldState,
} from "@/lib/roi-calculator";

const ACCENT = "#9a3412";

type FieldState = RoiFieldState;

const MB_FIELDS: { key: keyof MachineBuilderInputs; label: string; suffix: string; optional?: boolean }[] = [
  { key: "visitsPerYear", label: "Service visits per year", suffix: "visits" },
  { key: "travelHoursPerVisit", label: "Travel hours per visit", suffix: "hours" },
  { key: "engineerCostPerHour", label: "Engineer cost per hour", suffix: "€/hour" },
  { key: "travelCostPerVisit", label: "Travel cost per visit", suffix: "€/visit" },
  { key: "remoteShareEstimate", label: "Share of visits you expect could be handled remotely (your own estimate)", suffix: "%" },
  { key: "urgentIncidentsPerYear", label: "Urgent incidents per year", suffix: "incidents" },
  { key: "hoursToRespondToday", label: "Hours to respond today", suffix: "hours" },
  { key: "hoursToRespondRemotely", label: "Hours to respond remotely", suffix: "hours" },
  { key: "customerDowntimeCostPerHour", label: "Customer downtime cost per hour", suffix: "€/hour", optional: true },
  { key: "annualSolutionCost", label: "Annual cost of a remote access solution", suffix: "€/year", optional: true },
];

const PO_FIELDS: { key: keyof PlantOperatorInputs; label: string; suffix: string; optional?: boolean }[] = [
  { key: "numVendors", label: "Number of external vendors with access", suffix: "vendors" },
  { key: "adminHoursPerMonth", label: "Admin hours per month spent managing that access", suffix: "hours/month" },
  { key: "adminCostPerHour", label: "Admin cost per hour", suffix: "€/hour" },
  { key: "emergencyIncidentsPerYear", label: "Emergency vendor-access incidents per year", suffix: "incidents" },
  { key: "hoursDelayToday", label: "Hours of delay today", suffix: "hours" },
  { key: "downtimeCostPerHour", label: "Downtime cost per hour", suffix: "€/hour", optional: true },
  { key: "adminTimeReductionEstimate", label: "Expected reduction in admin time (your own estimate)", suffix: "%" },
  { key: "annualSolutionCost", label: "Annual solution cost", suffix: "€/year", optional: true },
];

function ResultBlock({ title, result }: { title: string; result: RoiResult }) {
  return (
    <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5">
      <p className="font-semibold text-[15px] mb-3 text-[#1a1d22]">{title}</p>
      <ul className="grid gap-3 mb-4">
        {result.lines.map((l) => (
          <li key={l.label} className="border-b border-[#3f4b52]/[0.1] pb-3">
            <div className="flex flex-wrap justify-between gap-x-3">
              <span className="text-[14px] text-[#3f4b52]">{l.label}</span>
              <span className="font-semibold text-[15px] text-[#1a1d22]">{formatEur(l.amount)}</span>
            </div>
            <p className="text-[12px] text-[#6b7280] mt-1">Formula: {l.formula}</p>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-between gap-x-3 pt-2 border-t border-[#3f4b52]/[0.2]">
        <span className="font-semibold text-[15px] text-[#1a1d22]">Total estimated annual saving</span>
        <span className="font-bold text-[17px]" style={{ color: ACCENT }}>{formatEur(result.totalAnnualSavings)}</span>
      </div>
      {result.netAnnualSavings !== null && (
        <div className="flex flex-wrap justify-between gap-x-3 mt-2">
          <span className="text-[14px] text-[#3f4b52]">Net, after the solution cost you entered</span>
          <span className="font-semibold text-[15px] text-[#1a1d22]">{formatEur(result.netAnnualSavings)}</span>
        </div>
      )}
      {result.paybackMonths !== null && (
        <div className="flex flex-wrap justify-between gap-x-3 mt-2">
          <span className="text-[14px] text-[#3f4b52]">Payback period</span>
          <span className="font-semibold text-[15px] text-[#1a1d22]">{result.paybackMonths} months</span>
        </div>
      )}
      {result.contextLines.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#3f4b52]/[0.15]">
          {result.contextLines.map((l) => (
            <div key={l.label}>
              <div className="flex flex-wrap justify-between gap-x-3">
                <span className="text-[13px] text-[#3f4b52]">{l.label}</span>
                <span className="font-semibold text-[14px] text-[#3f4b52]">{formatEur(l.amount)}</span>
              </div>
              <p className="text-[12px] text-[#6b7280] mt-1">Formula: {l.formula}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface EmailFormState {
  name: string;
  company: string;
  email: string;
}
const EMPTY_EMAIL_FORM: EmailFormState = { name: "", company: "", email: "" };

function EmailResultForm({ mode, fields }: { mode: RoiMode; fields: FieldState }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EmailFormState>(EMPTY_EMAIL_FORM);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

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
          country: null,
          answers: { tool: "roi_calculator", roiMode: mode, roiInputs: fields },
          contact: { name: form.name, company: form.company, email: form.email },
          consentReviewGiven: consent,
          website,
          turnstileToken: token,
          source: "calculator",
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
      track("calculator_email_request", { mode });
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
      turnstileRef.current?.reset();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
        style={{ background: ACCENT }}
      >
        Email me this calculation
      </button>
    );
  }

  if (status === "done") {
    return (
      <div className="rounded border p-6" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="font-semibold text-[16px] mb-2 text-[#1a1d22]">Sent. Check your inbox.</p>
        {dryRun && (
          <p className="text-[13px] text-[#3f4b52]">(Preview deployment: no email was actually sent.)</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-6 max-w-[480px]">
      <p className="font-semibold text-[16px] mb-3 text-[#1a1d22]">Email me this calculation</p>
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
        {status === "submitting" ? "Sending…" : "Send it to my inbox"}
      </button>
    </div>
  );
}

export function RoiCalculator() {
  const [mode, setMode] = useState<RoiMode>("machine_builder");
  const [mbFields, setMbFields] = useState<FieldState>({});
  const [poFields, setPoFields] = useState<FieldState>({});
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  const fields = mode === "machine_builder" ? mbFields : poFields;
  const setFields = mode === "machine_builder" ? setMbFields : setPoFields;
  const activeSchema = mode === "machine_builder" ? MB_FIELDS : PO_FIELDS;

  const onFieldChange = (key: string, value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("calculator_start", {});
    }
    setFields((f) => ({ ...f, [key]: value }));
  };

  const requiredKeys = activeSchema.filter((f) => !f.optional).map((f) => f.key as string);
  const allRequiredFilled = requiredKeys.every((k) => (fields[k] ?? "").trim() !== "");

  const fullResult = useMemo(() => {
    if (!allRequiredFilled) return null;
    return mode === "machine_builder"
      ? calculateMachineBuilderRoi(parseMachineBuilderFields(mbFields), 1)
      : calculatePlantOperatorRoi(parsePlantOperatorFields(poFields), 1);
  }, [mode, mbFields, poFields, allRequiredFilled]);

  const halfResult = useMemo(() => {
    if (!allRequiredFilled) return null;
    return mode === "machine_builder"
      ? calculateMachineBuilderRoi(parseMachineBuilderFields(mbFields), 0.5)
      : calculatePlantOperatorRoi(parsePlantOperatorFields(poFields), 0.5);
  }, [mode, mbFields, poFields, allRequiredFilled]);

  useEffect(() => {
    if (fullResult && !completedRef.current) {
      completedRef.current = true;
      track("calculator_complete", { mode });
    }
  }, [fullResult, mode]);

  return (
    <div>
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setMode("machine_builder")}
          className="rounded px-5 py-[10px] font-sans font-semibold text-[14px]"
          style={{
            background: mode === "machine_builder" ? ACCENT : "transparent",
            color: mode === "machine_builder" ? "#fff" : "#3f4b52",
            border: `1px solid ${mode === "machine_builder" ? ACCENT : "rgba(63,75,82,0.3)"}`,
          }}
        >
          Machine builder
        </button>
        <button
          onClick={() => setMode("plant_operator")}
          className="rounded px-5 py-[10px] font-sans font-semibold text-[14px]"
          style={{
            background: mode === "plant_operator" ? ACCENT : "transparent",
            color: mode === "plant_operator" ? "#fff" : "#3f4b52",
            border: `1px solid ${mode === "plant_operator" ? ACCENT : "rgba(63,75,82,0.3)"}`,
          }}
        >
          Plant or factory operator
        </button>
      </div>

      <div className="rounded border border-[#3f4b52]/[0.15] bg-[#f6f5f1] p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {activeSchema.map((f) => (
            <div key={f.key as string}>
              <label className="block text-[13px] font-semibold text-[#3f4b52] mb-1">
                {f.label} {f.optional && <span className="font-normal text-[#6b7280]">(optional)</span>}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={fields[f.key as string] ?? ""}
                  onChange={(e) => onFieldChange(f.key as string, e.target.value)}
                  placeholder={f.suffix === "%" ? "e.g. 40" : "e.g. 0"}
                  className="w-full rounded border border-[#3f4b52]/[0.3] px-3 py-2 text-[14px]"
                />
                <span className="text-[12px] text-[#6b7280] whitespace-nowrap">{f.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!allRequiredFilled && (
        <p className="text-[14px] text-[#3f4b52] mb-8">
          Fill in the fields above (optional ones can stay blank) to see your estimate here. Nothing
          is sent anywhere until you choose to email it to yourself below.
        </p>
      )}

      {fullResult && halfResult && (
        <div className="grid gap-6 mb-8">
          <p className="text-[13px] leading-[1.6] text-[#6b7280]">
            These figures are an estimate calculated directly from the numbers you entered above.
            They are not a guarantee, a benchmark, or data about any other company, and this
            calculator does not store anything you type unless you choose to email it below.
          </p>
          <ResultBlock title="Your estimate" result={fullResult} />
          <ResultBlock title="Conservative check: at 50% of your own estimate above" result={halfResult} />
        </div>
      )}

      {fullResult && (
        <div className="mb-10">
          <EmailResultForm mode={mode} fields={fields} />
        </div>
      )}

      <p className="text-[13px] leading-[1.6] text-[#3f4b52]">
        No email is needed to see your estimate above. This tool doesn&apos;t name or recommend any
        specific product. If you&apos;d like to talk through your situation,{" "}
        <Link href="/checker" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          check your situation
        </Link>{" "}
        or see{" "}
        <Link href="/guides/remote-access-approaches" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          the guide to remote access approaches
        </Link>
        .
      </p>
    </div>
  );
}
