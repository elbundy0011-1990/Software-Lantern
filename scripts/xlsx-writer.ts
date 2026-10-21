// Minimal, dependency-free .xlsx writer for the site's downloadable
// spreadsheets (scripts/build-register-xlsx.ts, scripts/build-vendor-checklist-
// xlsx.ts). Writes raw SpreadsheetML and zips it with node:zlib, so the files
// can be rebuilt on any machine with Node 20, without adding a spreadsheet
// library to the app's dependencies.
//
// Supports what those files need and nothing more: text, numbers, formulas
// (no cached values; the workbook asks for a full recalculation on load),
// a fixed style table, column widths, merged cells, frozen panes, an auto
// filter, data validations (list, date, whole number) and defined names.

import { writeFileSync } from "node:fs";
import { deflateRawSync, crc32 } from "node:zlib";

// Indexes into CELL_XFS below.
export const STYLE = {
  default: 0,
  header: 1, // bold white on accent, bordered, wrapped
  date: 2,
  bold: 3,
  wrap: 4, // wrapped, top aligned
  title: 5, // large bold
  input: 6, // light fill and border: a cell the user fills in
  inputDate: 7,
  note: 8, // italic grey, wrapped
  group: 9, // bold accent on light grey
  cell: 10, // wrapped, top aligned, bordered
  cellBold: 11,
  count: 12, // bordered, centred
} as const;

const CELL_XFS = [
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>`,
  `<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>`,
  `<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>`,
  `<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>`,
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`,
  `<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>`,
  `<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`,
  `<xf numFmtId="164" fontId="0" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"/></xf>`,
  `<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`,
  `<xf numFmtId="0" fontId="5" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1"/>`,
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="2" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`,
  `<xf numFmtId="0" fontId="2" fillId="0" borderId="2" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>`,
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="2" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="top"/></xf>`,
];

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts>
<fonts count="6">
<font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="16"/><name val="Calibri"/><family val="2"/></font>
<font><i/><sz val="10"/><color rgb="FF6B7280"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF7C2D12"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="5">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF9A3412"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF7ED"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF3F1EC"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="3">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FF7C2D12"/></left><right style="thin"><color rgb="FF7C2D12"/></right><top style="thin"><color rgb="FF7C2D12"/></top><bottom style="thin"><color rgb="FF7C2D12"/></bottom><diagonal/></border>
<border><left style="thin"><color rgb="FFD6D3CC"/></left><right style="thin"><color rgb="FFD6D3CC"/></right><top style="thin"><color rgb="FFD6D3CC"/></top><bottom style="thin"><color rgb="FFD6D3CC"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${CELL_XFS.length}">
${CELL_XFS.join("\n")}
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

export type Cell =
  | { v: string | number; s?: number }
  | { f: string; s?: number } // formula, without the leading "="
  | { s: number }; // styled empty cell

export interface Row {
  height?: number;
  cells: (Cell | null)[]; // index = column (0 = A); null skips a column
}

export type Validation =
  | { sqref: string; type: "list"; values: string[]; prompt?: string }
  | { sqref: string; type: "date"; prompt?: string }
  | { sqref: string; type: "whole"; min: number; prompt?: string };

export interface Sheet {
  name: string;
  cols: { width: number; style?: number; hidden?: boolean }[];
  rows: Row[]; // row 1 first; an empty { cells: [] } leaves a blank row
  merges?: string[];
  validations?: Validation[];
  freeze?: { rows: number; cols?: number };
  autoFilter?: string;
  landscape?: boolean;
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 0 -> A, 25 -> Z, 26 -> AA.
export function col(i: number): string {
  let s = "";
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

// Sheet name as it must appear inside a formula.
export const ref = (sheet: string) => (/^[A-Za-z0-9_]+$/.test(sheet) ? sheet : `'${sheet.replace(/'/g, "''")}'`);

function cellXml(r: number, c: number, cell: Cell): string {
  const at = `${col(c)}${r}`;
  const s = cell.s ? ` s="${cell.s}"` : "";
  if ("f" in cell) return `<c r="${at}"${s}><f>${esc(cell.f)}</f></c>`;
  if ("v" in cell) {
    if (typeof cell.v === "number") return `<c r="${at}"${s}><v>${cell.v}</v></c>`;
    return `<c r="${at}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(cell.v)}</t></is></c>`;
  }
  return `<c r="${at}"${s}/>`;
}

function validationXml(v: Validation): string {
  const prompt = v.prompt ? ` showInputMessage="1" prompt="${esc(v.prompt)}"` : "";
  if (v.type === "list") {
    if (v.values.some((x) => x.includes(","))) throw new Error(`A dropdown value cannot contain a comma: ${v.values.join(" | ")}`);
    const list = v.values.join(",");
    if (list.length > 250) throw new Error(`Dropdown list too long for an inline validation: ${list}`);
    return `<dataValidation type="list" allowBlank="1" showErrorMessage="1"${prompt} errorTitle="Choose from the list" error="${esc(`Choose one of: ${v.values.join(", ")}.`)}" sqref="${v.sqref}"><formula1>"${esc(list)}"</formula1></dataValidation>`;
  }
  if (v.type === "date") {
    return `<dataValidation type="date" operator="greaterThan" allowBlank="1" showErrorMessage="1"${prompt} errorTitle="Date" error="Enter a date, for example 2027-03-31." sqref="${v.sqref}"><formula1>36526</formula1></dataValidation>`;
  }
  return `<dataValidation type="whole" operator="greaterThanOrEqual" allowBlank="1" showErrorMessage="1"${prompt} errorTitle="Whole number" error="Enter a whole number of ${v.min} or more." sqref="${v.sqref}"><formula1>${v.min}</formula1></dataValidation>`;
}

function sheetXml(sheet: Sheet, selected: boolean): string {
  const cols = sheet.cols
    .map(
      (c, i) =>
        `<col min="${i + 1}" max="${i + 1}" width="${c.width}" customWidth="1"${c.style ? ` style="${c.style}"` : ""}${c.hidden ? ' hidden="1"' : ""}/>`,
    )
    .join("");
  const rows = sheet.rows
    .map((row, i) => {
      const r = i + 1;
      const cells = row.cells.map((cell, c) => (cell ? cellXml(r, c, cell) : "")).join("");
      const ht = row.height ? ` ht="${row.height}" customHeight="1"` : "";
      return cells || ht ? `<row r="${r}"${ht}>${cells}</row>` : "";
    })
    .join("");
  const f = sheet.freeze;
  const topLeft = f ? `${col(f.cols ?? 0)}${f.rows + 1}` : "A1";
  const pane = f
    ? `<pane${f.cols ? ` xSplit="${f.cols}"` : ""} ySplit="${f.rows}" topLeftCell="${topLeft}" activePane="${f.cols ? "bottomRight" : "bottomLeft"}" state="frozen"/><selection pane="${f.cols ? "bottomRight" : "bottomLeft"}" activeCell="${topLeft}" sqref="${topLeft}"/>`
    : "";
  const merges = sheet.merges?.length ? `<mergeCells count="${sheet.merges.length}">${sheet.merges.map((m) => `<mergeCell ref="${m}"/>`).join("")}</mergeCells>` : "";
  const validations = sheet.validations?.length
    ? `<dataValidations count="${sheet.validations.length}">${sheet.validations.map(validationXml).join("")}</dataValidations>`
    : "";
  // Element order is fixed by the SpreadsheetML schema.
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<sheetViews><sheetView workbookViewId="0"${selected ? ' tabSelected="1"' : ""}>${pane}</sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>${cols}</cols>
<sheetData>${rows}</sheetData>
${sheet.autoFilter ? `<autoFilter ref="${sheet.autoFilter}"/>` : ""}${merges}${validations}
<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
<pageSetup paperSize="9" orientation="${sheet.landscape ? "landscape" : "portrait"}" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;
}

export function writeXlsx(
  path: string,
  { title, sheets, names = [] }: { title: string; sheets: Sheet[]; names?: { name: string; ref: string }[] },
): void {
  const filterNames = sheets.flatMap((s, i) =>
    s.autoFilter
      ? [`<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">${esc(ref(s.name))}!${s.autoFilter.replace(/([A-Z]+)(\d+)/g, "$$$1$$$2")}</definedName>`]
      : [],
  );
  const definedNames = [...names.map((n) => `<definedName name="${n.name}">${esc(n.ref)}</definedName>`), ...filterNames];
  const files: Record<string, string> = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("\n")}
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
<dc:title>${esc(title)}</dc:title><dc:creator>Software Lantern</dc:creator>
</cp:coreProperties>`,
    "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Software Lantern</Application></Properties>`,
    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<bookViews><workbookView activeTab="0"/></bookViews>
<sheets>${sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets>
${definedNames.length ? `<definedNames>${definedNames.join("")}</definedNames>` : ""}
<calcPr calcId="191029" fullCalcOnLoad="1"/>
</workbook>`,
    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("\n")}
<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    "xl/styles.xml": STYLES_XML,
  };
  sheets.forEach((s, i) => (files[`xl/worksheets/sheet${i + 1}.xml`] = sheetXml(s, i === 0)));
  writeFileSync(path, zip(files));
}

// Minimal zip: deflate each entry, then a central directory. A fixed
// timestamp keeps the output byte-identical between runs.
function zip(entries: Record<string, string>): Buffer {
  const local: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;
  const DOS_TIME = 0;
  const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
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
