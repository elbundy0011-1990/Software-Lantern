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
//
// See docs/CLAIMS.md for how to add a new, compliant claim.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// Only the OT cybersecurity resource is in scope. The legacy EUDR/Fashion
// PLM/Battery Passport marketplace has its own, separate sourcing
// discipline (lib/eudr-dates.ts, lib/battery-passport-dates.ts, docs/
// ICP.md) and is deliberately not touched by this guard.
const OT_DIRS = ["app/(ot)"];
const OT_FILES = [
  "app/api/ot-enquiries/route.ts",
  "components/nis2-scope-checker.tsx",
  "components/ot-enquiry-form.tsx",
  "components/ot-cyber-interactive.tsx",
  "components/compliance-ledger.tsx",
  "components/ot-logo.tsx",
  "components/disclosure-slot.tsx",
  "lib/compliance-ledger.ts",
  "lib/nis2-dates.ts",
  "lib/consent-text.ts",
  "lib/checker-session.ts",
  "lib/email-templates.ts",
];

// Files where a literal date is expected and allowed: the ledger itself
// (the one place dates are allowed to be typed out), and the privacy
// policy's own "Last updated" line.
const DATE_ALLOWLIST = new Set(["lib/compliance-ledger.ts", "app/(ot)/privacy/page.tsx"]);

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

console.log(`Claims guard passed (${files.length} files scanned, ${pulledIds.length} pulled entries).`);
