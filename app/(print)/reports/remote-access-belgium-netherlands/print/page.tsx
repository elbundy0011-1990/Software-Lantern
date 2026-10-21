import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import {
  ExecutiveSummarySection,
  CountryComparisonSection,
  RegulatoryTimelineSection,
  ApproachesSection,
  TradeoffsSection,
  BuyerMatrixSection,
  ScenariosSection,
  ActionPlanSection,
  SourcesMethodologySection,
  TableOfContents,
} from "@/components/whitepaper/report-sections";
import { REPORT_TITLE, REPORT_SUBTITLE, REPORT_EDITION } from "@/lib/whitepaper-content";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";

// The full print/PDF source for the regional report. Lives under app/(print)/,
// not app/(ot)/, specifically so it inherits no header, footer, or nav — see
// app/(print)/layout.tsx. Never linked from anywhere on the site, never in the
// sitemap (hardcoded noindex: true below, the same pattern app/(ot)/enquiry/
// page.tsx uses for a page that must never be crawled or advertised): this
// route exists only for scripts/render-whitepaper-pdf.mjs to navigate to with
// Playwright and call page.pdf() against.
//
// Wrapped in .print-area: app/globals.css's print stylesheet (written for
// /checker and /remote-access-check's "print just this result card" use case)
// hides everything under print media except .print-area and its children — so
// without this wrapper, Playwright's page.pdf() (which renders using print
// media) would produce a blank document. Page numbers and the per-page
// source-note footer come from that script's displayHeaderFooter option, not
// CSS, since headless Chromium's print-to-PDF doesn't support paged-media
// margin boxes. Each <Page> below becomes its own PDF page via the CSS
// break-before property, which Chromium's print path does support.
export const metadata: Metadata = pageMetadata({
  title: `${REPORT_TITLE}. ${REPORT_SUBTITLE}.`,
  description: "Print-optimised source for the regional remote-access report PDF.",
  path: "/reports/remote-access-belgium-netherlands/print",
  noindex: true,
  siteName: "Software Lantern",
});

function Page({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      className={first ? "max-w-[720px] mx-auto px-6 py-6" : "max-w-[720px] mx-auto px-6 py-10"}
      style={first ? undefined : { breakBefore: "page" }}
    >
      {children}
    </div>
  );
}

export default function PrintSourcePage() {
  return (
    <main className="print-area" style={{ background: "#ffffff" }}>
      <Page first>
        <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: "760px" }}>
          <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9a3412" }}>
            {REPORT_EDITION}
          </p>
          <h1 className="font-sans font-semibold text-[40px] leading-[1.15] tracking-[-0.03em] mb-6 text-[#1a1d22] max-w-[560px]">
            {REPORT_TITLE}
          </h1>
          <p className="text-[20px] text-[#3f4b52] mb-10">{REPORT_SUBTITLE}</p>
          <p className="text-[13px] text-[#6b7280]">A regional guide with an original size-class analysis, not a market study.</p>
          <p className="text-[13px] text-[#6b7280] mt-2">Data extracted on {EUROSTAT_SOURCE.extractionDateDisplay}.</p>
        </div>
      </Page>

      <Page>
        <TableOfContents />
      </Page>

      <Page>
        <ExecutiveSummarySection />
      </Page>

      <Page>
        <CountryComparisonSection />
      </Page>

      <Page>
        <RegulatoryTimelineSection mode="static" />
      </Page>

      <Page>
        <ApproachesSection />
      </Page>

      <Page>
        <TradeoffsSection />
      </Page>

      <Page>
        <BuyerMatrixSection />
      </Page>

      <Page>
        <ScenariosSection />
      </Page>

      <Page>
        <ActionPlanSection />
      </Page>

      <Page>
        <SourcesMethodologySection />
      </Page>
    </main>
  );
}
