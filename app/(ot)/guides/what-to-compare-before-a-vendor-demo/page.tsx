import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";
import { CHECKLIST_GROUPS, CHECKLIST_ROW_COUNT, DEMO_SCENARIOS, checklistRowsByGroup } from "@/lib/vendor-checklist-rows";

const TITLE = "What to Compare Before a Vendor Demo";
const DESCRIPTION = `What to compare before a remote-access vendor demo: ${CHECKLIST_ROW_COUNT} questions under identity, scope, lifecycle, evidence, availability, and fit, with a free comparison checklist.`;
const H1 = "What to compare before a vendor demo";
const LAST_UPDATED_ISO = "2026-10-21";
const LAST_UPDATED_DISPLAY = "October 21, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/what-to-compare-before-a-vendor-demo",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[22px] leading-[1.2] tracking-[-0.02em] mt-10 mb-2 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

export default function VendorDemoChecklistGuidePage() {
  return (
    <main data-screen-label="What to compare before a vendor demo guide">
      <GuideStructuredData
        headline={H1}
        path="/guides/what-to-compare-before-a-vendor-demo"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: "/guides/what-to-compare-before-a-vendor-demo" },
        ]}
      />
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] mb-6">Last updated: {LAST_UPDATED_DISPLAY}</p>

          <p className={p}>
            A demo tends to show what a remote-access product does well. The questions below are
            what&apos;s worth asking about directly, so the comparison covers what a demo doesn&apos;t
            always surface on its own. They are grouped under five dimensions of remote access
            governance (identity, scope, lifecycle, evidence and availability) plus fit and
            commercial, the same grouping as the{" "}
            <Link href="/reports/remote-access-belgium-netherlands" className={link}>
              regional report
            </Link>
            . This page doesn&apos;t name or recommend any specific product.
          </p>

          {CHECKLIST_GROUPS.map((g) => (
            <div key={g.id}>
              <h2 className={h2}>{g.title}</h2>
              <p className={p}>{g.summary}</p>
              <ul className="list-disc pl-5 space-y-1 mb-4 text-[16px] leading-[1.6] text-[#3f4b52]">
                {checklistRowsByGroup(g.id).map((r) => (
                  <li key={r.id}>{r.askTheVendor}</li>
                ))}
              </ul>
            </div>
          ))}

          <h2 className={h2}>Ask to see it, not to hear about it</h2>
          <p className={p}>
            A claim in a meeting is not the same as seeing it work. Ask each vendor to run these live,
            on a system you direct:
          </p>
          <ol className="list-decimal pl-5 space-y-1 mb-4 text-[16px] leading-[1.6] text-[#3f4b52]">
            {DEMO_SCENARIOS.map((d) => (
              <li key={d.id}>{d.title}</li>
            ))}
          </ol>

          <div className="mt-10 rounded border border-[#3f4b52]/[0.2] bg-[#f6f5f1] p-6 text-center">
            <p className="font-semibold text-[17px] mb-2 text-[#1a1d22]">
              Get the full comparison checklist
            </p>
            <p className="text-[14px] text-[#3f4b52] mb-4 max-w-[480px] mx-auto">
              A spreadsheet with all {CHECKLIST_ROW_COUNT} rows above: why each one matters, what to
              ask, the evidence to request, what a weak answer looks like and default priorities by
              buyer type, plus three vendor columns with an evidence status, the demo script, and a
              summary of the evidence per vendor.
            </p>
            <Link
              href="/vendor-checklist"
              className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block"
              style={{ background: "#9a3412" }}
            >
              Get the checklist
            </Link>
          </div>

          <h2 className={h2}>Related guides</h2>
          <p className={p}>
            <Link href="/guides/remote-access-approaches" className={link}>
              Remote access approaches for machines, compared
            </Link>{" "}
            and{" "}
            <Link href="/guides/customer-security-questionnaire" className={link}>
              Preparing to answer a customer&apos;s security questionnaire
            </Link>
            .
          </p>

          <div className="mt-10 text-center">
            <Link href="/checker" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block" style={{ background: "#9a3412" }}>
              Check your situation →
            </Link>
            <p className="mt-3 text-[14px] text-[#3f4b52]">
              It takes about 2 minutes and covers NIS2, the Cyber Resilience Act, and the Machinery
              Regulation for machine builders, factory operators, and system integrators in the
              Netherlands, Belgium, and Luxembourg.
            </p>
          </div>

          <hr className="border-[#3f4b52]/[0.2] my-10" />
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] italic">
            This is a general guide, not legal or security advice, and does not name or recommend
            any specific product. Confirm what fits your own situation with a qualified advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
