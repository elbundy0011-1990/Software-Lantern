import type { Metadata } from "next";
import Link from "next/link";
import { OtCyberInteractive } from "@/components/ot-cyber-interactive";
import { DisclosureSlot } from "@/components/disclosure-slot";

const TITLE = "NIS2 & OT Remote Access for Machine Builders (Preview)";
const DESCRIPTION =
  "A plain-language, source-cited look at NIS2 and the Cyberbeveiligingswet for Benelux machine builders and manufacturers, including the supply-chain pressure on remote access even outside direct scope.";

// Explicit openGraph/twitter, not just title/description: the root
// layout's metadata (lib/site.ts's SITE_NAME/SITE_TITLE, "Software
// Lantern") is what a page silently inherits for openGraph/twitter if it
// only sets plain title/description — see lib/metadata.ts's own comment
// on this exact pitfall. This section is deliberately not branded as
// Software Lantern, so it needs its own complete openGraph/twitter, not
// pageMetadata()'s helper (which hardcodes SITE_NAME).
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function OtCyberLandingPage() {
  return (
    <main data-screen-label="OT Cyber Readiness landing (preview)">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pt-16 pb-14 text-center">
          <h1 className="font-sans font-semibold text-[clamp(32px,4.8vw,52px)] leading-[1.08] tracking-[-0.03em] mb-5">
            NIS2 and OT remote access, for Benelux machine builders
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#3d4653] mb-6 max-w-[640px] mx-auto">
            NIS2 is live in Belgium, and the Netherlands&apos; Cyberbeveiligingswet took effect on 15
            August 2026. Neither names a specific product as required. This page walks through what
            actually applies to a machine builder, in plain language, with sources cited.
          </p>
          <div className="mb-8">
            <DisclosureSlot />
          </div>
        </div>
      </section>

      <OtCyberInteractive />

      <section className="border-t border-[#0d1117]/[0.07]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 py-16 text-center">
          <h2 className="font-sans font-semibold text-[26px] mb-4">Want the detail behind this?</h2>
          <p className="text-[15px] text-[#5c6573] mb-5">
            The supply-chain and remote-access rules this checker is built around, explained with
            the exact article and source citations.
          </p>
          <Link href="/ot-cyber/supply-chain-and-remote-access" className="font-semibold underline" style={{ color: "#115e59" }}>
            Read: NIS2 supply chain and remote access, explained →
          </Link>
        </div>
      </section>
    </main>
  );
}
