import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { OtCyberInteractive } from "@/components/ot-cyber-interactive";
import { ExampleOutput } from "@/components/example-output";

export const metadata: Metadata = pageMetadata({
  title: "Your Brief: Which EU Rules Apply to You",
  description:
    "Four questions. Get a one-page brief: the rules that likely apply (NIS2, CRA, Machinery Regulation), the dates that matter, your national authority, and what customers may ask. Free, no email.",
  path: "/checker",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function CheckerPage() {
  return (
    <main data-screen-label="Scope checker page">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pt-16 pb-10">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
            Which EU rules apply to you, and what to do next
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-8 max-w-[680px]">
            Four questions. You get a one-page brief with the rules that likely apply, the dates
            that matter, your national authority and what customers may ask you. Free, no email
            needed. Your answers stay in your browser.
          </p>

          <ExampleOutput>
            <p className="font-semibold text-[#1a1d22] mb-1 mt-4">Which rules likely apply</p>
            <ul className="grid gap-1 mb-4">
              <li>NIS2: Likely applies. A medium or large machine builder generally sits in NIS2&apos;s manufacturing category.</li>
              <li>Cyber Resilience Act: Likely applies. A connected product placed on the market is in scope regardless of company size.</li>
              <li>Machinery Regulation: Likely applies. Covers safety requirements for machinery placed on the market.</li>
            </ul>
            <p className="font-semibold text-[#1a1d22] mb-1">Dates that matter</p>
            <p className="mb-4">A short list of upcoming dates relevant to your answers, each with a live countdown and its source.</p>
            <p className="font-semibold text-[#1a1d22] mb-1">Your country</p>
            <p className="mb-4">Supervisory authority, registration step, and incident-reporting duty, each cited.</p>
            <p className="font-semibold text-[#1a1d22] mb-1">Questions customers may ask</p>
            <ul className="grid gap-1 mb-4">
              <li>Who has remote access to our systems, and how is that list kept up to date?</li>
              <li>Is multi-factor authentication required for remote access?</li>
            </ul>
            <p className="font-semibold text-[#1a1d22] mb-1">Next steps</p>
            <p>Five concrete steps, including the official government tool and a link to build a remote access review sheet.</p>
          </ExampleOutput>
        </div>
      </section>
      <OtCyberInteractive />
    </main>
  );
}
