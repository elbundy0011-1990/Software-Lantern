import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { ComplianceLedger } from "@/components/compliance-ledger";

export const metadata: Metadata = pageMetadata({
  title: "NIS2 for Factory & Plant Operators",
  description:
    "What NIS2 means for factory and plant operators in the Netherlands, Belgium, and Luxembourg, and how it affects vetting your suppliers' remote access.",
  path: "/factory-operators",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function FactoryOperatorsPage() {
  return (
    <main data-screen-label="Factory operators audience page">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-14">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-5 text-[#1a1d22]">
            For factory and plant operators
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-8">
            As an operator, NIS2 is the organizational rule most likely to reach you, if your
            sector and size put you in scope. If it does, one of its ten minimum measures is
            supply-chain security, which covers the machine builders, integrators, and service
            providers who have remote access into your systems.
          </p>
          <ComplianceLedger limit={3} />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-14">
          <h2 className="font-sans font-semibold text-[24px] mb-4 text-[#1a1d22]">
            Is your organization in scope?
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52] mb-4">
            NIS2 covers 18 sectors; this site doesn&apos;t attempt to classify every one of them
            (your country&apos;s official self-evaluation tool, linked from the checker, does
            that). Size is generally the first gate: a company under roughly 50 staff and €10m in
            turnover or balance sheet total is generally outside NIS2&apos;s scope entirely,
            regardless of sector.
          </p>
          <h2 className="font-sans font-semibold text-[24px] mb-4 mt-10 text-[#1a1d22]">
            If you are in scope: vetting remote access into your systems
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52] mb-4">
            Article 21(2)(d) requires assessing the security practices of your direct suppliers,
            including anyone with remote access to your machines for servicing. This is an
            organizational requirement on you as the operator, not a product requirement on your
            suppliers directly, though it will likely affect what you ask of them.
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
