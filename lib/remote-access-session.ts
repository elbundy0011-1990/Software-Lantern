// Carries the remote-access situation check's answers to the enquiry
// form via sessionStorage, the same pattern as lib/checker-session.ts
// (never the URL, never analytics), kept as its own separate store so
// the already-shipped NIS2 checker flow doesn't need to change shape.

export type ConnectionMethod =
  | "always_on_vpn"
  | "remote_desktop"
  | "vendor_modem"
  | "on_site_only"
  | "other"
  | "not_sure";
export type AccessDecision = "customer_each_time" | "we_decide" | "always_on" | "not_sure";
export type Credentials = "named" | "shared" | "not_sure";
export type YesNoUnsure = "yes" | "no" | "not_sure";
export type Reach = "one_machine" | "whole_network" | "not_sure";
export type QuestionFrequency = "often" | "sometimes" | "never" | "not_sure";
// The eighth question, added after the original seven: optional (a visitor can
// skip it), so it stays null unless they actively pick one. Used only to tailor
// which section of the review sheet is shown first, and reordered within a list
// (lib/review-sheet.ts) — never to gate or hide content outright.
export type ReviewPrompt = "customer_questionnaire" | "internal_initiative" | "incident" | "replacing_upgrading" | "just_learning";

export interface RemoteAccessAnswers {
  connectionMethod: ConnectionMethod | null;
  accessDecision: AccessDecision | null;
  credentials: Credentials | null;
  sessionLogging: YesNoUnsure | null;
  mfa: YesNoUnsure | null;
  reach: Reach | null;
  customerQuestions: QuestionFrequency | null;
  reviewPrompt: ReviewPrompt | null;
}

export const EMPTY_REMOTE_ACCESS_ANSWERS: RemoteAccessAnswers = {
  connectionMethod: null,
  accessDecision: null,
  credentials: null,
  sessionLogging: null,
  mfa: null,
  reach: null,
  customerQuestions: null,
  reviewPrompt: null,
};

export const REVIEW_PROMPT_OPTIONS: { value: ReviewPrompt; label: string }[] = [
  { value: "customer_questionnaire", label: "A customer security questionnaire" },
  { value: "internal_initiative", label: "An internal security initiative" },
  { value: "incident", label: "An incident" },
  { value: "replacing_upgrading", label: "Replacing or upgrading our remote access" },
  { value: "just_learning", label: "Just learning" },
];

export function reviewPromptLabel(a: RemoteAccessAnswers): string | null {
  if (!a.reviewPrompt) return null;
  return REVIEW_PROMPT_OPTIONS.find((o) => o.value === a.reviewPrompt)?.label ?? null;
}

export function hasAnyRemoteAccessAnswer(a: RemoteAccessAnswers): boolean {
  return Boolean(
    a.connectionMethod ||
      a.accessDecision ||
      a.credentials ||
      a.sessionLogging ||
      a.mfa ||
      a.reach ||
      a.customerQuestions ||
      a.reviewPrompt,
  );
}

// Unchanged in meaning: still only the original seven required questions. The
// eighth question (reviewPrompt) is optional by design and never gates
// completion of the check.
export function isRemoteAccessCheckComplete(a: RemoteAccessAnswers): boolean {
  return Boolean(
    a.connectionMethod && a.accessDecision && a.credentials && a.sessionLogging && a.mfa && a.reach && a.customerQuestions,
  );
}

// The same 7 question prompts shown as screen headings in components/
// remote-access-situation-check.tsx, kept here too so the country
// report email (lib/email-templates.ts) can phrase "areas to look at"
// as questions without retyping them a second time in a way that could
// drift from the on-screen wording. If the screen headings in that
// component ever change, update this list to match.
export const REMOTE_ACCESS_QUESTIONS: { key: keyof RemoteAccessAnswers; question: string }[] = [
  { key: "connectionMethod", question: "How do service engineers connect to a machine today?" },
  { key: "accessDecision", question: "Who decides when that access is switched on?" },
  { key: "credentials", question: "Are the accounts used to connect named to a specific person, or shared?" },
  { key: "sessionLogging", question: "Are remote sessions logged, and is that log kept?" },
  { key: "mfa", question: "Does connecting require more than a single password?" },
  { key: "reach", question: "Once connected, what can that access reach?" },
  { key: "customerQuestions", question: "How often do customers ask you security questions like these?" },
];

const KEY = "ot_remote_access_answers";
const CHANGE_EVENT = "ot-remote-access-answers-changed";

export function saveRemoteAccessAnswers(answers: RemoteAccessAnswers): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(answers));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Private browsing or storage disabled — the tool and form both
    // still work, the form just won't carry the result across pages.
  }
}

let cachedRaw: string | null | undefined;
let cachedAnswers: RemoteAccessAnswers | null = null;

export function getRemoteAccessAnswersSnapshot(): RemoteAccessAnswers | null {
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedAnswers;
  cachedRaw = raw;
  try {
    cachedAnswers = raw ? { ...EMPTY_REMOTE_ACCESS_ANSWERS, ...JSON.parse(raw) } : null;
  } catch {
    cachedAnswers = null;
  }
  return cachedAnswers;
}

export function getRemoteAccessAnswersServerSnapshot(): RemoteAccessAnswers | null {
  return null;
}

export function subscribeRemoteAccessAnswers(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// Plain-language label for each answered field, in the same order and
// wording as components/remote-access-situation-check.tsx's AreasToLookAt
// list — shared so the on-screen result and the country-report email
// (lib/email-templates.ts) never describe an answer differently.
export function remoteAccessAnswerRows(a: RemoteAccessAnswers): { label: string; value: string }[] {
  return [
    {
      label: "How service engineers connect",
      value:
        a.connectionMethod === "always_on_vpn"
          ? "An always-on VPN into the customer's network"
          : a.connectionMethod === "remote_desktop"
            ? "A remote desktop tool"
            : a.connectionMethod === "vendor_modem"
              ? "A vendor-supplied modem or gateway"
              : a.connectionMethod === "on_site_only"
                ? "On-site only"
                : a.connectionMethod === "other"
                  ? "Something else"
                  : "Not sure",
    },
    {
      label: "Who decides when access is switched on",
      value:
        a.accessDecision === "customer_each_time"
          ? "The customer, each time"
          : a.accessDecision === "we_decide"
            ? "We decide, without asking each time"
            : a.accessDecision === "always_on"
              ? "It's always on"
              : "Not sure",
    },
    {
      label: "Whether access is named to a person or shared",
      value: a.credentials === "named" ? "Named" : a.credentials === "shared" ? "Shared" : "Not sure",
    },
    {
      label: "Whether sessions are logged and kept",
      value: a.sessionLogging === "yes" ? "Yes" : a.sessionLogging === "no" ? "No" : "Not sure",
    },
    {
      label: "Whether multi-factor authentication is used",
      value: a.mfa === "yes" ? "Yes" : a.mfa === "no" ? "No" : "Not sure",
    },
    {
      label: "What a connection can reach",
      value:
        a.reach === "one_machine" ? "Just the one machine" : a.reach === "whole_network" ? "More of the network" : "Not sure",
    },
    {
      label: "How often customers ask about this",
      value:
        a.customerQuestions === "often"
          ? "Often"
          : a.customerQuestions === "sometimes"
            ? "Sometimes"
            : a.customerQuestions === "never"
              ? "Never"
              : "Not sure",
    },
  ];
}

// Plain-language one-line summary, shown read-only at the top of the
// enquiry form, the same role describeCheckerAnswers() plays for the
// NIS2 checker.
export function describeRemoteAccessAnswers(a: RemoteAccessAnswers): string {
  const connection =
    a.connectionMethod === "always_on_vpn"
      ? "an always-on VPN into the customer network"
      : a.connectionMethod === "remote_desktop"
        ? "a remote desktop tool"
        : a.connectionMethod === "vendor_modem"
          ? "a vendor-supplied modem or gateway"
          : a.connectionMethod === "on_site_only"
            ? "on-site access only"
            : a.connectionMethod === "other"
              ? "another connection method"
              : "an unspecified connection method";
  const credentials =
    a.credentials === "named" ? "named accounts" : a.credentials === "shared" ? "shared accounts" : "accounts of an unclear kind";
  const mfa = a.mfa === "yes" ? "with multi-factor authentication" : a.mfa === "no" ? "without multi-factor authentication" : "with MFA status not sure";
  return `Remote access today is via ${connection}, using ${credentials}, ${mfa}.`;
}
