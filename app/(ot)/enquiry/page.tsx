import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { OtEnquiryForm } from "@/components/ot-enquiry-form";

const TITLE = "Send an Enquiry";
const DESCRIPTION = "Tell us about your situation, whether or not you've used the checker.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/enquiry",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function EnquiryPage() {
  return (
    <main data-screen-label="Direct enquiry page">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-8 text-[#1a1d22] text-center">
            Send an enquiry
          </h1>
          <OtEnquiryForm source="direct" />
        </div>
      </section>
    </main>
  );
}
