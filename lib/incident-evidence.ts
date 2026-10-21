// Single source of truth for every public incident the OT site cites. Same rule
// as lib/compliance-ledger.ts: nothing about a real incident goes on a page
// unless it is written here first, quoted from a primary record (an official
// hearing record or a government agency alert), with the record's URL, its
// identifier, and a check date. scripts/check-claims.mjs enforces this at build
// time: every entry needs those fields, and no other in-scope file may retype a
// quote from this file or name an incident without importing from it.
//
// Quotes that name a company (for example the incident-response firm in the
// Colonial Pipeline testimony) are left out, because the report names no
// vendor; the point they make is stated as Interpretation instead.
//
// Only uncontested cases are listed. A case whose public record is disputed
// (EXCLUDED_INCIDENTS below) is never described as an incident on a page.
//
// LAST VERIFIED (whole file, as a pass): 2026-10-21.

export interface IncidentQuote {
  speaker?: string; // who said it, for testimony records
  text: string; // verbatim from the record
}

export interface IncidentEvidence {
  id: string;
  name: string; // short public name of the case
  year: string;
  recordType: "hearing record" | "agency alert";
  recordLabel: string; // e.g. the hearing title or the alert title
  recordId: string; // e.g. "S. Hrg. 117-429", "IR-ALERT-H-16-056-01"
  recordUrl: string;
  recordDateDisplay?: string; // only when the record itself states its own date
  tier: "primary";
  contested: false;
  quotes: IncidentQuote[];
  lastVerifiedDisplay: string;
}

export const INCIDENT_EVIDENCE: IncidentEvidence[] = [
  {
    id: "colonial-pipeline-2021",
    name: "Colonial Pipeline",
    year: "2021",
    recordType: "hearing record",
    recordLabel: "Threats to Critical Infrastructure: Examining the Colonial Pipeline Cyberattack, US Senate Committee on Homeland Security and Governmental Affairs",
    recordId: "S. Hrg. 117-429",
    recordUrl: "https://www.govinfo.gov/content/pkg/CHRG-117shrg46569/html/CHRG-117shrg46569.htm",
    recordDateDisplay: "8 June 2021",
    tier: "primary",
    contested: false,
    quotes: [
      {
        speaker: "Colonial Pipeline chief executive, testimony",
        text: "Although the investigation is still ongoing, we believe the attacker exploited the legacy VPN profile that was not intended to be in use.",
      },
      {
        speaker: "Colonial Pipeline chief executive, answering on multi-factor authentication",
        text: "in the case of this particular legacy VPN, it did only have single-factor authentication.",
      },
      {
        speaker: "Colonial Pipeline chief executive, answering whether the attack was detected only in the IT network",
        text: "Senator, that is correct.",
      },
    ],
    lastVerifiedDisplay: "21 October 2026",
  },
  {
    id: "ukraine-grid-2015",
    name: "Ukrainian power distribution companies",
    year: "2015",
    recordType: "agency alert",
    recordLabel: "Cyber-Attack Against Ukrainian Critical Infrastructure, US Cybersecurity and Infrastructure Security Agency (CISA)",
    recordId: "IR-ALERT-H-16-056-01",
    recordUrl: "https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01",
    tier: "primary",
    contested: false,
    quotes: [
      {
        text: "During the cyber-attacks, malicious remote operation of the breakers was conducted by multiple external humans using either existing remote administration tools at the operating system level or remote industrial control system (ICS) client software via virtual private network (VPN) connections.",
      },
      {
        text: "The companies believe that the actors acquired legitimate credentials prior to the cyber-attack to facilitate remote access.",
      },
      {
        text: "Remote access should be operator controlled, time limited, and procedurally similar to \"lock out, tag out.\"",
      },
    ],
    lastVerifiedDisplay: "21 October 2026",
  },
];

// Considered and left out. Listed so the report can say what it excluded and
// why, without describing the excluded case as an incident.
export const EXCLUDED_INCIDENTS: { name: string; reason: string }[] = [
  {
    name: "Oldsmar, Florida, water treatment plant (2021)",
    reason: "The public record is contested: the former city manager later attributed the event to employee error, and the FBI was reported as unable to confirm an intrusion. A contested case cannot carry a finding.",
  },
];

export function incidentById(id: string): IncidentEvidence {
  const e = INCIDENT_EVIDENCE.find((i) => i.id === id);
  if (!e) throw new Error(`No incident evidence entry: ${id}`);
  return e;
}
