import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { SUPPLEMENTARY_EVIDENCE, sourceLineText } from "@/lib/compliance-ledger";
import { GuideStructuredData } from "@/components/guide-structured-data";

const TITLE = "What 'Proportionate' Means Under NIS2";
const DESCRIPTION = "Article 21(1), quoted directly, and the factors it names for assessing what counts as a proportionate NIS2 security measure.";
const H1 = "What “proportionate” means under NIS2";
const LAST_UPDATED_ISO = "2026-10-20";
const LAST_UPDATED_DISPLAY = "October 20, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/nis2-proportionate-measures",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const ul = "list-disc pl-6 mb-4 grid gap-1.5 text-[16px] leading-[1.7] text-[#3f4b52]";
const link = "font-semibold underline text-[#9a3412]";

export default function Nis2ProportionateGuidePage() {
  const entry = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-art21-1")!;
  const quote = entry.evidence.kind === "quote" ? entry.evidence.quotes[0] : null;
  const copyUrls = entry.evidence.kind === "quote" && entry.evidence.tier === "corroborated" ? entry.evidence.copyUrls : [];

  return (
    <main data-screen-label="NIS2 proportionate measures guide">
      <GuideStructuredData
        headline={H1}
        path="/guides/nis2-proportionate-measures"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: "/guides/nis2-proportionate-measures" },
        ]}
      />
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] mb-6">Last updated: {LAST_UPDATED_DISPLAY}</p>

          <p className={p}>
            NIS2 Article 21(1) requires security measures to be &ldquo;appropriate and
            proportionate&rdquo; to an entity&apos;s own risk, size, and exposure, not a fixed
            checklist applied identically to everyone. The article itself names the specific
            factors that determine proportionality, introducing the{" "}
            <Link href="/guides/nis2-supply-chain-and-remote-access" className={link}>
              Article 21(2) measures
            </Link>{" "}
            that follow. Verbatim:
          </p>
          {quote && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
          )}

          <h2 className={h2}>The factors the article itself names</h2>
          <p className={p}>Read plainly, the quote above names two sets of factors:</p>
          <ul className={ul}>
            <li>What measures should take into account: the state-of-the-art, relevant European
              and international standards where applicable, and the cost of implementation.</li>
            <li>
              What proportionality is assessed against: the entity&apos;s degree of exposure to
              risks, the entity&apos;s size, and the likelihood of incidents occurring and their
              severity, including their societal and economic impact.
            </li>
          </ul>
          <p className={p}>
            That is what the article says. It does not name a required product, architecture, or
            vendor, and this page adds nothing to it beyond restating the two lists above.
          </p>

          <h2 className={h2}>Source</h2>
          <p className={p}>
            <a href={entry.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(entry)}
            </a>
          </p>
          {copyUrls.length > 0 && (
            <p className="text-[13px] leading-[1.7] text-[#3f4b52]">
              Copies checked:{" "}
              {copyUrls.map((u, i) => (
                <span key={u}>
                  <a href={u} target="_blank" rel="noopener noreferrer" className={link}>
                    {new URL(u).hostname}
                  </a>
                  {i < copyUrls.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}

          <h2 className={h2}>Related guides</h2>
          <p className={p}>
            <Link href="/guides/nis2-supply-chain-and-remote-access" className={link}>
              NIS2 supply chain and remote access, explained
            </Link>{" "}
            and{" "}
            <Link href="/guides/nis2-small-and-micro-manufacturers" className={link}>
              NIS2 for small and micro manufacturers
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
