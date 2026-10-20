import { SITE_URL, SITE_NAME } from "@/lib/site";

// BreadcrumbList + Article JSON-LD for a guide page. Organization and
// WebSite JSON-LD already render sitewide from app/layout.tsx; this is
// the per-guide addition on top of that. No ratings, no reviews, no
// claims beyond what the page itself states, and no personal name
// anywhere — author/publisher are both the Organization, matching the
// standing rule against using a personal name in site copy.
export function GuideStructuredData({
  headline,
  path,
  datePublished,
  dateModified,
  breadcrumbs,
}: {
  headline: string;
  path: string;
  datePublished: string; // ISO date, real (git history), never build time
  dateModified: string; // ISO date, real (git history), never build time
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    datePublished,
    dateModified,
    url: `${SITE_URL}${path}`,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
