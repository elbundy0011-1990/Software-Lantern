"use client";

import { useState } from "react";
import { NIS2_DATES, OFFICIAL_SCOPE_TOOLS, type Nis2Country } from "@/lib/nis2-dates";

type Sector = "machine_builder" | "other" | "not_sure";
type Size = "medium_large" | "small_micro" | "not_sure";
type RemoteAccess = "yes" | "no" | "not_sure";
type Screen = "country" | "sector" | "size" | "remote_access" | "result";

const ACCENT = "#0f766e";
const ACCENT_DARK = "#115e59";

const COUNTRY_OPTIONS: { value: Nis2Country; label: string; supporting?: string }[] = [
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "other", label: "Elsewhere" },
  { value: "not_sure", label: "Not sure / multiple countries" },
];

const SECTOR_OPTIONS: { value: Sector; label: string; supporting?: string }[] = [
  {
    value: "machine_builder",
    label: "Yes, we design or build machinery or equipment",
    supporting: "Covers NACE division 28 (machinery and equipment) under NIS2 Annex II",
  },
  { value: "other", label: "No, something else" },
  { value: "not_sure", label: "Not sure" },
];

const SIZE_OPTIONS: { value: Size; label: string; supporting?: string }[] = [
  {
    value: "medium_large",
    label: "Medium or large",
    supporting: "Generally: 50 or more staff, or over €10m annual turnover or balance sheet total",
  },
  {
    value: "small_micro",
    label: "Small or micro",
    supporting: "Generally: under 50 staff and €10m or less turnover and balance sheet total",
  },
  { value: "not_sure", label: "Not sure" },
];

const REMOTE_ACCESS_OPTIONS: { value: RemoteAccess; label: string }[] = [
  { value: "yes", label: "Yes, we can connect into machines at customer sites" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

function totalSteps(): number {
  return 4;
}
function stepNumber(screen: Screen): number {
  if (screen === "country") return 1;
  if (screen === "sector") return 2;
  if (screen === "size") return 3;
  if (screen === "remote_access") return 4;
  return 0;
}

function ProgressIndicator({ screen }: { screen: Screen }) {
  const total = totalSteps();
  const current = stepNumber(screen);
  return (
    <div className="flex items-center gap-[14px] mb-8">
      <div className="flex-1 h-[6px] rounded-full bg-white overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${(current / total) * 100}%`, background: ACCENT }}
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
}: {
  label: string;
  supporting?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-4 text-left rounded-2xl border-2 bg-white px-5 py-5 font-sans transition-colors duration-150"
      style={{ borderColor: selected ? ACCENT : "rgba(13,17,23,0.12)" }}
    >
      <span
        className="shrink-0 mt-[2px] w-[20px] h-[20px] rounded-full flex items-center justify-center border-2"
        style={{ borderColor: selected ? ACCENT : "rgba(13,17,23,0.22)", background: selected ? ACCENT : "transparent" }}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12.5L9.5 18L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-[15px] font-semibold text-[#0d1117]">{label}</span>
        {supporting && <span className="block mt-[3px] text-[13px] font-normal text-[#79818f]">{supporting}</span>}
      </span>
    </button>
  );
}

const backButtonClass =
  "rounded-full px-5 py-[10px] font-sans font-semibold text-[14px] text-[#5c6573] border border-[#0d1117]/[0.14] hover:bg-[#0d1117]/[0.05]";

function countryInfo(country: Nis2Country | null) {
  if (country === "NL") return NIS2_DATES.netherlands;
  if (country === "BE") return NIS2_DATES.belgium;
  return null;
}

function OfficialToolNote({ country }: { country: Nis2Country | null }) {
  const tool = country === "NL" ? OFFICIAL_SCOPE_TOOLS.NL : country === "BE" ? OFFICIAL_SCOPE_TOOLS.BE : null;
  return (
    <div className="rounded-xl bg-[#f6f7fb] border border-[#0d1117]/[0.08] p-5 text-[14px] text-[#3d4653] mb-4">
      <p className="mb-2">
        This checker is built specifically for machine builders, the Benelux, and the supply-chain
        pressure angle covered below. It is not a substitute for your own country&apos;s official
        self-evaluation tool, which covers every sector and is the better source for a definitive
        answer.
      </p>
      {tool ? (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: ACCENT_DARK }}>
          {tool.name} →
        </a>
      ) : (
        <>
          <a href={OFFICIAL_SCOPE_TOOLS.NL.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline block mb-1" style={{ color: ACCENT_DARK }}>
            {OFFICIAL_SCOPE_TOOLS.NL.name} (Netherlands) →
          </a>
          <a href={OFFICIAL_SCOPE_TOOLS.BE.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: ACCENT_DARK }}>
            {OFFICIAL_SCOPE_TOOLS.BE.name} (Belgium) →
          </a>
        </>
      )}
    </div>
  );
}

// The required branch for builders who are themselves outside NIS2's
// direct scope on size: phrased throughout as commercial/contractual
// pressure that may come from a customer's own compliance obligations,
// never as a legal requirement on the builder. See docs/OT-CYBER-PLAN.md
// §1.4 and §3 of the approval for why this distinction is load-bearing.
function SupplyChainPressureNote({ remoteAccess }: { remoteAccess: RemoteAccess | null }) {
  return (
    <div className="rounded-xl border p-5 text-[14px] text-[#3d4653] mb-4" style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}>
      <p className="font-semibold mb-2" style={{ color: ACCENT_DARK }}>
        A likely commercial pressure, not a legal requirement on you
      </p>
      <p className="mb-2">
        NIS2 Article 21(2)(d) requires companies that <em>are</em> in scope to assess the security
        practices of their direct suppliers, including machine builders and integrators with remote
        access into their systems. If one or more of your customers are themselves in scope, some of
        them may ask you, as a supplier, to demonstrate specific security practices as a condition
        of doing business.
      </p>
      <p>
        That is commercial pressure coming from your customer&apos;s own obligations, not a separate
        legal requirement on your business under NIS2 itself.
        {remoteAccess === "yes" &&
          " Since you've indicated you can connect into customer sites remotely, this is a realistic scenario worth preparing for even though it isn't a legal obligation on you directly."}
      </p>
    </div>
  );
}

function GenerallyOutOfScopeResult({ country, remoteAccess }: { country: Nis2Country | null; remoteAccess: RemoteAccess | null }) {
  return (
    <>
      <div className="rounded-2xl border border-[#0d1117]/[0.09] bg-white p-7 sm:p-9 text-center mb-6">
        <p className="mb-2 text-[13px] font-bold tracking-[0.08em] uppercase" style={{ color: ACCENT_DARK }}>
          Based on your answers
        </p>
        <p className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117]" style={{ fontSize: "clamp(24px,4vw,30px)" }}>
          Generally outside NIS2&apos;s direct scope, based on size
        </p>
      </div>
      <p className="text-[15px] text-[#5c6573] text-center mb-4">
        NIS2 generally only applies to medium and large companies (broadly: 50 or more staff, or
        over €10m turnover or balance sheet total) in the sectors it covers. A small or micro
        business is generally outside its direct scope, unless a specific exception applies, such
        as being identified individually as critical by your country&apos;s authority.
      </p>
      <SupplyChainPressureNote remoteAccess={remoteAccess} />
      <OfficialToolNote country={country} />
    </>
  );
}

function InScopeResult({ country }: { country: Nis2Country | null }) {
  const info = countryInfo(country);
  return (
    <>
      <div className="rounded-2xl border p-7 sm:p-9 text-center mb-6" style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}>
        <p className="mb-2 text-[13px] font-bold tracking-[0.08em] uppercase" style={{ color: ACCENT_DARK }}>
          Based on your answers
        </p>
        <p className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117] mb-2" style={{ fontSize: "clamp(24px,4vw,30px)" }}>
          Likely an &ldquo;important entity&rdquo; under NIS2
        </p>
        <p className="text-[14px] text-[#5c6573]">
          Machinery and equipment manufacturing (NACE division 28) sits in NIS2 Annex II, which
          generally produces important-entity status for medium and large companies, not essential.
        </p>
      </div>
      {info && (
        <p className="text-[15px] text-[#3d4653] text-center mb-4">
          {country === "NL" ? (
            <>
              In the Netherlands, the <strong>{info.lawName}</strong> entered into force on{" "}
              <strong>{info.inForceDisplay}</strong> ({info.citation}).
            </>
          ) : (
            <>
              In Belgium, NIS2 has applied since <strong>{info.inForceDisplay}</strong> via the{" "}
              <strong>{info.lawName}</strong>. Belgium has since moved into conformity-assessment
              deadlines for in-scope entities, which you should confirm directly with the CCB.
            </>
          )}
        </p>
      )}
      <p className="text-[15px] text-[#3d4653] text-center mb-4">
        In scope generally means risk-management measures covering things like incident handling,
        supply-chain security, access management, and multi-factor authentication for remote
        access, not a requirement to buy any specific product.
      </p>
      <OfficialToolNote country={country} />
    </>
  );
}

function NotSureResult({ country, remoteAccess }: { country: Nis2Country | null; remoteAccess: RemoteAccess | null }) {
  return (
    <>
      <div className="rounded-2xl border border-[#0d1117]/[0.09] bg-white p-7 sm:p-9 text-center mb-6">
        <p className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#0d1117]" style={{ fontSize: "clamp(24px,4vw,30px)" }}>
          Not enough to give you a definite answer
        </p>
      </div>
      <p className="text-[15px] text-[#5c6573] text-center mb-4">
        Whether NIS2 applies to you generally depends on your sector and your company size (broadly:
        50 or more staff, or over €10m turnover or balance sheet total puts you at or above the
        threshold that&apos;s in scope; below that, you&apos;re generally outside it). Your own official
        government tool, linked below, asks more detailed questions and is the better source for a
        definitive answer.
      </p>
      <SupplyChainPressureNote remoteAccess={remoteAccess} />
      <OfficialToolNote country={country} />
    </>
  );
}

export function Nis2ScopeChecker({
  onAnswersChange,
}: {
  // Lifts the checker's answers up to the page so the lead-capture form
  // below can submit exactly what was shown in the result, without this
  // component needing to know anything about the form or the API route.
  onAnswersChange?: (answers: { country: Nis2Country | null; sector: Sector | null; size: Size | null; remoteAccess: RemoteAccess | null }) => void;
}) {
  const [screen, setScreen] = useState<Screen>("country");
  const [country, setCountry] = useState<Nis2Country | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [remoteAccess, setRemoteAccess] = useState<RemoteAccess | null>(null);

  const emit = (next: { country?: Nis2Country | null; sector?: Sector | null; size?: Size | null; remoteAccess?: RemoteAccess | null }) => {
    onAnswersChange?.({
      country: next.country ?? country,
      sector: next.sector ?? sector,
      size: next.size ?? size,
      remoteAccess: next.remoteAccess ?? remoteAccess,
    });
  };

  const pickCountry = (c: Nis2Country) => {
    setCountry(c);
    setScreen("sector");
    emit({ country: c });
  };
  const pickSector = (s: Sector) => {
    setSector(s);
    setScreen("size");
    emit({ sector: s });
  };
  const pickSize = (s: Size) => {
    setSize(s);
    setScreen("remote_access");
    emit({ size: s });
  };
  const pickRemoteAccess = (r: RemoteAccess) => {
    setRemoteAccess(r);
    setScreen("result");
    emit({ remoteAccess: r });
  };
  const restart = () => {
    setScreen("country");
    setCountry(null);
    setSector(null);
    setSize(null);
    setRemoteAccess(null);
  };

  const renderResult = () => {
    if (size === "not_sure" || sector === "not_sure") {
      return <NotSureResult country={country} remoteAccess={remoteAccess} />;
    }
    if (size === "small_micro") {
      return <GenerallyOutOfScopeResult country={country} remoteAccess={remoteAccess} />;
    }
    if (size === "medium_large" && sector === "machine_builder") {
      return <InScopeResult country={country} />;
    }
    // medium/large but not a machine builder (or "other" sector) — still
    // possibly in scope under a different Annex I/II sector, but this
    // checker doesn't cover that; be honest about the limit rather than
    // guessing at a sector it wasn't built to assess.
    return <NotSureResult country={country} remoteAccess={remoteAccess} />;
  };

  return (
    <section id="nis2-scope-checker" className="border-b border-[#0d1117]/[0.07]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
          Does NIS2 apply to your business?
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-10">
          A few questions, built specifically for machine builders in the Netherlands and Belgium,
          including the supply-chain pressure a customer may put on you even if NIS2 doesn&apos;t
          apply to you directly. Not a substitute for the official government tool linked in your
          result.
        </p>

        <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} />}

          {screen === "country" && (
            <div key="country">
              <h3 className="font-sans font-semibold text-[21px] mb-5">Where is your business based?</h3>
              <div className="grid gap-3">
                {COUNTRY_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} supporting={opt.supporting} selected={country === opt.value} onClick={() => pickCountry(opt.value)} />
                ))}
              </div>
            </div>
          )}

          {screen === "sector" && (
            <div key="sector">
              <h3 className="font-sans font-semibold text-[21px] mb-5">Do you design or manufacture machinery or equipment?</h3>
              <div className="grid gap-3 mb-7">
                {SECTOR_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} supporting={opt.supporting} selected={sector === opt.value} onClick={() => pickSector(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("country")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "size" && (
            <div key="size">
              <h3 className="font-sans font-semibold text-[21px] mb-5">What&apos;s your company size?</h3>
              <div className="grid gap-3 mb-7">
                {SIZE_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} supporting={opt.supporting} selected={size === opt.value} onClick={() => pickSize(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("sector")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "remote_access" && (
            <div key="remote_access">
              <h3 className="font-sans font-semibold text-[21px] mb-2">
                Do you or your dealers connect into your machines at customer sites?
              </h3>
              <p className="text-[14px] text-[#5c6573] mb-5">
                For servicing, diagnostics, or support, over the internet.
              </p>
              <div className="grid gap-3 mb-7">
                {REMOTE_ACCESS_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={remoteAccess === opt.value} onClick={() => pickRemoteAccess(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("size")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "result" && (
            <div key="result">
              {renderResult()}
              <div className="mt-7 pt-6 border-t border-[#0d1117]/[0.08] flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#ot-enquiry-form"
                  className="rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
                  style={{ background: ACCENT }}
                >
                  Tell us about your situation →
                </a>
                <button onClick={restart} className="text-[14px] font-semibold text-[#5c6573] underline underline-offset-2">
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-[13px] leading-[1.6] text-[#79818f]">
          This is a general guide based on NIS2 and its Dutch and Belgian implementing laws, not
          legal advice, and it deliberately says &ldquo;generally&rdquo; because real exceptions
          exist. Confirm your specific obligations with the official government tool above or a
          qualified advisor.
        </p>
      </div>
    </section>
  );
}
