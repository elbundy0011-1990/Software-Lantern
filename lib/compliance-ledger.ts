// Single source of truth for every entry the Compliance Ledger (see
// components/compliance-ledger.tsx) renders anywhere on the site. Every
// entry comes from this one file, with a citation URL and a "last
// verified" date. No invented log events, customers, counts, or sample
// data — every row below is a real, dated regulatory fact, sourced in
// docs/OT-CYBER-PLAN.md Part A §1 and Part B §B.2.1.
//
// LAST VERIFIED (whole file, as a pass): 2026-10-19. Re-check before any
// go-live and periodically after, same discipline as lib/eudr-dates.ts.
//
// 2026-10-19 pull: entries below with verified: false have no quoted
// primary-source sentence on file yet. components/compliance-ledger.tsx
// and components/nis2-scope-checker.tsx withhold them from public
// rendering entirely (no inline "[VERIFY]") until verified flips true —
// at which point set verified: true, update lastVerified, and add the
// quoted sentence as a comment on that entry.

import { NIS2_DATES } from "./nis2-dates";

export type LedgerStatus = "in_force" | "upcoming";

export interface LedgerEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd, for sorting and "days until/since"
  display: string; // human display date, e.g. "15 August 2026"
  label: string;
  status: LedgerStatus;
  citationLabel: string;
  citationUrl: string;
  lastVerified: string; // ISO date this specific entry was last checked
  lastVerifiedDisplay: string; // human display date, e.g. "19 October 2026" — used in the public "Source: ..., checked ..." line
  verified: boolean; // false => withheld from public rendering entirely, pending a quoted primary-source sentence
}

export const COMPLIANCE_LEDGER: LedgerEntry[] = [
  {
    id: "nis2-be",
    date: NIS2_DATES.belgium.inForceDate,
    display: NIS2_DATES.belgium.inForceDisplay,
    label: "NIS2 in force in Belgium (Law of 26 April 2024)",
    status: "in_force",
    citationLabel: "Moniteur belge / eJustice ELI 2024202344",
    citationUrl: "https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: false, // pending — no quoted primary-source sentence on file; withheld from public pages 2026-10-19
  },
  {
    id: "nis2-lu",
    date: NIS2_DATES.luxembourg.inForceDate,
    display: NIS2_DATES.luxembourg.inForceDisplay,
    label: "NIS2 in force in Luxembourg (Loi du 5 mai 2026)",
    status: "in_force",
    // 2026-10-19 audit fix: this previously linked to a secondary tracker
    // (nis-2-directive.com) while the label claimed the primary source.
    // Found and confirmed resolving (HTTP 200): Legilux, Luxembourg's own
    // official legal publication portal, Mémorial A n° 225 de 2026.
    citationLabel: "Legilux (Mémorial A n° 225 de 2026)",
    citationUrl: "https://legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: false, // pending — no quoted primary-source sentence on file; withheld from public pages 2026-10-19
  },
  {
    id: "nis2-nl",
    date: NIS2_DATES.netherlands.inForceDate,
    display: NIS2_DATES.netherlands.inForceDisplay,
    label: "Cyberbeveiligingswet (NIS2) in force in the Netherlands",
    status: "in_force",
    citationLabel: "Staatsblad 2026, 187 and 189 (Art. 35)",
    citationUrl: "https://zoek.officielebekendmakingen.nl/stb-2026-189.html",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true, // this one's Article 35 text was read directly, see lib/nis2-dates.ts
  },
  {
    id: "cra-reporting",
    date: "2026-09-11",
    display: "11 September 2026",
    label: "Cyber Resilience Act, Article 14, applies",
    status: "upcoming",
    // Verbatim, Art. 71(2): "This Regulation shall apply from 11 December 2027.
    // However, Article 14 shall apply from 11 September 2026 and Chapter IV
    // (Articles 35 to 51) shall apply from 11 June 2026." Read directly
    // 2026-10-19 against the ELI text below.
    citationLabel: "Regulation (EU) 2024/2847, Art. 71(2)",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
  {
    id: "machinery-regulation",
    date: "2027-01-14",
    display: "14 January 2027",
    label: "Machinery Regulation (EU) 2023/1230 applies",
    status: "upcoming",
    // Verbatim, Art. 54: "It shall apply from 14 January 2027." Read
    // directly 2026-10-19 against the ELI text below. The previous
    // 20 January 2027 figure on this entry was wrong and has been
    // corrected; see the guide page for the repeal (Art. 51(2)) and
    // transitional-sale (Art. 52(1)) quotes, which confirm the old
    // Directive is repealed from the same date this Regulation applies.
    citationLabel: "Regulation (EU) 2023/1230, Art. 54",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2023/1230/oj/eng",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
  {
    id: "cra-full",
    date: "2027-12-11",
    display: "11 December 2027",
    label: "Cyber Resilience Act fully applies",
    status: "upcoming",
    // Verbatim, Art. 71(2): see cra-reporting above — same sentence, same source.
    citationLabel: "Regulation (EU) 2024/2847, Art. 71(2)",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng",
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
];

// Always rendered in date order — the component must never reorder or
// filter this beyond what's exported here, so the ledger can't silently
// drift into a different story than this file tells.
export const COMPLIANCE_LEDGER_SORTED = [...COMPLIANCE_LEDGER].sort((a, b) => a.date.localeCompare(b.date));
