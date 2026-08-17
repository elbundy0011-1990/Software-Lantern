// Single source of truth for EUDR Article 38 compliance dates. Verified
// directly against EUR-Lex (Regulation (EU) 2025/2650, amending Article 38
// of Regulation (EU) 2023/1115) — see docs/PHASE-7-CHANGES.md for the
// verification record, including the exact quoted regulation text. Every
// date shown on /eudr (prose, deadline strip, scope checker) reads from
// here so they can't drift out of sync if a date is ever updated.

export const EUDR_DEADLINES = {
  largeMedium: {
    date: "2026-12-30",
    display: "30 December 2026",
    label: "Large and medium operators & traders",
  },
  microSmall: {
    date: "2027-06-30",
    display: "30 June 2027",
    label: "Micro and small operators",
  },
} as const;

export type EudrDeadlineKey = keyof typeof EUDR_DEADLINES;

// Article 38(3)'s later date is scoped to "operators ... who were
// established as such by 31 December 2024" — the regulation's own wording
// never mentions traders, so this note only applies to the operator path.
export const EUDR_ESTABLISHED_BY_NOTE = "31 December 2024";

export const EUDR_SME_SIZE_NOTE =
  "Company size for EUDR purposes follows Directive 2013/34/EU's standard company-size categories (based on balance sheet total, net turnover, and employee count). If you're not sure which category your business falls into, check your official size classification, since it determines which deadline applies to you.";
