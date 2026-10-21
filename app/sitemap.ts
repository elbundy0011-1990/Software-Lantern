import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

// Forces this metadata route to render on every request rather than be
// statically generated once at build time and then potentially served
// stale from a CDN/ISR cache across later deploys — a fresh deploy must
// always serve its own current route list, never a previous deploy's
// cached sitemap.xml.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// /enquiry is left out: it's a lead-capture form page, hardcoded
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
  { path: "/vendor-checklist", lastModified: "2026-10-21" },
  { path: "/guides", lastModified: "2026-10-21" },
  { path: "/guides/remote-access-approaches", lastModified: "2026-10-20" },
  { path: "/guides/what-to-compare-before-a-vendor-demo", lastModified: "2026-10-21" },
  { path: "/guides/nis2-supply-chain-and-remote-access", lastModified: "2026-10-19" },
  { path: "/guides/cyber-resilience-act-for-machine-builders", lastModified: "2026-10-19" },
  { path: "/guides/machinery-regulation-cybersecurity", lastModified: "2026-10-19" },
  { path: "/guides/iec-62443-explained", lastModified: "2026-10-19" },
  { path: "/guides/customer-security-questionnaire", lastModified: "2026-10-20" },
  { path: "/guides/iec-62443-remote-access", lastModified: "2026-10-20" },
  { path: "/guides/nis2-small-and-micro-manufacturers", lastModified: "2026-10-20" },
  { path: "/guides/nis2-proportionate-measures", lastModified: "2026-10-20" },
  { path: "/guides/regulation-overview", lastModified: "2026-10-20" },
  { path: "/reports/remote-access-belgium-netherlands", lastModified: "2026-10-21" },
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
