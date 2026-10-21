import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// See app/sitemap.ts for why this is forced dynamic: a metadata route
// should never risk serving a previous deploy's cached output.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/auth/",
        "/reset-password",
        "/reset-password/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
