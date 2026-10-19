import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

// Every page-level metadata export should go through this, not set title/
// description alone. Next's metadata API does NOT synthesize openGraph or
// twitter from a page's plain title/description — a page that omits those
// nested objects inherits them wholesale from the nearest ancestor that
// does set them (the root layout), so a page setting only title/
// description silently shows the homepage's OG/Twitter card instead of its
// own. This wraps title/description/canonical path into a complete
// Metadata object so that can't happen by omission again.
export function pageMetadata({
  title,
  description,
  path,
  ogDescription,
  noindex,
  siteName,
}: {
  title: string;
  description: string;
  // Canonical path (e.g. "/eudr"), also used as the openGraph url.
  path?: string;
  // A few pages want a shorter, OG-specific description than their <meta
  // name="description">; defaults to the same description otherwise.
  ogDescription?: string;
  // Set true for a page that should carry robots noindex/nofollow — used
  // both for the legacy marketplace pages (2026-10-19 wind-down decision:
  // keep live, noindex, unlinked, out of sitemap) and, via
  // lib/site-config.ts's OT_SITE_INDEXABLE flag, for the OT pages before
  // that flag is flipped on in production.
  noindex?: boolean;
  // Override SITE_NAME for a page/section with its own brand identity
  // distinct from the sitewide default (e.g. the OT pages, which are not
  // "Software Lantern"-branded) — defaults to SITE_NAME otherwise.
  siteName?: string;
}): Metadata {
  const ogDesc = ogDescription ?? description;
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description: ogDesc,
      ...(path ? { url: path } : {}),
      siteName: siteName ?? SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDesc,
    },
  };
}
