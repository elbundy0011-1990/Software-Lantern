"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  getSteps,
  validateStep,
  shortCategoryLabel,
  type ContactAnswers,
  type StepAnswers,
} from "@/lib/finder-config";
import { TurnstileWidget } from "@/components/turnstile-widget";

function summaryRows(category: string | null, answers: StepAnswers, contact: ContactAnswers) {
  const val = (v: string | string[] | undefined) => {
    if (Array.isArray(v)) return v.length ? v.join(", ") : "Not given";
    return v && String(v).trim() ? v : "Not given";
  };
  const currentSoftwareRows = (): { label: string; value: string }[] => {
    const rows = [{ label: "Currently using software", value: val(answers.usingSoftware) }];
    if (answers.usingSoftware === "Yes") {
      rows.push({ label: "Vendor", value: val(answers.vendor) });
    }
    return rows;
  };
  const isEudr = (category || "").indexOf("EUDR") > -1;
  if (isEudr) {
    return [
      { label: "Products in scope", value: val(answers.industry) },
      { label: "Role", value: val(answers.role) },
      { label: "Suppliers", value: val(answers.manage) },
      { label: "Sourcing regions", value: val(answers.regions) },
      { label: "Geolocation data", value: val(answers.geo) },
      ...currentSoftwareRows(),
      { label: "Compliance deadline", value: val(answers.timing) },
      { label: "We'll email you at", value: val(contact.email) },
    ];
  }
  return [
    { label: "Company type", value: val(answers.industry) },
    { label: "Needs to manage", value: val(answers.manage) },
    ...currentSoftwareRows(),
    { label: "Users", value: val(answers.users) },
    { label: "Timeline", value: val(answers.timing) },
    { label: "Send matches to", value: val(contact.email) },
  ];
}

export function FinderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetCategory = searchParams.get("category");

  const [category, setCategory] = useState<string | null>(presetCategory);
  const [catPreset] = useState(!!presetCategory);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StepAnswers>(presetCategory ? { category: presetCategory } : {});
  const [contact, setContact] = useState<ContactAnswers>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    // Fires once per wizard mount, not per step — this is the "finder started"
    // funnel event, distinct from per-step navigation.
    track("finder_start", presetCategory ? { category: presetCategory } : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only on mount
  }, []);

  const usingSoftwareAnswer = answers.usingSoftware as string | undefined;
  const steps = useMemo(
    () => getSteps(category, catPreset, usingSoftwareAnswer),
    [category, catPreset, usingSoftwareAnswer],
  );
  const i = Math.min(step, steps.length - 1);
  const currentStep = steps[i];

  const pick = (stepId: string, label: string) => {
    setError(null);
    setAnswers((a) => ({ ...a, [stepId]: label }));
    if (stepId === "category") setCategory(label);
  };

  const toggle = (stepId: string, label: string) => {
    setError(null);
    setAnswers((a) => {
      const cur = (a[stepId] as string[] | undefined) || [];
      const next = cur.indexOf(label) > -1 ? cur.filter((x) => x !== label) : [...cur, label];
      return { ...a, [stepId]: next };
    });
  };

  const setText = (stepId: string, value: string) => {
    setError(null);
    setAnswers((a) => ({ ...a, [stepId]: value }));
  };

  const setContactField = (field: keyof ContactAnswers, value: string) => {
    setError(null);
    setContact((c) => ({ ...c, [field]: value }));
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = { category, answers, contact, website, turnstileToken };
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong submitting your brief. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("Something went wrong submitting your brief. Please try again.");
      setSubmitting(false);
      return;
    }
    track("finder_complete", category ? { category } : {});
    const summary = summaryRows(category, answers, contact);
    sessionStorage.setItem(
      "sl_finder_done",
      JSON.stringify({ category, summary }),
    );
    router.push("/finder/done");
  };

  const next = () => {
    const err = validateStep(currentStep, answers, contact);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    const last = steps.length - 1;
    if (step >= last) {
      submit();
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    setError(null);
    if (step === 0) {
      router.push("/");
      return;
    }
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const progressPct = Math.round(((i + 1) / steps.length) * 100);
  const isMulti = currentStep.kind === "multi";
  const selectedList = isMulti
    ? ((answers[currentStep.id] as string[] | undefined) || [])
    : answers[currentStep.id]
      ? [answers[currentStep.id] as string]
      : [];

  const hasErrorOnContact = !!error && currentStep.kind === "contact";
  const stepIncomplete = !!error && currentStep.kind !== "contact";

  const nameBorder = error && /your name/.test(error) ? "#c0451f" : "rgba(13,17,23,0.12)";
  const companyBorder = error && /company name/.test(error) ? "#c0451f" : "rgba(13,17,23,0.12)";
  const emailBorder = error && /email/i.test(error) ? "#c0451f" : "rgba(13,17,23,0.12)";
  const phoneBorder = error && /phone/i.test(error) ? "#c0451f" : "rgba(13,17,23,0.12)";

  const shortCat = shortCategoryLabel(category);
  const nextLabel =
    i === steps.length - 1 ? `Send my brief to ${shortCat} providers →` : "Continue →";

  return (
    <main
      data-screen-label="Software finder"
      className="max-w-[780px] mx-auto px-5 sm:px-8 pt-12 pb-25"
    >
      <p className="mb-[10px] text-[13px] font-bold tracking-[0.06em] uppercase text-[#4f46e5]">
        {(category || "Software") + " finder"}
      </p>
      <div className="flex items-center gap-[14px] mb-11">
        <div className="flex-1 h-[7px] rounded-full bg-[#eef1f8] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4f46e5] transition-[width] duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-[13px] font-bold text-[#5c6573] whitespace-nowrap">
          Step {i + 1} of {steps.length}
        </span>
      </div>

      <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-[10px] text-pretty">
        {currentStep.title}
      </h2>
      <p className="mb-[34px] text-[17px] text-[#5c6573]">{currentStep.help}</p>

      {(currentStep.kind === "multi" || currentStep.kind === "single") && (
        <div className="flex flex-wrap gap-3 mb-10">
          {(currentStep.options || []).map((label) => {
            const on = selectedList.indexOf(label) > -1;
            return (
              <button
                key={label}
                onClick={() => (isMulti ? toggle(currentStep.id, label) : pick(currentStep.id, label))}
                className="rounded-full px-[22px] py-[14px] font-sans text-[16px] font-semibold cursor-pointer transition-colors duration-150"
                style={{
                  border: `1px solid ${on ? "#4f46e5" : "rgba(13,17,23,0.12)"}`,
                  background: on ? "#4f46e5" : "#f6f7fb",
                  color: on ? "#ffffff" : "#0d1117",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {currentStep.kind === "text" && (
        <div className="mb-10">
          <textarea
            value={(answers[currentStep.id] as string) || ""}
            onChange={(e) => setText(currentStep.id, e.target.value)}
            placeholder={currentStep.placeholder}
            rows={3}
            className="w-full bg-[#f6f7fb] border border-[#0d1117]/[0.12] rounded-2xl px-5 py-[18px] font-sans text-[17px] text-[#0d1117] resize-y outline-none focus:border-[#4f46e5]"
          />
          <p className="mt-[10px] text-[14px] text-[#79818f]">
            A sentence is plenty. This is what providers will respond to.
          </p>
        </div>
      )}

      {currentStep.kind === "contact" && (
        <>
          {/* Honeypot: hidden from real visitors, bots fill every field they can find. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 0, height: 0, overflow: "hidden" }}>
            <label>
              Company website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] mb-9">
            <label className="block">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Name</span>
              <input
                value={contact.name || ""}
                onChange={(e) => setContactField("name", e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#f6f7fb] rounded-full px-5 py-[14px] font-sans text-[16px] text-[#0d1117] outline-none"
                style={{ border: `1px solid ${nameBorder}` }}
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Company</span>
              <input
                value={contact.company || ""}
                onChange={(e) => setContactField("company", e.target.value)}
                placeholder="Company name"
                className="w-full bg-[#f6f7fb] rounded-full px-5 py-[14px] font-sans text-[16px] text-[#0d1117] outline-none"
                style={{ border: `1px solid ${companyBorder}` }}
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Work email</span>
              <input
                value={contact.email || ""}
                onChange={(e) => setContactField("email", e.target.value)}
                type="email"
                placeholder="you@company.com"
                className="w-full bg-[#f6f7fb] rounded-full px-5 py-[14px] font-sans text-[16px] text-[#0d1117] outline-none"
                style={{ border: `1px solid ${emailBorder}` }}
              />
              <span className="block mt-[6px] ml-1 text-[12px] text-[#79818f]">
                Personal email providers (Gmail, Yahoo, etc.) aren&apos;t accepted.
              </span>
            </label>
            <label className="block">
              <span className="block text-[13px] font-bold text-[#5c6573] mb-[7px]">Phone</span>
              <input
                value={contact.phone || ""}
                onChange={(e) => setContactField("phone", e.target.value)}
                placeholder="+45 …"
                className="w-full bg-[#f6f7fb] rounded-full px-5 py-[14px] font-sans text-[16px] text-[#0d1117] outline-none"
                style={{ border: `1px solid ${phoneBorder}` }}
              />
            </label>
          </div>
          <TurnstileWidget onToken={setTurnstileToken} />

          {hasErrorOnContact && (
            <p className="-mt-[18px] mb-[30px] text-[15px] font-semibold text-[#4f46e5]">{error}</p>
          )}
        </>
      )}

      {stepIncomplete && (
        <p className="-mt-[18px] mb-[30px] text-[15px] font-semibold text-[#4f46e5]">{error}</p>
      )}

      <div className="flex items-center gap-4 border-t border-[#0d1117]/[0.07] pt-[26px]">
        <button
          onClick={back}
          className="border border-[#0d1117]/[0.14] rounded-full px-[22px] py-[13px] font-sans font-semibold text-[15px] text-[#3d4653] hover:bg-[#0d1117]/[0.05]"
        >
          ← Back
        </button>
        <button
          onClick={next}
          disabled={submitting}
          className="ml-auto bg-[#4f46e5] text-white rounded-full px-[30px] py-4 font-sans font-semibold text-[18px] whitespace-nowrap hover:bg-[#4338ca] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : nextLabel}
        </button>
      </div>
      <p className="mt-[22px] text-[14px] text-[#79818f]">
        Free for buyers · Your brief is published to the provider portal for providers to review.
      </p>
    </main>
  );
}
