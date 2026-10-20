"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  remoteAccessAnswerRows,
  type ConnectionMethod,
  type AccessDecision,
  type Credentials,
  type YesNoUnsure,
  type Reach,
  type QuestionFrequency,
  type RemoteAccessAnswers,
} from "@/lib/remote-access-session";
import { CountryReportForm } from "@/components/country-report-form";

type Screen = "connection" | "decision" | "credentials" | "logging" | "mfa" | "reach" | "questions" | "result";

// Same palette as components/nis2-scope-checker.tsx, so this reads as
// the same tool family rather than a new identity.
const ACCENT = "#9a3412";

const CONNECTION_OPTIONS: { value: ConnectionMethod; label: string }[] = [
  { value: "always_on_vpn", label: "An always-on VPN into the customer's network" },
  { value: "remote_desktop", label: "A remote desktop tool" },
  { value: "vendor_modem", label: "A vendor-supplied modem or gateway" },
  { value: "on_site_only", label: "On-site only, no remote connection" },
  { value: "other", label: "Something else" },
  { value: "not_sure", label: "Not sure" },
];

const DECISION_OPTIONS: { value: AccessDecision; label: string }[] = [
  { value: "customer_each_time", label: "The customer switches it on each time" },
  { value: "we_decide", label: "We switch it on when we need it, without asking each time" },
  { value: "always_on", label: "It's always on" },
  { value: "not_sure", label: "Not sure" },
];

const CREDENTIALS_OPTIONS: { value: Credentials; label: string }[] = [
  { value: "named", label: "Named to a specific person" },
  { value: "shared", label: "Shared between people" },
  { value: "not_sure", label: "Not sure" },
];

const YES_NO_OPTIONS: { value: YesNoUnsure; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "not_sure", label: "Not sure" },
];

const REACH_OPTIONS: { value: Reach; label: string }[] = [
  { value: "one_machine", label: "Just the one machine being serviced" },
  { value: "whole_network", label: "More of the customer's network" },
  { value: "not_sure", label: "Not sure" },
];

const QUESTIONS_OPTIONS: { value: QuestionFrequency; label: string }[] = [
  { value: "often", label: "Often" },
  { value: "sometimes", label: "Sometimes" },
  { value: "never", label: "Never" },
  { value: "not_sure", label: "Not sure" },
];

function totalSteps(): number {
  return 7;
}
function stepNumber(screen: Screen): number {
  const order: Screen[] = ["connection", "decision", "credentials", "logging", "mfa", "reach", "questions"];
  const idx = order.indexOf(screen);
  return idx === -1 ? 0 : idx + 1;
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
  selected,
  onClick,
}: {
  label: string;
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
      <span className="block text-[15px] font-semibold text-[#1a1d22]">{label}</span>
    </button>
  );
}

const backButtonClass =
  "rounded px-5 py-[10px] font-sans font-semibold text-[14px] text-[#3f4b52] border border-[#3f4b52]/[0.3] hover:bg-[#3f4b52]/[0.06]";

// The result: a plain list of areas worth being able to describe,
// phrased as questions, restating the visitor's own answer. No score,
// no pass/fail, no product category, and no claim that any answer
// breaks a rule — every area is shown the same way regardless of what
// was answered.
function AreasToLookAt({ answers }: { answers: RemoteAccessAnswers }) {
  const rows = remoteAccessAnswerRows(answers);
  return (
    <div className="rounded border border-[#3f4b52]/[0.2] bg-white p-5 text-[14px] text-[#3f4b52] mb-4">
      <p className="font-semibold mb-3 text-[#1a1d22]">Areas worth being ready to describe</p>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.label} className="flex flex-wrap justify-between gap-x-3 border-b border-[#3f4b52]/[0.1] pb-2">
            <span>{r.label}</span>
            <span className="font-semibold text-[#1a1d22]">{r.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4">
        This is not a pass or fail, and it doesn&apos;t name or favor any product. A customer&apos;s
        own questionnaire will ask about these same topics in its own words.{" "}
        <Link href="/guides/customer-security-questionnaire" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          See the guide
        </Link>
        {" "}on preparing an answer, or{" "}
        <Link href="/guides/iec-62443-remote-access" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          IEC 62443 and remote access
        </Link>
        .
      </p>
    </div>
  );
}

export function RemoteAccessSituationCheck({
  onAnswersChange,
}: {
  onAnswersChange?: (answers: RemoteAccessAnswers) => void;
}) {
  const [screen, setScreen] = useState<Screen>("connection");
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod | null>(null);
  const [accessDecision, setAccessDecision] = useState<AccessDecision | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [sessionLogging, setSessionLogging] = useState<YesNoUnsure | null>(null);
  const [mfa, setMfa] = useState<YesNoUnsure | null>(null);
  const [reach, setReach] = useState<Reach | null>(null);
  const [customerQuestions, setCustomerQuestions] = useState<QuestionFrequency | null>(null);
  const [started, setStarted] = useState(false);

  const emit = (next: Partial<RemoteAccessAnswers>) => {
    onAnswersChange?.({
      connectionMethod: next.connectionMethod ?? connectionMethod,
      accessDecision: next.accessDecision ?? accessDecision,
      credentials: next.credentials ?? credentials,
      sessionLogging: next.sessionLogging ?? sessionLogging,
      mfa: next.mfa ?? mfa,
      reach: next.reach ?? reach,
      customerQuestions: next.customerQuestions ?? customerQuestions,
    });
  };

  const pick = {
    connection: (v: ConnectionMethod) => {
      if (!started) {
        track("remote_access_check_start", {});
        setStarted(true);
      }
      setConnectionMethod(v);
      setScreen("decision");
      emit({ connectionMethod: v });
    },
    decision: (v: AccessDecision) => {
      setAccessDecision(v);
      setScreen("credentials");
      emit({ accessDecision: v });
    },
    credentials: (v: Credentials) => {
      setCredentials(v);
      setScreen("logging");
      emit({ credentials: v });
    },
    logging: (v: YesNoUnsure) => {
      setSessionLogging(v);
      setScreen("mfa");
      emit({ sessionLogging: v });
    },
    mfa: (v: YesNoUnsure) => {
      setMfa(v);
      setScreen("reach");
      emit({ mfa: v });
    },
    reach: (v: Reach) => {
      setReach(v);
      setScreen("questions");
      emit({ reach: v });
    },
    questions: (v: QuestionFrequency) => {
      setCustomerQuestions(v);
      setScreen("result");
      emit({ customerQuestions: v });
      track("remote_access_check_complete", { connectionMethod: connectionMethod ?? "unknown" });
    },
  };

  const restart = () => {
    setScreen("connection");
    setConnectionMethod(null);
    setAccessDecision(null);
    setCredentials(null);
    setSessionLogging(null);
    setMfa(null);
    setReach(null);
    setCustomerQuestions(null);
  };

  const answers: RemoteAccessAnswers = {
    connectionMethod,
    accessDecision,
    credentials,
    sessionLogging,
    mfa,
    reach,
    customerQuestions,
  };

  return (
    <section id="remote-access-situation-check" className="border-b border-[#3f4b52]/[0.15]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
          Your remote access, today
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-6">
          Seven questions about how you actually connect to machines today. This does not check
          whether you meet NIS2, the Cyber Resilience Act, or any other rule, and it does not
          score or grade your setup. It just lists what&apos;s worth being ready to describe if a
          customer asks.
        </p>

        <div className="bg-[#f6f5f1] border border-[#3f4b52]/[0.15] rounded p-6 sm:p-10 overflow-hidden">
          {screen !== "result" && <ProgressIndicator screen={screen} />}

          {screen === "connection" && (
            <div key="connection">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                How do service engineers connect to a machine today?
              </h3>
              <div className="grid gap-3">
                {CONNECTION_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={connectionMethod === opt.value} onClick={() => pick.connection(opt.value)} />
                ))}
              </div>
            </div>
          )}

          {screen === "decision" && (
            <div key="decision">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                Who decides when that access is switched on?
              </h3>
              <div className="grid gap-3 mb-7">
                {DECISION_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={accessDecision === opt.value} onClick={() => pick.decision(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("connection")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "credentials" && (
            <div key="credentials">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                Are the accounts used to connect named to a specific person, or shared?
              </h3>
              <div className="grid gap-3 mb-7">
                {CREDENTIALS_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={credentials === opt.value} onClick={() => pick.credentials(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("decision")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "logging" && (
            <div key="logging">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                Are remote sessions logged, and is that log kept?
              </h3>
              <div className="grid gap-3 mb-7">
                {YES_NO_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={sessionLogging === opt.value} onClick={() => pick.logging(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("credentials")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "mfa" && (
            <div key="mfa">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                Does connecting require more than a single password?
              </h3>
              <p className="text-[14px] text-[#3f4b52] mb-5">For example, multi-factor authentication.</p>
              <div className="grid gap-3 mb-7">
                {YES_NO_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={mfa === opt.value} onClick={() => pick.mfa(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("logging")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "reach" && (
            <div key="reach">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                Once connected, what can that access reach?
              </h3>
              <div className="grid gap-3 mb-7">
                {REACH_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={reach === opt.value} onClick={() => pick.reach(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("mfa")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "questions" && (
            <div key="questions">
              <h3 className="font-sans font-semibold text-[21px] mb-5 text-[#1a1d22]">
                How often do customers ask you security questions like these?
              </h3>
              <div className="grid gap-3 mb-7">
                {QUESTIONS_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={customerQuestions === opt.value} onClick={() => pick.questions(opt.value)} />
                ))}
              </div>
              <button onClick={() => setScreen("reach")} className={backButtonClass}>← Back</button>
            </div>
          )}

          {screen === "result" && (
            <div key="result">
              <AreasToLookAt answers={answers} />
              <div className="mt-7 pt-6 border-t border-[#3f4b52]/[0.15] text-center">
                <p className="text-[15px] text-[#3f4b52] mb-4 max-w-[480px] mx-auto">
                  If you&apos;d like to talk through any of this, send your result for review.
                </p>
                <a
                  href="#ot-enquiry-form"
                  onClick={() => track("result_cta_click", { tool: "remote_access_check" })}
                  className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block"
                  style={{ background: ACCENT }}
                >
                  Send my result for review
                </a>
                <div className="mt-4">
                  <button onClick={restart} className="text-[14px] font-semibold text-[#3f4b52] underline underline-offset-2">
                    Start over
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {screen === "result" && (
          <div className="mt-10">
            <CountryReportForm remoteAccessAnswers={answers} />
          </div>
        )}

        <p className="mt-6 text-[13px] leading-[1.6] text-[#3f4b52]">
          This is a general self-check, not legal advice, and not a substitute for your own
          country&apos;s official NIS2 tool, linked from{" "}
          <Link href="/checker" className="underline font-semibold" style={{ color: "#7c2d12" }}>
            the scope checker
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
