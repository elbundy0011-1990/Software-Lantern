import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/portal",
        "/portal/",
        "/api/",
        "/finder",
        "/finder/",
        "/auth/",
        "/reset-password",
        "/reset-password/",
        // 2026-10-19 wind-down decision (docs/OT-CYBER-PLAN.md Part B
        // §B.1.5): keep every legacy marketplace page live, noindex,
        // unlinked from the new site's nav, out of the sitemap. Each page
        // also carries its own `robots: { index: false }` metadata
        // directly (lib/metadata.ts's pageMetadata(noindex: true)), on top
        // of this disallow.
        "/eudr",
        "/plm",
        "/battery-passport",
        "/providers",
        "/resources",
        "/resources/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
