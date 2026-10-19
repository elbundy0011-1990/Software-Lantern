import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { OFFICIAL_SCOPE_TOOLS } from "@/lib/nis2-dates";
import { COMPLIANCE_LEDGER, SUPPLEMENTARY_EVIDENCE } from "@/lib/compliance-ledger";

const TITLE = "NIS2 Supply Chain and Remote Access, Explained";
const DESCRIPTION = "What NIS2 Article 21(2) actually requires for supply-chain security and remote access, with sources cited, and what it does not require.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/nis2-supply-chain-and-remote-access",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const ul = "list-disc pl-6 mb-4 grid gap-1.5 text-[16px] leading-[1.7] text-[#3f4b52]";
const link = "font-semibold underline text-[#9a3412]";

export default function SupplyChainArticlePage() {
  const article21 = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-article-21-2-d")!;
  const article21Quote = article21.quotes[0];
  const nl = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-nl")!;
  const be = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-be")!;
  const lu = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-lu")!;

  return (
    <main data-screen-label="NIS2 supply chain and remote access guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            NIS2 supply chain and remote access, explained
          </h1>

          <p className={p}>
            This page answers one specific question plainly: what does NIS2 actually require about
            supply-chain security and remote access, and what does it not require? It does not name
            or recommend any specific product or vendor.
          </p>

          <h2 className={h2}>What NIS2 requires (Article 21(2))</h2>
          <p className={p}>
            Directive (EU) 2022/2555 (&ldquo;NIS2&rdquo;), Article 21(2), requires in-scope entities
            to take minimum cybersecurity risk-management measures. Verbatim:
          </p>
          <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-4">
            &ldquo;{article21Quote.text}&rdquo;
          </blockquote>
          <p className={p}>
            Point (d), supply chain security, covers a machine builder or integrator with remote
            access into its customer&apos;s systems.{" "}
            <a href={article21.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Source: {article21.citationLabel}, checked {article21.lastVerifiedDisplay}
            </a>
          </p>

          <h2 className={h2}>What NIS2 does not require</h2>
          <p className={p}>
            NIS2 does not specify any particular technology. It does not name a required product, architecture, or
            vendor, for remote access or anything else. It requires &ldquo;appropriate and
            proportionate&rdquo; measures and leaves the specific implementation to the entity,
            based on its own risk assessment.
          </p>

          <h2 className={h2}>Who this actually reaches</h2>
          <ul className={ul}>
            <li>
              If a machine builder or manufacturer is itself in scope (generally: medium or large,
              in a covered sector such as machinery and equipment manufacturing), it has its own
              direct obligations under Article 21(2), including assessing its own suppliers.
            </li>
            <li>
              Separately, if a machine builder&apos;s customer is in scope, that customer has its
              own obligation to assess the machine builder&apos;s security practices as a supplier
              with system access. This can create commercial pressure on the machine builder, even
              when it is generally outside NIS2&apos;s direct scope on size. That pressure is
              contractual and commercial, not a separate legal requirement under NIS2 itself.
            </li>
          </ul>

          <h2 className={h2}>NIS2 across the Netherlands, Belgium, and Luxembourg</h2>
          <p className={p}>
            NIS2 is a Directive: each country transposes it into its own national law, on its own
            date.
          </p>

          <p className={p}><strong>Netherlands</strong> &ndash; Cyberbeveiligingswet, {nl.citationLabel}:</p>
          {nl.evidence.kind === "quote" && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-2">
              &ldquo;{nl.evidence.quotes[0].text}&rdquo;
            </blockquote>
          )}
          {nl.evidence.kind === "quote" && nl.evidence.quotes[0].translation && (
            <blockquote className="border-l-4 border-[#3f4b52]/[0.25] pl-4 text-[15px] leading-[1.7] text-[#3f4b52] mb-2">
              Our translation: &ldquo;{nl.evidence.quotes[0].translation}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            <a href={nl.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Source: {nl.citationLabel}, checked {nl.lastVerifiedDisplay}
            </a>
          </p>

          <p className={p}><strong>Belgium</strong> &ndash; {be.citationLabel}:</p>
          {be.evidence.kind === "quote" && (
            <blockquote className="border-l-4 border-[#9a3412]/40 pl-4 italic text-[16px] leading-[1.7] text-[#3f4b52] mb-2">
              &ldquo;{be.evidence.quotes[0].text}&rdquo;
            </blockquote>
          )}
          {be.evidence.kind === "quote" && be.evidence.quotes[0].translation && (
            <blockquote className="border-l-4 border-[#3f4b52]/[0.25] pl-4 text-[15px] leading-[1.7] text-[#3f4b52] mb-2">
              Our translation: &ldquo;{be.evidence.quotes[0].translation}&rdquo;
            </blockquote>
          )}
          <p className={p}>
            <a href={be.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Source: {be.citationLabel}, checked {be.lastVerifiedDisplay}
            </a>
          </p>

          <p className={p}><strong>Luxembourg</strong> &ndash; {lu.citationLabel}:</p>
          {lu.evidence.kind === "record" && (
            <ul className={ul}>
              {lu.evidence.fields.map((f) => (
                <li key={f.label}>{f.label}: {f.value}</li>
              ))}
            </ul>
          )}
          <p className={p}>
            <a href={lu.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              Source: {lu.citationLabel}, checked {lu.lastVerifiedDisplay}
            </a>
            {lu.subjectUrl && (
              <>
                {" "}&middot;{" "}
                <a href={lu.subjectUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  {lu.subjectLabel}
                </a>
              </>
            )}
          </p>

          <h2 className={h2}>Check your own situation</h2>
          <p className={p}>
            <Link href="/checker" className={link}>Use the checker</Link>, or go directly to your
            country&apos;s own official tool, which covers every sector (this guide and the checker
            only cover machine builders, operators, and integrators):
          </p>
          <ul className={ul}>
            <li>
              <a href={OFFICIAL_SCOPE_TOOLS.NL.url} target="_blank" rel="noopener noreferrer" className={link}>
                {OFFICIAL_SCOPE_TOOLS.NL.name}
              </a>{" "}
              (Netherlands)
            </li>
            <li>
              <a href={OFFICIAL_SCOPE_TOOLS.BE.url} target="_blank" rel="noopener noreferrer" className={link}>
                {OFFICIAL_SCOPE_TOOLS.BE.name}
              </a>{" "}
              (Belgium)
            </li>
          </ul>

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
