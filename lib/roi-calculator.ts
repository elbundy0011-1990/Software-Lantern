// Pure calculation functions for the ROI calculator (/roi-calculator).
// No React, no server-only APIs: imported by the client component for
// live recompute as someone types, and by the API route / email
// template for the "email me this calculation" feature, so the number
// a visitor sees on screen and the number that lands in their inbox are
// always produced by the exact same formula, never recomputed twice in
// two places that could drift apart.
//
// Every euro figure here comes only from numbers the visitor typed in.
// Nothing is a default, a benchmark, or an assumption about any other
// company — see docs/CLAIMS.md's spirit applied to arithmetic rather
// than regulatory claims: if an optional input is missing, the line it
// would produce is left out (null), never filled with an invented
// placeholder number.

export type RoiMode = "machine_builder" | "plant_operator";

export interface MachineBuilderInputs {
  visitsPerYear: number;
  travelHoursPerVisit: number;
  engineerCostPerHour: number;
  travelCostPerVisit: number;
  remoteShareEstimate: number; // 0–1, the visitor's own estimate
  urgentIncidentsPerYear: number;
  hoursToRespondToday: number;
  hoursToRespondRemotely: number;
  customerDowntimeCostPerHour: number | null; // optional
  annualSolutionCost: number | null; // optional
}

export interface PlantOperatorInputs {
  numVendors: number; // shown for context only, not part of the formula below
  adminHoursPerMonth: number;
  adminCostPerHour: number;
  emergencyIncidentsPerYear: number;
  hoursDelayToday: number;
  downtimeCostPerHour: number | null; // optional
  adminTimeReductionEstimate: number; // 0–1, the visitor's own estimate
  annualSolutionCost: number | null; // optional
}

export interface RoiLine {
  label: string;
  formula: string;
  amount: number | null; // null when an optional input needed for it is missing
}

export interface RoiResult {
  // Lines that make up the total below.
  lines: RoiLine[];
  // Shown separately, never added into the total: either because the
  // visitor didn't give a number needed to size it, or because sizing it
  // would require assuming a reduction they weren't asked to estimate.
  contextLines: RoiLine[];
  totalAnnualSavings: number;
  netAnnualSavings: number | null; // null if no solution cost was entered
  paybackMonths: number | null; // null if no solution cost, or total is zero
}

function sum(amounts: (number | null)[]): number {
  return amounts.reduce((acc: number, v) => acc + (v ?? 0), 0);
}

function round(n: number): number {
  return Math.round(n);
}

export function calculateMachineBuilderRoi(i: MachineBuilderInputs, estimateMultiplier = 1): RoiResult {
  const share = Math.max(0, Math.min(1, i.remoteShareEstimate * estimateMultiplier));
  const travelSavingsPerVisit = i.travelHoursPerVisit * i.engineerCostPerHour + i.travelCostPerVisit;
  const travelSavings = round(i.visitsPerYear * share * travelSavingsPerVisit);

  const hoursSaved = Math.max(0, i.hoursToRespondToday - i.hoursToRespondRemotely);
  const incidentDowntimeSavings =
    i.customerDowntimeCostPerHour != null
      ? round(i.urgentIncidentsPerYear * hoursSaved * i.customerDowntimeCostPerHour)
      : null;

  const lines: RoiLine[] = [
    {
      label: "Avoided travel for visits handled remotely instead",
      formula: "service visits per year × your remote-share estimate × (travel hours per visit × engineer cost per hour + travel cost per visit)",
      amount: travelSavings,
    },
    {
      label: "Downtime avoided from a faster response to urgent incidents",
      formula: "urgent incidents per year × (hours to respond today − hours to respond remotely) × customer downtime cost per hour",
      amount: incidentDowntimeSavings,
    },
  ];

  const total = sum(lines.map((l) => l.amount));
  const net = i.annualSolutionCost != null ? round(total - i.annualSolutionCost) : null;
  const payback =
    i.annualSolutionCost != null && total > 0 ? Math.round((i.annualSolutionCost / (total / 12)) * 10) / 10 : null;

  return { lines, contextLines: [], totalAnnualSavings: total, netAnnualSavings: net, paybackMonths: payback };
}

export function calculatePlantOperatorRoi(i: PlantOperatorInputs, estimateMultiplier = 1): RoiResult {
  const reduction = Math.max(0, Math.min(1, i.adminTimeReductionEstimate * estimateMultiplier));
  const adminSavings = round(i.adminHoursPerMonth * 12 * i.adminCostPerHour * reduction);

  const lines: RoiLine[] = [
    {
      label: "Admin time no longer spent managing vendor access",
      formula: "admin hours per month × 12 × admin cost per hour × your expected reduction in admin time",
      amount: adminSavings,
    },
  ];

  // Today's emergency-access delay exposure: shown as context, not as a
  // saving, because sizing a saving here would mean assuming how much of
  // that delay a solution removes, a number this calculator never asked
  // for and won't invent.
  const delayExposure =
    i.downtimeCostPerHour != null
      ? round(i.emergencyIncidentsPerYear * i.hoursDelayToday * i.downtimeCostPerHour)
      : null;
  const contextLines: RoiLine[] = [
    {
      label: "Today's cost of emergency vendor-access delays (not a saving)",
      formula: "emergency vendor-access incidents per year × hours of delay today × downtime cost per hour",
      amount: delayExposure,
    },
  ];

  const total = sum(lines.map((l) => l.amount));
  const net = i.annualSolutionCost != null ? round(total - i.annualSolutionCost) : null;
  const payback =
    i.annualSolutionCost != null && total > 0 ? Math.round((i.annualSolutionCost / (total / 12)) * 10) / 10 : null;

  return { lines, contextLines, totalAnnualSavings: total, netAnnualSavings: net, paybackMonths: payback };
}

export function formatEur(amount: number | null): string {
  if (amount === null) return "not calculated — add this field to see it";
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

// Raw field values as typed into the form (strings, possibly empty) —
// shared shape between the client component's state and whatever the
// "email me this calculation" request posts to the server, so the
// server can recompute the same result from the same raw input rather
// than trusting a client-submitted total.
export type RoiFieldState = Record<string, string>;

function parseNum(v: string | undefined): number {
  const n = parseFloat((v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function parseNumOrNull(v: string | undefined): number | null {
  if (!v || v.trim() === "") return null;
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
function parsePct(v: string | undefined): number {
  const n = parseNum(v);
  return Math.max(0, Math.min(100, n)) / 100;
}

export function parseMachineBuilderFields(f: RoiFieldState): MachineBuilderInputs {
  return {
    visitsPerYear: parseNum(f.visitsPerYear),
    travelHoursPerVisit: parseNum(f.travelHoursPerVisit),
    engineerCostPerHour: parseNum(f.engineerCostPerHour),
    travelCostPerVisit: parseNum(f.travelCostPerVisit),
    remoteShareEstimate: parsePct(f.remoteShareEstimate),
    urgentIncidentsPerYear: parseNum(f.urgentIncidentsPerYear),
    hoursToRespondToday: parseNum(f.hoursToRespondToday),
    hoursToRespondRemotely: parseNum(f.hoursToRespondRemotely),
    customerDowntimeCostPerHour: parseNumOrNull(f.customerDowntimeCostPerHour),
    annualSolutionCost: parseNumOrNull(f.annualSolutionCost),
  };
}

export function parsePlantOperatorFields(f: RoiFieldState): PlantOperatorInputs {
  return {
    numVendors: parseNum(f.numVendors),
    adminHoursPerMonth: parseNum(f.adminHoursPerMonth),
    adminCostPerHour: parseNum(f.adminCostPerHour),
    emergencyIncidentsPerYear: parseNum(f.emergencyIncidentsPerYear),
    hoursDelayToday: parseNum(f.hoursDelayToday),
    downtimeCostPerHour: parseNumOrNull(f.downtimeCostPerHour),
    adminTimeReductionEstimate: parsePct(f.adminTimeReductionEstimate),
    annualSolutionCost: parseNumOrNull(f.annualSolutionCost),
  };
}
