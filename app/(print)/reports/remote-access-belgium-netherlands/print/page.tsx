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
  FrameworksSection,
  RegulationIntro,
  RegulationSummary,
  RegulationQuotes,
  BeneluxAndExcluded,
  IncidentsSection,
  PlanSection,
  ContextSection,
  MatrixAppendix,
  RegisterAppendix,
  MethodAppendix,
} from "@/components/whitepaper/report-sections";
import { REPORT_TITLE, REPORT_SUBTITLE, REPORT_EDITION, READERS, DIMENSIONS, DISCLAIMER } from "@/lib/whitepaper-content";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";
import { LANTERN_VIEWBOX, LANTERN_PATHS } from "@/lib/lantern-paths";
// The full print/PDF source for the regional report. Lives under app/(print)/,
// not app/(ot)/, so it inherits no header, footer, or nav (see app/(print)/
// layout.tsx). Never linked, never in the sitemap, always noindex: it exists
// only for scripts/render-whitepaper-pdf.mjs to open with Playwright and print.
//
// Wrapped in .print-area because app/globals.css hides everything else under
// print media. Each <Page> starts a new PDF page via break-before; page numbers
// and the footer come from the render script's displayHeaderFooter option. The
// cover ([data-cover]) is full bleed: the render script prints it on its own,
// with no margins and no footer, and joins it to the rest.
export const metadata: Metadata = pageMetadata({
  title: `${REPORT_TITLE}. ${REPORT_SUBTITLE}.`,
  description: "Print-optimised source for the regional remote-access report PDF.",
  path: "/reports/remote-access-belgium-netherlands/print",
  noindex: true,
  siteName: "Software Lantern",
});

const ACCENT = "#9a3412";
const INK = "#1a1d22";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[880px] mx-auto px-6 py-6" style={{ breakBefore: "page" }}>
      {children}
    </div>
  );
}

// Suppliers on the left, sites on the right, one line per supplier-site pair:
// the access-sprawl idea of Part 2 as a picture. Decorative, no figures.
function SprawlMotif() {
  const suppliers = [0, 1, 2, 3, 4, 5].map((i) => 30 + i * 44);
  const sites = [0, 1, 2].map((i) => 80 + i * 88);
  return (
    <svg viewBox="0 0 880 290" width="100%" aria-hidden="true">
      {suppliers.flatMap((sy, si) =>
        sites.map((ty, ti) => (
          <path
            key={`${si}-${ti}`}
            d={`M 70 ${sy} C 400 ${sy}, 480 ${ty}, 810 ${ty}`}
            fill="none"
            stroke={si === 2 && ti === 1 ? ACCENT : "#ffffff"}
            strokeOpacity={si === 2 && ti === 1 ? 1 : 0.22}
            strokeWidth={si === 2 && ti === 1 ? 2.5 : 1}
          />
        )),
      )}
      {suppliers.map((y) => (
        <circle key={y} cx={70} cy={y} r={7} fill="#d6d3cc" />
      ))}
      {sites.map((y) => (
        <rect key={y} x={803} y={y - 14} width={28} height={28} rx={3} fill={ACCENT} />
      ))}
      <text x={70} y={286} textAnchor="middle" fontSize={12} fill="#a8a29e" letterSpacing="1.5">SUPPLIERS</text>
      <text x={817} y={286} textAnchor="middle" fontSize={12} fill="#a8a29e" letterSpacing="1.5">SITES</text>
    </svg>
  );
}

// Exactly one A4 page at the render script's 0.8 scale with zero margins
// (992 x 1403 CSS px), so it never spills onto a second page.
function Cover() {
  return (
    <section
      data-cover
      className="flex flex-col"
      style={{ height: "1400px", background: INK, color: "#ffffff", padding: "72px 84px 64px" }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-3">
          <svg width={27} height={36} viewBox={LANTERN_VIEWBOX} aria-hidden="true">
            <path d={LANTERN_PATHS.ring} fill={ACCENT} />
            <path d={LANTERN_PATHS.hood} fill={ACCENT} />
            <path d={LANTERN_PATHS.body} fill={ACCENT} />
            <path d={LANTERN_PATHS.flame} fill="#f6f5f1" />
            <path d={LANTERN_PATHS.footLeft} fill={ACCENT} />
            <path d={LANTERN_PATHS.footRight} fill={ACCENT} />
          </svg>
          <span className="font-sans font-semibold text-[22px]">Software Lantern</span>
        </span>
        <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#d6d3cc]">Regional report</span>
      </div>

      <div className="mt-[150px]">
        <div className="h-[6px] w-[96px] mb-8" style={{ background: ACCENT }} />
        <p className="text-[15px] font-bold uppercase tracking-[0.12em] mb-5 text-[#f0b48f]">{REPORT_EDITION}</p>
        <h1 className="font-sans font-semibold text-[64px] leading-[1.04] tracking-[-0.03em] max-w-[720px]">{REPORT_TITLE}</h1>
        <p className="text-[24px] leading-[1.35] text-[#d6d3cc] mt-6 max-w-[680px]">{REPORT_SUBTITLE}</p>
      </div>

      <div className="mt-auto">
        <SprawlMotif />
        <div className="flex flex-wrap gap-2 mt-8">
          {DIMENSIONS.map((d) => (
            <span key={d.id} className="rounded-full border border-white/[0.3] px-4 py-1.5 text-[14px] text-[#f6f5f1]">
              {d.name}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[1.6fr_1fr] gap-10 mt-10 pt-6 border-t border-white/[0.2] text-[13px] leading-[1.55] text-[#d6d3cc]">
          <p>{READERS}</p>
          <div>
            <p>Belgium and the Netherlands</p>
            <p>Sources checked as of {EUROSTAT_SOURCE.extractionDateDisplay}</p>
          </div>
        </div>
        <p className="text-[11px] leading-[1.5] text-[#a8a29e] mt-5">{DISCLAIMER}</p>
      </div>
    </section>
  );
}

export default function PrintSourcePage() {
  return (
    // No .print-area padding: the cover is full bleed, and each <Page> pads itself.
    <main className="print-area" style={{ background: "#ffffff", padding: 0 }}>
      <Cover />

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
        <FrameworksSection />
      </Page>

      <Page>
        <RegulationIntro />
        <RegulationSummary id="nis2" />
      </Page>
      <Page>
        <RegulationQuotes id="nis2" />
      </Page>

      <Page>
        <RegulationSummary id="cra" />
      </Page>
      <Page>
        <RegulationQuotes id="cra" />
      </Page>

      <Page>
        <RegulationSummary id="machinery" />
      </Page>
      <Page>
        <RegulationQuotes id="machinery" />
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
        <MatrixAppendix />
      </Page>

      <Page>
        <RegisterAppendix />
      </Page>

      <Page>
        <ContextSection />
      </Page>

      <Page>
        <MethodAppendix />
      </Page>
    </main>
  );
}
