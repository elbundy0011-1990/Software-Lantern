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
        "/finder/done",
        "/auth/",
        "/reset-password",
        "/reset-password/",
        // Preview-only, pre-approval build (docs/OT-CYBER-PLAN.md §3/§7):
        // not yet on its own domain, not yet announced. Each page under
        // here also carries its own `robots: { index: false }` metadata
        // directly, on top of this disallow and Vercel's own preview
        // noindex header.
        "/ot-cyber",
        "/ot-cyber/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
