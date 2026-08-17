import Link from "next/link";
import type { Metadata } from "next";
import { BATTERY_PASSPORT_DEADLINE } from "@/lib/battery-passport-dates";
import { pageMetadata } from "@/lib/metadata";
import { TagIcon, ExchangeIcon, ScaleIcon } from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "Why the Battery Passport Software Market Is So Fragmented | Software Lantern",
  description:
    "Run a battery passport software comparison search and you'll get market-research reports and vendor sites that all claim to do everything. Here's why the market is genuinely fragmented, and what that means before you start comparing providers.",
  path: "/resources/blog/why-battery-passport-software-market-is-fragmented",
});

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4";
const h3 = "font-sans font-semibold text-[19px] leading-[1.2] tracking-[-0.01em] mt-12 mb-4";
const p = "text-[16px] leading-[1.7] text-[#3d4653] mb-4";
const link = "text-[#4f46e5] font-semibold";

function IconCard({
  icon,
  title,
  children,
  accent = "#4f46e5",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {icon}
        </span>
        <h3 className="font-sans font-semibold text-[17px] text-[#0d1117]">{title}</h3>
      </div>
      <p className="text-[15px] leading-[1.6] text-[#5c6573]">{children}</p>
    </div>
  );
}

export default function BatteryPassportFragmentationArticlePage() {
  return (
    <main data-screen-label="Blog: why battery passport software market is fragmented">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <p className="mb-8 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span>{" "}
            <Link href="/resources/blog" className="text-[#4f46e5] font-semibold">
              Blog
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Battery Passport software market structure
          </p>

          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3">
            Why the Battery Passport Software Market Is So Fragmented
          </h1>
          <p className="text-[13px] font-semibold text-[#5c6573] mb-6">
            Written by Johannes Cornelis de Boer, founder of Software Lantern
          </p>
          <p className="text-[15px] text-[#79818f] mb-14">
            This is about the shape of the market, not how to evaluate a specific provider. Once
            you&apos;re ready for that step, our{" "}
            <Link href="/resources/blog/battery-passport-software-questions-to-ask-providers" className={link}>
              buyer&apos;s checklist and provider questions
            </Link>{" "}
            picks up from here.
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            Search for battery passport software and you don&apos;t get a clear picture, you get a
            pile of market-size reports, a handful of vendor sites that all describe themselves as
            covering everything, and one or two comparison articles that don&apos;t agree with each
            other. That&apos;s not bad luck. It&apos;s a fairly direct result of how this market
            actually formed.
          </p>

          <h2 className={h2}>What shows up when you search for this</h2>
          <p className={p}>
            A battery passport software comparison search tends to surface two very different kinds
            of content. One is paid market-research reports: forecasts, dollar figures, growth
            percentages, useful if you&apos;re sizing an industry, not much help if you&apos;re
            trying to figure out which platform fits your product. The other is vendor sites and a
            thin layer of comparison listicles, most of them written by or adjacent to one of the
            vendors being compared. Neither one is built to answer the question a buyer actually
            has, which is closer to: which of these were built to solve the part of this problem I
            actually have?
          </p>

          <h2 className={h2}>Three different starting points, one shared endpoint</h2>
          <p className={p}>
            The reason no single feature list captures this market cleanly is that these platforms
            didn&apos;t start in the same place. The EU Battery Regulation created one target,{" "}
            <strong>a compliant digital battery passport</strong>, but the software built to reach
            it grew out of at least three genuinely different starting points, each strongest at a
            different part of the underlying problem.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <IconCard icon={<TagIcon />} title="Passport-generation-first platforms">
              Built around assembling and publishing the passport record itself: the data model, the
              QR code or other data carrier, the unique identifier, the public and restricted views.
              Often the fastest route to a compliant, presentable passport. Depth on the data that
              feeds it, especially multi-tier supplier data, varies a lot between them.
            </IconCard>
            <IconCard icon={<ExchangeIcon />} title="Supply chain traceability-first platforms" accent="#047857">
              Grew out of chain-of-custody and multi-tier supplier data collection, sometimes with
              roots in materials or ESG traceability more broadly. Strongest at pulling verified data
              out of a supplier network, with the passport itself treated as one output among several
              rather than the core product.
            </IconCard>
            <IconCard icon={<ScaleIcon />} title="Compliance and reporting-first platforms" accent="#3730a3">
              Grew out of carbon accounting or broader ESG/regulatory reporting tools. Strongest at
              footprint methodology and audit-defensible documentation. Real-time, in-field data like
              State of Health, which changes throughout a battery&apos;s life rather than at the
              point of manufacture, is often a newer, thinner part of what they do.
            </IconCard>
          </div>

          <p className={p}>
            None of that is a ranking. It&apos;s just three different histories converging on the
            same regulation. And because every one of these platforms now markets itself as covering
            the full passport, not just the piece it started with, the origin that actually predicts
            what a platform is strongest at rarely shows up anywhere on its homepage.
          </p>

          <h3 className={h3}>A second, smaller axis: how it&apos;s deployed</h3>
          <p className={p}>
            Separately from what a platform was built to do well, some are pure cloud/SaaS products
            and others offer a self-hosted or on-premises option for companies with stricter internal
            IT or data-control requirements. This isn&apos;t as consistently documented across vendor
            sites as the three starting points above, so it&apos;s worth confirming directly with a
            provider rather than assuming it from their marketing, but it&apos;s a real second
            dimension of variation on top of the first.
          </p>

          <h2 className={h2}>Why &ldquo;just Google it&rdquo; doesn&apos;t produce a clear answer</h2>
          <p className={p}>
            Put those two things together and the outside view makes sense. Market-research reports
            answer a question about industry size, not fit. Vendor sites all describe full coverage,
            because none of them wants to be read as narrower than a competitor. And most public
            comparison content is written from inside the industry, which means it rarely draws the
            origin-based distinction above, since doing so would mean saying plainly that a given
            platform is weaker in the area it didn&apos;t start in. A generic &ldquo;best of&rdquo;
            list smooths that over rather than surfacing it.
          </p>

          <h2 className={h2}>What this means before you start comparing</h2>
          <p className={p}>
            {BATTERY_PASSPORT_DEADLINE.scope} must carry a digital battery passport from{" "}
            <strong>{BATTERY_PASSPORT_DEADLINE.display}</strong>, and that deadline applies the same
            way regardless of which kind of platform you end up looking at. What changes is how you
            read what&apos;s in front of you once you start looking: &ldquo;battery passport
            software&rdquo; isn&apos;t one product category with minor feature differences between
            entries, it&apos;s three different starting points that have converged on the same
            regulation, plus a separate deployment question layered on top. The same demo call can
            look completely different depending on which of those a given provider actually started
            as.
          </p>
          <p className={p}>
            Our{" "}
            <Link href="/battery-passport" className={link}>
              Battery Passport page
            </Link>{" "}
            is the place to start working out where you sit in the value chain and what your
            passport actually needs to cover. Once you&apos;ve got that, the{" "}
            <Link href="/resources/blog/battery-passport-software-questions-to-ask-providers" className={link}>
              buyer&apos;s checklist and provider questions
            </Link>{" "}
            walks through exactly what to ask on a call, including questions that will help surface
            which starting point a given provider actually came from.
          </p>

          <p className={`${p} text-[15px] text-[#79818f]`}>
            This is a general guide to how the market is structured, not legal advice and not a
            claim about any specific provider. Confirm your own regulatory obligations against the
            regulation itself or with a qualified advisor. See our{" "}
            <Link href="/resources/regulations/battery-passport" className={link}>
              Battery Passport regulation explainer
            </Link>{" "}
            for what the law itself requires.
          </p>

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Tell us where you sit, we&apos;ll handle the rest
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Instead of working out which starting point each vendor came from yourself, tell us
              about your product and requirements. We&apos;ll publish your brief to battery passport
              software providers in the category, and the ones who believe they&apos;re a genuine fit
              will respond.
            </p>
            <Link
              href={`/finder?category=${encodeURIComponent("Digital Battery Passport (DBP)")}`}
              className="inline-block bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              See software providers that handle Battery Passport compliance →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
