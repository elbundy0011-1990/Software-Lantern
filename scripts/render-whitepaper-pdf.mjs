#!/usr/bin/env node
// Renders the regional report PDF from its print-only page
// (app/(ot)/reports/remote-access-belgium-netherlands/print) via Playwright, and
// saves it to private/reports/ (never /public), where app/api/ot-enquiries/
// whitepaper/route.ts serves it after a signed-token check. This is a one-off
// build tool, run by hand when the report's content changes, not part of `npm
// run build` — Vercel's build environment isn't a reliable place to launch a full
// Chromium instance, and the PDF doesn't need to regenerate on every deploy.
//
// Usage: the dev (or production) server must already be running on PORT below.
//   npm run dev &
//   node scripts/render-whitepaper-pdf.mjs
//
// The title/edition/date strings below must match lib/whitepaper-content.ts and
// lib/eurostat-data.ts's EUROSTAT_SOURCE — this script runs standalone via plain
// Node, not through Next's TypeScript pipeline, so it can't import those .ts
// files directly. Update both places together if either changes.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = process.env.PORT || 3000;
const PRINT_URL = `http://localhost:${PORT}/reports/remote-access-belgium-netherlands/print`;
const OUT_DIR = join(ROOT, "private", "reports");
const OUT_FILE = join(OUT_DIR, "remote-access-belgium-netherlands.pdf");

const REPORT_TITLE = "Securing Remote Access to Industrial Machines in Belgium and the Netherlands";
const REPORT_EDITION = "Winter 2026/27 edition";
const EXTRACTION_DATE_DISPLAY = "21 October 2026";

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("pageerror", (err) => consoleErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto(PRINT_URL, { waitUntil: "networkidle", timeout: 60_000 });

  const footerTemplate = `
    <div style="font-size:8px; width:100%; text-align:center; color:#6b7280; padding:0 24px; font-family: Arial, sans-serif;">
      ${REPORT_TITLE}. ${REPORT_EDITION}. Data extracted ${EXTRACTION_DATE_DISPLAY}.
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>.
    </div>
  `;

  await page.pdf({
    path: OUT_FILE,
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate,
    margin: { top: "16mm", bottom: "18mm", left: "0mm", right: "0mm" },
  });

  await browser.close();

  if (consoleErrors.length) {
    console.error("Console/page errors during render (PDF was still written, review before shipping):");
    for (const e of consoleErrors) console.error(" - " + e);
  }

  console.log(`Wrote ${OUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
