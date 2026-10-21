import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import {
  HowToRead,
  TableOfContents,
  BriefingSection,
  SprawlSection,
  FailuresSection,
  AssessmentGrid,
  ArchitecturesSection,
  RegulationIntro,
  RegulationBlockSection,
  BeneluxAndExcluded,
  IncidentsSection,
  PlanSection,
  ContextSection,
  MatrixAppendix,
  MethodAppendix,
} from "@/components/whitepaper/report-sections";
import { REPORT_TITLE, REPORT_SUBTITLE, REPORT_EDITION, DISCLAIMER } from "@/lib/whitepaper-content";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";

// The full print/PDF source for the regional report. Lives under app/(print)/,
// not app/(ot)/, so it inherits no header, footer, or nav (see app/(print)/
// layout.tsx). Never linked, never in the sitemap, always noindex: it exists
// only for scripts/render-whitepaper-pdf.mjs to open with Playwright and print.
//
// Wrapped in .print-area because app/globals.css hides everything else under
// print media. Each <Page> starts a new PDF page via break-before; page numbers
// and the footer come from the render script's displayHeaderFooter option.
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
      className={first ? "max-w-[880px] mx-auto px-6 py-4" : "max-w-[880px] mx-auto px-6 py-6"}
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
        <div className="flex flex-col justify-center" style={{ minHeight: "1100px" }}>
          <p className="mb-6 text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: "#9a3412" }}>
            {REPORT_EDITION}
          </p>
          <h1 className="font-sans font-semibold text-[46px] leading-[1.08] tracking-[-0.03em] mb-5 text-[#1a1d22] max-w-[600px]">
            {REPORT_TITLE}
          </h1>
          <p className="text-[20px] leading-[1.4] text-[#3f4b52] mb-12 max-w-[560px]">{REPORT_SUBTITLE}</p>
          <div className="border-t-2 pt-5 max-w-[560px]" style={{ borderColor: "#9a3412" }}>
            <p className="text-[13px] text-[#3f4b52]">
              Software Lantern. Sources checked as of {EUROSTAT_SOURCE.extractionDateDisplay}.
            </p>
            <p className="text-[12px] text-[#6b7280] mt-2">{DISCLAIMER}</p>
          </div>
        </div>
      </Page>

      <Page>
        <HowToRead />
        <div className="mt-6">
          <TableOfContents />
        </div>
      </Page>

      <Page>
        <BriefingSection />
      </Page>

      <Page>
        <SprawlSection interactive={false} />
      </Page>

      <Page>
        <FailuresSection />
      </Page>

      <Page>
        <AssessmentGrid />
        <div className="mt-8">
          <ArchitecturesSection />
        </div>
      </Page>

      <Page>
        <RegulationIntro />
        <RegulationBlockSection id="nis2" />
      </Page>

      <Page>
        <RegulationBlockSection id="cra" />
      </Page>

      <Page>
        <RegulationBlockSection id="machinery" />
      </Page>

      <Page>
        <BeneluxAndExcluded />
      </Page>

      <Page>
        <IncidentsSection />
      </Page>

      <Page>
        <PlanSection />
      </Page>

      <Page>
        <ContextSection />
      </Page>

      <Page>
        <MatrixAppendix />
      </Page>

      <Page>
        <MethodAppendix />
      </Page>
    </main>
  );
}
