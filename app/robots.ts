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
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
