import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

// 2026-10-19 site replacement: the legacy marketplace routes (/eudr, /plm,
// /battery-passport, /providers, /resources/*, /finder) are deliberately
// left out of this sitemap per docs/OT-CYBER-PLAN.md Part B §B.1.5 (keep
// live, noindex, unlinked, out of sitemap) — they still work for anyone
// with an existing link, they just aren't advertised for (re)crawling.
// /enquiry is also left out: it's a lead-capture form page, hardcoded
// noindex regardless of OT_SITE_INDEXABLE (app/(ot)/enquiry/page.tsx).
//
// lastModified per route is a real date this specific page's content
// last substantively changed (`git log -1 --format=%ad --date=short`
// against the page file, checked 2026-10-20), not the build timestamp —
// a build-time Date.now() would claim every page changed on every
// deploy, which isn't true and isn't useful to a crawler deciding what
// to recrawl. Update the date here by hand the next time a page's own
// content changes.
const OT_ROUTES: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: "2026-10-20" },
  { path: "/machine-builders", lastModified: "2026-10-19" },
  { path: "/factory-operators", lastModified: "2026-10-19" },
  { path: "/system-integrators", lastModified: "2026-10-19" },
  { path: "/checker", lastModified: "2026-10-19" },
  { path: "/remote-access-check", lastModified: "2026-10-20" },
  { path: "/roi-calculator", lastModified: "2026-10-20" },
  { path: "/questionnaire-pack", lastModified: "2026-10-20" },
  { path: "/guides", lastModified: "2026-10-20" },
  { path: "/guides/remote-access-approaches", lastModified: "2026-10-20" },
  { path: "/guides/nis2-supply-chain-and-remote-access", lastModified: "2026-10-19" },
  { path: "/guides/cyber-resilience-act-for-machine-builders", lastModified: "2026-10-19" },
  { path: "/guides/machinery-regulation-cybersecurity", lastModified: "2026-10-19" },
  { path: "/guides/iec-62443-explained", lastModified: "2026-10-19" },
  { path: "/guides/customer-security-questionnaire", lastModified: "2026-10-20" },
  { path: "/guides/iec-62443-remote-access", lastModified: "2026-10-20" },
  { path: "/guides/nis2-small-and-micro-manufacturers", lastModified: "2026-10-20" },
  { path: "/guides/nis2-proportionate-measures", lastModified: "2026-10-20" },
  { path: "/guides/regulation-overview", lastModified: "2026-10-20" },
  { path: "/privacy", lastModified: "2026-10-20" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // If the OT pages aren't indexable yet (lib/site-config.ts), an empty
  // sitemap is more honest than one advertising noindexed URLs for
  // crawling — Search Console treats that as a real inconsistency to flag.
  if (!OT_SITE_INDEXABLE) return [];

  return OT_ROUTES.map(({ path, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/checker" || path === "/roi-calculator" ? 0.9 : 0.7,
  }));
}
