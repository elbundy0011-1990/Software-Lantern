import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { COMPLIANCE_LEDGER } from "@/lib/compliance-ledger";

const TITLE = "The Machinery Regulation's Cybersecurity Requirements";
const DESCRIPTION = "What Regulation (EU) 2023/1230 means for cybersecurity and safety in machinery, with sources cited.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/machinery-regulation-cybersecurity",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";

export default function MachineryRegulationGuidePage() {
  const entry = COMPLIANCE_LEDGER.find((e) => e.id === "machinery-regulation")!;

  return (
    <main data-screen-label="Machinery Regulation cybersecurity guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            The Machinery Regulation&apos;s cybersecurity requirements
          </h1>

          <p className={p}>
            Regulation (EU) 2023/1230 replaces the Machinery Directive 2006/42/EC.{" "}
            <a href={entry.citationUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline text-[#9a3412]">
              {entry.citationLabel}
            </a>
          </p>

          <h2 className={h2}>What&apos;s new</h2>
          <p className={p}>
            For the first time, the regulation adds cybersecurity-related essential health and
            safety requirements for machinery. Its application date and the specific requirements
            are pending primary-source verification against the official text linked above.
          </p>

          <h2 className={h2}>It&apos;s a Regulation, not a Directive</h2>
          <p className={p}>
            Unlike NIS2 (a Directive, transposed differently by each member state, as the
            Netherlands&apos;, Belgium&apos;s, and Luxembourg&apos;s different dates show), this is a
            Regulation: directly binding in all EU member states at once, with no national
            transposition step.
          </p>

          <h2 className={h2}>How this differs from the Cyber Resilience Act</h2>
          <p className={p}>
            The Machinery Regulation is a safety regulation, newly extended to cover cyberattacks
            that create a physical hazard. The CRA is a cybersecurity regulation for products with
            digital elements generally. A connected machine can be covered by both, for different
            reasons, at the same time.
          </p>

          <div className="mt-10 text-center flex flex-wrap justify-center gap-3">
            <Link href="/checker" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block" style={{ background: "#9a3412" }}>
              Check your situation →
            </Link>
            <Link href="/enquiry" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-[#1a1d22] border border-[#3f4b52]/[0.3] inline-block">
              Send an enquiry
            </Link>
          </div>

          <hr className="border-[#3f4b52]/[0.2] my-10" />
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] italic">
            This is a general guide based on published sources, not legal advice. Confirm your
            specific obligations with a qualified advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
