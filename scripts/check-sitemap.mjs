#!/usr/bin/env node
// Sitemap completeness guard. Runs as "prebuild" (see package.json),
// alongside scripts/check-claims.mjs. Fails the build if any OT page
// that is indexable in production (every app/(ot)/**/page.tsx whose
// pageMetadata() call uses `noindex: !OT_SITE_INDEXABLE`, i.e. every
// page except the ones hardcoded `noindex: true` such as /enquiry) is
// missing from app/sitemap.ts's OT_ROUTES array. A page added without a
// matching sitemap entry would otherwise go unnoticed until someone
// manually diffed the two lists, which is exactly how a route drifts out
// of a "complete" sitemap over time.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (name === "page.tsx") {
      out.push(full);
    }
  }
}

const pageFiles = [];
walk(join(ROOT, "app/(ot)"), pageFiles);

const indexablePaths = [];
const errors = [];

for (const abs of pageFiles) {
  const rel = relative(ROOT, abs);
  const text = readFileSync(abs, "utf8");

  const pathMatch = text.match(/path:\s*"([^"]*)"/);
  if (!pathMatch) {
    errors.push(`${rel}: no pageMetadata({ path: "..." }) found — cannot verify sitemap coverage for this page.`);
    continue;
  }
  const path = pathMatch[1];

  // Hardcoded `noindex: true` (a literal boolean, not `!OT_SITE_INDEXABLE`)
  // means this page is permanently excluded from indexing by design
  // (e.g. /enquiry) — it must NOT be in the sitemap, so skip it here.
  const noindexMatch = text.match(/noindex:\s*([a-zA-Z0-9_!().]+)/);
  const isPermanentlyNoindex = noindexMatch && noindexMatch[1] === "true";
  if (isPermanentlyNoindex) continue;

  indexablePaths.push({ path, rel });
}

const sitemapPath = join(ROOT, "app/sitemap.ts");
const sitemapSource = readFileSync(sitemapPath, "utf8");
const sitemapRoutePaths = new Set([...sitemapSource.matchAll(/\{\s*path:\s*"([^"]*)"/g)].map((m) => m[1]));

for (const { path, rel } of indexablePaths) {
  if (!sitemapRoutePaths.has(path)) {
    errors.push(`${rel}: indexable route "${path}" is missing from app/sitemap.ts's OT_ROUTES array.`);
  }
}

// The reverse check too: a sitemap entry with no matching page would be
// a dead/incorrect URL advertised to crawlers.
const indexablePathSet = new Set(indexablePaths.map((p) => p.path));
for (const path of sitemapRoutePaths) {
  if (!indexablePathSet.has(path)) {
    errors.push(`app/sitemap.ts: lists "${path}", which no indexable app/(ot)/**/page.tsx declares via pageMetadata({ path }).`);
  }
}

if (errors.length) {
  console.error("\nSitemap completeness guard failed:\n");
  for (const e of errors) console.error("  - " + e);
  console.error(`\n${errors.length} problem(s).\n`);
  process.exit(1);
}

console.log(`Sitemap completeness guard passed (${indexablePaths.length} indexable OT pages, all present in app/sitemap.ts).`);
