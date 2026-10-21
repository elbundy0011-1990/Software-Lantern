#!/usr/bin/env node
// Claims guard for the OT cybersecurity resource. Runs as "prebuild"
// (see package.json), before `next build`. Fails the build (non-zero
// exit) if any of the following is true:
//
//   A. A lib/compliance-ledger.ts entry (or supplementary-evidence item)
//      has verified: true without a citation URL, a check date, and a
//      quote or record reference. A "corroborated" tier quote also
//      needs at least 3 copyUrls (independent published copies of the
//      wording), since the official text wasn't directly confirmable.
//   B. Any in-scope file contains "[VERIFY]", "pending verification",
//      "TODO", or a leftover bracket placeholder like "[INSERT DATE]".
//   C. Any in-scope file other than lib/compliance-ledger.ts (the one
//      place a regulatory date is allowed to be a literal string) and
//      the privacy policy (its own "Last updated" date) contains a
//      regulatory-looking date (day + month name + year). Every other
//      date must come from a ledger entry via a JS expression, e.g.
//      {entry.display}, never typed out again as a string.
//   D. Any in-scope file references a ledger entry whose verified flag
//      is false — a pulled claim must never be looked up for display.
//   E. A lib/compliance-ledger.ts entry citing EUR-Lex has no ojReference
//      (the Official Journal reference of the act).
//   F. A lib/incident-evidence.ts entry lacks a record URL, record ID,
//      check date, primary tier, contested: false, or a verbatim quote.
//      Any other in-scope file that names a cited or excluded incident
//      must import from lib/incident-evidence.ts, and no in-scope file
//      may retype an incident quote instead of rendering it from there.
//   G. A regional report file retypes a ledger quote instead of rendering
//      it from the ledger, contains an em-dash, uses "independent",
//      "neutral" or "unbiased", or says a regulation requires buying
//      something.
//
// See docs/CLAIMS.md for how to add a new, compliant claim.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// Only the OT cybersecurity resource is in scope.
const OT_DIRS = ["app/(ot)"];
const OT_FILES = [
  "app/api/ot-enquiries/route.ts",
  "components/nis2-scope-checker.tsx",
  "components/ot-enquiry-form.tsx",
  "components/ot-cyber-interactive.tsx",
  "components/compliance-ledger.tsx",
  "components/ot-logo.tsx",
  "components/disclosure-slot.tsx",
  "components/remote-access-situation-check.tsx",
  "components/remote-access-check-interactive.tsx",
  "components/questionnaire-pack-form.tsx",
  "lib/compliance-ledger.ts",
  "lib/nis2-dates.ts",
  "lib/consent-text.ts",
  "lib/checker-session.ts",
  "lib/remote-access-session.ts",
  "lib/download-token.ts",
  "lib/email-templates.ts",
  "lib/roi-calculator.ts",
  "components/roi-calculator.tsx",
  "components/breadcrumb-structured-data.tsx",
  "lib/country-report.ts",
  "components/country-report-form.tsx",
  "app/api/ot-enquiries/questionnaire-pack/route.ts",
  "app/api/ot-enquiries/checklist/route.ts",
  "lib/checker-brief.ts",
  "lib/review-sheet.ts",
  "lib/questionnaire-pack-rows.ts",
  "components/result-actions.tsx",
  "components/countdown.tsx",
  "lib/eurostat-data.ts",
  "lib/vendor-checklist-rows.ts",
  "lib/whitepaper-content.ts",
  "components/whitepaper/size-class-chart.tsx",
  "components/whitepaper/report-sections.tsx",
  "components/whitepaper-form.tsx",
  "app/api/ot-enquiries/whitepaper/route.ts",
  "app/(print)/reports/remote-access-belgium-netherlands/print/page.tsx",
  "lib/incident-evidence.ts",
  "components/whitepaper/access-sprawl-model.tsx",
];

// The regional report's own files: held to rule G on top of everything else.
const REPORT_FILES = new Set([
  "lib/whitepaper-content.ts",
  "lib/incident-evidence.ts",
  "components/whitepaper/report-sections.tsx",
  "components/whitepaper/size-class-chart.tsx",
  "components/whitepaper/access-sprawl-model.tsx",
  "components/whitepaper-form.tsx",
  "app/(ot)/reports/remote-access-belgium-netherlands/page.tsx",
  "app/(print)/reports/remote-access-belgium-netherlands/print/page.tsx",
]);

// Files where a literal date is expected and allowed: the ledger itself
// (the one place dates are allowed to be typed out), and the privacy
// policy's own "Last updated" line.
const DATE_ALLOWLIST = new Set([
  "lib/compliance-ledger.ts",
  "lib/eurostat-data.ts",
  "lib/incident-evidence.ts",
  "app/(ot)/privacy/page.tsx",
]);

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(full);
    }
  }
}

function collectOtFiles() {
  const out = [];
  for (const dir of OT_DIRS) walk(join(ROOT, dir), out);
  for (const file of OT_FILES) out.push(join(ROOT, file));
  // De-dupe and make paths relative + repo-root-relative for reporting.
  return [...new Set(out)].map((abs) => ({ abs, rel: relative(ROOT, abs) }));
}

const files = collectOtFiles();
const errors = [];

// ---------------------------------------------------------------------
// A. Every verified ledger / supplementary-evidence entry needs a quote
//    or record, a citation URL, and a check date.
// ---------------------------------------------------------------------
const ledgerPath = join(ROOT, "lib/compliance-ledger.ts");
const ledgerSource = readFileSync(ledgerPath, "utf8");

// Splits a `[ ... ]` array literal's source into its top-level `{ ... }`
// entry blocks by brace depth, so nested objects/arrays inside an entry
// (e.g. evidence.fields: [{...}]) don't break the split.
function splitEntries(arraySource) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < arraySource.length; i++) {
    const ch = arraySource[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        blocks.push(arraySource.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return blocks;
}

function extractArray(source, exportName) {
  const marker = `export const ${exportName}`;
  const startIdx = source.indexOf(marker);
  if (startIdx === -1) return [];
  // The type annotation (e.g. ": LedgerEntry[]") has its own "[]" before the
  // "=", so searching for "[" from startIdx lands on that empty pair, not
  // the array literal. Search from the "=" instead.
  const eqIdx = source.indexOf("=", startIdx);
  const bracketStart = source.indexOf("[", eqIdx);
  // Walk bracket depth to find the matching closing "]".
  let depth = 0;
  let end = -1;
  for (let i = bracketStart; i < source.length; i++) {
    if (source[i] === "[") depth++;
    else if (source[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return splitEntries(source.slice(bracketStart, end + 1));
}

function countCopyUrls(block) {
  const match = block.match(/copyUrls:\s*\[([\s\S]*?)\]/);
  if (!match) return 0;
  const urls = match[1].match(/"https?:\/\/[^"]+"/g);
  return urls ? urls.length : 0;
}

function checkEvidenceBlock(block, idMatch, requireDate) {
  const id = idMatch ? idMatch[1] : "(unknown id)";
  const verifiedMatch = block.match(/verified:\s*(true|false)/);
  const verified = verifiedMatch ? verifiedMatch[1] === "true" : requireDate; // supplementary entries are always "live", treat as verified
  if (!verified) return null;

  const missing = [];
  if (!/citationUrl:\s*"/.test(block)) missing.push("citationUrl");
  if (!/lastVerifiedDisplay:\s*"/.test(block)) missing.push("lastVerifiedDisplay");
  const hasQuote = /kind:\s*"quote"/.test(block) && /quotes:\s*\[/.test(block) && /text:\s*"/.test(block);
  const hasRecord = /kind:\s*"record"/.test(block) && /fields:\s*\[/.test(block) && /value:\s*"/.test(block);
  const hasSupplementaryQuotes = requireDate && /quotes:\s*\[/.test(block) && /text:\s*"/.test(block);
  if (!hasQuote && !hasRecord && !hasSupplementaryQuotes) missing.push("evidence (quote or record)");

  const tierMatch = block.match(/tier:\s*"(primary|corroborated)"/);
  if (tierMatch && tierMatch[1] === "corroborated") {
    const copyCount = countCopyUrls(block);
    if (copyCount < 3) {
      missing.push(`at least 3 copyUrls for a "corroborated" tier entry (found ${copyCount})`);
    }
  }

  if (missing.length) {
    return `Ledger entry "${id}" is verified but missing: ${missing.join(", ")}.`;
  }
  return null;
}

for (const block of extractArray(ledgerSource, "COMPLIANCE_LEDGER")) {
  const idMatch = block.match(/id:\s*"([^"]+)"/);
  const err = checkEvidenceBlock(block, idMatch, false);
  if (err) errors.push(err);
}
for (const block of extractArray(ledgerSource, "SUPPLEMENTARY_EVIDENCE")) {
  const idMatch = block.match(/id:\s*"([^"]+)"/);
  const err = checkEvidenceBlock(block, idMatch, true);
  if (err) errors.push(err);
}

// E. Every entry citing EUR-Lex records the act's Official Journal reference.
for (const name of ["COMPLIANCE_LEDGER", "SUPPLEMENTARY_EVIDENCE"]) {
  for (const block of extractArray(ledgerSource, name)) {
    if (!/citationUrl:\s*"https:\/\/eur-lex\.europa\.eu\//.test(block)) continue;
    if (!/ojReference:\s*"OJ [^"]+"/.test(block)) {
      const idMatch = block.match(/id:\s*"([^"]+)"/);
      errors.push(`Ledger entry "${idMatch ? idMatch[1] : "(unknown id)"}" cites EUR-Lex but has no ojReference.`);
    }
  }
}

// F. Incident evidence: same discipline as the ledger.
const incidentPath = join(ROOT, "lib/incident-evidence.ts");
const incidentSource = readFileSync(incidentPath, "utf8");
const incidentBlocks = extractArray(incidentSource, "INCIDENT_EVIDENCE");
if (incidentBlocks.length === 0) errors.push("lib/incident-evidence.ts: INCIDENT_EVIDENCE not found or empty.");
const incidentNames = [];
for (const block of incidentBlocks) {
  const id = (block.match(/id:\s*"([^"]+)"/) || [])[1] || "(unknown id)";
  const missing = [];
  if (!/recordUrl:\s*"https:\/\/[^"]+"/.test(block)) missing.push("recordUrl");
  if (!/recordId:\s*"[^"]+"/.test(block)) missing.push("recordId");
  if (!/lastVerifiedDisplay:\s*"[^"]+"/.test(block)) missing.push("lastVerifiedDisplay");
  if (!/tier:\s*"primary"/.test(block)) missing.push('tier: "primary"');
  if (!/contested:\s*false/.test(block)) missing.push("contested: false");
  if (!/quotes:\s*\[[\s\S]*text:\s*"/.test(block)) missing.push("at least one verbatim quote");
  if (missing.length) errors.push(`Incident entry "${id}" is missing: ${missing.join(", ")}.`);
  const nameMatch = block.match(/name:\s*"([^"]+)"/);
  if (nameMatch) incidentNames.push(nameMatch[1]);
}
for (const block of extractArray(incidentSource, "EXCLUDED_INCIDENTS")) {
  const nameMatch = block.match(/name:\s*"([^",(]+)/);
  if (nameMatch) incidentNames.push(nameMatch[1].trim());
}
// Names to watch for in other files: each incident's first word is enough
// to catch a retelling ("Colonial", "Ukrainian", "Oldsmar").
const incidentKeywords = [...new Set(incidentNames.map((n) => n.split(/\s+/)[0]))];

// Quote texts from both evidence files, for the "no retyping" checks.
function quoteTexts(source) {
  const out = [];
  for (const m of source.matchAll(/\btext:\s*"((?:[^"\\]|\\.)*)"/g)) out.push(m[1]);
  return out;
}
const incidentQuotes = quoteTexts(incidentSource);
const ledgerQuotes = quoteTexts(ledgerSource);
// True if `text` contains any 40-character run of `quote`.
function retypes(text, quote) {
  if (quote.length < 40) return text.includes(quote) && quote.length >= 25;
  for (let i = 0; i + 40 <= quote.length; i += 20) {
    if (text.includes(quote.slice(i, i + 40))) return true;
  }
  return false;
}

const BANNED_SELF_DESCRIPTIONS = /\b(independent|neutral|unbiased)\b/i;
const PURCHASE_MANDATE = /\b(requires?|mandates?|obliges?)\s+(you\s+)?(to\s+)?(buy|buying|purchas\w*)\b|\b(must|required to|have to)\s+(buy|purchase)\b/i;

// Collect every ledger id that is NOT verified, for check D below.
const pulledIds = [];
for (const block of extractArray(ledgerSource, "COMPLIANCE_LEDGER")) {
  const idMatch = block.match(/id:\s*"([^"]+)"/);
  const verifiedMatch = block.match(/verified:\s*(true|false)/);
  if (idMatch && verifiedMatch && verifiedMatch[1] === "false") pulledIds.push(idMatch[1]);
}

// ---------------------------------------------------------------------
// B, C, D: per-file text scans.
// ---------------------------------------------------------------------
const BRACKET_PLACEHOLDER = /\[[A-Z][A-Z _-]{2,}\]/g; // e.g. "[INSERT DATE]", "[TBD]", "[VERIFY]"
const DATE_PATTERN =
  /\b[0-9]{1,2} (January|February|March|April|May|June|July|August|September|October|November|December) [0-9]{4}\b/g;

for (const { abs, rel } of files) {
  const text = readFileSync(abs, "utf8");

  // B. Banned placeholder text.
  if (text.includes("[VERIFY]")) errors.push(`${rel}: contains "[VERIFY]".`);
  if (/pending verification/i.test(text)) errors.push(`${rel}: contains "pending verification".`);
  if (/\bTODO\b/.test(text)) errors.push(`${rel}: contains "TODO".`);
  const bracketMatches = text.match(BRACKET_PLACEHOLDER);
  if (bracketMatches) {
    for (const m of new Set(bracketMatches)) {
      if (m === "[VERIFY]") continue; // already reported above
      errors.push(`${rel}: contains a bracket placeholder (${m}).`);
    }
  }

  // C. Regulatory dates must live only in the ledger (or the allowlist).
  if (!DATE_ALLOWLIST.has(rel)) {
    const dateMatches = text.match(DATE_PATTERN);
    if (dateMatches) {
      for (const m of new Set(dateMatches)) {
        errors.push(`${rel}: contains a literal date ("${m}") outside lib/compliance-ledger.ts. Move it into the ledger and reference it with an expression instead.`);
      }
    }
  }

  // F. Incidents are named only via lib/incident-evidence.ts, and its
  //    quotes are never retyped elsewhere.
  if (rel !== "lib/incident-evidence.ts") {
    const named = incidentKeywords.filter((k) => text.includes(k));
    if (named.length && !text.includes("@/lib/incident-evidence")) {
      errors.push(`${rel}: names an incident (${named.join(", ")}) without importing from lib/incident-evidence.ts.`);
    }
    for (const q of incidentQuotes) {
      if (retypes(text, q)) errors.push(`${rel}: retypes an incident quote ("${q.slice(0, 50)}..."). Render it from lib/incident-evidence.ts.`);
    }
  }

  // G. Report wording rules.
  if (REPORT_FILES.has(rel)) {
    if (text.includes("\u2014")) errors.push(`${rel}: contains an em-dash.`);
    const banned = text.match(BANNED_SELF_DESCRIPTIONS);
    if (banned) errors.push(`${rel}: contains "${banned[0]}", which the report never uses.`);
    const mandate = text.match(PURCHASE_MANDATE);
    if (mandate) errors.push(`${rel}: "${mandate[0]}" reads as a regulation requiring a purchase.`);
    if (rel !== "lib/incident-evidence.ts") {
      for (const q of ledgerQuotes) {
        if (retypes(text, q)) errors.push(`${rel}: retypes a ledger quote ("${q.slice(0, 50)}..."). Render it from lib/compliance-ledger.ts.`);
      }
    }
  }

  // D. A pulled (unverified) ledger entry must never be referenced.
  for (const id of pulledIds) {
    if (text.includes(`e.id === "${id}"`) || text.includes(`id === "${id}"`)) {
      errors.push(`${rel}: references pulled ledger entry "${id}", which is not verified.`);
    }
  }
}

if (errors.length) {
  console.error("\nClaims guard failed:\n");
  for (const e of errors) console.error("  - " + e);
  console.error(`\n${errors.length} problem(s). See docs/CLAIMS.md.\n`);
  process.exit(1);
}

console.log(
  `Claims guard passed (${files.length} files scanned, ${pulledIds.length} pulled entries, ${incidentBlocks.length} incidents).`,
);
