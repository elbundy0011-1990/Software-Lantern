// Pure content builders for the /checker result (the "brief"), shared by the
// on-screen result (components/nis2-scope-checker.tsx) and the "email me a copy"
// template (lib/email-templates.ts), so the two never describe the same answers
// differently. Every regulatory statement traces to lib/compliance-ledger.ts, per
// docs/CLAIMS.md; nothing here invents a date, a statistic, or a verdict/score.

import {
  COMPLIANCE_LEDGER,
  SUPPLEMENTARY_EVIDENCE,
  sourceLineText,
  type LedgerEntry,
  type LedgerQuote,
  type SupplementaryQuote,
} from "./compliance-ledger";
import { OFFICIAL_SCOPE_TOOLS, LUXEMBOURG_AUTHORITY, type Nis2Country } from "./nis2-dates";
import { getCountrySection, type CountrySection } from "./country-report";
import { rowById, type PackRow } from "./questionnaire-pack-rows";
import type { CheckerAnswers } from "./checker-session";
import type { Audience } from "@/components/nis2-scope-checker";

export type Applicability = "likely_applies" | "likely_does_not_apply" | "not_enough_info";

export interface RegulationBrief {
  id: "nis2" | "cra" | "machinery";
  name: string;
  applicability: Applicability;
  applicabilityLabel: string;
  explanation: string;
  quote?: LedgerQuote;
  sourceLine?: string;
  citationUrl?: string;
}

const APPLICABILITY_LABEL: Record<Applicability, string> = {
  likely_applies: "Likely applies",
  likely_does_not_apply: "Generally does not apply, based on your answers",
  not_enough_info: "Not enough information from your answers",
};

function countryLabel(country: Nis2Country | null): string {
  return country === "NL" ? "the Netherlands" : country === "BE" ? "Belgium" : country === "LU" ? "Luxembourg" : "your country";
}

function countryLedgerEntry(country: Nis2Country | null): LedgerEntry | null {
  const id = country === "NL" ? "nis2-nl" : country === "BE" ? "nis2-be" : country === "LU" ? "nis2-lu" : null;
  if (!id) return null;
  const entry = COMPLIANCE_LEDGER.find((e) => e.id === id);
  return entry && entry.verified ? entry : null;
}

function nis2Brief(answers: CheckerAnswers): RegulationBrief {
  const { size, audience, country } = answers;
  const annex2 = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-annex2-5d")!;
  const importantEntities = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-important-entities-art3-2")!;
  const countryEntry = countryLedgerEntry(country);
  const countryClause = countryEntry ? ` In ${countryLabel(country)}, this has applied since ${countryEntry.display}.` : "";

  if (size === "medium_large") {
    if (audience === "operator") {
      return {
        id: "nis2",
        name: "NIS2",
        applicability: "not_enough_info",
        applicabilityLabel: APPLICABILITY_LABEL.not_enough_info,
        explanation:
          "Your size clears NIS2's medium/large threshold, but whether it applies also depends on your specific sector among its 18 covered sectors, which this brief doesn't attempt to classify. The official tool below does.",
      };
    }
    return {
      id: "nis2",
      name: "NIS2",
      applicability: "likely_applies",
      applicabilityLabel: APPLICABILITY_LABEL.likely_applies,
      explanation: `Machinery and equipment manufacturing sits in NIS2 Annex II, point 5(d), which generally produces important-entity status (rather than essential-entity status) for medium and large companies.${countryClause}`,
      quote: annex2.evidence.kind === "quote" ? annex2.evidence.quotes[0] : undefined,
      sourceLine: sourceLineText(annex2),
      citationUrl: annex2.citationUrl,
    };
  }

  if (size === "small_micro") {
    return {
      id: "nis2",
      name: "NIS2",
      applicability: "likely_does_not_apply",
      applicabilityLabel: APPLICABILITY_LABEL.likely_does_not_apply,
      explanation:
        "NIS2's organizational rules generally only apply to medium and large companies (broadly: 50 or more staff, or over €10m turnover or balance sheet total). A small or micro business is generally outside its direct scope, unless a specific exception applies, such as being identified individually as critical by your country's authority.",
      quote: importantEntities.evidence.kind === "quote" ? importantEntities.evidence.quotes[0] : undefined,
      sourceLine: sourceLineText(importantEntities),
      citationUrl: importantEntities.citationUrl,
    };
  }

  return {
    id: "nis2",
    name: "NIS2",
    applicability: "not_enough_info",
    applicabilityLabel: APPLICABILITY_LABEL.not_enough_info,
    explanation:
      "Whether NIS2's organizational rules apply to you generally depends on your sector and your company size (broadly: 50 or more staff, or over €10m turnover or balance sheet total is the threshold that's in scope; below that, you're generally outside it).",
  };
}

function craBrief(answers: CheckerAnswers): RegulationBrief {
  const cra = COMPLIANCE_LEDGER.find((e) => e.id === "cra-reporting")!;
  const craFull = COMPLIANCE_LEDGER.find((e) => e.id === "cra-full")!;
  const scope = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "cra-scope-art2-1")!;
  const { audience } = answers;

  if (audience === "builder" || audience === "integrator") {
    return {
      id: "cra",
      name: "Cyber Resilience Act",
      applicability: "likely_applies",
      applicabilityLabel: APPLICABILITY_LABEL.likely_applies,
      explanation: `The Cyber Resilience Act applies to products with digital elements placed on the market, regardless of your company size. Article 14 (reporting actively exploited vulnerabilities and severe incidents) applies from ${cra.display}, and the Regulation fully applies from ${craFull.display}.`,
      quote: scope.evidence.kind === "quote" ? scope.evidence.quotes[0] : undefined,
      sourceLine: sourceLineText(scope),
      citationUrl: scope.citationUrl,
    };
  }
  if (audience === "operator") {
    return {
      id: "cra",
      name: "Cyber Resilience Act",
      applicability: "likely_does_not_apply",
      applicabilityLabel: APPLICABILITY_LABEL.likely_does_not_apply,
      explanation:
        "The Cyber Resilience Act applies to manufacturers placing a connected product on the market, not to the operators who run it, though it affects the machines your own suppliers sell you.",
      quote: scope.evidence.kind === "quote" ? scope.evidence.quotes[0] : undefined,
      sourceLine: sourceLineText(scope),
      citationUrl: scope.citationUrl,
    };
  }
  return {
    id: "cra",
    name: "Cyber Resilience Act",
    applicability: "not_enough_info",
    applicabilityLabel: APPLICABILITY_LABEL.not_enough_info,
    explanation:
      "Whether this applies to you depends on whether you place a product with digital elements on the market yourself, which this brief can't determine from your answers alone.",
    quote: scope.evidence.kind === "quote" ? scope.evidence.quotes[0] : undefined,
    sourceLine: sourceLineText(scope),
    citationUrl: scope.citationUrl,
  };
}

function machineryBrief(answers: CheckerAnswers): RegulationBrief {
  const machinery = COMPLIANCE_LEDGER.find((e) => e.id === "machinery-regulation")!;
  const { audience } = answers;
  const quote = machinery.evidence.kind === "quote" ? machinery.evidence.quotes[0] : undefined;

  if (audience === "builder" || audience === "integrator") {
    return {
      id: "machinery",
      name: "Machinery Regulation",
      applicability: "likely_applies",
      applicabilityLabel: APPLICABILITY_LABEL.likely_applies,
      explanation: `The Machinery Regulation covers safety requirements for machinery placed on the market, including protection against corruption that could create a safety hazard, and applies from ${machinery.display}.`,
      quote,
      sourceLine: sourceLineText(machinery),
      citationUrl: machinery.citationUrl,
    };
  }
  if (audience === "operator") {
    return {
      id: "machinery",
      name: "Machinery Regulation",
      applicability: "likely_does_not_apply",
      applicabilityLabel: APPLICABILITY_LABEL.likely_does_not_apply,
      explanation:
        "The Machinery Regulation applies to manufacturers placing machinery on the market, not to the operators who run it, though it affects the machines your own suppliers sell you.",
      quote,
      sourceLine: sourceLineText(machinery),
      citationUrl: machinery.citationUrl,
    };
  }
  return {
    id: "machinery",
    name: "Machinery Regulation",
    applicability: "not_enough_info",
    applicabilityLabel: APPLICABILITY_LABEL.not_enough_info,
    explanation:
      "Whether this applies to you depends on whether you place machinery on the market yourself, which this brief can't determine from your answers alone.",
    quote,
    sourceLine: sourceLineText(machinery),
    citationUrl: machinery.citationUrl,
  };
}

export function regulationBriefs(answers: CheckerAnswers): RegulationBrief[] {
  return [nis2Brief(answers), craBrief(answers), machineryBrief(answers)];
}

export interface DateItem {
  id: string;
  label: string;
  dateIso: string | null;
  display: string | null;
  note?: string;
  sourceLine?: string;
  citationUrl?: string;
}

export function datesThatMatter(answers: CheckerAnswers): DateItem[] {
  const cra = COMPLIANCE_LEDGER.find((e) => e.id === "cra-reporting")!;
  const craFull = COMPLIANCE_LEDGER.find((e) => e.id === "cra-full")!;
  const machinery = COMPLIANCE_LEDGER.find((e) => e.id === "machinery-regulation")!;
  const countryEntry = countryLedgerEntry(answers.country);

  const items: DateItem[] = [];
  if (countryEntry) {
    items.push({
      id: countryEntry.id,
      label: `NIS2 in force in ${countryLabel(answers.country)}`,
      dateIso: countryEntry.date,
      display: countryEntry.display,
      sourceLine: sourceLineText(countryEntry),
      citationUrl: countryEntry.citationUrl,
    });
  } else {
    items.push({
      id: "nis2-unresolved",
      label: "NIS2 in force in your country",
      dateIso: null,
      display: null,
      note: "NIS2's in-force date depends on your country's own transposition law. Use the official government tool below for the exact date where one exists.",
    });
  }
  items.push({
    id: cra.id,
    label: cra.label,
    dateIso: cra.date,
    display: cra.display,
    sourceLine: sourceLineText(cra),
    citationUrl: cra.citationUrl,
  });
  items.push({
    id: craFull.id,
    label: craFull.label,
    dateIso: craFull.date,
    display: craFull.display,
    sourceLine: sourceLineText(craFull),
    citationUrl: craFull.citationUrl,
  });
  items.push({
    id: machinery.id,
    label: machinery.label,
    dateIso: machinery.date,
    display: machinery.display,
    sourceLine: sourceLineText(machinery),
    citationUrl: machinery.citationUrl,
  });
  return items;
}

export function checkerCountrySection(country: Nis2Country | null): CountrySection | null {
  if (country === "NL" || country === "BE" || country === "LU") return getCountrySection(country);
  return null;
}

export function officialToolLinks(country: Nis2Country | null): { name: string; url: string }[] {
  if (country === "NL") return [OFFICIAL_SCOPE_TOOLS.NL];
  if (country === "BE") return [OFFICIAL_SCOPE_TOOLS.BE];
  if (country === "LU") return [];
  return [OFFICIAL_SCOPE_TOOLS.NL, OFFICIAL_SCOPE_TOOLS.BE];
}

export { LUXEMBOURG_AUTHORITY };

export function customerQuestionsFraming(audience: Audience | null): string {
  if (audience === "operator") return "questions you may need to ask your own suppliers";
  if (audience === "not_sure") return "questions a customer or supplier may ask";
  return "questions your customers may ask you";
}

export function customerQuestionsForBrief(answers: CheckerAnswers): PackRow[] {
  const ids = ["access-1", "auth-1", "logging-1", answers.remoteAccess === "yes" ? "sub-1" : "doc-2"];
  return ids.map(rowById);
}

export const CUSTOMER_QUESTIONS_CITATION: SupplementaryQuote = SUPPLEMENTARY_EVIDENCE.find(
  (e) => e.id === "nis2-article-21-2-d",
)!;

export interface NextStep {
  text: string;
  href: string;
}

export function nextSteps(): NextStep[] {
  return [
    { text: "Check the official government self-evaluation tool for your country, linked below", href: "/checker#official-tool" },
    { text: "Build your remote access review sheet (7 questions, free, no email)", href: "/remote-access-check" },
    { text: "Get the customer security questionnaire pack", href: "/questionnaire-pack" },
    { text: "See what remote access could cost or save you", href: "/roi-calculator" },
    { text: "Talk it through with us", href: "/checker#ot-enquiry-form" },
  ];
}

export interface CheckerBriefContent {
  regulations: RegulationBrief[];
  dates: DateItem[];
  countrySection: CountrySection | null;
  officialTools: { name: string; url: string }[];
  customerQuestionsFraming: string;
  customerQuestions: PackRow[];
  nextSteps: NextStep[];
}

export function buildCheckerBrief(answers: CheckerAnswers): CheckerBriefContent {
  return {
    regulations: regulationBriefs(answers),
    dates: datesThatMatter(answers),
    countrySection: checkerCountrySection(answers.country),
    officialTools: officialToolLinks(answers.country),
    customerQuestionsFraming: customerQuestionsFraming(answers.audience),
    customerQuestions: customerQuestionsForBrief(answers),
    nextSteps: nextSteps(),
  };
}

function quoteLine(q?: LedgerQuote): string {
  if (!q) return "";
  return q.translation ?? q.text;
}

export function checkerBriefToText(answers: CheckerAnswers): string {
  const c = buildCheckerBrief(answers);
  const lines: string[] = [];
  lines.push("YOUR BRIEF: WHICH EU RULES APPLY TO YOU");
  lines.push("");
  lines.push("WHICH RULES LIKELY APPLY");
  for (const r of c.regulations) {
    lines.push(`- ${r.name}: ${r.applicabilityLabel}`);
    lines.push(`  ${r.explanation}`);
    if (r.quote) lines.push(`  Quote: "${quoteLine(r.quote)}" (${r.sourceLine})`);
  }
  lines.push("");
  lines.push("DATES THAT MATTER");
  for (const d of c.dates) {
    if (d.display) {
      lines.push(`- ${d.label}: ${d.display} (${d.sourceLine})`);
    } else {
      lines.push(`- ${d.label}: ${d.note}`);
    }
  }
  lines.push("");
  lines.push("YOUR COUNTRY");
  if (c.countrySection) {
    const s = c.countrySection;
    lines.push(`- In force since: ${s.inForce.display} (${sourceLineText(s.inForce)})`);
    lines.push(`- Supervisory authority: ${s.authority.citationLabel}`);
    lines.push(`- Registration step: ${s.registration.citationLabel}`);
    lines.push(`- Incident-reporting duty: ${s.incident.citationLabel}`);
  } else {
    lines.push("- No country-specific section is available. Use the official tool(s) below.");
    for (const t of c.officialTools) lines.push(`  ${t.name}: ${t.url}`);
  }
  lines.push("");
  lines.push(`${c.customerQuestionsFraming.toUpperCase()} (NIS2 ART. 21(2)(D))`);
  for (const q of c.customerQuestions) lines.push(`- ${q.question}`);
  lines.push("");
  lines.push("NEXT STEPS");
  for (const s of c.nextSteps) lines.push(`- ${s.text}`);
  lines.push("");
  lines.push("This is a general guide, not legal advice. It deliberately says \"generally\" because real");
  lines.push("exceptions exist. Confirm your specific obligations with the official government tool or a");
  lines.push("qualified advisor.");
  return lines.join("\n");
}
