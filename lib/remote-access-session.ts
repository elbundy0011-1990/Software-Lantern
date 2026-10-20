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

export interface RemoteAccessAnswers {
  connectionMethod: ConnectionMethod | null;
  accessDecision: AccessDecision | null;
  credentials: Credentials | null;
  sessionLogging: YesNoUnsure | null;
  mfa: YesNoUnsure | null;
  reach: Reach | null;
  customerQuestions: QuestionFrequency | null;
}

export const EMPTY_REMOTE_ACCESS_ANSWERS: RemoteAccessAnswers = {
  connectionMethod: null,
  accessDecision: null,
  credentials: null,
  sessionLogging: null,
  mfa: null,
  reach: null,
  customerQuestions: null,
};

export function hasAnyRemoteAccessAnswer(a: RemoteAccessAnswers): boolean {
  return Boolean(
    a.connectionMethod || a.accessDecision || a.credentials || a.sessionLogging || a.mfa || a.reach || a.customerQuestions,
  );
}

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
