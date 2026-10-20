import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { SUPPLEMENTARY_EVIDENCE, sourceLineText } from "@/lib/compliance-ledger";

const TITLE = "NIS2 for Small and Micro Manufacturers";
const DESCRIPTION =
  "What NIS2's own scope article says, quoted directly, for a small or micro machinery manufacturer.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/nis2-small-and-micro-manufacturers",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

export default function Nis2SmallMicroGuidePage() {
  const scope = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-scope-art2-1")!;
  const scopeQuote = scope.evidence.kind === "quote" ? scope.evidence.quotes[0] : null;
  const annex2 = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-annex2-5d")!;
  const annex2Quote = annex2.evidence.kind === "quote" ? annex2.evidence.quotes[0] : null;
  const importantEntities = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-important-entities-art3-2")!;
  const importantQuote = importantEntities.evidence.kind === "quote" ? importantEntities.evidence.quotes[0] : null;
  const supplyChain = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-article-21-2-d")!;
  const supplyChainQuote = supplyChain.evidence.kind === "quote" ? supplyChain.evidence.quotes[0] : null;

  return (
    <main data-screen-label="NIS2 small and micro manufacturers guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            NIS2 for small and micro manufacturers
          </h1>

          <p className={p}>
            This page quotes NIS2&apos;s own scope article directly, for a small or micro machinery
            manufacturer asking whether this Directive names them.
          </p>

          <h2 className={h2}>Who Article 2(1) names</h2>
          {scopeQuote && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
              &ldquo;{scopeQuote.text}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            Article 2(1) names entities that qualify as medium-sized, or exceed the ceilings for
            medium-sized, under Recommendation 2003/361/EC. It does not name small or micro
            enterprises.{" "}
            <a href={scope.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(scope)}
            </a>
          </p>

          <h2 className={h2}>Machinery manufacturing, by name</h2>
          {annex2Quote && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
              &ldquo;{annex2Quote.text}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            Machinery and equipment manufacturing is named directly in NIS2&apos;s Annex II.{" "}
            <a href={annex2.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(annex2)}
            </a>
          </p>

          <h2 className={h2}>&ldquo;Important entity,&rdquo; defined</h2>
          {importantQuote && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
              &ldquo;{importantQuote.text}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            This is the definition Article 3(2) gives for &ldquo;important entity,&rdquo; the status
            Article 2(1) and Annex II combine to generally produce for a medium or large machinery
            manufacturer.{" "}
            <a href={importantEntities.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(importantEntities)}
            </a>
          </p>

          <h2 className={h2}>What this doesn&apos;t settle</h2>
          <p className={p}>
            These four quotes are what Article 2(1), Annex II point 5(d), and Article 3(2) actually
            say. They don&apos;t, by themselves, state every exception or every national
            implementing law&apos;s own detail, and this page doesn&apos;t add any beyond what&apos;s
            quoted above.{" "}
            <Link href="/guides/nis2-supply-chain-and-remote-access" className={link}>
              NIS2 supply chain and remote access, explained
            </Link>{" "}
            covers the national transposition dates for the Netherlands, Belgium, and Luxembourg,
            each with its own citation.
          </p>

          <h2 className={h2}>Even outside this scope, a customer may still ask</h2>
          {supplyChainQuote && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
              &ldquo;{supplyChainQuote.text}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            Point (d) is one of the measures an in-scope entity must take. If your customer is
            itself in scope, this is the provision behind why it might ask you, its supplier, about
            your own remote-access security, even though Article 2(1) may not name you directly.{" "}
            <a href={supplyChain.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(supplyChain)}
            </a>
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
