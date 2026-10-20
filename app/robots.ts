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
        "/auth/",
        "/reset-password",
        "/reset-password/",
        // 2026-10-20: the legacy marketplace paths (/eudr, /plm,
        // /battery-passport, /providers, /resources, /finder) used to be
        // disallowed here too, which was actually counter-productive:
        // a page that's both robots.txt-disallowed AND noindex-tagged
        // presents a contradiction Google can never resolve, because it
        // can't crawl the page to see the noindex tag in the first place.
        // Every one of those pages already carries its own hardcoded
        // `noindex: true` (lib/metadata.ts's pageMetadata), confirmed
        // directly in each page's own metadata call, so letting Google
        // recrawl and see that tag is the correct fix, not a regression.
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
