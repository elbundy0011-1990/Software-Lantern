"use client";

import { useState } from "react";
import Link from "next/link";
import { EUDR_DEADLINES, EUDR_SME_SIZE_NOTE, daysUntil, type EudrDeadlineKey } from "@/lib/eudr-dates";

type Role = "operator" | "trader" | "export" | "none";
type Size = "large-medium" | "micro-small" | "not-sure";
type Screen = "role" | "commodities" | "sourcing" | "size" | "result";

const CONFIRMED_LOW_RISK = "confirmed-low-risk";

const ROLE_OPTIONS: { value: Role; label: string; supporting?: string }[] = [
  {
    value: "operator",
    label: "First time on the EU market",
    supporting: "Importing from outside the EU, or producing within it",
  },
  {
    value: "trader",
    label: "Reselling within the EU",
    supporting: "Distributing or retailing products someone else already placed on the market",
  },
  { value: "export", label: "Exporting from the EU" },
  { value: "none", label: "None of these" },
];

// Matches the hero "By commodity" list and the "Commodity coverage" comparison
// framework prose on this page exactly — same 7 official EUDR commodities,
// same names, same order, so there's no drift across the page.
const COMMODITIES = ["Cattle", "Cocoa", "Coffee", "Oil palm", "Rubber", "Soya", "Wood"];

const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: "large-medium", label: "Large or medium" },
  { value: "micro-small", label: "Micro or small" },
  { value: "not-sure", label: "Not sure" },
];

// Risk classification under EUDR is per-country (Article 29 benchmarking,
// via Commission Implementing Regulation (EU) 2025/1093), not per-region —
// and the confirmed low-risk list spans every continent, so none of these
// region options can be honestly mapped to a specific tier. They're offered
// for context; only the last option changes the result.
const SOURCING_OPTIONS: { value: string; label: string }[] = [
  { value: "West Africa", label: "West Africa" },
  { value: "East Africa", label: "East Africa" },
  { value: "South America", label: "South America" },
  { value: "Southeast Asia", label: "Southeast Asia" },
  { value: "South Asia", label: "South Asia" },
  { value: "Europe", label: "Europe" },
  { value: "North America", label: "North America" },
  { value: "Mixed / not sure", label: "A mix of regions, or not sure" },
  { value: CONFIRMED_LOW_RISK, label: "All of my sourcing is confirmed low-risk under the EU's official country list" },
];

const BOTH_ROLES_NOTE =
  "If your business operates as both an operator and a trader across different product lines, the earlier applicable deadline generally applies — confirm your specific situation with a qualified advisor.";

const LOW_RISK_NOTE =
  "Since you've indicated all your sourcing is from EU-classified low-risk countries, a simplified due diligence procedure may apply under Article 13 of the regulation — you may not need to carry out the risk assessment and risk mitigation steps that otherwise apply, though the underlying information-gathering and due diligence system requirements still apply. Confirm your sourcing countries' exact status and what this means for your business with a qualified advisor.";

const GENERAL_RISK_NOTE =
  "The EU classifies sourcing countries into three risk tiers — low, standard, or high — under the regulation's country benchmarking system. Only a small number of countries are currently classified high-risk; most others are low or standard risk by default. If all of your sourcing is confirmed to come from low-risk-classified countries, a simplified due diligence procedure may be available — check the EU's published country list or ask a qualified advisor to confirm your specific situation.";

// Total question count depends on path: "none" ends after Q1; every other
// path now gets the sourcing question, and only operators/exporters also
// get the size question (the SME date only applies to operators). Before a
// role is picked, default to 4 — the longest path — for the step indicator.
function totalSteps(role: Role | null): number {
  if (role === "none") return 1;
  if (role === "trader") return 3;
  return 4;
}

function stepNumber(screen: Screen): number {
  if (screen === "role") return 1;
  if (screen === "commodities") return 2;
  if (screen === "sourcing") return 3;
  if (screen === "size") return 4;
  return 0;
}

function ProgressIndicator({ screen, role }: { screen: Screen; role: Role | null }) {
  const total = totalSteps(role);
  const current = stepNumber(screen);
  return (
    <div className="flex items-center gap-[14px] mb-8">
      <div className="flex-1 h-[6px] rounded-full bg-white overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4f46e5] transition-[width] duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-[13px] font-bold text-[#5c6573] whitespace-nowrap">
        Step {current} of {total}
      </span>
    </div>
  );
}

function OptionCard({
  label,
  supporting,
  selected,
  onClick,
  multi,
}: {
  label: string;
  supporting?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 text-left rounded-2xl border-2 bg-white px-5 py-5 font-sans transition-colors duration-150 hover:border-[#4f46e5]/[0.5]"
      style={{ borderColor: selected ? "#4f46e5" : "rgba(13,17,23,0.12)" }}
    >
      <span
        className="shrink-0 mt-[2px] w-[20px] h-[20px] flex items-center justify-center border-2"
        style={{
          borderRadius: multi ? "6px" : "999px",
          borderColor: selected ? "#4f46e5" : "rgba(13,17,23,0.22)",
          background: selected ? "#4f46e5" : "transparent",
        }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 12.5L9.5 18L20 6"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-[15px] font-semibold text-[#0d1117]">{label}</span>
        {supporting && (
          <span className="block mt-[3px] text-[13px] font-normal text-[#79818f]">{supporting}</span>
        )}
      </span>
    </button>
  );
}

function DeadlineResultCard({ deadlineKey }: { deadlineKey: EudrDeadlineKey }) {
  const info = EUDR_DEADLINES[deadlineKey];
  const days = daysUntil(info.date);
  return (
    <div className="rounded-2xl border border-[#4f46e5]/[0.25] bg-[#eef1f8] p-7 sm:p-9 text-center mb-6">
      <p className="mb-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#4338ca]">
        Your deadline
      </p>
      <p
        className="font-sans font-semibold leading-none tracking-[-0.02em] text-[#0d1117] mb-2"
        style={{ fontSize: "clamp(36px, 6vw, 48px)" }}
      >
        {info.display}
      </p>
      <p className="text-[15px] font-semibold text-[#4338ca]">{days} days remaining</p>
    </div>
  );
}

const backButtonClass =
  "rounded-full px-5 py-[10px] font-sans font-semibold text-[14px] text-[#5c6573] border border-[#0d1117]/[0.14] hover:bg-[#0d1117]/[0.05]";

export function EudrScopeChecker() {
  const [screen, setScreen] = useState<Screen>("role");
  const [role, setRole] = useState<Role | null>(null);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [sourcing, setSourcing] = useState<string | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const pickRole = (r: Role) => {
    setRole(r);
    setScreen(r === "none" ? "result" : "commodities");
  };

  const toggleCommodity = (c: string) => {
    setCommodities((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  };

  const afterCommodities = () => {
    setScreen("sourcing");
  };

  const pickSourcing = (value: string) => {
    setSourcing(value);
    // Traders don't get a size question — the SME extension in the
    // regulation's own text applies only to operators, so asking would
    // imply an answer that doesn't exist.
    setScreen(role === "trader" ? "result" : "size");
  };

  const pickSize = (s: Size) => {
    setSize(s);
    setScreen("result");
  };

  const restart = () => {
    setScreen("role");
    setRole(null);
    setCommodities([]);
    setSourcing(null);
    setSize(null);
  };

  const commodityPhrase = commodities.length > 0 ? ` (${commodities.join(", ")})` : "";
  const riskNote = sourcing === CONFIRMED_LOW_RISK ? LOW_RISK_NOTE : GENERAL_RISK_NOTE;

  const renderResult = () => {
    if (role === "none") {
      return (
        <>
          <div className="rounded-2xl border border-[#0d1117]/[0.09] bg-white p-7 sm:p-9 text-center mb-6">
            <p
              className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117]"
              style={{ fontSize: "clamp(24px, 4vw, 30px)" }}
            >
              EUDR likely doesn&apos;t apply to you
            </p>
          </div>
          <p className="text-[16px] text-[#5c6573] text-center">
            The regulation covers cattle, cocoa, coffee, palm oil, rubber, soy, wood and their
            derived products placed on, made available on, or exported from the EU market.
          </p>
        </>
      );
    }

    if (role === "trader") {
      return (
        <>
          <DeadlineResultCard deadlineKey="largeMedium" />
          <p className="text-[16px] text-[#3d4653] text-center mb-4">
            Based on your answers, EUDR likely applies to you as a trader{commodityPhrase}. The
            later SME date in the regulation applies only to operators, not traders.
          </p>
          <p className="text-[14px] text-[#5c6573] text-center mb-4">{riskNote}</p>
          <p className="text-[14px] text-[#79818f] text-center">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    const roleWord = role === "export" ? "an exporter" : "an operator";

    if (size === "large-medium") {
      return (
        <>
          <DeadlineResultCard deadlineKey="largeMedium" />
          <p className="text-[16px] text-[#3d4653] text-center mb-4">
            Based on your answers, EUDR likely applies to you as {roleWord}
            {commodityPhrase}.
          </p>
          <p className="text-[14px] text-[#5c6573] text-center mb-4">{riskNote}</p>
          <p className="text-[14px] text-[#79818f] text-center">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    if (size === "micro-small") {
      return (
        <>
          <DeadlineResultCard deadlineKey="microSmall" />
          <p className="text-[16px] text-[#3d4653] text-center mb-4">
            Based on your answers, EUDR likely applies to you as {roleWord}
            {commodityPhrase}. This applies if your business qualifies as micro or small and was
            established as such by <strong>31 December 2024</strong> — otherwise the general{" "}
            {EUDR_DEADLINES.largeMedium.display} deadline applies.
          </p>
          <p className="text-[14px] text-[#5c6573] text-center mb-4">{riskNote}</p>
          <p className="text-[14px] text-[#79818f] text-center">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    // not sure
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <DeadlineResultCard deadlineKey="largeMedium" />
          <DeadlineResultCard deadlineKey="microSmall" />
        </div>
        <p className="text-[16px] text-[#3d4653] text-center mb-3">
          Based on your answers, EUDR likely applies to you as {roleWord}
          {commodityPhrase}. Your deadline depends on company size — the earlier date if you&apos;re
          large or medium, the later date if you&apos;re micro or small and were established as
          such by 31 December 2024.
        </p>
        <p className="text-[14px] text-[#5c6573] text-center mb-4">{EUDR_SME_SIZE_NOTE}</p>
        <p className="text-[14px] text-[#5c6573] text-center mb-4">{riskNote}</p>
        <p className="text-[14px] text-[#79818f] text-center">{BOTH_ROLES_NOTE}</p>
      </>
    );
  };

  return (
    <section id="eudr-scope-checker" className="border-b border-[#0d1117]/[0.07]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
          Does EUDR apply to you?
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-10">
          A few questions to check your scope and deadline — based on the regulation&apos;s
          published dates, not a guess.
        </p>

        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} role={role} />}

          {screen === "role" && (
            <div key="role" className="eudr-step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                What do you do with EUDR-relevant commodities or products?
              </h3>
              <div className="grid gap-3">
                {ROLE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    supporting={opt.supporting}
                    selected={role === opt.value}
                    onClick={() => pickRole(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {screen === "commodities" && (
            <div key="commodities" className="eudr-step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                Which commodities are involved?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {COMMODITIES.map((c) => (
                  <OptionCard
                    key={c}
                    label={c}
                    selected={commodities.includes(c)}
                    onClick={() => toggleCommodity(c)}
                    multi
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen("role")} className={backButtonClass}>
                  ← Back
                </button>
                <button
                  onClick={afterCommodities}
                  className="ml-auto bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {screen === "sourcing" && (
            <div key="sourcing" className="eudr-step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-2">
                Where do you source these commodities from?
              </h3>
              <p className="text-[14px] text-[#5c6573] mb-5">
                This affects how much due diligence work is required — the EU classifies sourcing
                countries into risk tiers under the regulation.
              </p>
              <div className="grid gap-3 mb-7">
                {SOURCING_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={sourcing === opt.value}
                    onClick={() => pickSourcing(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("commodities")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "size" && (
            <div key="size" className="eudr-step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">What&apos;s your company size?</h3>
              <div className="grid gap-3 mb-7">
                {SIZE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={size === opt.value}
                    onClick={() => pickSize(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("sourcing")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "result" && (
            <div key="result" className="eudr-step-in">
              {renderResult()}
              <div className="mt-7 pt-6 border-t border-[#0d1117]/[0.08] flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/finder?category=EUDR%20Software"
                  className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
                >
                  Ready to look at software options? Tell us what you need →
                </Link>
                <button
                  onClick={restart}
                  className="text-[14px] font-semibold text-[#5c6573] underline underline-offset-2"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-[13px] leading-[1.6] text-[#79818f]">
          This is a general guide based on the EU Deforestation Regulation&apos;s published dates
          and definitions, not legal advice. Confirm your specific obligations with a qualified
          advisor.
        </p>
      </div>
    </section>
  );
}
