// Every statistical number used in the regional report (/reports/remote-access-
// belgium-netherlands) lives here, cited, and nowhere else is it allowed to be
// retyped as a literal. See docs/WHITEPAPER-DATA.md for the full extraction
// methodology, the raw API responses, and what was deliberately left out for lack
// of a source. Like lib/compliance-ledger.ts, this file is on scripts/check-
// claims.mjs's DATE_ALLOWLIST: it's the one place a literal date is allowed,
// because every other file must reference a date here through an expression,
// never retype it.
//
// Primary source: Eurostat dissemination API, dataset sbs_sc_ovw ("Enterprise
// statistics by size class and NACE Rev. 2 activity"). Extracted 2026-10-21.
// Every figure is an exact count or an exact ratio of exact counts; nothing here
// is modeled, projected, or estimated.

export const EUROSTAT_SOURCE = {
  datasetCode: "sbs_sc_ovw",
  datasetLabel: "Enterprise statistics by size class and NACE Rev. 2 activity (from 2021 onwards)",
  agency: "Eurostat (ESTAT)",
  datasetUpdated: "2026-09-30",
  datasetUpdatedDisplay: "30 September 2026",
  extractionDate: "2026-10-21",
  extractionDateDisplay: "21 October 2026",
  year: "2024",
  queryUrl:
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw?format=JSON&lang=EN&geo=BE&geo=NL&nace_r2=C26&nace_r2=C27&nace_r2=C28&nace_r2=C29&nace_r2=C30&nace_r2=C33&indic_sbs=ENT_NR&indic_sbs=EMP_NR&size_emp=TOTAL&size_emp=0-9&size_emp=10-19&size_emp=20-49&size_emp=50-249&size_emp=GE250&sinceTimePeriod=2021",
} as const;

export type Geo = "BE" | "NL";

export interface NaceEntry {
  nace: string;
  naceLabel: string;
  geo: Geo;
  enterprisesTotal: number;
  enterprises0_9: number | null;
  enterprises10_19: number | null;
  enterprises20_49: number | null;
  enterprises50_249: number;
  enterprisesGe250: number;
  personsEmployedTotal: number;
}

// Full size-class breakdown extracted for every geo x NACE combination; the "null"
// entries are codes the report's size-class chart doesn't break out below 50
// (only C28 does, per the brief), not missing data — see docs/WHITEPAPER-DATA.md
// section 3 for the full breakdown of every code, including those three bands.
export const NACE_DATA: NaceEntry[] = [
  { nace: "C28", naceLabel: "Machinery and equipment n.e.c.", geo: "BE", enterprisesTotal: 1247, enterprises0_9: 907, enterprises10_19: 96, enterprises20_49: 133, enterprises50_249: 95, enterprisesGe250: 16, personsEmployedTotal: 32271 },
  { nace: "C26", naceLabel: "Computer, electronic and optical products", geo: "BE", enterprisesTotal: 380, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 27, enterprisesGe250: 10, personsEmployedTotal: 10085 },
  { nace: "C27", naceLabel: "Electrical equipment", geo: "BE", enterprisesTotal: 505, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 23, enterprisesGe250: 10, personsEmployedTotal: 11738 },
  { nace: "C29", naceLabel: "Motor vehicles, trailers and semi-trailers", geo: "BE", enterprisesTotal: 499, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 26, enterprisesGe250: 15, personsEmployedTotal: 26118 },
  { nace: "C30", naceLabel: "Other transport equipment", geo: "BE", enterprisesTotal: 187, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 7, enterprisesGe250: 5, personsEmployedTotal: 6114 },
  { nace: "C33", naceLabel: "Repair and installation of machinery and equipment", geo: "BE", enterprisesTotal: 4679, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 64, enterprisesGe250: 12, personsEmployedTotal: 23097 },
  { nace: "C28", naceLabel: "Machinery and equipment n.e.c.", geo: "NL", enterprisesTotal: 3886, enterprises0_9: 2846, enterprises10_19: 339, enterprises20_49: 331, enterprises50_249: 324, enterprisesGe250: 46, personsEmployedTotal: 107705 },
  { nace: "C26", naceLabel: "Computer, electronic and optical products", geo: "NL", enterprisesTotal: 1889, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 74, enterprisesGe250: 15, personsEmployedTotal: 29803 },
  { nace: "C27", naceLabel: "Electrical equipment", geo: "NL", enterprisesTotal: 1427, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 58, enterprisesGe250: 18, personsEmployedTotal: 26263 },
  { nace: "C29", naceLabel: "Motor vehicles, trailers and semi-trailers", geo: "NL", enterprisesTotal: 930, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 44, enterprisesGe250: 14, personsEmployedTotal: 21675 },
  { nace: "C30", naceLabel: "Other transport equipment", geo: "NL", enterprisesTotal: 1564, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 39, enterprisesGe250: 15, personsEmployedTotal: 19765 },
  { nace: "C33", naceLabel: "Repair and installation of machinery and equipment", geo: "NL", enterprisesTotal: 14762, enterprises0_9: null, enterprises10_19: null, enterprises20_49: null, enterprises50_249: 114, enterprisesGe250: 17, personsEmployedTotal: 54565 },
];

// Exact ratio from exact counts, rounded only for display — never a projection.
export function share50PlusPct(e: NaceEntry): number {
  return Math.round(((e.enterprises50_249 + e.enterprisesGe250) / e.enterprisesTotal) * 1000) / 10;
}

export function naceEntry(geo: Geo, nace: string): NaceEntry {
  const e = NACE_DATA.find((r) => r.geo === geo && r.nace === nace);
  if (!e) throw new Error(`No Eurostat NACE entry for ${geo}/${nace}`);
  return e;
}

export const C28_CHART_DATA: { geo: Geo; geoLabel: string; entry: NaceEntry }[] = [
  { geo: "BE", geoLabel: "Belgium", entry: naceEntry("BE", "C28") },
  { geo: "NL", geoLabel: "Netherlands", entry: naceEntry("NL", "C28") },
];

export const SECONDARY_NACE_CODES = ["C26", "C27", "C29", "C30", "C33"] as const;

// CBS (Statistics Netherlands) cross-check, table 81589NED, SBI code 28 (internal
// identifier 336500 in that table), latest available period. Corroborates the
// Eurostat 50-plus-employee enterprise count for the Netherlands; does not replace
// it, and the totals differ because this is CBS's own quarterly business register
// (a point-in-time count, explicitly provisional for this quarter) rather than
// Eurostat's annual structural business statistics survey. See docs/WHITEPAPER-
// DATA.md section 4.
export const CBS_CROSS_CHECK = {
  datasetCode: "81589NED",
  datasetTitle: "Bedrijven; bedrijfstak",
  agency: "CBS (Statistics Netherlands)",
  sbiCode: "28",
  sbiInternalIdentifier: "336500",
  period: "2026KW04",
  periodDisplay: "Q4 2026 (provisional, per CBS)",
  extractionDate: "2026-10-21",
  extractionDateDisplay: "21 October 2026",
  totalEnterprises: 3565,
  enterprises50to100: 170,
  enterprises100Plus: 200,
  queryUrl:
    "https://datasets.cbs.nl/odata/v1/CBS/81589NED/Observations?$filter=BedrijfstakkenBranchesSBI2008 eq '336500' and Perioden eq '2026KW04' and (Measure eq 'M000201' or Measure eq 'WP19096' or Measure eq 'WP19098')",
} as const;

export const CBS_50_PLUS = CBS_CROSS_CHECK.enterprises50to100 + CBS_CROSS_CHECK.enterprises100Plus;

// Statbel's open-data API was reachable on the extraction date, but no directly
// comparable, size-class-broken-out NACE 28 figure could be resolved through it
// within this extraction. No Belgian cross-check number is used in the report;
// Belgium's figures rest on Eurostat alone. See docs/WHITEPAPER-DATA.md section 4.
export const STATBEL_CROSS_CHECK_NOTE =
  "Statbel's open-data portal and API were reachable on the extraction date, but no directly comparable published size-class breakdown for NACE 28 could be resolved. Belgium's figures in this report rest on Eurostat alone.";
