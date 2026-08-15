import { Suspense } from "react";
import type { Metadata } from "next";
import { FinderWizard } from "@/components/finder-wizard";

const CATEGORY_META: Record<string, { title: string; description: string; canonical: string }> = {
  "EUDR Software": {
    title: "EUDR Software Finder | Software Lantern",
    description:
      "Answer a few questions about your supply chain and we'll connect you with up to 3 EUDR compliance software providers that believe they can help.",
    canonical: "/eudr",
  },
  "Product Lifecycle Management (PLM)": {
    title: "Fashion PLM Software Finder | Software Lantern",
    description:
      "Answer a few questions about your brand and we'll connect you with up to 3 fashion PLM providers that believe they can help.",
    canonical: "/plm",
  },
  "Digital Battery Passport (DBP)": {
    title: "Battery Passport Software Finder | Software Lantern",
    description:
      "Answer a few questions about your product and we'll connect you with up to 3 battery passport software providers that believe they can help.",
    canonical: "/battery-passport",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const meta = category ? CATEGORY_META[category] : undefined;

  if (meta) {
    // Canonicalize back to the category landing page: the wizard state for a
    // given category shouldn't compete with that page's own indexing/ranking.
    return {
      title: meta.title,
      description: meta.description,
      alternates: { canonical: meta.canonical },
    };
  }

  return {
    title: "Find Your Software Match | Software Lantern",
    description:
      "Tell us what software you need and we'll connect you with up to 3 providers that believe they have a fitting solution.",
    alternates: { canonical: "/finder" },
  };
}

export default function FinderPage() {
  return (
    <Suspense fallback={null}>
      <FinderWizard />
    </Suspense>
  );
}
