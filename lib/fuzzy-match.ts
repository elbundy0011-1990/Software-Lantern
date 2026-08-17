// Hand-rolled name similarity for the admin "possible current-vendor match"
// suggestion — no dependency, since this only ever produces a suggestion the
// admin explicitly confirms or dismisses, never an automatic action. Same
// reasoning as this project's icon library: not enough weight on this one
// feature to justify a package.

export interface PartnerRef {
  id: string;
  company_name: string;
}

const LEGAL_SUFFIXES =
  /\b(inc|incorporated|ltd|limited|llc|gmbh|bv|b\.?v|corp|corporation|co|company|sa|s\.a|nv|n\.v|plc)\b/g;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,'"()]/g, "")
    .replace(LEGAL_SUFFIXES, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

const MATCH_THRESHOLD = 0.6;

// Returns the single best-scoring partner above the threshold, or null.
// This is a suggestion, not a determination: typos, abbreviations, and
// informal names all mean this can miss real matches or flag unrelated
// ones, which is exactly why the caller always requires explicit confirm.
export function suggestPartnerMatch(
  currentVendor: string | null | undefined,
  partners: PartnerRef[],
): PartnerRef | null {
  const normVendor = normalize(currentVendor || "");
  if (!normVendor) return null;

  let best: { partner: PartnerRef; score: number } | null = null;
  for (const partner of partners) {
    const normName = normalize(partner.company_name);
    if (!normName) continue;
    if (normVendor === normName) return partner;

    const contains = normName.includes(normVendor) || normVendor.includes(normName);
    const distance = levenshtein(normVendor, normName);
    const maxLen = Math.max(normVendor.length, normName.length);
    const similarity = maxLen === 0 ? 0 : 1 - distance / maxLen;
    const score = contains ? Math.max(similarity, 0.85) : similarity;

    if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { partner, score };
    }
  }
  return best?.partner ?? null;
}
