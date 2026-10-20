import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { SUPPLEMENTARY_EVIDENCE, sourceLineText } from "@/lib/compliance-ledger";

const TITLE = "Preparing to Answer a Customer's Security Questionnaire";
const DESCRIPTION =
  "What a customer's remote-access security questionnaire typically asks a machine builder, and how to prepare an honest answer.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/customer-security-questionnaire",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const ul = "list-disc pl-6 mb-4 grid gap-1.5 text-[16px] leading-[1.7] text-[#3f4b52]";
const link = "font-semibold underline text-[#9a3412]";

export default function CustomerQuestionnaireGuidePage() {
  const article21 = SUPPLEMENTARY_EVIDENCE.find((e) => e.id === "nis2-article-21-2-d")!;

  return (
    <main data-screen-label="Customer security questionnaire guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            Preparing to answer a customer&apos;s security questionnaire
          </h1>

          <p className={p}>
            If a customer has sent you a questionnaire about how you secure remote access to the
            machines you service, this page explains what it&apos;s usually asking and how to
            prepare an honest answer. It does not name or recommend any specific product.
          </p>

          <h2 className={h2}>Why your customer is asking</h2>
          <p className={p}>
            If your customer is in scope for NIS2, it has its own obligation to assess the security
            practices of its direct suppliers and service providers, including a machine builder or
            integrator with remote access into its systems.{" "}
            <a href={article21.citationUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {sourceLineText(article21)}
            </a>{" "}
            That obligation is your customer&apos;s, not yours directly, unless you are separately
            in scope yourself. See{" "}
            <Link href="/guides/nis2-supply-chain-and-remote-access" className={link}>
              NIS2 supply chain and remote access, explained
            </Link>{" "}
            for the fuller picture.
          </p>

          <h2 className={h2}>What it typically covers</h2>
          <p className={p}>
            Questionnaires vary, but most cover some version of the following topics:
          </p>
          <ul className={ul}>
            <li>
              <strong>Access control.</strong> Who can connect remotely, how that access is
              requested and approved, and whether accounts are named to a specific person or shared
              between people.
            </li>
            <li>
              <strong>Authentication.</strong> Whether remote access requires more than a single
              password, such as multi-factor authentication.
            </li>
            <li>
              <strong>Session logging.</strong> Whether remote sessions are recorded or logged, and
              for how long those records are kept.
            </li>
            <li>
              <strong>Scope of access.</strong> Whether a connection reaches just the one machine
              being serviced, or more of the customer&apos;s network.
            </li>
            <li>
              <strong>Incident reporting.</strong> What happens, and who is told, if something goes
              wrong during or because of a remote session.
            </li>
            <li>
              <strong>Subcontractors.</strong> Whether anyone other than your own staff (a dealer, a
              subcontracted technician) also connects remotely, and under what arrangement.
            </li>
          </ul>

          <h2 className={h2}>How to prepare an honest answer</h2>
          <p className={p}>
            Describe what you actually do today, not what you think the customer wants to hear. If
            a practice isn&apos;t in place yet, say so plainly rather than guessing at an answer, and
            note it as something you&apos;re working on if that&apos;s true. A customer&apos;s
            questionnaire is asking what your practice is, not testing you against a specific
            product or checklist, and there is no single required answer that applies to every
            machine builder.
          </p>
          <p className={p}>
            Gathering the answer usually means talking to whoever actually manages your remote
            access today (an internal engineer, or whoever set up the connection method you use) and
            writing down, in plain terms, who can connect, how, and what they can reach.{" "}
            <Link href="/remote-access-check" className={link}>
              The remote access situation check
            </Link>{" "}
            walks through the same topics, with no score and no verdict, if that&apos;s a faster
            way to get it written down.
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
