#!/usr/bin/env node
// Builds public/downloads/remote-access-register.xlsx: the spreadsheet version
// of the regional report's Appendix B, "Remote access register template". Run
// by hand when the columns change:
//
//   node scripts/build-register-xlsx.mjs
//
// The columns and dropdown lists below must match REGISTER_COLUMNS in
// lib/whitepaper-content.ts (this script runs under plain Node, so it can't
// import that .ts file). Update both together.
//
// No dependencies: the workbook is written as raw SpreadsheetML and zipped
// with node:zlib, so the file can be rebuilt on any machine with Node 20.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateRawSync, crc32 } from "node:zlib";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_FILE = join(ROOT, "public", "downloads", "remote-access-register.xlsx");
const DATA_ROWS = 500; // rows that carry the dropdowns and date checks

// [header, what to record, dropdown values or "date" or null, column width]
const COLUMNS = [
  ["Path ID", "Your own reference, unique per row.", null, 10],
  ["Supplier", "The company whose people connect. Write in a dealer or subcontractor as its own row.", null, 22],
  ["Site", "The plant or location reached.", null, 18],
  ["Method", "How the connection is made.", ["VPN", "Remote support tool", "Jump host", "Cloud broker", "OT gateway", "Modem", "Other"], 20],
  ["Account type", "Whether each person has their own login.", ["Named", "Shared"], 14],
  ["Second factor", "Whether a second factor is enforced on this path.", ["Y", "N"], 13],
  ["Scope", "What a session can reach.", ["Single machine", "Cell or line", "Network segment", "Whole site", "Unknown"], 18],
  ["Plant-side owner", "The named person at the plant responsible for this path.", null, 20],
  ["Supplier-side owner", "The named person at the supplier responsible for this path.", null, 20],
  ["Expiry or end date", "When access ends unless renewed. A date, never blank.", "date", 16],
  ["Last reviewed", "When someone last confirmed the row is still true.", "date", 14],
  ["Evidence location", "Where the proof is: configuration export, account list, log store.", null, 30],
];

const RULES = [
  "One row per remote access path: one supplier reaching one site by one method.",
  "A row without two named owners, or without an end date, is the first thing to fix.",
  "A shared account or a missing second factor needs a dated exception with a reason.",
  "Review every row at least as often as you review supplier access in general, and record the date.",
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const colLetter = (i) => String.fromCharCode(65 + i); // 12 columns, A to L
const inline = (ref, text, style = 0) =>
  `<c r="${ref}" t="inlineStr"${style ? ` s="${style}"` : ""}><is><t xml:space="preserve">${esc(text)}</t></is></c>`;

// Styles: 0 default, 1 header (bold, fill, border, wrap), 2 date, 3 bold, 4 wrapped text.
const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts>
<fonts count="3">
<font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF9A3412"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FF7C2D12"/></left><right style="thin"><color rgb="FF7C2D12"/></right><top style="thin"><color rgb="FF7C2D12"/></top><bottom style="thin"><color rgb="FF7C2D12"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

function registerSheet() {
  const last = colLetter(COLUMNS.length - 1);
  const cols = COLUMNS.map(
    ([, , kind, width], i) => `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1"${kind === "date" ? ' style="2"' : ""}/>`,
  ).join("");
  const header = `<row r="1" ht="32" customHeight="1">${COLUMNS.map(([h], i) => inline(`${colLetter(i)}1`, h, 1)).join("")}</row>`;
  const validations = COLUMNS.flatMap(([name, , kind], i) => {
    const range = `${colLetter(i)}2:${colLetter(i)}${DATA_ROWS + 1}`;
    if (Array.isArray(kind)) {
      return [
        `<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" errorTitle="${esc(name)}" error="${esc(`Choose one of: ${kind.join(", ")}.`)}" sqref="${range}"><formula1>"${esc(kind.join(","))}"</formula1></dataValidation>`,
      ];
    }
    if (kind === "date") {
      return [
        `<dataValidation type="date" operator="greaterThan" allowBlank="1" showErrorMessage="1" errorTitle="${esc(name)}" error="Enter a date, for example 2027-03-31." sqref="${range}"><formula1>36526</formula1></dataValidation>`,
      ];
    }
    return [];
  });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<dimension ref="A1:${last}1"/>
<sheetViews><sheetView workbookViewId="0" tabSelected="1"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>${cols}</cols>
<sheetData>${header}</sheetData>
<autoFilter ref="A1:${last}${DATA_ROWS + 1}"/>
<dataValidations count="${validations.length}">${validations.join("")}</dataValidations>
<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
<pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;
}

function guideSheet() {
  const rows = [];
  let r = 1;
  rows.push(`<row r="${r}">${inline(`A${r}`, "Remote access register", 3)}</row>`);
  r += 2;
  for (const rule of RULES) {
    rows.push(`<row r="${r}">${inline(`A${r}`, rule, 4)}</row>`);
    r++;
  }
  r++;
  rows.push(`<row r="${r}">${inline(`A${r}`, "Column", 1)}${inline(`B${r}`, "What to record", 1)}${inline(`C${r}`, "Allowed values", 1)}</row>`);
  r++;
  for (const [name, record, kind] of COLUMNS) {
    const allowed = Array.isArray(kind) ? kind.join(", ") : kind === "date" ? "A date" : "Free text";
    rows.push(`<row r="${r}">${inline(`A${r}`, name, 3)}${inline(`B${r}`, record, 4)}${inline(`C${r}`, allowed, 4)}</row>`);
    r++;
  }
  r++;
  rows.push(
    `<row r="${r}">${inline(`A${r}`, "From the regional report Remote Access Is a Governance Problem, Appendix B. Software Lantern. A general template, not legal or security advice.", 4)}</row>`,
  );
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"/></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols><col min="1" max="1" width="24" customWidth="1"/><col min="2" max="2" width="70" customWidth="1"/><col min="3" max="3" width="48" customWidth="1"/></cols>
<sheetData>${rows.join("")}</sheetData>
<pageMargins left="0.5" right="0.5" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
</worksheet>`;
}

const files = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
  "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>Remote access register</dc:title><dc:creator>Software Lantern</dc:creator>
</cp:coreProperties>`,
  "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Software Lantern</Application></Properties>`,
  "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<bookViews><workbookView activeTab="0"/></bookViews>
<sheets><sheet name="Register" sheetId="1" r:id="rId1"/><sheet name="How to use" sheetId="2" r:id="rId2"/></sheets>
<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">Register!$A$1:$${colLetter(COLUMNS.length - 1)}$${DATA_ROWS + 1}</definedName></definedNames>
</workbook>`,
  "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
  "xl/styles.xml": stylesXml,
  "xl/worksheets/sheet1.xml": registerSheet(),
  "xl/worksheets/sheet2.xml": guideSheet(),
};

// Minimal zip writer: deflate each entry, then a central directory. A fixed
// timestamp keeps the output byte-identical between runs.
function zip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  const DOS_TIME = 0;
  const DOS_DATE = (2026 - 1980) << 9 | 1 << 5 | 1;
  for (const [name, content] of Object.entries(entries)) {
    const nameBuf = Buffer.from(name, "utf8");
    const raw = Buffer.from(content, "utf8");
    const data = deflateRawSync(raw);
    const crc = crc32(raw);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(0x0800, 6); // UTF-8 names
    head.writeUInt16LE(8, 8); // deflate
    head.writeUInt16LE(DOS_TIME, 10);
    head.writeUInt16LE(DOS_DATE, 12);
    head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(data.length, 18);
    head.writeUInt32LE(raw.length, 22);
    head.writeUInt16LE(nameBuf.length, 26);
    head.writeUInt16LE(0, 28);
    local.push(head, nameBuf, data);
    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(8, 10);
    dir.writeUInt16LE(DOS_TIME, 12);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(data.length, 20);
    dir.writeUInt32LE(raw.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += head.length + nameBuf.length + data.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(Object.keys(entries).length, 8);
  end.writeUInt16LE(Object.keys(entries).length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralBuf, end]);
}

mkdirSync(join(ROOT, "public", "downloads"), { recursive: true });
writeFileSync(OUT_FILE, zip(files));
console.log(`Wrote ${OUT_FILE}`);
