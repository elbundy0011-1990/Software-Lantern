"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  type ConnectionMethod,
  type AccessDecision,
  type Credentials,
  type YesNoUnsure,
  type Reach,
  type QuestionFrequency,
  type ReviewPrompt,
  type RemoteAccessAnswers,
  REVIEW_PROMPT_OPTIONS,
} from "@/lib/remote-access-session";
import { buildReviewSheet, reviewSheetToText, type ReviewSheetContent, type SectionKey } from "@/lib/review-sheet";
import { CountryReportForm } from "@/components/country-report-form";
import { ResultActions } from "@/components/result-actions";

type Screen = "connection" | "decision" | "credentials" | "logging" | "mfa" | "reach" | "questions" | "review_prompt" | "result";

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
  return 8;
}
function stepNumber(screen: Screen): number {
  const order: Screen[] = ["connection", "decision", "credentials", "logging", "mfa", "reach", "questions", "review_prompt"];
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

const bullet = (text: string) => (
  <li key={text} className="flex gap-2">
    <span style={{ color: "#9a3412" }}>&#8226;</span>
    <span>{text}</span>
  </li>
);

function QuestionsToResolveSection({ content }: { content: ReviewSheetContent }) {
  if (!content.questionsToResolve.length) return null;
  return (
    <div className="mb-6">
      <p className="font-semibold mb-2 text-[#1a1d22]">Questions to resolve</p>
      <ul className="grid gap-2 text-[14px] text-[#3f4b52]">{content.questionsToResolve.map((t) => bullet(t.text))}</ul>
    </div>
  );
}

function ControlsToVerifySection({ content }: { content: ReviewSheetContent }) {
  return (
    <div className="mb-6">
      <p className="font-semibold mb-2 text-[#1a1d22]">Controls to verify</p>
      <ul className="grid gap-2 text-[14px] text-[#3f4b52]">{content.controlsToVerify.map((t) => bullet(t.text))}</ul>
    </div>
  );
}

function EvidenceToPrepareSection({ content }: { content: ReviewSheetContent }) {
  return (
    <div className="mb-6">
      <p className="font-semibold mb-2 text-[#1a1d22]">Evidence to prepare</p>
      <ul className="grid gap-2 text-[14px] text-[#3f4b52]">{content.evidenceToPrepare.map((e) => bullet(e))}</ul>
    </div>
  );
}

function PackRowsSection({ content }: { content: ReviewSheetContent }) {
  return (
    <div className="rounded border border-[#3f4b52]/[0.2] bg-[#f6f5f1] p-5 mb-6">
      <p className="font-semibold mb-3 text-[#1a1d22]">Relevant rows from the customer security questionnaire pack</p>
      <ul className="grid gap-3 text-[14px]">
        {content.packRows.map((row) => (
          <li key={row.id} className="border-b border-[#3f4b52]/[0.12] pb-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#3f4b52] mb-1">{row.category}</p>
            <p className="font-semibold text-[#1a1d22] mb-1">{row.question}</p>
            <p className="text-[13px] text-[#3f4b52]">{row.why}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px]">
        <Link href="/questionnaire-pack" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          Get the full pack (about 30 questions across 8 topics)
        </Link>
      </p>
    </div>
  );
}

function VendorRequirementsList({ vendorRequirements }: { vendorRequirements: ReviewSheetContent["vendorRequirements"] }) {
  return (
    <ul className="grid gap-3 text-[14px]">
      {vendorRequirements.map((v) => (
        <li key={v.topic} className="border-b border-[#3f4b52]/[0.1] pb-2">
          <p className="font-semibold text-[#1a1d22]">{v.topic}</p>
          <p className="text-[13px] text-[#3f4b52]">{v.today}</p>
          <p className="text-[13px] text-[#1a1d22]">{v.askTheVendor}</p>
        </li>
      ))}
    </ul>
  );
}

// Expanded by default only when "Replacing or upgrading our remote access" was
// the answer to the eighth, optional question; everyone else sees it behind a
// plain link they can choose to open, never hidden entirely.
function VendorRequirementsSection({ content }: { content: ReviewSheetContent }) {
  const [open, setOpen] = useState(content.showVendorRequirementsExpanded);
  return (
    <div className="rounded border p-5 mb-6" style={{ borderColor: "#9a341233", background: "#9a34120d" }}>
      <p className="font-semibold mb-2" style={{ color: "#7c2d12" }}>Vendor demo requirements</p>
      {content.showVendorRequirementsExpanded ? (
        <p className="text-[13px] text-[#3f4b52] mb-3">
          Since you&apos;re replacing or upgrading your remote access, here&apos;s a starting list of
          what to ask a vendor to confirm, pre-filled from your answers above.
        </p>
      ) : (
        <p className="text-[13px] text-[#3f4b52] mb-3">
          Evaluating or replacing your remote access?{" "}
          <button onClick={() => setOpen((o) => !o)} className="underline font-semibold" style={{ color: "#7c2d12" }}>
            {open ? "Hide" : "See"} a pre-filled vendor-demo requirements list based on your answers
          </button>
          .
        </p>
      )}
      {open && <VendorRequirementsList vendorRequirements={content.vendorRequirements} />}
      <p className="mt-3 text-[13px]">
        <Link href="/vendor-checklist" className="underline font-semibold" style={{ color: "#7c2d12" }}>
          See the full 25-criteria vendor comparison checklist
        </Link>
      </p>
    </div>
  );
}

const SECTION_COMPONENTS: Record<SectionKey, (props: { content: ReviewSheetContent }) => React.ReactElement | null> = {
  questionsToResolve: QuestionsToResolveSection,
  controlsToVerify: ControlsToVerifySection,
  evidenceToPrepare: EvidenceToPrepareSection,
  packRows: PackRowsSection,
  vendorRequirements: VendorRequirementsSection,
};

// The review sheet: a neutral summary of the visitor's own answers, questions to
// resolve, controls to verify, evidence to prepare, and the most relevant
// questionnaire-pack rows (lib/review-sheet.ts chooses these deterministically from
// the seven required answers). No score, no pass/fail, no product category, and no
// claim that any answer breaks a rule: every answer is restated the same way
// regardless of what it was, and every task is phrased as a question or a thing to
// do. The optional eighth answer ("what prompted this review") only ever reorders
// these same sections, or expands the vendor-demo list by default; it never adds
// or removes content a visitor who skips it wouldn't otherwise see.
function ReviewSheetView({ content }: { content: ReviewSheetContent }) {
  return (
    <div>
      <p className="font-semibold mb-3 text-[#1a1d22]">Your setup, as described</p>
      {content.reviewPromptLabel && (
        <p className="text-[14px] text-[#3f4b52] mb-3">
          What prompted this review: <span className="font-semibold text-[#1a1d22]">{content.reviewPromptLabel}</span>
        </p>
      )}
      <ul className="grid gap-2 mb-6 text-[14px] text-[#3f4b52]">
        {content.answerRows.map((r) => (
          <li key={r.label} className="flex flex-wrap justify-between gap-x-3 border-b border-[#3f4b52]/[0.1] pb-2">
            <span>{r.label}</span>
            <span className="font-semibold text-[#1a1d22]">{r.value}</span>
          </li>
        ))}
      </ul>

      {content.sectionOrder.map((key) => {
        const Section = SECTION_COMPONENTS[key];
        return <Section key={key} content={content} />;
      })}

      <p className="text-[14px] text-[#3f4b52]">
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
  const [reviewPrompt, setReviewPrompt] = useState<ReviewPrompt | null>(null);
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
      reviewPrompt: next.reviewPrompt ?? reviewPrompt,
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
      setScreen("review_prompt");
      emit({ customerQuestions: v });
    },
    reviewPrompt: (v: ReviewPrompt) => {
      setReviewPrompt(v);
      setScreen("result");
      emit({ reviewPrompt: v });
      completeCheck(v);
    },
  };

  // Shared by both the eighth question's picker and its "skip" link, so
  // completion fires exactly once either way, with the same analytics shape.
  const completeCheck = (prompt: ReviewPrompt | null) => {
    // No answer value here beyond "reviewPrompt", by design: the privacy
    // policy promises every other answer to this check stays in the browser
    // unless the visitor chooses to email or submit it. reviewPrompt is the
    // one exception, sent only as its category (never free text), per the
    // 2026-10-21 instruction to include it in analytics.
    track("remote_access_check_complete", { reviewPrompt: prompt ?? "not_answered" });
  };

  const skipReviewPrompt = () => {
    setScreen("result");
    completeCheck(null);
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
    setReviewPrompt(null);
  };

  const answers: RemoteAccessAnswers = {
    connectionMethod,
    accessDecision,
    credentials,
    sessionLogging,
    mfa,
    reach,
    customerQuestions,
    reviewPrompt,
  };

  // No score and no verdict, so "outcome" here is only a flow category for
  // analytics (which branch of the review sheet rendered), never a judgment on
  // the setup described.
  const outcome = reviewPrompt ?? "not_answered";
  const reviewSheet: ReviewSheetContent | null = screen === "result" ? buildReviewSheet(answers) : null;

  useEffect(() => {
    if (screen === "result") track("result_viewed", { tool: "remote_access_check", outcome });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <section id="remote-access-situation-check" className="border-b border-[#3f4b52]/[0.15]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-21">
        <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
          Your remote access, today
        </h2>
        <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-6">
          Seven required questions about how you actually connect to machines today, plus one
          optional question about what prompted this review. This does not check whether you
          meet NIS2, the Cyber Resilience Act, or any other rule, and it does not score or grade
          your setup. It just lists what&apos;s worth being ready to describe if a customer asks.
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

          {screen === "review_prompt" && (
            <div key="review_prompt">
              <h3 className="font-sans font-semibold text-[21px] mb-2 text-[#1a1d22]">What prompted this review?</h3>
              <p className="text-[14px] text-[#3f4b52] mb-5">
                Optional. Used only to show the most relevant part of your review sheet first.
              </p>
              <div className="grid gap-3 mb-7">
                {REVIEW_PROMPT_OPTIONS.map((opt) => (
                  <OptionCard key={opt.value} label={opt.label} selected={reviewPrompt === opt.value} onClick={() => pick.reviewPrompt(opt.value)} />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => setScreen("questions")} className={backButtonClass}>← Back</button>
                <button onClick={skipReviewPrompt} className="text-[14px] font-semibold text-[#3f4b52] underline underline-offset-2">
                  Skip this question
                </button>
              </div>
            </div>
          )}

          {screen === "result" && reviewSheet && (
            <div key="result" id="review-sheet" className="print-area">
              <p className="mb-1 text-[12px] font-bold tracking-[0.08em] uppercase" style={{ color: "#7c2d12" }}>
                Your review sheet
              </p>
              <h3 className="font-sans font-semibold text-[24px] sm:text-[28px] mb-6 text-[#1a1d22]">
                Build your remote access review sheet
              </h3>

              <ReviewSheetView content={reviewSheet} />

              <div data-no-print>
                <ResultActions
                  tool="remote_access_check"
                  outcome={outcome}
                  downloadLabel="Download my review sheet"
                  getCopyText={() => reviewSheetToText(answers)}
                  emailRequestBody={{
                    answers: { tool: "review_sheet", remoteAccessAnswers: answers },
                    source: "review_sheet",
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
