import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { RemoteAccessCheckInteractive } from "@/components/remote-access-check-interactive";
import { ExampleOutput } from "@/components/example-output";

export const metadata: Metadata = pageMetadata({
  title: "Build Your Remote Access Review Sheet",
  description:
    "Seven required questions, plus one optional one. Get a tailored sheet of questions to resolve, controls to verify, and evidence to prepare before your next customer review. No score. Free, no email.",
  path: "/remote-access-check",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function RemoteAccessCheckPage() {
  return (
    <main data-screen-label="Remote access situation check page">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[860px] mx-auto px-5 sm:px-8 pt-16 pb-10">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-4 text-[#1a1d22]">
            Build your remote access review sheet
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3f4b52] mb-8 max-w-[680px]">
            Seven required questions, plus one optional question about what prompted the review.
            You get a tailored sheet of questions to resolve, controls to verify and evidence to
            prepare before your next customer review. No score. Nothing is sent anywhere unless
            you choose.
          </p>

          <ExampleOutput>
            <p className="font-semibold text-[#1a1d22] mb-1 mt-4">Your setup, as described</p>
            <p className="mb-4">A neutral restatement of your seven answers, with no scoring and no pass or fail.</p>
            <p className="font-semibold text-[#1a1d22] mb-1">Questions to resolve</p>
            <ul className="grid gap-1 mb-4">
              <li>Confirm whether remote sessions are logged, and where that log is kept.</li>
            </ul>
            <p className="font-semibold text-[#1a1d22] mb-1">Controls to verify</p>
            <ul className="grid gap-1 mb-4">
              <li>Verify multi-factor authentication is required for every account that can connect, not just some.</li>
            </ul>
            <p className="font-semibold text-[#1a1d22] mb-1">Evidence to prepare</p>
            <ul className="grid gap-1 mb-4">
              <li>Your log retention period.</li>
            </ul>
            <p className="font-semibold text-[#1a1d22] mb-1">Relevant questionnaire pack rows</p>
            <ul className="grid gap-1">
              <li>[Access control] Who has remote access to our systems, and how is that list kept up to date?</li>
            </ul>
          </ExampleOutput>
        </div>
      </section>
      <RemoteAccessCheckInteractive />
    </main>
  );
}
