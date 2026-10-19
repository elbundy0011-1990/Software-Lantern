// Single source of truth for every regulatory claim, date, and quote the
// OT cybersecurity site makes anywhere: the Compliance Ledger (see
// components/compliance-ledger.tsx), the scope checker's result screens
// (components/nis2-scope-checker.tsx), and the guide pages. Nothing goes
// public — no date, no quote, no "applies from," no "in force since" —
// unless it is written here first, with a citation URL and a check date.
// scripts/check-claims.mjs enforces this at build time: see docs/CLAIMS.md
// for how to add a new claim.
//
// LAST VERIFIED (whole file, as a pass): 2026-10-19.

export type LedgerStatus = "in_force" | "upcoming";

export interface LedgerQuote {
  article: string; // e.g. "Article 98" or "Article 71(2)"
  text: string; // verbatim, in the source language
  translation?: string; // "Our translation" — shown only when the source isn't English
}

export type LedgerEvidence =
  | { kind: "quote"; quotes: LedgerQuote[] }
  | { kind: "record"; fields: { label: string; value: string }[] };

export interface LedgerEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd, for sorting and "days until/since"
  display: string; // human display date, e.g. "15 August 2026"
  label: string;
  status: LedgerStatus;
  citationLabel: string;
  citationUrl: string;
  // A second citation for the entry's subject/purpose, when that's a
  // different document than the primary gazette/register citation above
  // (for example, a parliamentary bill summary explaining what a gazette
  // record transposes).
  subjectLabel?: string;
  subjectUrl?: string;
  evidence: LedgerEvidence;
  lastVerified: string; // ISO date this specific entry was last checked
  lastVerifiedDisplay: string; // human display date, e.g. "19 October 2026" — used in the public "Source: ..., checked ..." line
  verified: boolean; // false => withheld from public rendering entirely, no evidence on file yet
}

export const COMPLIANCE_LEDGER: LedgerEntry[] = [
  {
    id: "nis2-be",
    date: "2024-10-18",
    display: "18 October 2024",
    label: "NIS2 in force in Belgium (Law of 26 April 2024)",
    status: "in_force",
    citationLabel: "Law of 26 April 2024 (Moniteur belge), Art. 98",
    citationUrl: "https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel",
    evidence: {
      kind: "quote",
      quotes: [
        {
          article: "Article 98",
          text: "La présente loi entre en vigueur le 18 octobre 2024.",
          translation: "This law enters into force on 18 October 2024.",
        },
      ],
    },
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
  {
    id: "nis2-lu",
    date: "2026-05-10",
    display: "10 May 2026",
    label: "NIS2 in force in Luxembourg (Loi du 5 mai 2026)",
    status: "in_force",
    citationLabel: "Legilux gazette record, Loi du 5 mai 2026 (Mémorial A225)",
    citationUrl: "https://legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo",
    subjectLabel: "Chamber of Deputies summary of bill No 8364 (transposition of Directive (EU) 2022/2555)",
    subjectUrl: "https://wdocs-pub.chd.lu/docs/Dossiers_parlementaires/8364/20260415_Resume.pdf",
    evidence: {
      kind: "record",
      fields: [
        { label: "Signature", value: "5 May 2026" },
        { label: "Publication", value: "6 May 2026" },
        { label: "Entry into force", value: "10 May 2026" },
        { label: "Parliamentary document", value: "No 8364" },
      ],
    },
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
  {
    id: "nis2-nl",
    date: "2026-08-15",
    display: "15 August 2026",
    label: "Cyberbeveiligingswet (NIS2) in force in the Netherlands",
    status: "in_force",
    citationLabel: "Staatsblad 2026, 187 and 189 (Art. 35)",
    citationUrl: "https://zoek.officielebekendmakingen.nl/stb-2026-189.html",
    evidence: {
      kind: "quote",
      quotes: [
        {
          article: "Article 35",
          text: "De Cyberbeveiligingswet en dit besluit treden in werking met ingang van 15 augustus 2026.",
          translation: "The Cyberbeveiligingswet and this decree enter into force as of 15 August 2026.",
        },
      ],
    },
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
  {
    id: "cra-reporting",
    date: "2026-09-11",
    display: "11 September 2026",
    label: "Cyber Resilience Act, Article 14, applies",
    status: "upcoming",
    citationLabel: "Regulation (EU) 2024/2847, Art. 71(2)",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng",
    evidence: {
      kind: "quote",
      quotes: [
        {
          article: "Article 71(2)",
          text: "This Regulation shall apply from 11 December 2027. However, Article 14 shall apply from 11 September 2026 and Chapter IV (Articles 35 to 51) shall apply from 11 June 2026.",
        },
      ],
    },
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
    citationLabel: "Regulation (EU) 2023/1230, Art. 54",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2023/1230/oj/eng",
    evidence: {
      kind: "quote",
      quotes: [
        { article: "Article 54", text: "It shall apply from 14 January 2027." },
        { article: "Article 51(2)", text: "Directive 2006/42/EC is repealed with effect from 14 January 2027." },
        {
          article: "Article 52(1)",
          text: "Member States shall not impede the making available on the market of products which were placed on the market in conformity with Directive 2006/42/EC before 14 January 2027.",
        },
      ],
    },
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
    citationLabel: "Regulation (EU) 2024/2847, Art. 71(2)",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng",
    evidence: {
      kind: "quote",
      quotes: [
        {
          article: "Article 71(2)",
          text: "This Regulation shall apply from 11 December 2027. However, Article 14 shall apply from 11 September 2026 and Chapter IV (Articles 35 to 51) shall apply from 11 June 2026.",
        },
      ],
    },
    lastVerified: "2026-10-19",
    lastVerifiedDisplay: "19 October 2026",
    verified: true,
  },
];

// Always rendered in date order — the component must never reorder or
// filter this beyond what's exported here, so the ledger can't silently
// drift into a different story than this file tells.
export const COMPLIANCE_LEDGER_SORTED = [...COMPLIANCE_LEDGER].sort((a, b) => a.date.localeCompare(b.date));

// Evidence for a regulatory claim that rides on the same primary source
// as an existing ledger entry, or isn't a dated timeline event at all
// (so it doesn't belong in COMPLIANCE_LEDGER's chronological log), but
// still needs a citation and a check date like everything else here.
export interface SupplementaryQuote {
  id: string;
  citationLabel: string;
  citationUrl: string;
  quotes: LedgerQuote[];
  lastVerifiedDisplay: string;
}

export const SUPPLEMENTARY_EVIDENCE: SupplementaryQuote[] = [
  {
    id: "nis2-article-21-2-d",
    citationLabel: "Directive (EU) 2022/2555, Art. 21(2)(d)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng",
    quotes: [
      {
        article: "Article 21(2)",
        text: "The measures referred to in paragraph 1 shall be based on an all-hazards approach that aims to protect network and information systems and the physical environment of those systems from incidents, and shall include at least the following: (a) policies on risk analysis and information system security; (b) incident handling; (c) business continuity, such as backup management and disaster recovery, and crisis management; (d) supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers.",
      },
    ],
    lastVerifiedDisplay: "19 October 2026",
  },
];
