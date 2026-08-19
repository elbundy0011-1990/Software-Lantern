"use client";

import { useState } from "react";
import Link from "next/link";

type Process = "spreadsheets" | "mixed" | "workingPlm" | "outgrowingPlm" | "notSure";
type Brand = "single" | "multi" | "notSure";
type ProcessLevel = "centralized" | "mixed" | "manual" | "inconsistent";
type Frequency = "rarely" | "occasionally" | "weekly" | "almostDaily";
type ReconcileTime = "little" | "fewHours" | "severalHours" | "significant";
type Screen =
  | "process"
  | "brand"
  | "info"
  | "techpacks"
  | "boms"
  | "supplierComm"
  | "chasing"
  | "conflicting"
  | "reconciling"
  | "improve"
  | "result";

const NONE_IMPROVE = "none";

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

const INFO_OPTIONS: { value: ProcessLevel; label: string }[] = [
  { value: "centralized", label: "Centralized in a PLM or similar system, one place, one version" },
  { value: "mixed", label: "Some of it lives in shared tools, but it's not fully centralized" },
  { value: "manual", label: "Mostly spreadsheets and shared drives" },
  { value: "inconsistent", label: "Inconsistent, it depends who you ask" },
];

const TECHPACK_OPTIONS: { value: ProcessLevel; label: string }[] = [
  { value: "centralized", label: "Centralized and versioned in a system, factories see the live version" },
  { value: "mixed", label: "Digital files, but versioning is manual (filenames, folders)" },
  { value: "manual", label: "Mostly static documents emailed to factories" },
  { value: "inconsistent", label: "Inconsistent, it depends on the developer" },
];

const BOM_OPTIONS: { value: ProcessLevel; label: string }[] = [
  { value: "centralized", label: "Centralized in a system, copied and adjusted from existing styles" },
  { value: "mixed", label: "Spreadsheets, but with a consistent template" },
  { value: "manual", label: "Rebuilt from scratch each season in spreadsheets" },
  { value: "inconsistent", label: "Inconsistent, varies by person or team" },
];

const SUPPLIER_OPTIONS: { value: ProcessLevel; label: string }[] = [
  { value: "centralized", label: "Suppliers work directly in a shared system with us" },
  { value: "mixed", label: "A mix of email and shared files" },
  { value: "manual", label: "Almost entirely over email" },
  { value: "inconsistent", label: "Inconsistent, depends on the supplier" },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: "rarely", label: "Rarely" },
  { value: "occasionally", label: "Occasionally" },
  { value: "weekly", label: "Weekly" },
  { value: "almostDaily", label: "Almost daily" },
];

const RECONCILE_OPTIONS: { value: ReconcileTime; label: string }[] = [
  { value: "little", label: "Little to none" },
  { value: "fewHours", label: "A few hours a week" },
  { value: "severalHours", label: "Several hours a week" },
  { value: "significant", label: "A significant, ongoing drain" },
];

// "short" is used only in the result recap; "label" is the full option text
// shown on the multi-select screen. Every option here traces to a pain
// point or "how to choose" factor already documented in /docs/ICP.md or
// this page's own content, not an invented buyer concern.
const IMPROVE_OPTIONS: { value: string; label: string; short: string }[] = [
  { value: "info", label: "Centralizing product information in one place", short: "centralizing product information" },
  { value: "techpacks", label: "Tech pack accuracy and version control", short: "tech pack accuracy" },
  { value: "bom", label: "BOM management", short: "BOM management" },
  { value: "supplier", label: "Supplier and factory communication", short: "supplier communication" },
  { value: "sampling", label: "Sample tracking and approvals", short: "sample tracking" },
  { value: "costing", label: "Costing accuracy and visibility", short: "costing visibility" },
  { value: "criticalpath", label: "Critical-path and deadline tracking", short: "critical-path tracking" },
  { value: "handover", label: "Production handover accuracy", short: "production handover" },
  { value: "reporting", label: "Reporting and visibility across the business", short: "reporting and visibility" },
];

const INFO_PHRASES: Record<ProcessLevel, string> = {
  centralized: "your product information lives in one place",
  mixed: "product information split across a few different tools",
  manual: "product information mostly living in spreadsheets and shared drives",
  inconsistent: "product information that depends on who you ask",
};

const TECHPACK_PHRASES: Record<ProcessLevel, string> = {
  centralized: "tech packs are versioned and factories see the live copy",
  mixed: "tech pack versions tracked by hand, in filenames and folders",
  manual: "tech packs that are mostly static documents emailed to factories",
  inconsistent: "a tech pack process that varies by developer",
};

const BOM_PHRASES: Record<ProcessLevel, string> = {
  centralized: "BOMs get copied and adjusted from existing styles instead of rebuilt",
  mixed: "BOMs kept in spreadsheets, even with a consistent template",
  manual: "BOMs rebuilt from scratch every season",
  inconsistent: "a BOM process that varies by person or team",
};

const SUPPLIER_PHRASES: Record<ProcessLevel, string> = {
  centralized: "suppliers work directly in a shared system with you",
  mixed: "supplier communication split between email and shared files",
  manual: "supplier communication that's almost entirely over email",
  inconsistent: "supplier communication that varies by supplier",
};

const CHASING_PHRASES: Record<Frequency, string> = {
  rarely: "you're rarely chasing people down for information",
  occasionally: "occasionally chasing people down for product information",
  weekly: "chasing people down for product information weekly",
  almostDaily: "chasing people down for product information almost daily",
};

const CONFLICTING_PHRASES: Record<Frequency, string> = {
  rarely: "conflicting or outdated versions are rare for you",
  occasionally: "occasionally running into conflicting or outdated versions",
  weekly: "running into conflicting or outdated versions weekly",
  almostDaily: "running into conflicting or outdated versions almost daily",
};

const RECONCILE_PHRASES: Record<ReconcileTime, string> = {
  little: "not much time lost reconciling data by hand",
  fewHours: "a few hours a week spent reconciling data by hand",
  severalHours: "several hours a week lost reconciling data by hand",
  significant: "a significant, ongoing drain reconciling data by hand",
};

function processPoints(level: ProcessLevel): number {
  if (level === "centralized") return 0;
  if (level === "mixed") return 1;
  return 2; // manual or inconsistent
}

function frequencyPoints(f: Frequency): number {
  if (f === "rarely") return 0;
  if (f === "occasionally") return 1;
  if (f === "weekly") return 2;
  return 3; // almostDaily
}

function reconcilePoints(r: ReconcileTime): number {
  if (r === "little") return 0;
  if (r === "fewHours") return 1;
  if (r === "severalHours") return 2;
  return 3; // significant
}

// "Nothing in particular right now" is deliberately non-scoring: it
// contributes 0, the same as leaving the question at zero real
// selections, rather than being treated as a confirmed-zero-signal that
// pulls toward the low band.
function improvePoints(items: string[]): number {
  const real = items.filter((v) => v !== NONE_IMPROVE);
  if (real.length >= 4) return 2;
  if (real.length >= 1) return 1;
  return 0;
}

function joinWithAnd(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

type Band = "low" | "emerging" | "strong";

// Low ceiling is deliberately 2, not higher: the minimum possible
// contribution from Q3-Q6 when all four are non-centralized is 4 (the
// mildest non-centralized tier, "mixed", scores 1, across 4 questions),
// which sits 2 points clear of this ceiling. A genuinely manual process
// across all four core questions can never land in "low", regardless of
// how mild the frequency-of-pain answers are, without needing the
// frequency or improve-list answers to do any of that work.
function scoreBand(score: number): Band {
  if (score <= 2) return "low";
  if (score <= 10) return "emerging";
  return "strong";
}

const MAIN_PATH_STEPS = 10;

function stepNumber(screen: Screen): number {
  switch (screen) {
    case "process":
      return 1;
    case "brand":
      return 2;
    case "info":
      return 3;
    case "techpacks":
      return 4;
    case "boms":
      return 5;
    case "supplierComm":
      return 6;
    case "chasing":
      return 7;
    case "conflicting":
      return 8;
    case "reconciling":
      return 9;
    case "improve":
      return 10;
    default:
      return 0;
  }
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

// Matches the established sitewide "publish a brief, providers self-select"
// pattern (see /plm's own hero copy and FAQ) rather than any phrasing that
// implies Software Lantern determines or performs the matching.
const publishBriefSentence =
  "Tell us what you're trying to manage, and we'll publish your brief to fashion PLM providers in the category. Up to 3 who believe they're a fit will respond.";

export function PlmReadinessChecker() {
  const [screen, setScreen] = useState<Screen>("process");
  const [process, setProcess] = useState<Process | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [info, setInfo] = useState<ProcessLevel | null>(null);
  const [techpacks, setTechpacks] = useState<ProcessLevel | null>(null);
  const [boms, setBoms] = useState<ProcessLevel | null>(null);
  const [supplierComm, setSupplierComm] = useState<ProcessLevel | null>(null);
  const [chasing, setChasing] = useState<Frequency | null>(null);
  const [conflicting, setConflicting] = useState<Frequency | null>(null);
  const [reconciling, setReconciling] = useState<ReconcileTime | null>(null);
  const [improve, setImprove] = useState<string[]>([]);

  const pickProcess = (p: Process) => {
    setProcess(p);
    setScreen(p === "workingPlm" || p === "outgrowingPlm" ? "result" : "brand");
  };
  const pickBrand = (b: Brand) => {
    setBrand(b);
    setScreen("info");
  };
  const pickInfo = (v: ProcessLevel) => {
    setInfo(v);
    setScreen("techpacks");
  };
  const pickTechpacks = (v: ProcessLevel) => {
    setTechpacks(v);
    setScreen("boms");
  };
  const pickBoms = (v: ProcessLevel) => {
    setBoms(v);
    setScreen("supplierComm");
  };
  const pickSupplierComm = (v: ProcessLevel) => {
    setSupplierComm(v);
    setScreen("chasing");
  };
  const pickChasing = (v: Frequency) => {
    setChasing(v);
    setScreen("conflicting");
  };
  const pickConflicting = (v: Frequency) => {
    setConflicting(v);
    setScreen("reconciling");
  };
  const pickReconciling = (v: ReconcileTime) => {
    setReconciling(v);
    setScreen("improve");
  };

  const toggleImprove = (value: string) => {
    setImprove((cur) => {
      if (value === NONE_IMPROVE) return cur.includes(NONE_IMPROVE) ? [] : [NONE_IMPROVE];
      const withoutNone = cur.filter((x) => x !== NONE_IMPROVE);
      return withoutNone.includes(value) ? withoutNone.filter((x) => x !== value) : [...withoutNone, value];
    });
  };
  const finishImprove = () => setScreen("result");

  const restart = () => {
    setScreen("process");
    setProcess(null);
    setBrand(null);
    setInfo(null);
    setTechpacks(null);
    setBoms(null);
    setSupplierComm(null);
    setChasing(null);
    setConflicting(null);
    setReconciling(null);
    setImprove([]);
  };

  const isShortCircuit = process === "workingPlm" || process === "outgrowingPlm";
  const total = isShortCircuit ? 1 : MAIN_PATH_STEPS;

  const score =
    (brand === "multi" ? 2 : 0) +
    processPoints(info ?? "centralized") +
    processPoints(techpacks ?? "centralized") +
    processPoints(boms ?? "centralized") +
    processPoints(supplierComm ?? "centralized") +
    frequencyPoints(chasing ?? "rarely") +
    frequencyPoints(conflicting ?? "rarely") +
    reconcilePoints(reconciling ?? "little") +
    improvePoints(improve);
  const band = scoreBand(score);

  const frictionDrivers = (): string[] => {
    const items: { text: string; weight: number }[] = [];
    if (info && info !== "centralized") items.push({ text: INFO_PHRASES[info], weight: processPoints(info) });
    if (techpacks && techpacks !== "centralized")
      items.push({ text: TECHPACK_PHRASES[techpacks], weight: processPoints(techpacks) });
    if (boms && boms !== "centralized") items.push({ text: BOM_PHRASES[boms], weight: processPoints(boms) });
    if (supplierComm && supplierComm !== "centralized")
      items.push({ text: SUPPLIER_PHRASES[supplierComm], weight: processPoints(supplierComm) });
    if (chasing && chasing !== "rarely") items.push({ text: CHASING_PHRASES[chasing], weight: frequencyPoints(chasing) });
    if (conflicting && conflicting !== "rarely")
      items.push({ text: CONFLICTING_PHRASES[conflicting], weight: frequencyPoints(conflicting) });
    if (reconciling && reconciling !== "little")
      items.push({ text: RECONCILE_PHRASES[reconciling], weight: reconcilePoints(reconciling) });
    items.sort((a, b) => b.weight - a.weight);
    return items.slice(0, 4).map((i) => i.text);
  };

  const positiveDrivers = (): string[] => {
    const items: string[] = [];
    if (info === "centralized") items.push(INFO_PHRASES.centralized);
    if (techpacks === "centralized") items.push(TECHPACK_PHRASES.centralized);
    if (boms === "centralized") items.push(BOM_PHRASES.centralized);
    if (supplierComm === "centralized") items.push(SUPPLIER_PHRASES.centralized);
    if (chasing === "rarely") items.push(CHASING_PHRASES.rarely);
    if (conflicting === "rarely") items.push(CONFLICTING_PHRASES.rarely);
    if (reconciling === "little") items.push(RECONCILE_PHRASES.little);
    return items.slice(0, 3);
  };

  const improveClause = (): string | null => {
    const real = IMPROVE_OPTIONS.filter((o) => improve.includes(o.value));
    if (real.length === 0) return null;
    const labels = real.slice(0, 3).map((o) => o.short);
    return `You also flagged wanting to improve ${joinWithAnd(labels)}.`;
  };

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
          <p className="text-[16px] text-[#5c6573] text-center mb-4">
            Outgrowing an existing system is one of the most common reasons fashion brands switch
            providers. The right next step is usually the same as evaluating PLM for the first time: get
            clear on where the current one is falling short, then compare options against that gap.
          </p>
          <p className="text-[15px] text-[#3d4653] text-center mb-6">{publishBriefSentence}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={finderHref}
              className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              Find my PLM →
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
      const positives = positiveDrivers();
      return (
        <>
          <ResultHeadline>Sounds like your process is holding up</ResultHeadline>
          <p className="text-[16px] text-[#5c6573] text-center mb-6">
            Based on your answers{positives.length > 0 ? `, ${joinWithAnd(positives)}` : ""}. That&apos;s
            a genuinely good sign. Plenty of fashion brands run on spreadsheets and email far longer than
            they&apos;d guess, without real damage. Worth revisiting if that changes: more SKUs, more
            suppliers, or a process that starts falling short at the wrong moment.
          </p>
          <div className="flex justify-center">
            <a href="#how-to-choose" className="text-[14px] font-semibold text-[#4f46e5] underline underline-offset-2">
              Curious what a more structured process typically includes? See what fashion PLM software
              covers ↓
            </a>
          </div>
        </>
      );
    }

    const friction = frictionDrivers();
    const improveNote = improveClause();

    if (band === "emerging") {
      return (
        <>
          <ResultHeadline>Some of this is exactly the friction PLM is designed to remove</ResultHeadline>
          <p className="text-[16px] text-[#3d4653] text-center mb-3">
            Based on your answers{friction.length > 0 ? ` — ${joinWithAnd(friction)}` : ""} — that&apos;s
            real day-to-day friction, though on its own it doesn&apos;t mean you need to go looking.
            It&apos;s a reasonable point to start understanding what&apos;s out there before it compounds.
          </p>
          {improveNote && <p className="text-[15px] text-[#3d4653] text-center mb-3">{improveNote}</p>}
          <p className="text-[15px] text-[#3d4653] text-center mb-6">{publishBriefSentence}</p>
          <div className="flex justify-center">
            <Link
              href={finderHref}
              className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              Find my PLM →
            </Link>
          </div>
        </>
      );
    }

    // strong
    return (
      <>
        <ResultHeadline>This is the kind of complexity fashion PLM software is designed to handle</ResultHeadline>
        <p className="text-[16px] text-[#3d4653] text-center mb-3">
          Based on your answers{friction.length > 0 ? ` — ${joinWithAnd(friction)}` : ""} — that&apos;s a
          lot of the friction fashion PLM software exists to solve. That&apos;s not a determination that
          you need to buy something, but it&apos;s the pattern we typically see in brands actively
          evaluating PLM.
        </p>
        {improveNote && <p className="text-[15px] text-[#3d4653] text-center mb-3">{improveNote}</p>}
        <p className="text-[15px] text-[#3d4653] text-center mb-6">{publishBriefSentence}</p>
        <div className="flex justify-center">
          <Link
            href={finderHref}
            className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
          >
            Find my PLM →
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
          A handful of quick questions about your process and how it feels day to day. Not a
          determination, just a signal worth weighing before you start evaluating providers.
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

          {screen === "info" && (
            <div key="info" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How is your core product information (specs, materials, approvals) managed?
              </h3>
              <div className="grid gap-3 mb-7">
                {INFO_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={info === opt.value}
                    onClick={() => pickInfo(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("brand")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "techpacks" && (
            <div key="techpacks" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How are tech packs created, versioned, and shared with factories?
              </h3>
              <div className="grid gap-3 mb-7">
                {TECHPACK_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={techpacks === opt.value}
                    onClick={() => pickTechpacks(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("info")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "boms" && (
            <div key="boms" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How are bills of materials built and maintained?
              </h3>
              <div className="grid gap-3 mb-7">
                {BOM_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={boms === opt.value}
                    onClick={() => pickBoms(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("techpacks")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "supplierComm" && (
            <div key="supplierComm" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How do you communicate with suppliers and factories about specs, samples, and approvals?
              </h3>
              <div className="grid gap-3 mb-7">
                {SUPPLIER_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={supplierComm === opt.value}
                    onClick={() => pickSupplierComm(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("boms")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "chasing" && (
            <div key="chasing" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How often do you (or your team) have to chase someone down for product information?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={chasing === opt.value}
                    onClick={() => pickChasing(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("supplierComm")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "conflicting" && (
            <div key="conflicting" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                How often do you run into conflicting or outdated versions of a spec, BOM, or tech pack?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {FREQUENCY_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={conflicting === opt.value}
                    onClick={() => pickConflicting(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("chasing")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "reconciling" && (
            <div key="reconciling" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                About how much team time goes into manually reconciling data across spreadsheets, email,
                and files?
              </h3>
              <div className="grid gap-3 mb-7">
                {RECONCILE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={reconciling === opt.value}
                    onClick={() => pickReconciling(opt.value)}
                  />
                ))}
              </div>
              <button onClick={() => setScreen("conflicting")} className={backButtonClass}>
                ← Back
              </button>
            </div>
          )}

          {screen === "improve" && (
            <div key="improve" className="step-in">
              <h3 className="font-sans font-semibold text-[21px] mb-5">
                Which of these would you most like to improve?
              </h3>
              <div className="grid gap-3 mb-7">
                {IMPROVE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={improve.includes(opt.value)}
                    onClick={() => toggleImprove(opt.value)}
                    multi
                  />
                ))}
                <OptionCard
                  label="Nothing in particular right now"
                  selected={improve.includes(NONE_IMPROVE)}
                  onClick={() => toggleImprove(NONE_IMPROVE)}
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen("reconciling")} className={backButtonClass}>
                  ← Back
                </button>
                <button
                  onClick={finishImprove}
                  disabled={improve.length === 0}
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
