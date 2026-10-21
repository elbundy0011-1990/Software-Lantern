import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { QuestionnairePackForm } from "@/components/questionnaire-pack-form";
import { BreadcrumbStructuredData } from "@/components/breadcrumb-structured-data";
import { CHECKLIST_GROUPS, CHECKLIST_ROW_COUNT, CHECKLIST_SHEETS, checklistRowsByGroup } from "@/lib/vendor-checklist-rows";

export const metadata: Metadata = pageMetadata({
  title: "Vendor Demo Comparison Checklist",
  description:
    `A ${CHECKLIST_ROW_COUNT}-row spreadsheet for comparing remote-access vendors: what to ask, the evidence to request, a live demo script and an evidence summary. No suggested answers.`,
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
          <p className="text-[16px] leading-[1.7] text-[#3f4b52] mb-6 text-center">
            An editable spreadsheet for comparing remote-access vendors on evidence rather than on what
            they say in a demo. {CHECKLIST_ROW_COUNT} rows, grouped under the five dimensions of remote
            access governance plus fit and commercial, each with what to ask, the evidence to request,
            and what a weak answer looks like. No recommended vendor and no suggested &ldquo;right&rdquo;
            answers. See{" "}
            <Link href="/guides/what-to-compare-before-a-vendor-demo" className="font-semibold underline text-[#9a3412]">
              the guide
            </Link>{" "}
            for the fuller explanation.
          </p>
          <div className="mb-6 rounded border border-[#3f4b52]/[0.2] bg-white p-5">
            <p className="font-semibold text-[15px] text-[#1a1d22] mb-2">The rows, by dimension</p>
            <ul className="space-y-1.5 text-[14px] leading-[1.55] text-[#3f4b52]">
              {CHECKLIST_GROUPS.map((g) => (
                <li key={g.id}>
                  <strong className="text-[#1a1d22]">
                    {g.title} ({checklistRowsByGroup(g.id).length}):
                  </strong>{" "}
                  {g.summary}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8 rounded border border-[#3f4b52]/[0.2] bg-white p-5">
            <p className="font-semibold text-[15px] text-[#1a1d22] mb-2">What is in the file</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-[14px] leading-[1.55] text-[#3f4b52]">
              {CHECKLIST_SHEETS.map((sh) => (
                <li key={sh.name}>
                  <strong className="text-[#1a1d22]">{sh.name}.</strong> {sh.body}
                </li>
              ))}
            </ol>
            <p className="text-[13px] leading-[1.6] text-[#6b7280] mt-3">
              Guidance, not a security audit. Completing it does not show that any product or setup is secure.
            </p>
          </div>
          <QuestionnairePackForm product="checklist" />
        </div>
      </section>
    </main>
  );
}
