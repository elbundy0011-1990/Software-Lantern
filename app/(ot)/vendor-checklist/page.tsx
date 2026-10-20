import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { QuestionnairePackForm } from "@/components/questionnaire-pack-form";
import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Demo Comparison Checklist",
  description:
    "A 25-criteria spreadsheet for comparing remote-access vendors before a demo, with why each one matters and what to ask. No suggested answers.",
  path: "/vendor-checklist",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function VendorChecklistPage() {
  return (
    <main data-screen-label="Vendor checklist download page">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Vendor comparison checklist", path: "/vendor-checklist" },
        ]}
      />
      <section>
        <div className="max-w-[640px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22] text-center">
            Vendor demo comparison checklist
          </h1>
          <p className="text-[16px] leading-[1.7] text-[#3f4b52] mb-8 text-center">
            An editable spreadsheet of about 25 criteria worth comparing across remote-access
            vendors, grouped by topic (access model, identity, session control, logging,
            deployment, protocol support, multi-customer management, pricing clarity, and more).
            Each row has the criterion, why it matters, what to ask, a blank column for your own
            requirement, and three blank columns for each vendor&apos;s answer. No recommended
            vendor and no suggested &ldquo;right&rdquo; answers. See{" "}
            <Link href="/guides/what-to-compare-before-a-vendor-demo" className="font-semibold underline text-[#9a3412]">
              the guide
            </Link>{" "}
            for the fuller explanation.
          </p>
          <QuestionnairePackForm product="checklist" />
        </div>
      </section>
    </main>
  );
}
