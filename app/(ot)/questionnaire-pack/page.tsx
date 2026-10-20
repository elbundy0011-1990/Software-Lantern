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

// Five real rows from private/customer-security-questionnaire-pack.xlsx
// (rows 1, 5, 8, 15, and 19 of the "Questionnaire pack" sheet), shown
// here so a visitor can see actual pack content before requesting it,
// not a separately-written summary of what it contains.
const SAMPLE_ROWS: { category: string; question: string; why: string }[] = [
  {
    category: "Access control",
    question: "Who has remote access to our systems, and how is that list kept up to date?",
    why: "Wants a current, accurate inventory of who can reach their systems.",
  },
  {
    category: "Authentication",
    question: "Is multi-factor authentication required for remote access?",
    why: "A password alone is the most commonly exploited single point of failure.",
  },
  {
    category: "Logging",
    question: "Are remote sessions logged?",
    why: "Logs are the main way an incident gets reconstructed after the fact.",
  },
  {
    category: "Incident reporting",
    question: "What counts as an incident, in your process?",
    why: "Without a shared definition, something significant can go unreported.",
  },
  {
    category: "Subcontractors",
    question: "Does anyone other than your own staff connect remotely, such as a dealer or subcontractor?",
    why: "A customer's risk extends to everyone who can reach their systems, not just your direct employees.",
  },
];

const BENEFITS: string[] = [
  "About 30 questions across 8 topics, each with why a customer asks it and what evidence to prepare.",
  "A blank column for your own answer, with no suggested “compliant” response to copy.",
  "Yours to keep and reuse for every customer who sends a security questionnaire, not just this one.",
];

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

          <ul className="grid gap-2 mb-10 text-[14px] text-[#3f4b52] max-w-[520px] mx-auto">
            {BENEFITS.map((b) => (
              <li key={b} className="flex gap-2">
                <span style={{ color: "#9a3412" }}>&#8226;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mb-10 rounded border border-[#3f4b52]/[0.2] overflow-hidden">
            <p className="px-4 py-2 text-[12px] font-bold uppercase tracking-[0.07em] text-[#3f4b52] bg-[#f6f5f1] border-b border-[#3f4b52]/[0.2]">
              Five sample rows from the pack
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead className="bg-[#f6f5f1]">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-[#1a1d22]">Category</th>
                    <th className="px-4 py-2 font-semibold text-[#1a1d22]">Question</th>
                    <th className="px-4 py-2 font-semibold text-[#1a1d22]">Why they ask it</th>
                  </tr>
                </thead>
                <tbody className="text-[#3f4b52]">
                  {SAMPLE_ROWS.map((r) => (
                    <tr key={r.question} className="border-t border-[#3f4b52]/[0.12] align-top">
                      <td className="px-4 py-2 whitespace-nowrap">{r.category}</td>
                      <td className="px-4 py-2">{r.question}</td>
                      <td className="px-4 py-2">{r.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <QuestionnairePackForm />
        </div>
      </section>
    </main>
  );
}
