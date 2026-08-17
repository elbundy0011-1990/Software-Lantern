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
}: {
  title: string;
  description: string;
  // Canonical path (e.g. "/eudr"), also used as the openGraph url.
  path?: string;
  // A few pages want a shorter, OG-specific description than their <meta
  // name="description">; defaults to the same description otherwise.
  ogDescription?: string;
}): Metadata {
  const ogDesc = ogDescription ?? description;
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title,
      description: ogDesc,
      ...(path ? { url: path } : {}),
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDesc,
    },
  };
}
