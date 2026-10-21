"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { OFFICIAL_SCOPE_TOOLS, LUXEMBOURG_AUTHORITY, type Nis2Country } from "@/lib/nis2-dates";
import { sourceLineText } from "@/lib/compliance-ledger";
import { buildCheckerBrief, checkerBriefToText, CUSTOMER_QUESTIONS_CITATION, type CheckerBriefContent } from "@/lib/checker-brief";
import type { CheckerAnswers } from "@/lib/checker-session";
import { Countdown } from "@/components/countdown";
import { ResultActions } from "@/components/result-actions";
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
          authority is the {LUXEMBOURG_AUTHORITY}.
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

// The four outcome categories used only for analytics ("outcome" on
// result_viewed/brief_download/brief_copy/brief_email_request/talk_request), never
// for a verdict shown on screen.
export type Outcome = "in_scope" | "not_sure" | "customer_evidence" | "clearly_out";

export function computeOutcome(size: Size | null, remoteAccess: RemoteAccess | null): Outcome {
  if (size === "medium_large") return "in_scope";
  if (size === "not_sure") return "not_sure";
  // size === "small_micro": a plausible customer-evidence ask needs some
  // remote-access exposure to point to; "no" leaves nothing to raise.
  return remoteAccess === "no" ? "clearly_out" : "customer_evidence";
}

// Shared with components/ot-enquiry-form.tsx, which shows the same recap
// as a read-only "Your result" summary at the top of the form, so the
// wording a visitor sees on the result screen and on the form that
// follows it never drifts apart.
export function describeCheckerAnswers({
  country,
  audience,
  size,
  remoteAccess,
}: {
  country: Nis2Country | null;
  audience: Audience | null;
  size: Size | null;
  remoteAccess: RemoteAccess | null;
}): string {
  const sizePart =
    size === "medium_large" ? "a medium or large" : size === "small_micro" ? "a small or micro" : "a";
  const audiencePart =
    audience === "builder"
      ? "machine builder"
      : audience === "operator"
        ? "factory or plant operator"
        : audience === "integrator"
          ? "system integrator"
          : "business";
  const countryPart =
    country === "NL" ? " in the Netherlands" : country === "BE" ? " in Belgium" : country === "LU" ? " in Luxembourg" : "";
  const remoteAccessPart =
    remoteAccess === "yes"
      ? ", with remote access into machines"
      : remoteAccess === "no"
        ? ", without remote access into machines"
        : "";
  return `${sizePart} ${audiencePart}${countryPart}${remoteAccessPart}`;
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
    track("checker_complete", { outcome: computeOutcome(size, r) });
  };
  const restart = () => {
    setScreen("country");
    setCountry(null);
    setAudience(null);
    setSize(null);
    setRemoteAccess(null);
  };

  const checkerAnswers: CheckerAnswers = { country, audience, size, remoteAccess };
  const outcome = computeOutcome(size, remoteAccess);
  const brief: CheckerBriefContent | null = screen === "result" ? buildCheckerBrief(checkerAnswers) : null;

  useEffect(() => {
    if (screen === "result") track("result_viewed", { tool: "checker", outcome });
    // Only the screen transition itself should fire this, not every
    // re-render while already on the result screen (e.g. the countdown
    // ticking over a minute boundary).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

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

          {screen === "result" && brief && (
            <div key="result" id="checker-brief" className="print-area">
              <p className="mb-1 text-[12px] font-bold tracking-[0.08em] uppercase" style={{ color: ACCENT_DARK }}>
                Your brief
              </p>
              <h3 className="font-sans font-semibold text-[24px] sm:text-[28px] mb-6 text-[#1a1d22]">
                Which EU rules likely apply to you
              </h3>

              <div className="grid gap-4 mb-8">
                {brief.regulations.map((r) => (
                  <div key={r.id} className="rounded border border-[#3f4b52]/[0.2] bg-white p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
                      <p className="font-semibold text-[16px] text-[#1a1d22]">{r.name}</p>
                      <p className="text-[13px] font-semibold" style={{ color: ACCENT_DARK }}>{r.applicabilityLabel}</p>
                    </div>
                    <p className="text-[14px] text-[#3f4b52] mb-2">{r.explanation}</p>
                    {r.quote && (
                      <blockquote className="text-[13px] italic text-[#3f4b52] border-l-2 pl-3 mb-2" style={{ borderColor: `${ACCENT}55` }}>
                        &ldquo;{r.quote.translation ?? r.quote.text}&rdquo;
                      </blockquote>
                    )}
                    {r.citationUrl && r.sourceLine && (
                      <a href={r.citationUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] underline" style={{ color: ACCENT_DARK }}>
                        {r.sourceLine}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5 mb-8">
                <p className="font-semibold text-[15px] mb-3 text-[#1a1d22]">Dates that matter</p>
                <ul className="grid gap-3">
                  {brief.dates.map((d) => (
                    <li key={d.id} className="flex flex-wrap justify-between gap-x-3 border-b border-[#3f4b52]/[0.1] pb-2">
                      <span className="text-[14px] text-[#3f4b52]">{d.label}</span>
                      <span className="text-[13px] font-semibold text-[#1a1d22] text-right">
                        {d.display && d.dateIso ? (
                          <>
                            {d.display} &middot; <Countdown dateIso={d.dateIso} />
                          </>
                        ) : (
                          <span className="font-normal text-[#3f4b52]">{d.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5 mb-8">
                <p className="font-semibold text-[15px] mb-3 text-[#1a1d22]">Your country</p>
                {brief.countrySection ? (
                  <ul className="grid gap-2 text-[14px] text-[#3f4b52]">
                    <li>
                      <strong className="text-[#1a1d22]">In force since:</strong> {brief.countrySection.inForce.display} (
                      <a href={brief.countrySection.inForce.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {sourceLineText(brief.countrySection.inForce)}
                      </a>
                      )
                    </li>
                    <li>
                      <strong className="text-[#1a1d22]">Supervisory authority:</strong>{" "}
                      <a href={brief.countrySection.authority.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {brief.countrySection.authority.citationLabel}
                      </a>
                    </li>
                    <li>
                      <strong className="text-[#1a1d22]">Registration step:</strong>{" "}
                      <a href={brief.countrySection.registration.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {brief.countrySection.registration.citationLabel}
                      </a>
                    </li>
                    <li>
                      <strong className="text-[#1a1d22]">Incident-reporting duty:</strong>{" "}
                      <a href={brief.countrySection.incident.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        {brief.countrySection.incident.citationLabel}
                      </a>
                    </li>
                  </ul>
                ) : (
                  <p className="text-[14px] text-[#3f4b52]">
                    {country === "not_sure"
                      ? "You said not sure, or multiple countries, so no single country section applies. Use the official tool(s) below for each country that's relevant."
                      : "No country-specific section is available for “elsewhere.” Use the official tool(s) below."}
                  </p>
                )}
              </div>

              <div className="rounded border p-5 mb-8" style={{ borderColor: `${ACCENT}33`, background: `${ACCENT}0d` }}>
                <p className="font-semibold mb-2" style={{ color: ACCENT_DARK }}>
                  A likely commercial pressure, not a legal requirement
                </p>
                <p className="text-[14px] text-[#3f4b52] mb-3">
                  NIS2 Article 21(2)(d) requires companies that are in scope to assess the security
                  practices of their direct suppliers, including machine builders and integrators with
                  remote access into their systems. That is the legal mechanism behind{" "}
                  {brief.customerQuestionsFraming}, even where NIS2 doesn&apos;t apply to you directly.
                </p>
                <ul className="grid gap-2 text-[14px] text-[#3f4b52] mb-3">
                  {brief.customerQuestions.map((q) => (
                    <li key={q.id} className="flex gap-2">
                      <span style={{ color: ACCENT_DARK }}>&#8226;</span>
                      <span>{q.question}</span>
                    </li>
                  ))}
                </ul>
                <a href={CUSTOMER_QUESTIONS_CITATION.citationUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] underline" style={{ color: ACCENT_DARK }}>
                  {sourceLineText(CUSTOMER_QUESTIONS_CITATION)}
                </a>
              </div>

              <Iec62443Note />
              <div id="official-tool">
                <OfficialToolNote country={country} />
              </div>

              <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5 mb-2">
                <p className="font-semibold text-[15px] mb-3 text-[#1a1d22]">Next steps</p>
                <ol className="grid gap-2 text-[14px] text-[#3f4b52] list-decimal pl-5">
                  {brief.nextSteps.map((step) => {
                    const isAnchor = step.href.includes("#");
                    const onPageHref = step.href.startsWith("/checker") ? step.href.slice("/checker".length) : step.href;
                    return (
                      <li key={step.text}>
                        {isAnchor ? (
                          <a href={onPageHref} className="underline font-semibold" style={{ color: ACCENT_DARK }}>
                            {step.text}
                          </a>
                        ) : (
                          <Link href={step.href} className="underline font-semibold" style={{ color: ACCENT_DARK }}>
                            {step.text}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div data-no-print>
                <ResultActions
                  tool="checker"
                  outcome={outcome}
                  downloadLabel="Download my brief"
                  getCopyText={() => checkerBriefToText(checkerAnswers)}
                  emailRequestBody={{
                    answers: { tool: "checker_brief", checkerAnswers },
                    source: "checker_brief",
                    country,
                  }}
                  talkExplanation="A short conversation about your result. We will contact you by email to arrange it."
                />
                <div className="mt-2 text-center">
                  <button onClick={restart} className="text-[14px] font-semibold text-[#3f4b52] underline underline-offset-2">
                    Start over
                  </button>
                </div>
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
