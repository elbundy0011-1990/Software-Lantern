import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { RoiCalculator } from "@/components/roi-calculator";
import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";

const TITLE = "Remote Access ROI Calculator";
const DESCRIPTION =
  "Estimate, in euros, what remote access to machines could save on travel and incident response, from the numbers you enter yourself.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/roi-calculator",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function RoiCalculatorPage() {
  return (
    <main data-screen-label="ROI calculator page">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "ROI calculator", path: "/roi-calculator" },
        ]}
      />
      <section>
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
            Remote access ROI calculator
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-10 max-w-[640px]">
            A euro estimate of what remote access could save, calculated only from the numbers you
            enter below. No email required to see it, no default figures presented as facts, and
            no data about any other company.
          </p>
          <RoiCalculator />
          <p className="mt-10 text-[13px] leading-[1.6] text-[#3f4b52]">
            Related: {" "}
            <Link href="/remote-access-check" className="underline font-semibold" style={{ color: "#7c2d12" }}>
              the remote access situation check
            </Link>{" "}
            and{" "}
            <Link href="/guides/remote-access-approaches" className="underline font-semibold" style={{ color: "#7c2d12" }}>
              the guide to remote access approaches
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
