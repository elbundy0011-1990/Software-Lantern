import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { COMPLIANCE_LEDGER, SUPPLEMENTARY_EVIDENCE, sourceLineText } from "@/lib/compliance-ledger";

const TITLE = "NIS2, the CRA, the Machinery Regulation, and IEC 62443: an Overview";
const DESCRIPTION =
  "How the four frameworks relate for a machine builder, factory operator, or system integrator, each citation linking to the fuller guide.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/regulation-overview",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";
const cell = "py-3 px-2 align-top";

export default function RegulationOverviewPage() {
  const nl = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-nl")!;
  const be = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-be")!;
  const lu = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-lu")!;
  const craScope = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "cra-scope-art2-1")!;
  const craReporting = COMPLIANCE_LEDGER.find((e) => e.id === "cra-reporting")!;
  const craFull = COMPLIANCE_LEDGER.find((e) => e.id === "cra-full")!;
  const machinery = COMPLIANCE_LEDGER.find((e) => e.id === "machinery-regulation")!;

  return (
    <main data-screen-label="Regulation overview guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            NIS2, the CRA, the Machinery Regulation, and IEC 62443
          </h1>

          <p className={p}>
            Four different frameworks, binding different things for different reasons. This page
            is a hub: a short table, then one short link out to each fuller guide. It restates no
            date or quote already covered there, it just points to them.
          </p>

          <div className="overflow-x-auto mb-4 -mx-1">
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-[#3f4b52]/[0.2]">
                  <th className={`${cell} font-semibold text-[#1a1d22]`}>Framework</th>
                  <th className={`${cell} font-semibold text-[#1a1d22]`}>Binds</th>
                  <th className={`${cell} font-semibold text-[#1a1d22]`}>Kind</th>
                </tr>
              </thead>
              <tbody className="text-[#3f4b52]">
                <tr className="border-b border-[#3f4b52]/[0.15]">
                  <td className={cell}>NIS2</td>
                  <td className={cell}>Your organization, if in scope</td>
                  <td className={cell}>Directive, transposed differently per country</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15]">
                  <td className={cell}>Cyber Resilience Act</td>
                  <td className={cell}>Your product, if it has digital elements</td>
                  <td className={cell}>Regulation, binds directly EU-wide</td>
                </tr>
                <tr className="border-b border-[#3f4b52]/[0.15]">
                  <td className={cell}>Machinery Regulation</td>
                  <td className={cell}>Your product, as a safety matter</td>
                  <td className={cell}>Regulation, binds directly EU-wide</td>
                </tr>
                <tr>
                  <td className={cell}>IEC 62443</td>
                  <td className={cell}>Whoever a customer or contract requires it of</td>
                  <td className={cell}>Voluntary standard, not a law</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className={h2}>NIS2</h2>
          <p className={p}>
            Already in force in{" "}
            <a href={nl.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              the Netherlands ({nl.display})
            </a>
            ,{" "}
            <a href={be.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Belgium ({be.display})
            </a>
            , and{" "}
            <a href={lu.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Luxembourg ({lu.display})
            </a>
            . See{" "}
            <Link href="/guides/nis2-supply-chain-and-remote-access" className={link}>
              NIS2 supply chain and remote access, explained
            </Link>{" "}
            and{" "}
            <Link href="/guides/nis2-small-and-micro-manufacturers" className={link}>
              NIS2 for small and micro manufacturers
            </Link>
            .
          </p>

          <h2 className={h2}>Cyber Resilience Act</h2>
          <p className={p}>
            Applies to products with digital elements.{" "}
            <a href={craScope.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(craScope)}
            </a>{" "}
            Article 14 reporting obligations apply from{" "}
            <strong>{craReporting.display}</strong>, full application from{" "}
            <strong>{craFull.display}</strong>. See{" "}
            <Link href="/guides/cyber-resilience-act-for-machine-builders" className={link}>
              The Cyber Resilience Act for machine builders
            </Link>
            .
          </p>

          <h2 className={h2}>Machinery Regulation</h2>
          <p className={p}>
            Applies from <strong>{machinery.display}</strong>. See{" "}
            <Link href="/guides/machinery-regulation-cybersecurity" className={link}>
              The Machinery Regulation&apos;s cybersecurity requirements
            </Link>
            .
          </p>

          <h2 className={h2}>IEC 62443</h2>
          <p className={p}>
            A voluntary standard, not a law. See{" "}
            <Link href="/guides/iec-62443-explained" className={link}>
              IEC 62443, explained
            </Link>{" "}
            and{" "}
            <Link href="/guides/iec-62443-remote-access" className={link}>
              IEC 62443 and remote access for machine builders
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
            This is a general guide based on published sources, not legal advice. Confirm your
            specific obligations with a qualified advisor.
          </p>
        </div>
      </section>
    </main>
  );
}
