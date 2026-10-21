// Builds public/downloads/remote-access-register.xlsx: the spreadsheet version
// of the regional report's Appendix B, "Remote access register template". The
// columns, dropdown values and rules come from lib/whitepaper-content.ts, the
// same data the report renders, so the two cannot drift. Run by hand when they
// change:
//
//   npx tsx scripts/build-register-xlsx.ts

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { REGISTER_COLUMNS, REGISTER_INTRO, REGISTER_RULES, REPORT_TITLE, partLabel } from "../lib/whitepaper-content";
import { STYLE, col, writeXlsx, type Sheet, type Validation } from "./xlsx-writer";

const ROOT = join(__dirname, "..");
const OUT_FILE = join(ROOT, "public", "downloads", "remote-access-register.xlsx");
const DATA_ROWS = 500; // rows that carry the dropdowns and date checks

const WIDTHS: Record<string, number> = { "Path ID": 10, Supplier: 22, Site: 18, Method: 20, Scope: 18, "Evidence location": 30 };
const last = col(REGISTER_COLUMNS.length - 1);

const register: Sheet = {
  name: "Register",
  cols: REGISTER_COLUMNS.map((c) => ({ width: WIDTHS[c.name] ?? 16, style: c.date ? STYLE.date : undefined })),
  rows: [{ height: 32, cells: REGISTER_COLUMNS.map((c) => ({ v: c.name, s: STYLE.header })) }],
  validations: REGISTER_COLUMNS.flatMap((c, i): Validation[] => {
    const sqref = `${col(i)}2:${col(i)}${DATA_ROWS + 1}`;
    if (c.values) return [{ sqref, type: "list", values: c.values }];
    if (c.date) return [{ sqref, type: "date" }];
    return [];
  }),
  freeze: { rows: 1 },
  autoFilter: `A1:${last}${DATA_ROWS + 1}`,
  landscape: true,
};

const guide: Sheet = {
  name: "How to use",
  cols: [{ width: 24 }, { width: 70 }, { width: 48 }],
  rows: [
    { cells: [{ v: "Remote access register", s: STYLE.title }] },
    { cells: [] },
    ...[REGISTER_INTRO, ...REGISTER_RULES].map((t) => ({ cells: [{ v: t, s: STYLE.wrap }] })),
    { cells: [] },
    { cells: ["Column", "What to record", "Allowed values"].map((v) => ({ v, s: STYLE.header })) },
    ...REGISTER_COLUMNS.map((c) => ({
      cells: [
        { v: c.name, s: STYLE.bold },
        { v: c.record, s: STYLE.wrap },
        { v: c.values ? c.values.join(", ") : c.date ? "A date" : "Free text", s: STYLE.wrap },
      ],
    })),
    { cells: [] },
    { cells: [{ v: `From the regional report ${REPORT_TITLE}, ${partLabel("register")}. Software Lantern. A general template, not legal or security advice.`, s: STYLE.wrap }] },
  ],
};

mkdirSync(join(ROOT, "public", "downloads"), { recursive: true });
writeXlsx(OUT_FILE, { title: "Remote access register", sheets: [register, guide] });
console.log(`Wrote ${OUT_FILE}`);
