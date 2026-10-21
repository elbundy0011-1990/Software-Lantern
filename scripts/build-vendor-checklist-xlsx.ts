// Builds private/vendor-demo-comparison-checklist.xlsx (version 2) from
// lib/vendor-checklist-rows.ts, the same source the regional report's Appendix
// A, the /vendor-checklist page and the vendor demo guide read. The file is
// served only through app/api/ot-enquiries/checklist/route.ts, after a signed
// download token. Run by hand when the rows change:
//
//   npx tsx scripts/build-vendor-checklist-xlsx.ts
//
// For testing, `--sample <path> [buyer type index]` writes a copy with a buyer
// type and some evidence statuses filled in, so the formulas have something to
// count.

import { join } from "node:path";
import {
  BUYER_TYPES,
  CHECKLIST_GROUPS,
  CHECKLIST_SHEETS,
  CHECKLIST_ROW_COUNT,
  DEMO_SCENARIOS,
  EVIDENCE_STATUSES,
  EVIDENCE_STATUS_MEANINGS,
  PRIORITIES,
  VENDOR_CHECKLIST_ROWS,
  type ChecklistGroupId,
  type ChecklistSheetId,
} from "../lib/vendor-checklist-rows";
import { REPORT_TITLE } from "../lib/whitepaper-content";
import { STYLE, col, ref, writeXlsx, type Cell, type Row, type Sheet } from "./xlsx-writer";

const ROOT = join(__dirname, "..");
const OUT_FILE = join(ROOT, "private", "vendor-demo-comparison-checklist.xlsx");

// Rows added in version 2, named on the Read me sheet.
const NEW_IN_V2 = ["path-inventory", "session-approval", "break-glass", "leaver-offboarding", "file-transfer-control", "platform-outage"];

const N = CHECKLIST_ROW_COUNT;
const groupTitle = (g: ChecklistGroupId) => CHECKLIST_GROUPS.find((x) => x.id === g)!.title;
const rows = [...VENDOR_CHECKLIST_ROWS].sort(
  (a, b) => CHECKLIST_GROUPS.findIndex((g) => g.id === a.group) - CHECKLIST_GROUPS.findIndex((g) => g.id === b.group),
);

const SHEET = Object.fromEntries(CHECKLIST_SHEETS.map((sh) => [sh.id, sh.name])) as Record<ChecklistSheetId, string>;
const REQ = ref(SHEET.requirements);
const VC = ref(SHEET.vendors);

const t = (v: string, s: number = STYLE.default): Cell => ({ v, s });
const f = (formula: string, s: number = STYLE.default): Cell => ({ f: formula, s });
const blank: Row = { cells: [] };

// Requirements: data rows 2..N+1. Vendor comparison: data rows 3..N+2.
const REQ_FIRST = 2;
const VC_FIRST = 3;
const VC_LAST = VC_FIRST + N - 1;
const VC_RANGE = (c: string) => `${VC}!$${c}$${VC_FIRST}:$${c}$${VC_LAST}`;

// Per vendor: answer, status and notes columns, and a hidden helper column
// numbering that vendor's open Must rows (1, 2, 3...) in checklist order.
const VENDORS = [
  { answer: "D", status: "E", notes: "F", name: "D1", open: "M", label: "Vendor A" },
  { answer: "G", status: "H", notes: "I", name: "G1", open: "N", label: "Vendor B" },
  { answer: "J", status: "K", notes: "L", name: "J1", open: "O", label: "Vendor C" },
];
const ANY_OPEN = "P"; // hidden: numbers the Must rows open for at least one vendor

function readme(): Sheet {
  const heading = (v: string): Row => ({ cells: [t(v, STYLE.group), t("", STYLE.group)] });
  const para = (v: string): Row => ({ cells: [{ v, s: STYLE.wrap }] });
  const merges: string[] = [];
  const out: Row[] = [];
  const push = (row: Row, merge = false) => {
    out.push(row);
    if (merge) merges.push(`A${out.length}:B${out.length}`);
  };
  push({ cells: [t("Vendor demo comparison checklist", STYLE.title)] });
  push({ cells: [t("Version 2. Software Lantern.", STYLE.note)] });
  push(blank);
  push(heading("This is guidance, not a security audit"));
  push(
    para(
      "This workbook helps you ask every remote access vendor the same questions and record what you actually saw. It is guidance, not a security audit, a certification or legal advice, and completing it does not show that any product or setup is secure. It names no vendor and suggests no right answers.",
    ),
    true,
  );
  push(blank);
  push(heading("How to use it"));
  const steps = [
    `${SHEET.context}: choose your buyer type and describe your sites, machines and suppliers. The buyer type decides which priority column the other sheets use.`,
    `${SHEET.requirements}: ${N} rows grouped under ${CHECKLIST_GROUPS.map((g) => g.title).join(", ").replace(/, ([^,]*)$/, " and $1")}. Adjust the default priorities (Must, Should, Nice) to your situation, and write your own requirement where it helps.`,
    `${SHEET.vendors}: type each vendor's name over Vendor A, B and C. For each row record the answer, an evidence status and notes.`,
    `${SHEET.demo}: ask each vendor to run the ${DEMO_SCENARIOS.length} scenarios live, on a system you direct. What you see there is what moves a row to Verified in demo.`,
    `${SHEET.summary}: per vendor, the Must rows for your buyer type and the evidence behind them, and the Must rows still open. There is deliberately no overall score.`,
    `${SHEET.plan}: the Must rows still open for at least one vendor, with the evidence to collect. Before you add owners and dates, copy the items and paste them as values, so your notes stay next to the right item when statuses change.`,
  ];
  steps.forEach((s, i) => push(para(`${i + 1}. ${s}`), true));
  push(blank);
  push(heading("Evidence status"));
  for (const m of EVIDENCE_STATUS_MEANINGS) push({ cells: [t(m.status, STYLE.cellBold), t(m.meaning, STYLE.cell)] });
  push(para("A Must row is open for a vendor until it is Verified in demo or marked Not applicable."), true);
  push(blank);
  push(heading("Priorities"));
  push({ cells: [t("Must", STYLE.cellBold), t("Without it, do not go ahead with the vendor unless you accept the gap in writing.", STYLE.cell)] });
  push({ cells: [t("Should", STYLE.cellBold), t("Expected. A gap needs a reason and a plan.", STYLE.cell)] });
  push({ cells: [t("Nice", STYLE.cellBold), t("Helps, but does not decide anything.", STYLE.cell)] });
  push(para("The defaults for each buyer type are a starting point, not a rule. Change them."), true);
  push(blank);
  push(heading("Where the rows come from"));
  push(
    para(
      `The rows follow the five governance dimensions of Software Lantern's regional report ${REPORT_TITLE}, whose Appendix A lists the same rows, plus a ${groupTitle("fit")} group. Version 2 adds: ${NEW_IN_V2.map((id) => VENDOR_CHECKLIST_ROWS.find((r) => r.id === id)!.criterion.toLowerCase()).join("; ")}.`,
    ),
    true,
  );
  return { name: SHEET.readme, cols: [{ width: 22 }, { width: 100 }], rows: out, merges };
}

function context(sample?: Sample): Sheet {
  const q = (question: string, answer: Cell, note: string): Row => ({ cells: [t(question, STYLE.cellBold), answer, t(note, STYLE.note)] });
  return {
    name: SHEET.context,
    cols: [{ width: 34 }, { width: 34 }, { width: 70 }],
    rows: [
      { cells: [t("Context", STYLE.title)] },
      { cells: [t("Fill in the shaded cells. The buyer type decides which priority column the Vendor comparison, Summary and Action plan use.", STYLE.note)] },
      { cells: ["Question", "Your answer", "Note"].map((v) => t(v, STYLE.header)) },
      q("Buyer type", sample ? t(sample.buyerType, STYLE.input) : { s: STYLE.input }, BUYER_TYPES.map((b) => b.label).join(", ") + "."),
      q("Number of sites", { s: STYLE.input }, "Sites that remote access reaches, or will reach."),
      q("Number of machines", { s: STYLE.input }, "Machines with a remote access path, now or planned."),
      q("Number of external suppliers", { s: STYLE.input }, "Companies whose people connect remotely, dealers and subcontractors included."),
      q("Current access methods", { s: STYLE.input }, "For example VPN, remote support tool, jump host, OT gateway, modem. List every one in use."),
      q("Is remote support business-critical?", { s: STYLE.input }, "Yes if losing remote access would stop production or break a service commitment."),
    ],
    merges: ["A2:C2"],
    validations: [
      { sqref: "B4", type: "list", values: BUYER_TYPES.map((b) => b.label), prompt: "Choose your buyer type." },
      { sqref: "B5:B7", type: "whole", min: 0 },
      { sqref: "B9", type: "list", values: ["Yes", "Partly", "No"] },
    ],
  };
}

function requirements(): Sheet {
  const header = ["Dimension", "Criterion", "Why it matters", "What to ask", "Evidence to request", "What a weak answer looks like", ...BUYER_TYPES.map((b) => b.priorityHeader), "Your requirement"];
  return {
    name: SHEET.requirements,
    cols: [{ width: 16 }, { width: 34 }, { width: 40 }, { width: 40 }, { width: 40 }, { width: 36 }, { width: 12 }, { width: 12 }, { width: 12 }, { width: 34 }],
    rows: [
      { height: 32, cells: header.map((v) => t(v, STYLE.header)) },
      ...rows.map((r) => ({
        cells: [
          t(groupTitle(r.group), STYLE.cellBold),
          t(r.criterion, STYLE.cellBold),
          t(r.why, STYLE.cell),
          t(r.askTheVendor, STYLE.cell),
          t(r.evidence, STYLE.cell),
          t(r.weakAnswer, STYLE.cell),
          ...BUYER_TYPES.map((b) => t(r.priority[b.id], STYLE.input)),
          { s: STYLE.input },
        ],
      })),
    ],
    validations: [{ sqref: `G${REQ_FIRST}:I${REQ_FIRST + N - 1}`, type: "list", values: PRIORITIES }],
    freeze: { rows: 1, cols: 2 },
    autoFilter: `A1:J${REQ_FIRST + N - 1}`,
    landscape: true,
  };
}

function vendorComparison(sample?: Sample): Sheet {
  const priorityFormula = (reqRow: number) =>
    BUYER_TYPES.reduceRight(
      (inner, b, i) => `IF(BuyerType="${b.label}",${REQ}!${col(6 + i)}${reqRow},${inner})`,
      `""`,
    );
  const dataRows: Row[] = rows.map((_, i) => {
    const r = VC_FIRST + i;
    const reqRow = REQ_FIRST + i;
    const cells: (Cell | null)[] = [
      f(`${REQ}!A${reqRow}`, STYLE.cellBold),
      f(`${REQ}!B${reqRow}`, STYLE.cell),
      f(priorityFormula(reqRow), STYLE.count),
    ];
    VENDORS.forEach((v, k) => {
      const status = sample?.statuses[k]?.[i];
      cells.push({ s: STYLE.input }, status ? t(status, STYLE.input) : { s: STYLE.input }, { s: STYLE.input });
    });
    for (const v of VENDORS) {
      cells.push(f(`IF(AND($C${r}="Must",${v.status}${r}<>"Verified in demo",${v.status}${r}<>"Not applicable"),MAX(${v.open}$2:${v.open}${r - 1})+1,"")`));
    }
    cells.push(f(`IF(OR(${VENDORS.map((v) => `${v.open}${r}<>""`).join(",")}),MAX(${ANY_OPEN}$2:${ANY_OPEN}${r - 1})+1,"")`));
    return { cells };
  });
  return {
    name: SHEET.vendors,
    cols: [
      { width: 16 },
      { width: 36 },
      { width: 12 },
      ...VENDORS.flatMap(() => [{ width: 30 }, { width: 18 }, { width: 26 }]),
      ...[...VENDORS, null].map(() => ({ width: 10, hidden: true })),
    ],
    rows: [
      {
        height: 22,
        cells: [
          t("Type each vendor's name over Vendor A, B and C.", STYLE.note),
          null,
          null,
          ...VENDORS.flatMap((v) => [t(v.label, STYLE.header), t("", STYLE.header), t("", STYLE.header)]),
        ],
      },
      {
        height: 32,
        cells: [
          ...["Dimension", "Criterion", "Priority (your buyer type)"].map((v) => t(v, STYLE.header)),
          ...VENDORS.flatMap(() => ["Answer", "Evidence status", "Notes"].map((v) => t(v, STYLE.header))),
          ...VENDORS.map((v) => t(`Open rank ${v.label}`)),
          t("Open rank any vendor"),
        ],
      },
      ...dataRows,
    ],
    merges: ["A1:C1", ...VENDORS.map((v) => `${v.answer}1:${v.notes}1`)],
    validations: VENDORS.map((v) => ({
      sqref: `${v.status}${VC_FIRST}:${v.status}${VC_LAST}`,
      type: "list" as const,
      values: [...EVIDENCE_STATUSES],
    })),
    freeze: { rows: 2, cols: 3 },
    landscape: true,
  };
}

function demoScript(): Sheet {
  const header = ["#", "Scenario", "Ask the vendor to", "Evidence to expect", "Follow-up questions", "Dimensions"];
  return {
    name: SHEET.demo,
    cols: [{ width: 5 }, { width: 28 }, { width: 42 }, { width: 42 }, { width: 42 }, { width: 18 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 30 }],
    rows: [
      { cells: [t("Demo script", STYLE.title)] },
      {
        cells: [
          t(
            "Ask each vendor to do these live, on a system you direct, not as slides. Record what you saw for each vendor, then set the matching rows on the Vendor comparison sheet.",
            STYLE.note,
          ),
        ],
      },
      blank,
      {
        height: 32,
        cells: [
          ...header.map((v) => t(v, STYLE.header)),
          ...VENDORS.map((v) => f(`${VC}!$${v.answer}$1`, STYLE.header)),
          t("Notes", STYLE.header),
        ],
      },
      ...DEMO_SCENARIOS.map((d, i) => ({
        cells: [
          { v: i + 1, s: STYLE.count },
          t(d.title, STYLE.cellBold),
          t(d.ask, STYLE.cell),
          t(d.expect, STYLE.cell),
          t(d.followUps, STYLE.cell),
          t(d.groups.map(groupTitle).join(", "), STYLE.cell),
          ...VENDORS.map(() => ({ s: STYLE.input })),
          { s: STYLE.input },
        ],
      })),
    ],
    merges: ["A2:J2"],
    validations: [{ sqref: `G5:I${4 + DEMO_SCENARIOS.length}`, type: "list", values: [...EVIDENCE_STATUSES] }],
    freeze: { rows: 4 },
    landscape: true,
  };
}

function summary(): Sheet {
  const countRow = (label: string, formula: (v: (typeof VENDORS)[number], k: number) => string): Row => ({
    cells: [t(label, STYLE.cellBold), ...VENDORS.map((v, k) => f(formula(v, k), STYLE.count))],
  });
  const must = `${VC_RANGE("C")},"Must"`;
  const statusCount = (status: string) => (v: (typeof VENDORS)[number]) => `COUNTIFS(${must},${VC_RANGE(v.status)},"${status}")`;
  const vendorCol = (k: number) => col(1 + k); // B, C, D on this sheet
  const LIST_FIRST = 17;
  return {
    name: SHEET.summary,
    cols: [{ width: 44 }, { width: 34 }, { width: 34 }, { width: 34 }],
    rows: [
      { cells: [t("Summary", STYLE.title)] },
      { cells: [t("Formulas only. No overall score: compare the evidence behind each Must row, not a number.", STYLE.note)] },
      blank,
      { cells: [t("Buyer type", STYLE.cellBold), f(`IF(BuyerType="","Choose a buyer type on the Context sheet",BuyerType)`, STYLE.cell)] },
      blank,
      { height: 22, cells: [t("Must rows for this buyer type", STYLE.header), ...VENDORS.map((v) => f(`${VC}!$${v.answer}$1`, STYLE.header))] },
      countRow("Must rows", () => `COUNTIF(${must})`),
      countRow("Verified in demo", statusCount("Verified in demo")),
      countRow("Documented only", statusCount("Documented only")),
      countRow("Claimed", statusCount("Claimed")),
      countRow("Not applicable", statusCount("Not applicable")),
      countRow("Not answered (including blank)", (_, k) => `${vendorCol(k)}7-${vendorCol(k)}8-${vendorCol(k)}9-${vendorCol(k)}10-${vendorCol(k)}11`),
      countRow("Open (not verified in demo, not N/A)", (_, k) => `${vendorCol(k)}7-${vendorCol(k)}8-${vendorCol(k)}11`),
      blank,
      { cells: [t("Open Must rows, in checklist order", STYLE.group), t("", STYLE.group), t("", STYLE.group), t("", STYLE.group)] },
      { height: 22, cells: [t("#", STYLE.header), ...VENDORS.map((v) => f(`${VC}!$${v.answer}$1`, STYLE.header))] },
      ...Array.from({ length: N }, (_, i) => ({
        cells: [
          { v: i + 1, s: STYLE.count },
          ...VENDORS.map((v) => f(`IFERROR(INDEX(${VC_RANGE("B")},MATCH($A${LIST_FIRST + i},${VC_RANGE(v.open)},0)),"")`, STYLE.cell)),
        ],
      })),
    ],
    freeze: { rows: 6, cols: 1 },
  };
}

function actionPlan(): Sheet {
  const FIRST = 5;
  const AUTO = 15; // items filled from the open Must rows
  const OWN = 10; // blank rows for items of your own
  const header = ["#", "Unresolved item", "Open for", "Evidence to collect", "Stakeholders", "Next step", "Owner", "Date", "Status", "Row"];
  const auto: Row[] = Array.from({ length: AUTO }, (_, i) => {
    const r = FIRST + i;
    const pick = (c: string) => `INDEX(${VC_RANGE(c)},$J${r})`;
    return {
      cells: [
        { v: i + 1, s: STYLE.count },
        f(`IF($J${r}="","",${pick("B")})`, STYLE.cellBold),
        f(`IF($J${r}="","",MID(${VENDORS.map((v) => `IF(${pick(v.open)}<>"",", "&${VC}!$${v.answer}$1,"")`).join("&")},3,200))`, STYLE.cell),
        f(`IF($J${r}="","",INDEX(${REQ}!$E$${REQ_FIRST}:$E$${REQ_FIRST + N - 1},$J${r}))`, STYLE.cell),
        { s: STYLE.input },
        { s: STYLE.input },
        { s: STYLE.input },
        { s: STYLE.inputDate },
        { s: STYLE.input },
        f(`IFERROR(MATCH($A${r},${VC_RANGE(ANY_OPEN)},0),"")`),
      ],
    };
  });
  const own: Row[] = Array.from({ length: OWN }, () => ({
    cells: [{ s: STYLE.input }, { s: STYLE.input }, { s: STYLE.input }, { s: STYLE.input }, { s: STYLE.input }, { s: STYLE.input }, { s: STYLE.input }, { s: STYLE.inputDate }, { s: STYLE.input }],
  }));
  const last = FIRST + AUTO + OWN - 1;
  return {
    name: SHEET.plan,
    cols: [{ width: 5 }, { width: 36 }, { width: 22 }, { width: 40 }, { width: 22 }, { width: 36 }, { width: 18 }, { width: 13 }, { width: 13 }, { width: 6, hidden: true }],
    rows: [
      { cells: [t("Action plan", STYLE.title)] },
      {
        cells: [
          t(
            `The first ${AUTO} rows fill themselves with the Must rows still open for at least one vendor, in checklist order, with the evidence to collect. Before adding owners and dates, copy those rows and paste them as values, so your notes stay with the right item when statuses change. The last ${OWN} rows are for items of your own.`,
            STYLE.note,
          ),
        ],
      },
      blank,
      { height: 32, cells: header.slice(0, 9).map((v) => t(v, STYLE.header)) },
      ...auto,
      ...own,
    ],
    merges: ["A2:I2"],
    validations: [
      { sqref: `E${FIRST}:E${last}`, type: "list", values: ["OT", "IT", "Operations", "Management", "OT and IT", "OT and operations", "All four"] },
      { sqref: `H${FIRST}:H${last}`, type: "date" },
      { sqref: `I${FIRST}:I${last}`, type: "list", values: ["Open", "In progress", "Done"] },
    ],
    freeze: { rows: 4 },
    landscape: true,
  };
}

interface Sample {
  buyerType: string;
  statuses: string[][]; // per vendor, per checklist row (in sheet order)
}

function build(path: string, sample?: Sample) {
  writeXlsx(path, {
    title: "Vendor demo comparison checklist, version 2",
    sheets: [readme(), context(sample), requirements(), vendorComparison(sample), demoScript(), summary(), actionPlan()],
    names: [{ name: "BuyerType", ref: `${ref(SHEET.context)}!$B$4` }],
  });
  console.log(`Wrote ${path}`);
}

const sampleAt = process.argv.indexOf("--sample");
if (sampleAt !== -1) {
  // Vendor A: everything verified; vendor B: a spread of statuses; vendor C: blank.
  const spread = [...EVIDENCE_STATUSES];
  build(process.argv[sampleAt + 1], {
    buyerType: BUYER_TYPES[Number(process.argv[sampleAt + 2] ?? 1)].label,
    statuses: [rows.map(() => "Verified in demo"), rows.map((_, i) => spread[i % spread.length]), []],
  });
} else {
  build(OUT_FILE);
}
