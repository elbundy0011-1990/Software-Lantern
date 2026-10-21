import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";
import { WhitepaperForm } from "@/components/whitepaper-form";
import { ReportViewTracker } from "@/components/whitepaper/view-tracker";
import {
  HowToRead,
  TableOfContents,
  BriefingSection,
  SprawlSection,
  FailuresSection,
} from "@/components/whitepaper/report-sections";
import {
  REPORT_TITLE,
  REPORT_SUBTITLE,
  REPORT_EDITION,
  REPORT_PATH,
  REPORT_SECTIONS,
  partLabel,
  REGISTER_XLSX_PATH,
  DISCLAIMER,
} from "@/lib/whitepaper-content";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";

const TITLE = "Remote Access Governance: Belgium & Netherlands Report";
const DESCRIPTION =
  "Why industrial remote access is a governance problem, what NIS2, the CRA and the Machinery Regulation say about it, and a 90-day plan. Belgium and the Netherlands.";
const H1 = REPORT_TITLE;

// Parts shown on the open page; the rest is in the PDF.
const OPEN_PARTS = new Set(["briefing", "sprawl", "failures"]);
const PDF_ONLY = REPORT_SECTIONS.filter((s) => !OPEN_PARTS.has(s.id));

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/reports/remote-access-belgium-netherlands",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const wrap = "max-w-[860px] mx-auto px-5 sm:px-8";

export default function RemoteAccessBelgiumNetherlandsReportPage() {
  return (
    <main data-screen-label="Regional report: remote access governance, Belgium and Netherlands">
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
        <div className={`${wrap} pt-16 pb-10`}>
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#9a3412]">
            {REPORT_EDITION} &middot; Regional report
          </p>
          <h1 className="font-sans font-semibold text-[clamp(28px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[18px] text-[#3f4b52] mb-8">{REPORT_SUBTITLE}</p>
          <HowToRead />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className={`${wrap} py-10`}>
          <TableOfContents />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className={`${wrap} py-12`}>
          <BriefingSection />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className={`${wrap} py-12`}>
          <SprawlSection interactive />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className={`${wrap} py-12`}>
          <FailuresSection />
        </div>
      </section>

      <section>
        <div className={`${wrap} py-16`}>
          <div className="max-w-[560px] mx-auto mb-8">
            <p className="text-[16px] text-[#3f4b52] mb-3">The full PDF continues with:</p>
            <ul className="space-y-1 text-[15px] text-[#3f4b52]">
              {PDF_ONLY.map((s) => (
                <li key={s.id}>
                  <strong className="text-[#1a1d22]">{partLabel(s.id)}:</strong> {s.title}
                </li>
              ))}
            </ul>
            <p className="text-[14px] text-[#3f4b52] mt-4">
              {partLabel("register")} is also a spreadsheet, free to use without the form:{" "}
              <a href={REGISTER_XLSX_PATH} download className="underline font-semibold text-[#7c2d12]">
                download the remote access register template (.xlsx)
              </a>
              .
            </p>
          </div>
          <WhitepaperForm />
        </div>
      </section>

      <section>
        <div className={`${wrap} pb-16`}>
          <hr className="border-[#3f4b52]/[0.2] mb-6" />
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] italic">
            {DISCLAIMER} This report names no vendor or competitor.
          </p>
        </div>
      </section>
    </main>
  );
}
