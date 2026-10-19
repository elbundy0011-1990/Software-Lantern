import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { ComplianceLedger } from "@/components/compliance-ledger";

export const metadata: Metadata = pageMetadata({
  title: "NIS2, CRA & Machinery Regulation for Machine Builders",
  description:
    "What NIS2, the Cyber Resilience Act, and the Machinery Regulation mean for machine builders and manufacturers in the Netherlands, Belgium, and Luxembourg.",
  path: "/machine-builders",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function MachineBuildersPage() {
  return (
    <main data-screen-label="Machine builders audience page">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-14">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-5 text-[#1a1d22]">
            For machine builders and manufacturers
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-8">
            As a machine builder, you can face rules at two different levels: your organization
            (NIS2, if you&apos;re in scope), and your product (the Cyber Resilience Act and the
            Machinery Regulation, which generally apply to manufacturers regardless of company
            size). Remote access into the machines you build or service sits at the center of both.
          </p>
          <ComplianceLedger />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-14">
          <h2 className="font-sans font-semibold text-[24px] mb-4 text-[#1a1d22]">
            Your organization: NIS2
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52] mb-4">
            Machinery and equipment manufacturing sits in NIS2&apos;s Annex II, which generally
            produces &ldquo;important entity&rdquo; status for medium and large companies, not
            essential. A small or micro business is generally outside this organizational scope
            entirely, though its customers may still push supply-chain security expectations onto
            it commercially, which the checker covers in detail.
          </p>
          <h2 className="font-sans font-semibold text-[24px] mb-4 mt-10 text-[#1a1d22]">
            Your product: the Cyber Resilience Act and the Machinery Regulation
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52] mb-4">
            These two generally apply to manufacturers placing a connected product on the market,
            regardless of company size. The Cyber Resilience Act&apos;s vulnerability-reporting
            obligations begin, and the Machinery Regulation applies with no transition period,
            on the dates shown above. Remote-access functionality on a machine is treated as a
            security-critical component by sources discussing the CRA&apos;s application to
            connected machinery.
          </p>
          <p className="text-[14px] text-[#3f4b52]">
            Neither regulation names or requires a specific product or vendor.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-14 text-center">
          <Link
            href="/checker"
            className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block"
            style={{ background: "#9a3412" }}
          >
            Check your situation →
          </Link>
        </div>
      </section>
    </main>
  );
}
