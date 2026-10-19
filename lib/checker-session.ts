import type { Nis2Country } from "./nis2-dates";
import type { Audience, Size, RemoteAccess } from "@/components/nis2-scope-checker";

// Carries the scope checker's answers from the checker to the enquiry
// form via sessionStorage, never the URL and never analytics — so a
// visitor who lands on /enquiry directly after checking their situation
// still sees their result, without any personal data leaving the browser
// or appearing in a shareable link.
//
// Read through useSyncExternalStore (see getCheckerAnswersSnapshot /
// subscribeCheckerAnswers below), React's own recommended way to read a
// browser-only store safely across server rendering and hydration,
// rather than a useEffect + setState pair, which this project's lint
// config flags as cascading-render-prone for exactly this pattern.

const KEY = "ot_checker_answers";
const CHANGE_EVENT = "ot-checker-answers-changed";

export interface CheckerAnswers {
  country: Nis2Country | null;
  audience: Audience | null;
  size: Size | null;
  remoteAccess: RemoteAccess | null;
}

export const EMPTY_CHECKER_ANSWERS: CheckerAnswers = {
  country: null,
  audience: null,
  size: null,
  remoteAccess: null,
};

export function hasAnyCheckerAnswer(answers: CheckerAnswers): boolean {
  return Boolean(answers.country || answers.audience || answers.size || answers.remoteAccess);
}

export function saveCheckerAnswers(answers: CheckerAnswers): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(answers));
    // sessionStorage writes don't fire the native "storage" event in the
    // same tab that wrote them (only other tabs/windows get that) — this
    // tells any useSyncExternalStore subscriber in this tab to re-read.
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Private browsing or storage disabled — the checker and form both
    // still work, the form just won't carry the result across pages.
  }
}

function parse(raw: string): CheckerAnswers {
  const parsed = JSON.parse(raw) as Partial<CheckerAnswers>;
  return {
    country: parsed.country ?? null,
    audience: parsed.audience ?? null,
    size: parsed.size ?? null,
    remoteAccess: parsed.remoteAccess ?? null,
  };
}

// Cached so repeated snapshot reads return the same reference when the
// underlying storage hasn't changed — useSyncExternalStore re-renders
// whenever the snapshot it's given is a new object, so this avoids an
// infinite render loop.
let cachedRaw: string | null | undefined;
let cachedAnswers: CheckerAnswers | null = null;

export function getCheckerAnswersSnapshot(): CheckerAnswers | null {
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedAnswers;
  cachedRaw = raw;
  try {
    cachedAnswers = raw ? parse(raw) : null;
  } catch {
    cachedAnswers = null;
  }
  return cachedAnswers;
}

export function getCheckerAnswersServerSnapshot(): CheckerAnswers | null {
  return null;
}

export function subscribeCheckerAnswers(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
