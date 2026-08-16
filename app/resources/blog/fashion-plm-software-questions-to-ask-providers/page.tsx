import Link from "next/link";
import type { Metadata } from "next";
import { BuildingIcon, BoxIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "How to Evaluate Fashion PLM Software: A Buyer's Checklist and Questions to Ask Providers | Software Lantern",
  description:
    "Questions to ask fashion PLM software providers before you buy, organized by brand structure and collection complexity, with a sequential guide to what actually matters for your workflow.",
  alternates: {
    canonical: "/resources/blog/fashion-plm-software-questions-to-ask-providers",
  },
};

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
    q: "How are materials, colors, trims, and approved components tracked, and can I see the full history of a single material across multiple seasons?",
    why: "Material libraries are often where PLM projects succeed or fail, since fashion products are defined as much by fabric and trim choices as by silhouette.",
    lookFor: "Ask to see a real material record, not a mockup, including who approved it and when.",
  },
  {
    q: "How is a bill of materials built and maintained across sizes, colorways, and seasonal carryovers?",
    why: "A BOM that has to be rebuilt from scratch each season, instead of copied and adjusted, costs real time every cycle.",
    lookFor: "Ask how many steps it takes to create a new colorway's BOM from an existing style.",
  },
  {
    q: "How are tech packs generated, versioned, and shared with factories, and what happens when a spec changes mid-development?",
    why: "Tech pack errors and outdated versions reaching a factory are a common cause of costly production mistakes.",
    lookFor: "Ask specifically how version history works and whether factories see the same live tech pack you do.",
  },
  {
    q: "How do suppliers and factories interact with the platform: can they comment, upload, and respond directly, or does everything route back through your team?",
    why: "This determines how much of your team's time goes into relaying messages instead of managing exceptions.",
    lookFor: "Ask whether suppliers get their own login or whether your team is the single point of contact for every update.",
  },
  {
    q: "How are sampling rounds tracked, and can you see the full comment and approval history for a single sample across multiple revisions?",
    why: "Sampling is usually the most iterative, back-and-forth part of development, and losing track of comment history causes real rework.",
    lookFor: "Ask to see a sample with more than one revision round and how the history is actually displayed.",
  },
  {
    q: "How does costing update as materials, quantities, or suppliers change, and can I see the margin impact before I commit to a decision?",
    why: "Costing that's disconnected from the BOM means margin surprises show up after decisions are already made, not before.",
    lookFor: "Ask whether a material substitution automatically recalculates the costed BOM or requires manual re-entry.",
  },
  {
    q: "How does the platform handle planning across multiple seasons or collections at once, including carryover styles?",
    why: "Most fashion brands work on more than one season simultaneously, and a tool that only handles one cleanly forces workarounds.",
    lookFor: "Ask how a style that carries over from last season into a new one is actually handled in the system.",
  },
  {
    q: "Can the platform track critical path milestones and flag when a style is falling behind schedule?",
    why: "Missed calendar deadlines are one of the most expensive failure modes in fashion production, since they can push delivery past a selling window.",
    lookFor: "Ask to see how a missed milestone is actually flagged and who gets notified.",
  },
  {
    q: "What does it take to connect this to our ERP or order management system, and what data actually flows between them?",
    why: "Without a real integration, your team ends up re-entering the same style and material data in two systems.",
    lookFor: "Ask for the specific data fields that sync, not just the names of the ERP systems they claim to support.",
  },
  {
    q: "Does the platform connect to 3D design tools, and what does that workflow actually look like in practice?",
    why: "3D-to-PLM workflows can meaningfully cut physical sampling, but only if the integration is genuinely two-way, not just an import.",
    lookFor: "Ask whether changes made in the 3D tool sync back into the PLM record automatically or need to be re-entered.",
  },
  {
    q: "If we run multiple brands or labels, can each have its own workflow, approval chain, and branding, or is everything forced through one shared setup?",
    why: "A platform that only really works well for a single brand often becomes a bottleneck once you're managing more than one.",
    lookFor: "Ask for a specific example of two brands with different approval workflows running in the same account.",
  },
];

export default function FashionPlmQuestionsArticlePage() {
  return (
    <main data-screen-label="Blog: Fashion PLM software provider questions">
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
            <span className="text-[#c2c8d1]">/</span> Fashion PLM software evaluation
          </p>

          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3">
            How to Evaluate Fashion PLM Software: A Buyer&apos;s Checklist and Questions to Ask
            Providers
          </h1>
          <p className="text-[13px] font-semibold text-[#5c6573] mb-6">
            Written by Johannes Cornelis de Boer, founder of Software Lantern
          </p>
          <p className="text-[15px] text-[#79818f] mb-14">
            For a compact overview of the core areas, see{" "}
            <Link href="/plm" className={link}>
              our Fashion PLM page
            </Link>
            . This guide walks through how to evaluate fashion PLM software in order, and gives
            you a script of questions to bring to a provider call.
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            Most guidance on how to evaluate fashion PLM software starts with a feature list.
            That&apos;s useful once you know what you&apos;re looking for, but it&apos;s the wrong
            starting point. The right starting point is your brand structure and collection
            complexity, since that determines which capabilities actually matter to you and which
            ones you&apos;d just be paying for.
          </p>

          <h2 className={h2}>Start with your brand structure, not the feature list</h2>
          <p className={p}>
            Fashion PLM is built for very different buyers, and a platform sized for one is often
            a poor fit, and a poor price, for the other.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<BoxIcon />} title="If you're a small or growing brand" accent="#047857">
              You&apos;re likely managing a single brand, a smaller SKU count, and a product
              development process that still runs partly through spreadsheets and email.
              Prioritize speed to value: how quickly your team can actually start using the tool,
              whether tech packs and BOMs are simple to set up without a long implementation
              project, and whether the pricing scales sensibly as your collection grows. A
              platform built for a multi-brand enterprise is usually more complexity, and more
              cost, than you need yet.
            </IconCard>
            <IconCard icon={<BuildingIcon />} title="If you're a multi-brand or multinational business">
              You&apos;re likely coordinating multiple brands or labels, a large supplier network,
              and product development teams working across several collections at once.
              Prioritize depth: separate workflows and approval chains per brand, ERP
              integration, critical path tracking across many styles simultaneously, and
              reporting that rolls up across brands without forcing everyone into one shared
              setup. A platform built for a single growing brand often can&apos;t hold this
              complexity without workarounds.
            </IconCard>
          </div>

          <h2 className={h2}>Then work through what actually matters for your workflow</h2>
          <p className={p}>
            Once you know your brand structure, the next question is which parts of product
            development you most need the platform to handle well: materials and BOM management,
            tech packs and supplier collaboration, sampling, costing, or calendar and critical
            path tracking. Our{" "}
            <Link href="/plm" className={link}>
              Fashion PLM page
            </Link>{" "}
            outlines the core areas we&apos;ll ask about, so we won&apos;t repeat them here. Use
            it as your starting reference, then use the questions below to go deeper with any
            provider you talk to.
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

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Skip the trial and error
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Tell us what your brand needs and we&apos;ll publish your requirements to fashion
              PLM providers in the category. The ones who believe they&apos;re a fit will respond.
            </p>
            <Link
              href={`/finder?category=${encodeURIComponent("Product Lifecycle Management (PLM)")}`}
              className="inline-block bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              See software providers that handle fashion PLM →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
