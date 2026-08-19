"use client";

import { useState } from "react";
import Link from "next/link";
import { BATTERY_PASSPORT_DEADLINE } from "@/lib/battery-passport-dates";
import { daysUntil } from "@/lib/dates";

type Screen = "categories" | "chain" | "result";

const NOT_SURE = "Not sure";

// Verified against the regulation's own scope split (Article 77): these
// three carry the passport obligation. Wording matches
// BATTERY_PASSPORT_DEADLINE.scope exactly so the two never drift apart.
const IN_SCOPE_CATEGORIES = [
  "EV batteries",
  "LMT batteries (e-bikes, e-scooters, and similar)",
  "Industrial batteries above 2 kWh",
];

// Explicitly excluded from the passport requirement itself, confirmed this
// phase (see the pre-build verification note) — not the same as being
// outside the wider Battery Regulation entirely, just outside Article 77.
const OUT_OF_SCOPE_CATEGORIES = [
  "Portable or consumer batteries (e.g. AA, phone, laptop)",
  "Starting-lighting-ignition (SLI) batteries",
];

const CATEGORY_OPTIONS = [...IN_SCOPE_CATEGORIES, ...OUT_OF_SCOPE_CATEGORIES, NOT_SURE];

// Same 7 labels as the finder's DBP "Where do you sit in the battery
// chain?" step (lib/finder-config.ts) — kept in sync deliberately so this
// checker and the finder never describe chain position differently.
const CHAIN_OPTIONS = [
  "Cell manufacturer",
  "Pack assembler",
  "Automotive OEM",
  "Energy storage",
  "Materials supplier",
  "Recycler",
  "Other",
];

// The passport obligation binds to whoever places the finished battery on
// the EU market, not to every position in the chain equally. Cell
// manufacturers and materials suppliers are typically feeding data into
// someone else's passport rather than owning the obligation themselves,
// unless they also place a finished battery product on the market directly.
const UPSTREAM_CHAIN_POSITIONS = new Set(["Cell manufacturer", "Materials supplier"]);

function totalSteps(afterCategories: boolean, skipsChain: boolean): number {
  if (skipsChain) return 1;
  return 2;
}

function stepNumber(screen: Screen): number {
  if (screen === "categories") return 1;
  if (screen === "chain") return 2;
  return 0;
}

function ProgressIndicator({ screen, skipsChain }: { screen: Screen; skipsChain: boolean }) {
  const total = totalSteps(true, skipsChain);
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
      <span className="block text-[15px] font-semibold text-[#0d1117]">{label}</span>
    </button>
  );
}

function DeadlineResultCard() {
  const days = daysUntil(BATTERY_PASSPORT_DEADLINE.date);
  return (
    <div className="rounded-2xl border border-[#4f46e5]/[0.25] bg-[#eef1f8] p-7 sm:p-9 text-center mb-6">
      <p className="mb-2 text-[13px] font-bold tracking-[0.08em] uppercase text-[#4338ca]">Your deadline</p>
      <p
        className="font-sans font-semibold leading-none tracking-[-0.02em] text-[#0d1117] mb-2"
        style={{ fontSize: "clamp(36px, 6vw, 48px)" }}
      >
        {BATTERY_PASSPORT_DEADLINE.display}
      </p>
      <p className="text-[15px] font-semibold text-[#4338ca]">{days} days remaining</p>
    </div>
  );
}

// Shared conversion block for the in-scope result (not shown on the
// out-of-scope path, which keeps its own unchanged CTA in the bottom bar
// below). Matches the exact "publish your brief... up to 3 who believe
// they're a fit will respond" sentence and "Find battery passport software
// →" button already live in this page's own hero copy, and the exact
// trust-line text already live in that same hero, rather than inventing
// new phrasing.
function InScopeCta() {
  return (
    <div className="mt-6 text-center">
      <p className="text-[15px] text-[#3d4653] mb-4">
        We&apos;ll publish your brief to battery passport software providers in the category. Up to
        3 who believe they&apos;re a fit will respond.
      </p>
      <Link
        href={`/finder?category=${encodeURIComponent("Digital Battery Passport (DBP)")}`}
        className="inline-block bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
      >
        Find battery passport software →
      </Link>
      <p className="mt-4 text-[13px] font-semibold text-[#5c6573]">
        Free for buyers · No obligation · Providers respond by email within 24 hours
      </p>
    </div>
  );
}

const backButtonClass =
  "rounded-full px-5 py-[10px] font-sans font-semibold text-[14px] text-[#5c6573] border border-[#0d1117]/[0.14] hover:bg-[#0d1117]/[0.05]";

export function BatteryPassportScopeChecker() {
  const [screen, setScreen] = useState<Screen>("categories");
  const [categories, setCategories] = useState<string[]>([]);
  const [chain, setChain] = useState<string | null>(null);

  const toggleCategory = (c: string) => {
    setCategories((cur) => {
      if (c === NOT_SURE) return cur.includes(NOT_SURE) ? [] : [NOT_SURE];
      const withoutNotSure = cur.filter((x) => x !== NOT_SURE);
      return withoutNotSure.includes(c) ? withoutNotSure.filter((x) => x !== c) : [...withoutNotSure, c];
    });
  };

  const onlyOutOfScope =
    categories.length > 0 && categories.every((c) => OUT_OF_SCOPE_CATEGORIES.includes(c));
  const notSure = categories.includes(NOT_SURE);
  const skipsChain = onlyOutOfScope;

  const afterCategories = () => {
    setScreen(skipsChain ? "result" : "chain");
  };

  const pickChain = (c: string) => {
    setChain(c);
    setScreen("result");
  };

  const restart = () => {
    setScreen("categories");
    setCategories([]);
    setChain(null);
  };

  const inScopeSelected = categories.filter((c) => IN_SCOPE_CATEGORIES.includes(c));
  const categoryPhrase = inScopeSelected.length > 0 ? ` (${inScopeSelected.join(", ")})` : "";

  const chainNote = chain
    ? UPSTREAM_CHAIN_POSITIONS.has(chain)
      ? "The passport obligation itself sits with whoever places the finished battery on the EU market, typically a pack assembler, OEM, or importer. As a " +
        chain.toLowerCase() +
        ", you're most likely feeding data into that passport rather than holding the obligation directly, unless you also place a finished battery product on the market yourself."
      : "If your business places the finished battery on the EU market, either directly or as the importer, the passport obligation applies to you directly."
    : null;

  const renderResult = () => {
    if (onlyOutOfScope) {
      return (
        <>
          <div className="rounded-2xl border border-[#0d1117]/[0.09] bg-white p-7 sm:p-9 text-center mb-6">
            <p
              className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117]"
              style={{ fontSize: "clamp(24px, 4vw, 30px)" }}
            >
              The battery passport requirement likely doesn&apos;t apply to you
            </p>
          </div>
          <p className="text-[16px] text-[#5c6573] text-center">
            Portable, consumer, and starting-lighting-ignition (SLI) batteries are excluded from the
            digital battery passport requirement. Other parts of the wider EU Battery Regulation may
            still apply to these battery types, so confirm your specific situation with a qualified
            advisor if you&apos;re not sure.
          </p>
        </>
      );
    }

    const days = daysUntil(BATTERY_PASSPORT_DEADLINE.date);

    return (
      <>
        <DeadlineResultCard />
        <p className="text-[16px] text-[#3d4653] text-center mb-4">
          Based on your answers, the digital battery passport requirement likely applies to you
          {categoryPhrase}. Your deadline is {BATTERY_PASSPORT_DEADLINE.display}, {days} days from
          today.
          {notSure &&
            " Confirm which of the categories above your product falls into: if any apply, this deadline applies to you, regardless of company size."}
        </p>
        {chainNote && <p className="text-[14px] text-[#5c6573] text-center mb-4">{chainNote}</p>}
        <p className="text-[14px] text-[#79818f] text-center">
          The deadline applies uniformly once a battery is in scope: there&apos;s no separate date by
          company size or position in the value chain.
        </p>
        <InScopeCta />
      </>
    );
  };

  return (
    <section id="battery-passport-scope-checker" className="border-b border-[#0d1117]/[0.07]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
          Does the battery passport requirement apply to you?
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-10">
          A few questions to check whether the digital battery passport requirement applies to you:
          EV batteries, LMT batteries (e-bikes and e-scooters), and industrial batteries above 2 kWh
          are in scope, with a single deadline of 18 February 2027 regardless of company size or
          where you sit in the value chain (cell manufacturer, pack assembler, automotive OEM, energy
          storage, materials supplier, or recycler). Based on the regulation&apos;s published
          categories and dates, not a guess.
        </p>

        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} skipsChain={skipsChain} />}

          {screen === "categories" && (
            <div key="categories" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                Which battery categories does your business place on the EU market, or work with?
              </h3>
              <div className="grid gap-3 mb-7">
                {CATEGORY_OPTIONS.map((c) => (
                  <OptionCard
                    key={c}
                    label={c}
                    selected={categories.includes(c)}
                    onClick={() => toggleCategory(c)}
                    multi={c !== NOT_SURE}
                  />
                ))}
              </div>
              <button
                onClick={afterCategories}
                disabled={categories.length === 0}
                className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca] disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          )}

          {screen === "chain" && (
            <div key="chain" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                Where do you sit in the battery chain?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {CHAIN_OPTIONS.map((c) => (
                  <OptionCard key={c} label={c} selected={chain === c} onClick={() => pickChain(c)} />
                ))}
              </div>
              <button onClick={() => setScreen("categories")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "result" && (
            <div key="result" className="step-in">
              {renderResult()}
              <div className="mt-7 pt-6 border-t border-[#0d1117]/[0.08] flex flex-wrap items-center justify-center gap-4">
                {onlyOutOfScope && (
                  <Link
                    href={`/finder?category=${encodeURIComponent("Digital Battery Passport (DBP)")}`}
                    className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
                  >
                    Ready to look at software options? Tell us what you need →
                  </Link>
                )}
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
          This is a general guide based on the EU Battery Regulation&apos;s published categories and
          dates, not legal advice. Confirm your specific obligations with a qualified advisor.
        </p>
      </div>
    </section>
  );
}
