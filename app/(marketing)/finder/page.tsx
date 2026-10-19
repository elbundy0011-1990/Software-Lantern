import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";

// Disabled per the 2026-10-19 site-replacement instruction: this form
// previously promised "up to 3 providers will respond," which the
// marketplace's current state (3 total leads, 3 pending unreviewed
// partner applications, see docs/OT-CYBER-PLAN.md Part B §B.1.1) cannot
// actually deliver reliably. Replaced with a short notice rather than
// removed, so /finder and /finder?category=... links already out in the
// world (emails, bookmarks, old search results) land somewhere honest
// instead of a dead page. The wizard component (components/finder-
// wizard.tsx) and /api/leads are untouched and still work — nothing here
// deletes or modifies any stored lead, partner, or payment data.
export const metadata: Metadata = pageMetadata({
  title: "Software Finder: No Longer Accepting New Requests",
  description: "This form is no longer accepting new requests.",
  path: "/finder",
  noindex: true,
});

export default function FinderPage() {
  return (
    <main data-screen-label="Finder disabled notice">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[640px] mx-auto px-5 sm:px-8 pt-20 pb-24 text-center">
          <h1 className="font-sans font-semibold text-[clamp(26px,3.6vw,34px)] leading-[1.15] mb-4">
            This form is no longer accepting new requests
          </h1>
          <p className="text-[16px] leading-[1.6] text-[#5c6573] mb-8">
            If you already submitted a requirement here, it&apos;s still being handled and nothing
            about your existing submission has changed. We&apos;re no longer taking new EUDR,
            Fashion PLM, or Battery Passport software requests through this form.
          </p>
          <p className="text-[16px] leading-[1.6] text-[#5c6573] mb-8">
            Looking for help with industrial cybersecurity, secure remote access to machines, or
            NIS2/the Cyber Resilience Act/the Machinery Regulation instead?
          </p>
          <Link
            href="/"
            className="inline-block bg-[#9a3412] text-white rounded px-6 py-[13px] font-sans font-semibold text-[15px]"
          >
            Go to the new site →
          </Link>
          <p className="mt-8 text-[14px] text-[#79818f]">
            Already a software provider/partner? Your account and existing enquiries still work as
            before &mdash; see{" "}
            <a href="mailto:info@softwarelantern.com" className="text-[#4f46e5] font-semibold">
              info@softwarelantern.com
            </a>{" "}
            if you have questions.
          </p>
        </div>
      </section>
    </main>
  );
}
