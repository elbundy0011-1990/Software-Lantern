import { SITE_URL } from "@/lib/site";

// BreadcrumbList JSON-LD for a tool/utility page that isn't an article
// (no headline, no datePublished/dateModified to be honest about) — see
// components/guide-structured-data.tsx for the guide-page equivalent,
// which adds Article on top of the same BreadcrumbList shape. Organization
// and WebSite JSON-LD already render sitewide from app/layout.tsx.
export function BreadcrumbStructuredData({
  breadcrumbs,
}: {
  breadcrumbs: { name: string; path: string }[];
}) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `${SITE_URL}${b.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}
