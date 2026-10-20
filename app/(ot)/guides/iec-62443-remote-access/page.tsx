import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { GuideStructuredData } from "@/components/guide-structured-data";

const TITLE = "IEC 62443 and Remote Access for Machine Builders";
const DESCRIPTION =
  "A plain overview of how the voluntary IEC 62443 standard's general approach touches remote access, with public sources cited.";
const H1 = "IEC 62443 and remote access for machine builders";
const LAST_UPDATED_ISO = "2026-10-20";
const LAST_UPDATED_DISPLAY = "October 20, 2026";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/iec-62443-remote-access",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const ISA_OVERVIEW_URL = "https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards";

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline text-[#9a3412]";

export default function Iec62443RemoteAccessGuidePage() {
  return (
    <main data-screen-label="IEC 62443 and remote access guide">
      <GuideStructuredData
        headline={H1}
        path="/guides/iec-62443-remote-access"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: H1, path: "/guides/iec-62443-remote-access" },
        ]}
      />
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3 text-[#1a1d22]">
            {H1}
          </h1>
          <p className="text-[13px] leading-[1.7] text-[#3f4b52] mb-6">Last updated: {LAST_UPDATED_DISPLAY}</p>

          <p className={p}>
            <strong>IEC 62443 is a voluntary international standard, not a regulation.</strong> No
            EU law makes conformance to it mandatory by itself, though a customer or a contract may
            still require it. See{" "}
            <Link href="/guides/iec-62443-explained" className={link}>
              IEC 62443, explained
            </Link>{" "}
            for that distinction in full. This page is an overview of how the standard&apos;s
            general approach relates to remote access specifically, in plain terms, not a
            clause-by-clause reading of the standard&apos;s own text.
          </p>

          <h2 className={h2}>The general approach</h2>
          <p className={p}>
            IEC 62443 is a functional standard: it sets objectives for security performance rather
            than prescribing one specific technical solution. Its general approach, as the
            standard&apos;s own publisher describes it, is risk-based: it groups a system into
            zones with defined, controlled connections between them, and sets a target security
            level for each zone based on the risk it faces, rather than applying one fixed rule
            everywhere.{" "}
            <a href={ISA_OVERVIEW_URL} target="_blank" rel="noopener noreferrer" className={link}>
              Source: ISA, publisher of the ISA/IEC 62443 series
            </a>
          </p>

          <h2 className={h2}>Where remote access fits</h2>
          <p className={p}>
            A remote-access connection is one of the controlled paths this risk-based approach
            applies to. A customer asking about IEC 62443 conformance is generally asking how you
            manage that path: who it reaches, how it is controlled, and whether its risk has been
            assessed, rather than asking for a specific product or technology. This page
            deliberately does not quote or paraphrase the standard&apos;s own clause text, since
            IEC 62443 is a paid, licensed standard, not a freely published one like an EU
            regulation; for the standard&apos;s actual requirement wording, its publisher is the
            source, not a summary.
          </p>

          <h2 className={h2}>How this differs from NIS2, the CRA, and the Machinery Regulation</h2>
          <p className={p}>
            NIS2, the Cyber Resilience Act, and the Machinery Regulation are EU law: they bind
            whoever they apply to, regardless of whether that party has heard of them. IEC 62443 is
            a standard a customer, insurer, or contract can choose to require, but no EU law
            requires it by itself. A machine builder can face some or all of these at once, for
            different reasons.
          </p>

          <h2 className={h2}>Related guides</h2>
          <p className={p}>
            <Link href="/guides/iec-62443-explained" className={link}>
              IEC 62443, explained
            </Link>{" "}
            and{" "}
            <Link href="/guides/customer-security-questionnaire" className={link}>
              Preparing to answer a customer&apos;s security questionnaire
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
