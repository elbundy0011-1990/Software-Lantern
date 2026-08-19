"use client";

import { useState } from "react";
import Link from "next/link";

type Process = "spreadsheets" | "mixed" | "workingPlm" | "outgrowingPlm" | "notSure";
type Brand = "single" | "multi" | "notSure";
type Skus = "under50" | "50to200" | "200plus" | "notSure";
type Suppliers = "under5" | "5to20" | "20plus" | "notSure";
type Screen = "process" | "brand" | "skus" | "suppliers" | "pain" | "result";

const NONE_OF_THESE = "none";

const PROCESS_OPTIONS: { value: Process; label: string }[] = [
  { value: "spreadsheets", label: "Mostly spreadsheets, email, and shared drives" },
  { value: "mixed", label: "A mix of spreadsheets and a few point tools" },
  { value: "workingPlm", label: "An existing PLM (or similar) system that's working well for us" },
  { value: "outgrowingPlm", label: "An existing PLM (or similar) system we've outgrown or are struggling with" },
  { value: "notSure", label: "Not sure / something else" },
];

const BRAND_OPTIONS: { value: Brand; label: string }[] = [
  { value: "single", label: "A single brand or label" },
  { value: "multi", label: "Multiple brands or labels" },
  { value: "notSure", label: "Not sure yet / early stage" },
];

const SKU_OPTIONS: { value: Skus; label: string }[] = [
  { value: "under50", label: "Under ~50" },
  { value: "50to200", label: "50–200" },
  { value: "200plus", label: "200+" },
  { value: "notSure", label: "Not sure" },
];

const SUPPLIER_OPTIONS: { value: Suppliers; label: string }[] = [
  { value: "under5", label: "Fewer than 5" },
  { value: "5to20", label: "5–20" },
  { value: "20plus", label: "More than 20" },
  { value: "notSure", label: "Not sure" },
];

// "short" is used only in the result recap; "label" is the full option text
// shown on the question screen.
const PAIN_OPTIONS: { value: string; label: string; short: string }[] = [
  {
    value: "techpacks",
    label: "Tech packs going out of date or getting lost before reaching the factory",
    short: "tech pack version control",
  },
  {
    value: "bom",
    label: "Rebuilding BOMs from scratch each season instead of adjusting an existing one",
    short: "BOM rebuilding",
  },
  {
    value: "sampling",
    label: "Losing track of sample rounds and approval history",
    short: "sample tracking",
  },
  {
    value: "costing",
    label: "Costing surprises that show up after decisions are already made",
    short: "costing visibility",
  },
  { value: "deadlines", label: "Missed critical-path deadlines", short: "critical-path deadlines" },
  {
    value: "suppliers",
    label: "Suppliers hard to coordinate without constant email back-and-forth",
    short: "supplier coordination",
  },
];

function skuPoints(s: Skus): number {
  if (s === "200plus") return 2;
  if (s === "50to200") return 1;
  return 0;
}

function supplierPoints(s: Suppliers): number {
  if (s === "20plus") return 2;
  if (s === "5to20") return 1;
  return 0;
}

// "None of these, really" is deliberately non-scoring: it contributes 0
// points, the same as if the pain screen were skipped, rather than being
// treated as a confirmed-zero-pain signal that pulls toward the low band.
// Someone whose real pain isn't on this list shouldn't score the same as
// someone who checked and found nothing.
function painPoints(pain: string[]): number {
  const real = pain.filter((p) => p !== NONE_OF_THESE);
  if (real.length >= 3) return 2;
  if (real.length >= 1) return 1;
  return 0;
}

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildDrivers(brand: Brand | null, skus: Skus | null, suppliers: Suppliers | null, pain: string[]): string[] {
  const drivers: string[] = [];
  if (brand === "multi") drivers.push("running multiple brands or labels");
  if (skus === "200plus") drivers.push("200+ styles a season");
  else if (skus === "50to200") drivers.push("50–200 styles a season");
  if (suppliers === "20plus") drivers.push("coordinating more than 20 suppliers");
  else if (suppliers === "5to20") drivers.push("coordinating 5–20 suppliers");
  const realPain = pain.filter((p) => p !== NONE_OF_THESE);
  if (realPain.length > 0) {
    const shorts = realPain.map((v) => PAIN_OPTIONS.find((o) => o.value === v)!.short);
    drivers.push(`friction around ${joinWithAnd(shorts)}`);
  }
  return drivers;
}

type Band = "low" | "emerging" | "strong";

function scoreBand(score: number): Band {
  if (score <= 1) return "low";
  if (score <= 4) return "emerging";
  return "strong";
}

const MAIN_PATH_STEPS = 5;

function stepNumber(screen: Screen): number {
  if (screen === "process") return 1;
  if (screen === "brand") return 2;
  if (screen === "skus") return 3;
  if (screen === "suppliers") return 4;
  if (screen === "pain") return 5;
  return 0;
}

function ProgressIndicator({ screen, total }: { screen: Screen; total: number }) {
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

function ResultHeadline({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#0d1117]/[0.09] bg-white p-7 sm:p-9 text-center mb-6">
      <p
        className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117]"
        style={{ fontSize: "clamp(24px, 4vw, 30px)" }}
      >
        {children}
      </p>
    </div>
  );
}

const backButtonClass =
  "rounded-full px-5 py-[10px] font-sans font-semibold text-[14px] text-[#5c6573] border border-[#0d1117]/[0.14] hover:bg-[#0d1117]/[0.05]";

const finderHref = `/finder?category=${encodeURIComponent("Product Lifecycle Management (PLM)")}`;
const findProvidersCta = "See fashion PLM providers that fit your scale →";

export function PlmReadinessChecker() {
  const [screen, setScreen] = useState<Screen>("process");
  const [process, setProcess] = useState<Process | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [skus, setSkus] = useState<Skus | null>(null);
  const [suppliers, setSuppliers] = useState<Suppliers | null>(null);
  const [pain, setPain] = useState<string[]>([]);

  const pickProcess = (p: Process) => {
    setProcess(p);
    if (p === "workingPlm" || p === "outgrowingPlm") {
      setScreen("result");
    } else {
      setScreen("brand");
    }
  };

  const pickBrand = (b: Brand) => {
    setBrand(b);
    setScreen("skus");
  };

  const pickSkus = (s: Skus) => {
    setSkus(s);
    setScreen("suppliers");
  };

  const pickSuppliers = (s: Suppliers) => {
    setSuppliers(s);
    setScreen("pain");
  };

  const togglePain = (value: string) => {
    setPain((cur) => {
      if (value === NONE_OF_THESE) return cur.includes(NONE_OF_THESE) ? [] : [NONE_OF_THESE];
      const withoutNone = cur.filter((x) => x !== NONE_OF_THESE);
      return withoutNone.includes(value) ? withoutNone.filter((x) => x !== value) : [...withoutNone, value];
    });
  };

  const finishPain = () => setScreen("result");

  const restart = () => {
    setScreen("process");
    setProcess(null);
    setBrand(null);
    setSkus(null);
    setSuppliers(null);
    setPain([]);
  };

  const isShortCircuit = process === "workingPlm" || process === "outgrowingPlm";
  const total = isShortCircuit ? 1 : MAIN_PATH_STEPS;

  const score =
    (brand === "multi" ? 2 : 0) + skuPoints(skus ?? "notSure") + supplierPoints(suppliers ?? "notSure") + painPoints(pain);
  const band = scoreBand(score);
  const drivers = buildDrivers(brand, skus, suppliers, pain);

  const renderResult = () => {
    if (process === "workingPlm") {
      return (
        <>
          <ResultHeadline>Sounds like you&apos;re already set</ResultHeadline>
          <p className="text-[16px] text-[#5c6573] text-center mb-4">
            If your current system is genuinely working for your team, there&apos;s usually no reason to
            go looking. If something specific about it is starting to strain, a merger, a new brand, or
            outgrowing its supplier collaboration tools, that&apos;s a different conversation.
          </p>
          <div className="flex justify-center">
            <a href="#how-to-choose" className="text-[14px] font-semibold text-[#4f46e5] underline underline-offset-2">
              If that changes, here&apos;s what to look for in a replacement →
            </a>
          </div>
        </>
      );
    }

    if (process === "outgrowingPlm") {
      return (
        <>
          <ResultHeadline>This sounds like a replacement question, not a first-PLM question</ResultHeadline>
          <p className="text-[16px] text-[#5c6573] text-center mb-6">
            Outgrowing an existing system is one of the most common reasons fashion brands switch
            providers. The right next step is usually the same as evaluating PLM for the first time: get
            clear on where the current one is falling short, then compare options against that gap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={finderHref}
              className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              See fashion PLM providers that fit what you need →
            </Link>
            <Link
              href="/resources/blog/fashion-plm-software-questions-to-ask-providers"
              className="text-[14px] font-semibold text-[#4f46e5] underline underline-offset-2"
            >
              Our buyer&apos;s checklist can help you sharpen exactly where it&apos;s falling short →
            </Link>
          </div>
        </>
      );
    }

    if (band === "low") {
      return (
        <>
          <ResultHeadline>Not many signals yet</ResultHeadline>
          <p className="text-[16px] text-[#5c6573] text-center mb-6">
            Based on your answers, your current setup doesn&apos;t show many of the signals that usually
            push a growing fashion brand toward PLM software. Spreadsheets and email are probably still
            functional for you. Worth revisiting as your SKU count, supplier network, or team grows.
          </p>
          <div className="flex justify-center">
            <a href="#how-to-choose" className="text-[14px] font-semibold text-[#4f46e5] underline underline-offset-2">
              Curious anyway? See what fashion PLM software typically covers ↓
            </a>
          </div>
        </>
      );
    }

    if (band === "emerging") {
      return (
        <>
          <ResultHeadline>A few signals worth watching</ResultHeadline>
          <p className="text-[16px] text-[#3d4653] text-center mb-6">
            Your answers show some of the complexity that tends to make spreadsheet-based product
            development harder to sustain{drivers.length > 0 ? `, particularly ${joinWithAnd(drivers)}` : ""}.
            This doesn&apos;t mean you need PLM software right now, but it&apos;s a reasonable point to
            start understanding what&apos;s out there before the pain compounds.
          </p>
          <div className="flex justify-center">
            <Link
              href={finderHref}
              className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              {findProvidersCta}
            </Link>
          </div>
        </>
      );
    }

    // strong
    return (
      <>
        <ResultHeadline>Several signals point the same direction</ResultHeadline>
        <p className="text-[16px] text-[#3d4653] text-center mb-6">
          Based on your answers{drivers.length > 0 ? `, ${joinWithAnd(drivers)},` : ""} your product
          development process is carrying a lot of the complexity fashion PLM software is built to
          handle. That&apos;s not a determination that you need to buy something, but it&apos;s the
          pattern we typically see in brands actively evaluating PLM.
        </p>
        <div className="flex justify-center">
          <Link
            href={finderHref}
            className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
          >
            {findProvidersCta}
          </Link>
        </div>
      </>
    );
  };

  return (
    <section id="plm-readiness-check" className="border-b border-[#0d1117]/[0.07]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
          Is fashion PLM worth looking into yet?
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-10">
          A handful of quick questions about your brand&apos;s complexity. Not a determination, just a
          signal worth weighing before you start evaluating providers.
        </p>

        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} total={total} />}

          {screen === "process" && (
            <div key="process" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                What are you managing product development in today?
              </h3>
              <div className="grid gap-3">
                {PROCESS_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={process === opt.value}
                    onClick={() => pickProcess(opt.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {screen === "brand" && (
            <div key="brand" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">What&apos;s your brand structure?</h3>
              <div className="grid gap-3 mb-7">
                {BRAND_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={brand === opt.value}
                    onClick={() => pickBrand(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("process")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "skus" && (
            <div key="skus" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-2">
                About how many styles are actively in development at once?
              </h3>
              <p className="text-[14px] text-[#5c6573] mb-5">Per season, roughly.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {SKU_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={skus === opt.value}
                    onClick={() => pickSkus(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("brand")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "suppliers" && (
            <div key="suppliers" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How many suppliers or factories do you coordinate with regularly?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {SUPPLIER_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={suppliers === opt.value}
                    onClick={() => pickSuppliers(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("skus")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "pain" && (
            <div key="pain" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">Where does it hurt most right now?</h3>
              <div className="grid gap-3 mb-7">
                {PAIN_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={pain.includes(opt.value)}
                    onClick={() => togglePain(opt.value)}
                    multi
                  />
                ))}
                <OptionCard
                  label={"None of these, really"}
                  selected={pain.includes(NONE_OF_THESE)}
                  onClick={() => togglePain(NONE_OF_THESE)}
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen("suppliers")} className={backButtonClass}>
                  ← Back
                </button>
                <button
                  onClick={finishPain}
                  disabled={pain.length === 0}
                  className="ml-auto bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca] disabled:opacity-40"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {screen === "result" && (
            <div key="result" className="step-in">
              {renderResult()}
              <div className="mt-7 pt-6 border-t border-[#0d1117]/[0.08] flex justify-center">
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
          This is a general signal based on common patterns among fashion brands, not a formal
          recommendation or a determination that you need PLM software. Only you know if the timing,
          budget, and team bandwidth are right.
        </p>
      </div>
    </section>
  );
}
