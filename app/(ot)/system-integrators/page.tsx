import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { ComplianceLedger } from "@/components/compliance-ledger";

export const metadata: Metadata = pageMetadata({
  title: "NIS2, CRA & Machinery Regulation for System Integrators",
  description:
    "What NIS2, the Cyber Resilience Act, and the Machinery Regulation mean for system integrators installing and servicing equipment in the Netherlands, Belgium, and Luxembourg.",
  path: "/system-integrators",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function SystemIntegratorsPage() {
  return (
    <main data-screen-label="System integrators audience page">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-14">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-5 text-[#1a1d22]">
            For system integrators
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-8">
            As an integrator, you can sit on both sides of these rules: like a machine builder,
            your own remote-access practices may be assessed by in-scope customers under NIS2&apos;s
            supply-chain rules, and depending on exactly what you supply, you may also face product-
            level obligations directly.
          </p>
          <ComplianceLedger limit={3} />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-14">
          <h2 className="font-sans font-semibold text-[24px] mb-4 text-[#1a1d22]">
            Where you sit
          </h2>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52] mb-4">
            If you install or service connected equipment at a customer&apos;s site, your remote-
            access practices are exactly what an in-scope customer is expected to assess about you
            under NIS2 Article 21(2)(d), whether or not your own company is itself in NIS2&apos;s
            scope. Your own organizational NIS2 status depends on your company&apos;s size and
            sector, same general thresholds as everyone else.
          </p>
          <p className="text-[15px] leading-[1.6] text-[#3f4b52]">
            If you modify, rebrand, or substantially integrate equipment such that you&apos;re
            effectively placing a new product on the market, the Cyber Resilience Act&apos;s and
            Machinery Regulation&apos;s manufacturer obligations can apply to you directly, not
            just to the original builder. Confirm your specific situation with a qualified advisor.
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
