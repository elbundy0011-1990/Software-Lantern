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

// Two evidence tiers:
// - "primary": a quote read directly from the official text (EUR-Lex,
//   a national gazette, Legilux), or a gazette/register record. The
//   public Source line is "Source: [name], checked [date]".
// - "corroborated": the official EUR-Lex URL did not yield a
//   confirmable direct read in this pass, so the quote is corroborated
//   against at least three independent copies of the same text instead
//   (copyUrls). The public Source line says so explicitly: "Source:
//   [act and article]. Wording cross-checked against published copies,
//   [date]." scripts/check-claims.mjs fails the build if a
//   "corroborated" entry has fewer than 3 copyUrls.
export type LedgerEvidence =
  | { kind: "quote"; tier: "primary"; quotes: LedgerQuote[] }
  | { kind: "quote"; tier: "corroborated"; quotes: LedgerQuote[]; copyUrls: string[] }
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

// The public "Source: ..." line, in the one format every renderer
// (ledger, checker, guides) must use, so the two evidence tiers never
// get paraphrased differently in different places.
export function sourceLineText(entry: { citationLabel: string; lastVerifiedDisplay: string; evidence: LedgerEvidence }): string {
  if (entry.evidence.kind === "quote" && entry.evidence.tier === "corroborated") {
    return `Source: ${entry.citationLabel}. Wording cross-checked against published copies, ${entry.lastVerifiedDisplay}.`;
  }
  return `Source: ${entry.citationLabel}, checked ${entry.lastVerifiedDisplay}`;
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
      tier: "primary",
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
      tier: "primary",
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
      tier: "primary",
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
      tier: "primary",
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
      tier: "primary",
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
// Shares the same LedgerEvidence shape (and the same "primary"/
// "corroborated" tiers) as a ledger entry.
export interface SupplementaryQuote {
  id: string;
  citationLabel: string;
  citationUrl: string;
  evidence: LedgerEvidence;
  lastVerifiedDisplay: string;
}

export const SUPPLEMENTARY_EVIDENCE: SupplementaryQuote[] = [
  {
    id: "nis2-article-21-2-d",
    citationLabel: "Directive (EU) 2022/2555, Art. 21(2)(d)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 21(2)",
          text: "The measures referred to in paragraph 1 shall be based on an all-hazards approach that aims to protect network and information systems and the physical environment of those systems from incidents, and shall include at least the following: (a) policies on risk analysis and information system security; (b) incident handling; (c) business continuity, such as backup management and disaster recovery, and crisis management; (d) supply chain security, including security-related aspects concerning the relationships between each entity and its direct suppliers or service providers.",
        },
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },
  {
    id: "cra-scope-art2-1",
    citationLabel: "Regulation (EU) 2024/2847, Art. 2(1)",
    citationUrl: "https://eur-lex.europa.eu/eli/reg/2024/2847/2024-11-20/eng",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 2(1)",
          text: "This Regulation applies to products with digital elements made available on the market, the intended purpose or reasonably foreseeable use of which includes a direct or indirect logical or physical data connection to a device or network.",
        },
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },
  {
    id: "nis2-scope-art2-1",
    citationLabel: "Directive (EU) 2022/2555, Art. 2(1)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/2022-12-27",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 2(1)",
          text: "This Directive applies to public or private entities of a type referred to in Annex I or II which qualify as medium-sized enterprises under Article 2 of the Annex to Recommendation 2003/361/EC, or exceed the ceilings for medium-sized enterprises provided for in paragraph 1 of that Article, and which provide their services or carry out their activities within the Union.",
        },
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },
  {
    id: "nis2-important-entities-art3-2",
    citationLabel: "Directive (EU) 2022/2555, Art. 3(2)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/2022-12-27",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 3(2)",
          text: "For the purposes of this Directive, entities of a type referred to in Annex I or II which do not qualify as essential entities pursuant to paragraph 1 of this Article shall be considered to be important entities.",
        },
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },
  {
    id: "nis2-art21-1",
    citationLabel: "Directive (EU) 2022/2555, Art. 21(1)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng",
    evidence: {
      kind: "quote",
      tier: "corroborated",
      quotes: [
        {
          article: "Article 21(1)",
          text: "Member States shall ensure that essential and important entities take appropriate and proportionate technical, operational and organisational measures to manage the risks posed to the security of network and information systems which those entities use for their operations or for the provision of their services, and to prevent or minimise the impact of incidents on recipients of their services and on other services. Taking into account the state-of-the-art and, where applicable, relevant European and international standards, as well as the cost of implementation, the measures referred to in the first subparagraph shall ensure a level of security of network and information systems appropriate to the risks posed. When assessing the proportionality of those measures, due account shall be taken of the degree of the entity's exposure to risks, the entity's size and the likelihood of occurrence of incidents and their severity, including their societal and economic impact.",
        },
      ],
      copyUrls: [
        "https://advisera.com/nis2/cybersecurity-risk-management-measures/",
        "https://prighter.com/resources/laws/nis2/articles/article-21",
        "https://myctrl.tools/frameworks/nis2/article-21-1",
        "https://www.springlex.eu/en/packages/nis2/nis2-directive/article-21/",
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },
  {
    id: "nis2-annex2-5d",
    citationLabel: "Directive (EU) 2022/2555, Annex II, point 5(d)",
    citationUrl: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj/eng",
    evidence: {
      kind: "quote",
      tier: "corroborated",
      quotes: [
        {
          article: "Annex II, point 5(d)",
          text: "Manufacture of machinery and equipment n.e.c. (undertakings carrying out any of the economic activities referred to in section C division 28 of NACE Rev. 2).",
        },
      ],
      copyUrls: [
        "https://advisera.com/nis2/other-critical-sectors/",
        "https://prighter.com/resources/laws/nis2/articles/annex-ii",
        "https://streamlex.eu/annexes/nis2-en-annex-ii/",
        "https://www.ilr.lu/en/?p=32584",
      ],
    },
    lastVerifiedDisplay: "19 October 2026",
  },

  // --- Country report additions (2026-10-20): supervisory authority,
  // registration duty, and incident-reporting duty per country, for the
  // remote-access-check country report. Sourced only from official
  // domains per instruction (rijksoverheid.nl, ncsc.nl, rdi.nl,
  // ccb.belgium.be, safeonweb.be, ilr.lu, and national gazettes) — no
  // claim below rests on a secondary/tracker source. Belgium's
  // ccb.belgium.be and safeonweb.be themselves returned 403 to every
  // fetch attempted in this pass, so all three Belgian claims are
  // sourced directly from the official gazette instead (the law itself
  // and its implementing Royal Decree), which the instruction's
  // "gazettes" category also covers.
  {
    id: "nl-cbw-supervisory-authority",
    citationLabel: "NCSC-NL, Cyberbeveiligingswet (NIS2) referral-tree overview",
    citationUrl: "https://www.ncsc.nl/cyberbeveiligingswet-nis2/toezicht-op-de-cyberbeveiligingswet-nis2-hoe-zit-dat",
    evidence: {
      kind: "record",
      fields: [
        { label: "Sector (as listed)", value: "Vervaardiging (niet medische apparatuur): manufacturing, non-medical equipment" },
        { label: "Competent authority (toezichthouder)", value: "RDI (Rijksinspectie Digitale Infrastructuur)" },
        { label: "CSIRT", value: "NCSC (Nationaal Cyber Security Centrum)" },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "nl-cbw-registration-duty",
    citationLabel: "RDI, “Registratieplicht Cyberbeveiligingswet”",
    citationUrl: "https://www.rdi.nl/onderwerpen/digitale-weerbaarheid/cyberbeveiligingswet/registratieplicht",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Registratieplicht Cyberbeveiligingswet",
          text: "Organisaties die onder de Cbw vallen, moeten zich registreren in het nationale entiteitenregister. Dit is verplicht vanaf 15 augustus 2026. Het register wordt in Nederland beheerd via Mijn.NCSC.nl.",
          translation: "Organizations that fall under the Cbw must register in the national entity register. This is mandatory from 15 August 2026. The register is managed in the Netherlands via Mijn.NCSC.nl.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "nl-cbw-incident-reporting-duty",
    citationLabel: "NCSC-NL, “Meld incidenten onder de Cyberbeveiligingswet (meldplicht)”",
    citationUrl: "https://www.ncsc.nl/cyberbeveiligingswet-nis2/meldplicht",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Meldplicht, vroegtijdige waarschuwing",
          text: "Vroegtijdige waarschuwing binnen 24 uur.",
          translation: "Early warning within 24 hours.",
        },
        {
          article: "Meldplicht, melding",
          text: "Melding binnen 72 uur.",
          translation: "Notification within 72 hours.",
        },
        {
          article: "Meldplicht, eindverslag",
          text: "Eindverslag binnen 1 maand na je melding.",
          translation: "Final report within 1 month after your notification.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "be-nis2-supervisory-authority",
    citationLabel: "Arrêté royal du 9 juin 2024 (Moniteur belge), Art. 3 §1",
    citationUrl: "https://www.ejustice.just.fgov.be/cgi/article.pl?language=fr&lg_txt=f&numac_search=2024005260&sum_date=2024-06-24",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 3, § 1er",
          text: "Le Centre pour la Cybersécurité Belgique, créé par l'arrêté royal du 10 octobre 2014 portant création du Centre pour la Cybersécurité Belgique, est désigné comme autorité nationale de cybersécurité.",
          translation: "The Centre for Cybersecurity Belgium, created by the Royal Decree of 10 October 2014 establishing the Centre for Cybersecurity Belgium, is designated as the national cybersecurity authority.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "be-nis2-registration-duty",
    citationLabel: "Law of 26 April 2024 (Moniteur belge), Art. 13 §1",
    citationUrl: "https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 13, § 1er",
          text: "Dans les cinq mois suivant l'entrée en vigueur de la loi ou l'identification visée à l'article 11, les entités essentielles, les entités importantes et les entités fournissant des services d'enregistrement de noms de domaine s'enregistrent auprès de l'autorité nationale de cybersécurité selon les modalités pratiques fixées par cette autorité et lui communiquent les informations suivantes.",
          translation: "Within five months of the law's entry into force, or the identification referred to in Article 11, essential entities, important entities, and domain-name registration service entities must register with the national cybersecurity authority, in the practical manner it determines, and provide it with the following information.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "be-nis2-incident-reporting-duty",
    citationLabel: "Law of 26 April 2024 (Moniteur belge), Art. 35 §1",
    citationUrl: "https://www.ejustice.just.fgov.be/eli/loi/2024/04/26/2024202344/justel",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Article 35, § 1er, 1°",
          text: "Sans retard injustifié et en tout état de cause dans les vingt-quatre heures après avoir eu connaissance de l'incident significatif, une alerte précoce qui, le cas échéant, indique si l'on suspecte que l'incident significatif a été causé par des actes illicites ou malveillants ou s'il pourrait avoir un impact transfrontière.",
          translation: "Without undue delay and in any case within twenty-four hours of becoming aware of the significant incident, an early warning indicating, where relevant, whether the significant incident is suspected to be caused by unlawful or malicious acts or could have a cross-border impact.",
        },
        {
          article: "Article 35, § 1er, 2°",
          text: "Sans retard injustifié et en tout état de cause dans les septante-deux heures après avoir eu connaissance de l'incident significatif, une notification d'incident qui, le cas échéant, met à jour les informations visées au 1° et fournit une évaluation initiale de l'incident significatif, y compris de sa gravité et de son impact, ainsi que des indicateurs de compromission, lorsqu'ils sont disponibles.",
          translation: "Without undue delay and in any case within seventy-two hours of becoming aware of the significant incident, an incident notification updating the information referred to in point 1° and providing an initial assessment of the significant incident, including its severity and impact, as well as indicators of compromise where available.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "lu-nis2-supervisory-authority",
    citationLabel: "ILR, “Cybersecurity – NISS”",
    citationUrl: "https://www.ilr.lu/en/sectors/niss/",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Cybersecurity – NISS",
          text: "The Luxembourg Regulatory Institute is the competent authority responsible for cybersecurity under this Act and for the supervisory and enforcement tasks referred to in Chapter 6 for the sectors listed in Annexes I and II and critical entities.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "lu-nis2-registration-duty",
    citationLabel: "ILR, “Self-registration”",
    citationUrl: "https://www.ilr.lu/en/sectors/niss/self-registration/",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Self-registration, legal obligation",
          text: "Self-registration is a legal obligation that must be fulfilled within two months of the NIS 2 Act taking effect, i.e., no later than July 10, 2026.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
  {
    id: "lu-nis2-incident-reporting-duty",
    citationLabel: "ILR, “Incident notification”",
    citationUrl: "https://www.ilr.lu/en/sectors/niss/incident-notification/",
    evidence: {
      kind: "quote",
      tier: "primary",
      quotes: [
        {
          article: "Incident notification, reporting duty",
          text: "You must report incidents to the Institute within the first 24 hours.",
        },
        {
          article: "Incident notification, step 2",
          text: "Within 72 hours of becoming aware of the significant incident, the incident has to be formally notified, updating the information provided in the early warning.",
        },
        {
          article: "Incident notification, final report",
          text: "The final report must be submitted no later than one month after the incident notification.",
        },
      ],
    },
    lastVerifiedDisplay: "20 October 2026",
  },
];
