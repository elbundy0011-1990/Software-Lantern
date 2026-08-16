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

function DeadlineChip({ deadlineKey }: { deadlineKey: EudrDeadlineKey }) {
  const info = EUDR_DEADLINES[deadlineKey];
  const days = daysUntil(info.date);
  return (
    <div className="inline-flex items-center gap-2 bg-[#eef1f8] rounded-full px-4 py-2 text-[14px] font-semibold text-[#3d4653]">
      <span className="w-[7px] h-[7px] rounded-full bg-[#4f46e5]" />
      Your deadline: {info.display} — {days} days remaining
    </div>
  );
}

const optionButtonClass =
  "text-left rounded-2xl border border-[#0d1117]/[0.12] bg-white px-5 py-4 font-sans text-[15px] font-semibold text-[#0d1117] hover:border-[#4f46e5] hover:bg-[#4f46e5]/[0.06] transition-colors duration-150";

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
          <p className="text-[19px] leading-[1.5] text-[#0d1117] font-semibold mb-2">
            Based on your answers, EUDR likely doesn&apos;t apply to you.
          </p>
          <p className="text-[16px] text-[#5c6573]">
            The regulation covers cattle, cocoa, coffee, palm oil, rubber, soy, wood and their
            derived products placed on, made available on, or exported from the EU market.
          </p>
        </>
      );
    }

    if (role === "trader") {
      return (
        <>
          <p className="text-[19px] leading-[1.5] text-[#0d1117] font-semibold mb-2">
            Based on your answers, EUDR likely applies to you as a trader{commodityPhrase}.
          </p>
          <p className="text-[16px] text-[#5c6573] mb-4">
            Your deadline is <strong>{EUDR_DEADLINES.largeMedium.display}</strong> — the later SME
            date in the regulation applies only to operators, not traders.
          </p>
          <DeadlineChip deadlineKey="largeMedium" />
          <p className="mt-5 text-[14px] text-[#79818f]">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    // operator or export
    const roleWord = role === "export" ? "an exporter" : "an operator";

    if (size === "large-medium") {
      return (
        <>
          <p className="text-[19px] leading-[1.5] text-[#0d1117] font-semibold mb-2">
            Based on your answers, EUDR likely applies to you as {roleWord}
            {commodityPhrase}.
          </p>
          <p className="text-[16px] text-[#5c6573] mb-4">
            Your deadline is <strong>{EUDR_DEADLINES.largeMedium.display}</strong>.
          </p>
          <DeadlineChip deadlineKey="largeMedium" />
          <p className="mt-5 text-[14px] text-[#79818f]">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    if (size === "micro-small") {
      return (
        <>
          <p className="text-[19px] leading-[1.5] text-[#0d1117] font-semibold mb-2">
            Based on your answers, EUDR likely applies to you as {roleWord}
            {commodityPhrase}.
          </p>
          <p className="text-[16px] text-[#5c6573] mb-4">
            If your business qualifies as micro or small and was established as such by{" "}
            <strong>31 December 2024</strong>, your deadline is{" "}
            <strong>{EUDR_DEADLINES.microSmall.display}</strong> — otherwise the general{" "}
            <strong>{EUDR_DEADLINES.largeMedium.display}</strong> deadline applies.
          </p>
          <DeadlineChip deadlineKey="microSmall" />
          <p className="mt-5 text-[14px] text-[#79818f]">{BOTH_ROLES_NOTE}</p>
        </>
      );
    }

    // not sure
    return (
      <>
        <p className="text-[19px] leading-[1.5] text-[#0d1117] font-semibold mb-2">
          Based on your answers, EUDR likely applies to you as {roleWord}
          {commodityPhrase}.
        </p>
        <p className="text-[16px] text-[#5c6573] mb-3">
          Your deadline depends on company size:{" "}
          <strong>{EUDR_DEADLINES.largeMedium.display}</strong> if you&apos;re large or medium, or{" "}
          <strong>{EUDR_DEADLINES.microSmall.display}</strong> if you&apos;re micro or small and were
          established as such by 31 December 2024.
        </p>
        <p className="text-[14px] text-[#5c6573] mb-4">{EUDR_SME_SIZE_NOTE}</p>
        <p className="text-[14px] text-[#79818f]">{BOTH_ROLES_NOTE}</p>
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

        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 sm:p-10">
          {screen === "role" && (
            <>
              <p className="mb-4 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                Step 1
              </p>
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                What do you do with EUDR-relevant commodities or products?
              </h3>
              <div className="grid gap-3">
                {ROLE_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => pickRole(opt.value)} className={optionButtonClass}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {screen === "commodities" && (
            <>
              <p className="mb-4 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                Step 2
              </p>
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                Which commodities are involved?
              </h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {COMMODITIES.map((c) => {
                  const on = commodities.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleCommodity(c)}
                      className="rounded-full px-5 py-3 font-sans text-[15px] font-semibold transition-colors duration-150"
                      style={{
                        border: `1px solid ${on ? "#4f46e5" : "rgba(13,17,23,0.12)"}`,
                        background: on ? "#4f46e5" : "#ffffff",
                        color: on ? "#ffffff" : "#0d1117",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
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
            </>
          )}

          {screen === "size" && (
            <>
              <p className="mb-4 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                Step 3
              </p>
              <h3 className="font-sans font-semibold text-[21px] mb-5">What&apos;s your company size?</h3>
              <div className="grid gap-3 mb-7">
                {SIZE_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => pickSize(opt.value)} className={optionButtonClass}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setScreen("commodities")} className={backButtonClass}>
                ← Back
              </button>
            </>
          )}

          {screen === "result" && (
            <>
              {renderResult()}
              <div className="mt-7 pt-6 border-t border-[#0d1117]/[0.08] flex flex-wrap items-center gap-4">
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
            </>
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
