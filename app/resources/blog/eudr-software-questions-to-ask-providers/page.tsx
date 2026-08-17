import Link from "next/link";
import type { Metadata } from "next";
import { EUDR_DEADLINES } from "@/lib/eudr-dates";
import { pageMetadata } from "@/lib/metadata";
import { BuildingIcon, BoxIcon } from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "How to Evaluate EUDR Software: A Buyer's Checklist and Questions to Ask Providers | Software Lantern",
  description:
    "Questions to ask EUDR software providers before you buy, organized by whether you're an enterprise operator or an SME trader, with a sequential guide to what actually matters for your situation.",
  path: "/resources/blog/eudr-software-questions-to-ask-providers",
});

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4";
const p = "text-[16px] leading-[1.7] text-[#3d4653] mb-4";
const link = "text-[#4f46e5] font-semibold";
const ol = "list-decimal pl-6 mb-4 grid gap-3 text-[16px] leading-[1.7] text-[#3d4653]";

function IconCard({
  icon,
  title,
  children,
  accent = "#4f46e5",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {icon}
        </span>
        <h3 className="font-sans font-semibold text-[17px] text-[#0d1117]">{title}</h3>
      </div>
      <p className="text-[15px] leading-[1.6] text-[#5c6573]">{children}</p>
    </div>
  );
}

const QUESTIONS: { q: string; why: string; lookFor: string }[] = [
  {
    q: "How much of my supplier data collection can you automate, and how much will my team still need to do manually?",
    why: "This is the single biggest driver of ongoing admin time, especially as your supplier list grows.",
    lookFor: "Ask for a live walkthrough of the automated steps, not just a list of features.",
  },
  {
    q: "Do you handle point or polygon geolocation data, and can you validate it against deforestation risk maps directly in the platform?",
    why: "Points cover smallholder plots under 4 hectares; polygons cover everything larger. If you source from both, confirm the platform handles both.",
    lookFor: "Ask them to validate a real geolocation entry on the call, not just describe the process.",
  },
  {
    q: "What's your risk assessment methodology, and can I see how it's applied to a commodity like mine?",
    why: "Ask for a real example, not a feature description. Methodologies vary a lot between country-level scoring and satellite-overlay approaches.",
    lookFor: "Push for the specific data sources behind the score, not a vague reference to satellite data.",
  },
  {
    q: "Can you generate and file due diligence statements directly, or do I need to submit them myself?",
    why: "This is the difference between a platform that removes real manual work and one that only helps you gather the underlying data.",
    lookFor: "Ask exactly which fields are auto-populated and which you'd still fill in by hand.",
  },
  {
    q: "Do you submit directly to the EU's Information System, or do I need to file separately?",
    why: "Not every platform integrates this. If it doesn't, factor in the extra manual step.",
    lookFor: "Confirm it's a live integration, not a manual export you'd still have to upload yourself.",
  },
  {
    q: "If I'm a trader rather than an operator, do you have a lighter workflow for me, or am I paying for operator-level features I don't need?",
    why: "Traders have narrower obligations than operators. A platform built around full operator workflows is often more than a trader actually needs.",
    lookFor: "Ask what specifically changes in the workflow and price for a trader versus an operator.",
  },
  {
    q: "What does your audit trail actually capture, and can I export it if a customs authority asks?",
    why: "Ask specifically who supplied what data, when, and what changed. A vague answer here is a real warning sign.",
    lookFor: "Ask to see a sample export, not just a description of what it can capture.",
  },
  {
    q: "Can my suppliers log into the platform themselves, or does my team have to enter all their data by hand?",
    why: "This matters most once you have more than a handful of suppliers. It's the difference between chasing spreadsheets and letting suppliers self-serve.",
    lookFor: "Ask how suppliers are onboarded, and in how many languages the portal is available.",
  },
  {
    q: "What does your platform integrate with, and what would it take to connect it to our ERP or procurement system?",
    why: "Ask for specifics, not a generic \"we integrate with everything\" answer.",
    lookFor: "Ask for a reference customer using the same system you do.",
  },
  {
    q: "How is pricing structured, and what happens to the cost as my supplier count grows?",
    why: "Per-supplier and per-shipment pricing models can scale very differently. Ask for the actual formula, not just a starting price.",
    lookFor: "Ask them to model the cost at double your current supplier count.",
  },
  {
    q: "How does the platform handle incomplete or changing supplier data?",
    why: "Supplier data is rarely complete on day one, and it keeps changing as your supply chain does.",
    lookFor: "Ask what happens to an existing due diligence record when a linked supplier's data is updated.",
  },
  {
    q: "What does implementation require from our team?",
    why: "Setup time and internal effort vary a lot between platforms and are easy to underestimate upfront.",
    lookFor: "Ask for a realistic timeline and exactly who on your side needs to be involved.",
  },
];

export default function EudrSoftwareQuestionsArticlePage() {
  return (
    <main data-screen-label="Blog: EUDR software provider questions">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <p className="mb-8 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span>{" "}
            <Link href="/resources/blog" className="text-[#4f46e5] font-semibold">
              Blog
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> EUDR software evaluation
          </p>

          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3">
            How to Evaluate EUDR Software: A Buyer&apos;s Checklist and Questions to Ask Providers
          </h1>
          <p className="text-[13px] font-semibold text-[#5c6573] mb-6">
            Written by Johannes Cornelis de Boer, founder of Software Lantern
          </p>
          <p className="text-[15px] text-[#79818f] mb-14">
            For a compact side-by-side reference of specific capabilities, see the{" "}
            <Link href="/eudr#eudr-scope-checker" className={link}>
              comparison framework on our EUDR page
            </Link>
            . This guide walks through how to evaluate EUDR software in order, and gives you a
            script of questions to bring to a provider call.
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            Most guidance on how to evaluate EUDR software starts with a feature list. That&apos;s
            useful once you know what you&apos;re looking for, but it&apos;s the wrong starting
            point. The right starting point is your own role and size, since that determines which
            features actually matter to you and which ones you&apos;d just be paying for.
          </p>

          <h2 className={h2}>Start with your role and size, not the feature list</h2>
          <p className={p}>
            EUDR software is built for very different buyers, and a platform sized for one is
            often a poor fit, and a poor price, for the other.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<BuildingIcon />} title="If you're a large operator or trader">
              You&apos;re likely managing a high supplier count, multiple commodities, and a
              compliance team that needs audit-defensible records, not just a compliant process.
              Prioritize depth: automated risk scoring, direct submission to the EU&apos;s
              Information System, ERP integration, and an audit trail detailed enough to survive
              scrutiny. Obligations apply from <strong>{EUDR_DEADLINES.largeMedium.display}</strong>,
              so integration timelines and internal rollout matter as much as the feature set
              itself.
            </IconCard>
            <IconCard icon={<BoxIcon />} title="If you're a small trader or producer" accent="#047857">
              You&apos;re handling this alongside everything else it takes to run the business,
              usually without a dedicated compliance hire. A platform built for a large importer is
              usually the wrong fit, and the wrong price, for you. If you&apos;re a trader
              specifically, your obligations are narrower than an operator&apos;s, so confirm the
              platform doesn&apos;t force you into a full operator workflow you don&apos;t need. If
              you do qualify for the later, micro/small deadline, use the extra time to pick a tool
              sized for your actual supplier count, not a scaled-down enterprise platform.
            </IconCard>
          </div>

          <h2 className={h2}>Then work through what actually matters for your situation</h2>
          <p className={p}>
            Once you know your role and size, the next question is how much of your due diligence
            work you want the platform to automate versus doing yourself. That decision touches
            supplier data collection, geolocation handling, risk assessment, due diligence
            statement generation, and how the platform submits to the EU&apos;s Information System.
            Our{" "}
            <Link href="/eudr#eudr-scope-checker" className={link}>
              full comparison framework
            </Link>{" "}
            covers each of these line by line, with what to check for and why it matters, so we
            won&apos;t repeat it here. Use it as your reference once you&apos;ve narrowed the field
            using the questions below.
          </p>

          <h2 className={h2}>Questions to ask a provider</h2>
          <p className={p}>
            Bring these to a provider call. A specific, confident answer is a good sign. A vague
            or generic answer is worth pushing on.
          </p>
          <ol className={ol}>
            {QUESTIONS.map(({ q, why, lookFor }) => (
              <li key={q}>
                <span className="block font-semibold text-[#0d1117]">{q}</span>
                <span className="block text-[14px] text-[#5c6573] mt-1">{why}</span>
                <span className="block text-[14px] text-[#4338ca] mt-1">{lookFor}</span>
              </li>
            ))}
          </ol>

          <p className={`${p} text-[15px] text-[#79818f]`}>
            This is a general guide, not legal advice. Confirm your specific obligations against
            the regulation itself or with a qualified advisor. See our{" "}
            <Link href="/resources/regulations/eudr" className={link}>
              EUDR regulation explainer
            </Link>{" "}
            for what the law itself requires.
          </p>

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Skip the trial and error
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Tell us what your company needs and we&apos;ll publish your requirements to EUDR
              software providers in the category. The ones who believe they&apos;re a fit will
              respond.
            </p>
            <Link
              href="/finder?category=EUDR%20Software"
              className="inline-block bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              See software providers that handle EUDR compliance →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
