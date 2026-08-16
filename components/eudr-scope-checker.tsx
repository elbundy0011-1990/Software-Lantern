"use client";

import { useState } from "react";
import Link from "next/link";
import { EUDR_DEADLINES, EUDR_SME_SIZE_NOTE, daysUntil, type EudrDeadlineKey } from "@/lib/eudr-dates";

type Role = "operator" | "trader" | "export" | "none";
type Size = "large-medium" | "micro-small" | "not-sure";
type Screen = "role" | "commodities" | "size" | "result";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  {
    value: "operator",
    label:
      "I place these products on the EU market for the first time (importing from outside the EU, or producing them within the EU)",
  },
  {
    value: "trader",
    label:
      "I make these products available on the EU market after someone else already placed them there (distributing, reselling, retailing within the EU)",
  },
  { value: "export", label: "I export these products from the EU" },
  { value: "none", label: "None of these" },
];

const COMMODITIES = ["Cattle", "Cocoa", "Coffee", "Palm oil", "Rubber", "Soy", "Wood"];

const SIZE_OPTIONS: { value: Size; label: string }[] = [
  { value: "large-medium", label: "Large or medium" },
  { value: "micro-small", label: "Micro or small" },
  { value: "not-sure", label: "Not sure" },
];

const BOTH_ROLES_NOTE =
  "If your business operates as both an operator and a trader across different product lines, the earlier applicable deadline generally applies — confirm your specific situation with a qualified advisor.";

// Total question count depends on path: traders skip the size question
// (the SME date only applies to operators), "none" ends after Q1. Before a
// role is picked, default to 3 — the longest/most common path — for the
// step indicator.
function totalSteps(role: Role | null): number {
  if (role === "trader") return 2;
  if (role === "none") return 1;
  return 3;
}

function stepNumber(screen: Screen): number {
  if (screen === "role") return 1;
  if (screen === "commodities") return 2;
  if (screen === "size") return 3;
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
  selected,
  onClick,
  multi,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 text-left rounded-2xl border-2 bg-white px-5 py-5 font-sans text-[15px] font-semibold text-[#0d1117] transition-colors duration-150 hover:border-[#4f46e5]/[0.5]"
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
      {label}
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
  const [size, setSize] = useState<Size | null>(null);

  const pickRole = (r: Role) => {
    setRole(r);
    setScreen(r === "none" ? "result" : "commodities");
  };

  const toggleCommodity = (c: string) => {
    setCommodities((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  };

  const afterCommodities = () => {
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
    setSize(null);
  };

  const commodityPhrase = commodities.length > 0 ? ` (${commodities.join(", ")})` : "";

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
              <button onClick={() => setScreen("commodities")} className={backButtonClass}>
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
