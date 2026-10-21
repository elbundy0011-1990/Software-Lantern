import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";
import { WhitepaperForm } from "@/components/whitepaper-form";
import { ReportViewTracker } from "@/components/whitepaper/view-tracker";
import {
  ExecutiveSummarySection,
  CountryComparisonSection,
  RegulatoryTimelineSection,
  TableOfContents,
} from "@/components/whitepaper/report-sections";
import { REPORT_TITLE, REPORT_SUBTITLE, REPORT_EDITION, REPORT_PATH } from "@/lib/whitepaper-content";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";

const TITLE = "Remote Access Security: Belgium & Netherlands Report";
const DESCRIPTION =
  "A regulatory and buyer's guide to securing remote access to industrial machines in Belgium and the Netherlands, winter 2026/27, with an original size-class analysis and no vendor names.";
const H1 = REPORT_TITLE;

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/reports/remote-access-belgium-netherlands",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function RemoteAccessBelgiumNetherlandsReportPage() {
  return (
    <main data-screen-label="Regional report: remote access, Belgium and Netherlands">
      <ReportViewTracker />
      <GuideStructuredData
        headline={H1}
        path={REPORT_PATH}
        datePublished={EUROSTAT_SOURCE.extractionDate}
        dateModified={EUROSTAT_SOURCE.extractionDate}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: REPORT_PATH },
        ]}
      />
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pt-16 pb-10">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#9a3412]">
            {REPORT_EDITION} &middot; Regional guide
          </p>
          <h1 className="font-sans font-semibold text-[clamp(28px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[18px] text-[#3f4b52] mb-6">{REPORT_SUBTITLE}</p>
          <p className="text-[16px] leading-[1.7] text-[#3f4b52] mb-8 max-w-[680px]">
            An original regional guide, not a market study: five traceable findings, an original
            size-class analysis of machinery and equipment manufacturers in both countries from
            Eurostat&apos;s own data, the regulatory timeline, and a buyer&apos;s evaluation matrix
            that names no vendor. Free, full PDF after a short form.
          </p>
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-12">
          <TableOfContents />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-12">
          <ExecutiveSummarySection />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-12">
          <CountryComparisonSection />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-12">
          <RegulatoryTimelineSection mode="live" />
        </div>
      </section>

      <section>
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-16">
          <p className="text-center text-[16px] text-[#3f4b52] mb-8 max-w-[560px] mx-auto">
            The full PDF continues with how remote access works in practice, six trade-offs worth
            weighing deliberately, a 25-criteria buyer&apos;s evaluation matrix, three illustrative
            scenarios, and a 90-day action plan.
          </p>
          <WhitepaperForm />
        </div>
      </section>

      <section>
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pb-16">
          <hr className="border-[#3f4b52]/[0.2] mb-6" />
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] italic">
            This is a general guide based on published sources, not legal or security advice, and
            names no vendor or competitor. Confirm your specific obligations with the official
            government tool linked throughout or a qualified advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
