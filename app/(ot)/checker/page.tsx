import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { OtCyberInteractive } from "@/components/ot-cyber-interactive";

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
        </div>
      </section>
      <OtCyberInteractive />
    </main>
  );
}
