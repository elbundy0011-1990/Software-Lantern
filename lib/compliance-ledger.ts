// Single source of truth for every entry the Compliance Ledger (see
// components/compliance-ledger.tsx) renders anywhere on the site. Per the
// 2026-10-19 build instruction: every entry comes from this one file, with
// a citation URL and a "last verified" date, and [VERIFY] wherever the
// primary text itself hasn't been read directly yet. No invented log
// events, customers, counts, or sample data — every row below is a real,
// dated regulatory fact, sourced in docs/OT-CYBER-PLAN.md Part A §1 and
// Part B §B.2.1.
//
// LAST VERIFIED (whole file, as a pass): 2026-10-19. Re-check before any
// go-live and periodically after, same discipline as lib/eudr-dates.ts.

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
  verified: boolean; // false => render inline [VERIFY]
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
    verified: false,
  },
  {
    id: "nis2-lu",
    date: NIS2_DATES.luxembourg.inForceDate,
    display: NIS2_DATES.luxembourg.inForceDisplay,
    label: "NIS2 in force in Luxembourg (Loi du 5 mai 2026)",
    status: "in_force",
    citationLabel: "Journal Officiel du Grand-Duché de Luxembourg",
    citationUrl: "https://nis-2-directive.com/Transposition/Luxembourg.html",
    lastVerified: "2026-10-19",
    verified: false,
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
    verified: true, // this one's Article 35 text was read directly, see lib/nis2-dates.ts
  },
  {
    id: "cra-reporting",
    date: "2026-09-11",
    display: "11 September 2026",
    label: "Cyber Resilience Act vulnerability/incident reporting obligations begin",
    status: "upcoming",
    citationLabel: "Regulation (EU) 2024/2847",
    citationUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847",
    lastVerified: "2026-10-19",
    verified: false,
  },
  {
    id: "machinery-regulation",
    date: "2027-01-20",
    display: "20 January 2027",
    label: "Machinery Regulation (EU) 2023/1230 applies, no transition period",
    status: "upcoming",
    citationLabel: "Regulation (EU) 2023/1230",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2023/1230/oj",
    lastVerified: "2026-10-19",
    verified: false,
  },
  {
    id: "cra-full",
    date: "2027-12-11",
    display: "11 December 2027",
    label: "Cyber Resilience Act fully applies",
    status: "upcoming",
    citationLabel: "Regulation (EU) 2024/2847",
    citationUrl: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:L_202402847",
    lastVerified: "2026-10-19",
    verified: false,
  },
];

// Always rendered in date order — the component must never reorder or
// filter this beyond what's exported here, so the ledger can't silently
// drift into a different story than this file tells.
export const COMPLIANCE_LEDGER_SORTED = [...COMPLIANCE_LEDGER].sort((a, b) => a.date.localeCompare(b.date));
