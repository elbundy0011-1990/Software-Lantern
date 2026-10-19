import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

const TITLE = "Who Runs This";
const DESCRIPTION = "Who runs this site, why it exists, and how enquiries are actually handled.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/who-runs-this",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "[Product name]",
});

const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";
const h2 = "font-sans font-semibold text-[22px] leading-[1.2] mt-10 mb-3 text-[#1a1d22]";

export default function WhoRunsThisPage() {
  return (
    <main data-screen-label="Who runs this page">
      <section>
        <div className="max-w-[700px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            Who runs this
          </h1>

          <p className={p}>
            This site is run by <strong>Johannes Cornelis de Boer</strong>, based in Copenhagen,
            Denmark, the same controller named in this site&apos;s{" "}
            <a href="/privacy" className="font-semibold underline text-[#9a3412]">privacy policy</a>.
            There is no company behind it, no sales team, and no outside investors. [Add specific
            background, relevant experience, and why this specific topic, here, before this page
            goes live. Nothing is invented in its place.]
          </p>

          <h2 className={h2}>Why this exists</h2>
          <p className={p}>
            NIS2, the Cyber Resilience Act, and the Machinery Regulation are landing on machine
            builders, factory operators, and system integrators in the Benelux at the same time,
            each for a different reason, and most existing explanations come from vendors selling a
            specific product into this exact situation. This site tries to state the regulatory
            facts plainly, with sources cited, before anyone tries to sell you anything.
          </p>

          <h2 className={h2}>How enquiries are actually handled</h2>
          <p className={p}>
            If you submit the form on this site, a person, not an algorithm, reads it. Nothing is
            shared with any other company unless that specific company is named to you first and
            you agree to it. There is no automated matching, scoring, or ranking of providers
            anywhere on this site.
          </p>

          <h2 className={h2}>Corrections</h2>
          <p className={p}>
            Every regulatory date or claim on this site cites its source and carries a{" "}
            <code>[VERIFY]</code> tag where the primary legal text hasn&apos;t been read directly
            yet. If something here is wrong, say so at{" "}
            <a href="mailto:info@softwarelantern.com" className="font-semibold underline text-[#9a3412]">
              info@softwarelantern.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
