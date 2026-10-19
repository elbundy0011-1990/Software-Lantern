import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

const TITLE = "IEC 62443, Explained";
const DESCRIPTION = "IEC 62443 is a voluntary industrial-cybersecurity standard, not a law. What it actually is, and when it becomes relevant in practice.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/guides/iec-62443-explained",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
const p = "text-[16px] leading-[1.7] text-[#3f4b52] mb-4";

export default function Iec62443GuidePage() {
  return (
    <main data-screen-label="IEC 62443 guide">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22]">
            IEC 62443, explained
          </h1>

          <p className={p}>
            <strong>IEC 62443 is a voluntary international standard, not a regulation.</strong> No
            EU law, national or otherwise, makes conformance to it mandatory by itself. This page
            exists specifically to say that plainly, since it&apos;s commonly described in ways
            that blur it with NIS2, the Cyber Resilience Act, or the Machinery Regulation, all of
            which are actual legal requirements for the entities and products they cover.
          </p>

          <h2 className={h2}>What it actually is</h2>
          <p className={p}>
            Properly ISA/IEC 62443, it&apos;s a series of international standards defining
            requirements and processes for securing industrial automation and control systems
            (IACS) throughout their lifecycle, developed by the ISA99 committee and co-published by
            the IEC. It addresses asset owners who operate systems, integrators and service
            providers who design and maintain them, and product suppliers who build their
            components.
          </p>

          <h2 className={h2}>When it becomes relevant in practice</h2>
          <p className={p}>
            It becomes relevant commercially, not legally, when a customer, insurer, or a specific
            sector rule requires it contractually. The same distinction this site draws for NIS2
            Article 21(2)(d)&apos;s supply-chain pressure applies here too: a customer can require
            IEC 62443 conformance as a condition of doing business, which is real and worth
            preparing for, without that making it a general legal requirement.
          </p>

          <div className="mt-10 text-center flex flex-wrap justify-center gap-3">
            <Link href="/checker" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block" style={{ background: "#9a3412" }}>
              Check your situation →
            </Link>
            <Link href="/enquiry" className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-[#1a1d22] border border-[#3f4b52]/[0.3] inline-block">
              Send an enquiry
            </Link>
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
