import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { QuestionnairePackForm } from "@/components/questionnaire-pack-form";

export const metadata: Metadata = pageMetadata({
  title: "Customer Security Questionnaire Pack",
  description:
    "About 30 questions customers commonly ask machine builders about remote access, with why they ask and what evidence to prepare. No suggested answers.",
  path: "/questionnaire-pack",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

export default function QuestionnairePackPage() {
  return (
    <main data-screen-label="Questionnaire pack download page">
      <section>
        <div className="max-w-[640px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-6 text-[#1a1d22] text-center">
            Customer security questionnaire pack
          </h1>
          <p className="text-[16px] leading-[1.7] text-[#3f4b52] mb-8 text-center">
            An editable spreadsheet of about 30 questions customers commonly ask machine builders
            about remote access, grouped by topic (access control, authentication, logging,
            vulnerability handling, incident reporting, subcontractors, data, and documentation).
            Each row has the question, why a customer is likely asking it, and the kind of evidence
            worth having ready, plus a blank column for your own answer. No suggested
            &ldquo;compliant&rdquo; answers. See{" "}
            <Link href="/guides/customer-security-questionnaire" className="font-semibold underline text-[#9a3412]">
              the guide
            </Link>{" "}
            for the fuller explanation.
          </p>
          <QuestionnairePackForm />
        </div>
      </section>
    </main>
  );
}
