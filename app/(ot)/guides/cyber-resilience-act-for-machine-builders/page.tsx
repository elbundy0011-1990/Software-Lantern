import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { COMPLIANCE_LEDGER } from "@/lib/compliance-ledger";

const TITLE = "The Cyber Resilience Act for Machine Builders";
const DESCRIPTION = "What Regulation (EU) 2024/2847 requires of manufacturers of connected machinery, with sources cited.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/cyber-resilience-act-for-machine-builders",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

export default function CraGuidePage() {
  const reporting = COMPLIANCE_LEDGER.find((e) => e.id === "cra-reporting")!;

  return (
    <main data-screen-label="CRA guide for machine builders">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            The Cyber Resilience Act for machine builders
          </h1>

          <p className={p}>
            Regulation (EU) 2024/2847, &ldquo;horizontal cybersecurity requirements for products
            with digital elements,&rdquo; adopted 23 October 2024, in force 12 November 2024.
          </p>

          <h2 className={h2}>Dates that matter</h2>
          <p className={p}>
            The regulation phases in vulnerability/incident reporting obligations ahead of full
            application. Specific dates and exact article wording are pending primary-source
            verification against the official text.{" "}
            <a href={reporting.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {reporting.citationLabel}
            </a>
          </p>

          <h2 className={h2}>Scope</h2>
          <p className={p}>
            The CRA applies to products with digital elements whose intended or foreseeable use
            includes a direct or indirect connection to a device or network. Industrial control
            systems and connected machinery fall within that description. Excluded: medical
            devices, motor vehicles, civil aviation, marine equipment, and defence.
          </p>

          <h2 className={h2}>Why remote access matters here specifically</h2>
          <p className={p}>
            Several sources discussing the CRA&apos;s application to machinery describe remote
            access functionality on a machine as a security-critical component: a weak or
            uncertified remote connection is treated as a way the product itself fails to be
            secure by design, with responsibility resting on the manufacturer. The regulation does
            not name a required technology for this, such as a VPN or a specific gateway product.
          </p>

          <h2 className={h2}>How this differs from NIS2</h2>
          <p className={p}>
            NIS2 regulates your organization. The CRA regulates your product. A machine builder can
            be subject to one, the other, both, or neither, depending on its own size and sector
            (NIS2) versus simply placing a connected product on the EU market (the CRA, which isn&apos;t
            gated by company size the way NIS2 is).
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
