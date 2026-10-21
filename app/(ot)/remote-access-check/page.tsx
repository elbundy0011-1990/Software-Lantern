import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { RemoteAccessCheckInteractive } from "@/components/remote-access-check-interactive";

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
        </div>
      </section>
      <RemoteAccessCheckInteractive />
    </main>
  );
}
