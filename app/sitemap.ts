import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

// 2026-10-19 site replacement: the legacy marketplace routes (/eudr, /plm,
// /battery-passport, /providers, /finder, /resources/*) are deliberately
// left out of this sitemap per docs/OT-CYBER-PLAN.md Part B §B.1.5 (keep
// live, noindex, unlinked, out of sitemap) — they still work for anyone
// with an existing link, they just aren't advertised for (re)crawling.
const OT_ROUTES = [
  "/",
  "/machine-builders",
  "/factory-operators",
  "/system-integrators",
  "/checker",
  "/remote-access-check",
  "/questionnaire-pack",
  "/guides",
  "/guides/nis2-supply-chain-and-remote-access",
  "/guides/cyber-resilience-act-for-machine-builders",
  "/guides/machinery-regulation-cybersecurity",
  "/guides/iec-62443-explained",
  "/guides/customer-security-questionnaire",
  "/guides/iec-62443-remote-access",
  "/enquiry",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // If the OT pages aren't indexable yet (lib/site-config.ts), an empty
  // sitemap is more honest than one advertising noindexed URLs for
  // crawling — Search Console treats that as a real inconsistency to flag.
  if (!OT_SITE_INDEXABLE) return [];

  return OT_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/checker" ? 0.9 : 0.7,
  }));
}
