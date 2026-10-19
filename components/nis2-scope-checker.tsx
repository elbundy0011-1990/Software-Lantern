"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { NIS2_DATES, OFFICIAL_SCOPE_TOOLS, type Nis2Country } from "@/lib/nis2-dates";
import { COMPLIANCE_LEDGER } from "@/lib/compliance-ledger";
import { ComplianceLedger } from "./compliance-ledger";

export type Audience = "builder" | "operator" | "integrator" | "not_sure";
export type Size = "medium_large" | "small_micro" | "not_sure";
export type RemoteAccess = "yes" | "no" | "not_sure";
type Screen = "country" | "audience" | "size" | "remote_access" | "result";

// Palette per docs/OT-CYBER-PLAN.md Part B §B.2.4 — deliberately not the
// rest of the site's indigo/pill-button theme, so this reads as its own
// identity rather than a section of the Software Lantern marketplace.
const ACCENT = "#9a3412";
const ACCENT_DARK = "#7c2d12";
const IN_FORCE = "#166534";

const COUNTRY_OPTIONS: { value: Nis2Country; label: string }[] = [
  { value: "NL", label: "Netherlands" },
  { value: "BE", label: "Belgium" },
  { value: "LU", label: "Luxembourg" },
  { value: "other", label: "Elsewhere" },
  { value: "not_sure", label: "Not sure / multiple countries" },
];

const AUDIENCE_OPTIONS: { value: Audience; label: string; supporting?: string }[] = [
  { value: "builder", label: "Machine builder or manufacturer", supporting: "You design, build, or sell machinery or equipment" },
  { value: "operator", label: "Factory or plant operator", supporting: "You run production using machinery, your own or others'" },
  { value: "integrator", label: "System integrator", supporting: "You install, configure, or service equipment for others" },
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
  { value: "yes", label: "Yes, we (or our dealers/integrators) can connect in remotely" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

function totalSteps(): number {
  return 4;
}
function stepNumber(screen: Screen): number {
  if (screen === "country") return 1;
  if (screen === "audience") return 2;
  if (screen === "size") return 3;
  if (screen === "remote_access") return 4;
  return 0;
}

function ProgressIndicator({ screen }: { screen: Screen }) {
  const total = totalSteps();
  const current = stepNumber(screen);
  return (
    <div className="flex items-center gap-[14px] mb-8">
      <div className="flex-1 h-[6px] rounded-sm bg-white overflow-hidden">
        <div
          className="h-full rounded-sm transition-[width] duration-300"
          style={{ width: `${(current / total) * 100}%`, background: ACCENT }}
        />
      </div>
      <span className="text-[13px] font-bold text-[#3f4b52] whitespace-nowrap">
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
      className="flex items-start gap-4 text-left rounded border-2 bg-white px-5 py-5 font-sans transition-colors duration-150"
      style={{ borderColor: selected ? ACCENT : "rgba(63,75,82,0.22)" }}
    >
      <span
        className="shrink-0 mt-[2px] w-[18px] h-[18px] rounded-full flex items-center justify-center border-2"
        style={{ borderColor: selected ? ACCENT : "rgba(63,75,82,0.3)", background: selected ? ACCENT : "transparent" }}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12.5L9.5 18L20 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span>
        <span className="block text-[15px] font-semibold text-[#1a1d22]">{label}</span>
        {supporting && <span className="block mt-[3px] text-[13px] font-normal text-[#3f4b52]">{supporting}</span>}
      </span>
    </button>
  );
}

const backButtonClass =
  "rounded px-5 py-[10px] font-sans font-semibold text-[14px] text-[#3f4b52] border border-[#3f4b52]/[0.3] hover:bg-[#3f4b52]/[0.06]";

function countryInfo(country: Nis2Country | null) {
  if (country === "NL") return NIS2_DATES.netherlands;
  if (country === "BE") return NIS2_DATES.belgium;
  if (country === "LU") return NIS2_DATES.luxembourg;
  return null;
}

// Gates the in-force date/citation sentence in Nis2OrgStatus below: only
// render it once the matching Compliance Ledger entry is verified, so an
// unquoted claim never renders publicly. Flip when lib/compliance-ledger.ts
// flips, no separate edit needed here.
function countryDateVerified(country: Nis2Country | null): boolean {
  const id = country === "NL" ? "nis2-nl" : country === "BE" ? "nis2-be" : country === "LU" ? "nis2-lu" : null;
  if (!id) return false;
  return COMPLIANCE_LEDGER.find((e) => e.id === id)?.verified ?? false;
}

function OfficialToolNote({ country }: { country: Nis2Country | null }) {
  const tool = country === "NL" ? OFFICIAL_SCOPE_TOOLS.NL : country === "BE" ? OFFICIAL_SCOPE_TOOLS.BE : null;
  return (
    <div className="rounded bg-[#f6f5f1] border border-[#3f4b52]/[0.15] p-5 text-[14px] text-[#3f4b52] mb-4">
      <p className="mb-2">
        This checker is built specifically for machine builders, operators, and integrators in the
        Benelux, and the supply-chain pressure angle covered below. It is not a substitute for your
        own country&apos;s official self-evaluation tool, which covers every sector and is the
        better source for a definitive answer.
      </p>
      {tool ? (
        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: ACCENT_DARK }}>
          {tool.name} →
        </a>
      ) : country === "LU" ? (
        <p className="text-[13px]">
          No Luxembourg-specific self-evaluation tool was found as of this writing. The competent
          authority is the Institut Luxembourgeois de Régulation (ILR).
        </p>
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

// The required branch for anyone (builder, operator, or integrator)
// outside NIS2's direct organizational scope on size: phrased throughout
// as commercial/contractual pressure that may come from a customer's own
// compliance obligations, never as a legal requirement on them directly.
function SupplyChainPressureNote({ audience, remoteAccess }: { audience: Audience | null; remoteAccess: RemoteAccess | null }) {
  const subject = audience === "operator" ? "your suppliers' remote-access practices" : "your own remote-access practices";
  return (
    <div className="rounded border p-5 text-[14px] text-[#3f4b52] mb-4" style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}>
      <p className="font-semibold mb-2" style={{ color: ACCENT_DARK }}>
        A likely commercial pressure, not a legal requirement
      </p>
      <p className="mb-2">
        NIS2 Article 21(2)(d) requires companies that <em>are</em> in scope to assess the security
        practices of their direct suppliers, including machine builders and integrators with remote
        access into their systems. If one or more of {audience === "operator" ? "your suppliers' customers" : "your customers"} are
        themselves in scope, this can create pressure around {subject}, even though it isn&apos;t a
        separate legal requirement on you under NIS2 itself.
      </p>
      {remoteAccess === "yes" && (
        <p>
          Since you&apos;ve indicated remote access into machines is part of how you work, this is a
          realistic scenario worth preparing for even though it isn&apos;t a legal obligation on you
          directly.
        </p>
      )}
    </div>
  );
}

function Iec62443Note() {
  return (
    <p className="text-[13px] text-[#3f4b52] text-center mb-4">
      IEC 62443 is a voluntary industrial-cybersecurity standard, not a law. No regulation makes it
      mandatory by itself, though some customers or contracts may require it. See{" "}
      <a href="/guides/iec-62443-explained" className="underline font-semibold" style={{ color: ACCENT_DARK }}>
        the guide
      </a>
      .
    </p>
  );
}

// Product-level rules (CRA, Machinery Regulation) apply to manufacturers
// placing products on the market, not gated by the same organizational
// size thresholds as NIS2 — shown for builders and integrators, who sit on
// the "placing a product on the market" side of this.
function ProductRulesNote() {
  const cra = COMPLIANCE_LEDGER.find((e) => e.id === "cra-reporting")!;
  const machinery = COMPLIANCE_LEDGER.find((e) => e.id === "machinery-regulation")!;
  return (
    <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5 text-[14px] text-[#3f4b52] mb-4">
      <p className="font-semibold mb-2 text-[#1a1d22]">Separately, your product has its own rules</p>
      <p className="mb-2">
        Your company&apos;s size mainly affects whether NIS2&apos;s organizational rules apply to you. It
        generally does not affect two separate, product-level rules that apply to manufacturers
        regardless of size: the Cyber Resilience Act (
        <a href={cra.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {cra.citationLabel}
        </a>
        ) and the Machinery Regulation (
        <a href={machinery.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {machinery.citationLabel}
        </a>
        ). Specific obligation dates for both are pending primary-source verification; the official
        texts linked above have the current timeline.
      </p>
      <p>
        Neither names or requires any specific product or vendor. Both set outcomes (secure by
        design, protection against corruption that could create a safety hazard), leaving the
        implementation to you.
      </p>
    </div>
  );
}

function ResultHeading({ children, tone }: { children: React.ReactNode; tone: "in_scope" | "out_of_scope" | "not_sure" }) {
  const color = tone === "in_scope" ? ACCENT_DARK : tone === "out_of_scope" ? IN_FORCE : "#3f4b52";
  const bg = tone === "in_scope" ? `${ACCENT}0d` : tone === "out_of_scope" ? `${IN_FORCE}0d` : "#ffffff";
  const border = tone === "in_scope" ? `${ACCENT}40` : tone === "out_of_scope" ? `${IN_FORCE}33` : "rgba(63,75,82,0.2)";
  return (
    <div className="rounded border p-7 sm:p-9 text-center mb-6" style={{ borderColor: border, background: bg }}>
      <p className="mb-2 text-[13px] font-bold tracking-[0.08em] uppercase" style={{ color }}>
        Based on your answers
      </p>
      <p className="font-sans font-semibold leading-tight tracking-[-0.02em] text-[#1a1d22]" style={{ fontSize: "clamp(24px,4vw,30px)" }}>
        {children}
      </p>
    </div>
  );
}

function Nis2OrgStatus({ country, size, audience }: { country: Nis2Country | null; size: Size | null; audience: Audience | null }) {
  const info = countryInfo(country);
  if (size === "small_micro") {
    return (
      <p className="text-[15px] text-[#3f4b52] text-center mb-4">
        NIS2&apos;s organizational rules generally only apply to medium and large companies (broadly:
        50 or more staff, or over €10m turnover or balance sheet total). A small or micro business is
        generally outside its direct scope, unless a specific exception applies, such as being
        identified individually as critical by your country&apos;s authority.
      </p>
    );
  }
  if (size === "medium_large") {
    return (
      <p className="text-[15px] text-[#3f4b52] text-center mb-4">
        {audience === "operator"
          ? "Whether NIS2 applies to you as an organization depends on your specific sector among its 18 covered sectors, which this checker doesn't attempt to classify (the official tool below does). Size is generally the first gate: at medium or large, you clear that threshold if your sector is covered."
          : "Machinery and equipment manufacturing (NACE division 28) sits in NIS2 Annex II, which generally produces important-entity status for medium and large companies, not essential."}
        {info && country !== "other" && country !== "not_sure" && countryDateVerified(country) && (
          <>
            {" "}In{" "}
            {country === "NL" ? "the Netherlands" : country === "BE" ? "Belgium" : "Luxembourg"}, this
            has applied since <strong>{info.inForceDisplay}</strong> ({info.citation}).
          </>
        )}
      </p>
    );
  }
  return (
    <p className="text-[15px] text-[#3f4b52] text-center mb-4">
      Whether NIS2&apos;s organizational rules apply to you generally depends on your sector and your
      company size (broadly: 50 or more staff, or over €10m turnover or balance sheet total is the
      threshold that&apos;s in scope; below that, you&apos;re generally outside it).
    </p>
  );
}

export function Nis2ScopeChecker({
  onAnswersChange,
}: {
  // Lifts the checker's answers up to the page so the lead-capture form
  // below can submit exactly what was shown in the result.
  onAnswersChange?: (answers: { country: Nis2Country | null; audience: Audience | null; size: Size | null; remoteAccess: RemoteAccess | null }) => void;
}) {
  const [screen, setScreen] = useState<Screen>("country");
  const [country, setCountry] = useState<Nis2Country | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [remoteAccess, setRemoteAccess] = useState<RemoteAccess | null>(null);
  const [started, setStarted] = useState(false);

  const emit = (next: { country?: Nis2Country | null; audience?: Audience | null; size?: Size | null; remoteAccess?: RemoteAccess | null }) => {
    onAnswersChange?.({
      country: next.country ?? country,
      audience: next.audience ?? audience,
      size: next.size ?? size,
      remoteAccess: next.remoteAccess ?? remoteAccess,
    });
  };

  const pickCountry = (c: Nis2Country) => {
    if (!started) {
      track("checker_start", {});
      setStarted(true);
    }
    setCountry(c);
    setScreen("audience");
    emit({ country: c });
  };
  const pickAudience = (a: Audience) => {
    setAudience(a);
    setScreen("size");
    emit({ audience: a });
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
    track("checker_complete", {
      country: country ?? "unknown",
      audience: audience ?? "unknown",
      in_scope_result: size === "medium_large" ? "likely_in_scope" : size === "small_micro" ? "generally_out" : "not_sure",
    });
  };
  const restart = () => {
    setScreen("country");
    setCountry(null);
    setAudience(null);
    setSize(null);
    setRemoteAccess(null);
  };

  const showProductRules = audience === "builder" || audience === "integrator";
  const showSupplyChainPressure = size === "small_micro" || size === "not_sure";

  const resultTone: "in_scope" | "out_of_scope" | "not_sure" =
    size === "medium_large" ? "in_scope" : size === "small_micro" ? "out_of_scope" : "not_sure";

  const resultHeadingText = () => {
    if (size === "medium_large") return "Likely in scope for NIS2's organizational rules";
    if (size === "small_micro") return "Generally outside NIS2's direct scope, based on size";
    return "Not enough to give you a definite answer on NIS2";
  };

  return (
    <section id="nis2-scope-checker" className="border-b border-[#3f4b52]/[0.15]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
          Does this apply to you?
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-6">
          A few questions for machine builders, factory operators, and system integrators in the
          Netherlands, Belgium, and Luxembourg, covering NIS2, the Cyber Resilience Act, and the
          Machinery Regulation, including the supply-chain pressure a customer may put on you even
          if none of these apply to you directly. Not a substitute for the official government tool
          linked in your result.
        </p>

        <div className="mb-10">
          <ComplianceLedger limit={3} />
        </div>

        <div className="bg-[#f6f5f1] border border-[#3f4b52]/[0.15] rounded p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} />}

          {screen === "country" && (
            <div key="country">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">Where is your business based?</h3>
              <div className="grid gap-3">
                {COUNTRY_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={country === opt.value} onClick={() => pickCountry(opt.value)} />
                ))}
              </div>
            </div>
          )}

          {screen === "audience" && (
            <div key="audience">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">Which of these is you?</h3>
              <div className="grid gap-3 mb-7">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} supporting={opt.supporting} selected={audience === opt.value} onClick={() => pickAudience(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("country")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "size" && (
            <div key="size">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">What&apos;s your company size?</h3>
              <div className="grid gap-3 mb-7">
                {SIZE_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} supporting={opt.supporting} selected={size === opt.value} onClick={() => pickSize(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("audience")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "remote_access" && (
            <div key="remote_access">
              <h3 className="font-sans font-semibold text-[21px] mb-2 text-[#1a1d22]">
                Is remote access into machines part of how you work?
              </h3>
              <p className="text-[14px] text-[#3f4b52] mb-5">
                Servicing, diagnostics, or support over the internet, by you, your dealers, or a
                supplier.
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
              <ResultHeading tone={resultTone}>{resultHeadingText()}</ResultHeading>
              <Nis2OrgStatus country={country} size={size} audience={audience} />
              {showSupplyChainPressure && <SupplyChainPressureNote audience={audience} remoteAccess={remoteAccess} />}
              {showProductRules && <ProductRulesNote />}
              <Iec62443Note />
              <OfficialToolNote country={country} />
              <div className="mt-7 pt-6 border-t border-[#3f4b52]/[0.15] flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#ot-enquiry-form"
                  className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white"
                  style={{ background: ACCENT }}
                >
                  Tell us about your situation →
                </a>
                <Link
                  href="/enquiry"
                  className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-[#1a1d22] border border-[#3f4b52]/[0.3]"
                >
                  Send an enquiry
                </Link>
                <button onClick={restart} className="text-[14px] font-semibold text-[#3f4b52] underline underline-offset-2">
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-[13px] leading-[1.6] text-[#3f4b52]">
          This is a general guide based on NIS2, the Cyber Resilience Act, and the Machinery
          Regulation, and their national implementing laws where applicable, not legal advice, and it
          deliberately says &ldquo;generally&rdquo; because real exceptions exist. Confirm your
          specific obligations with the official government tool above or a qualified advisor.
        </p>
      </div>
    </section>
  );
}
