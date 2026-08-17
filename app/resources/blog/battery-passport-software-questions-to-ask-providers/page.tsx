import Link from "next/link";
import type { Metadata } from "next";
import { BATTERY_PASSPORT_DEADLINE } from "@/lib/battery-passport-dates";
import { CubeIcon, BuildingIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "How to Evaluate Battery Passport Software: A Buyer's Checklist and Questions to Ask Providers | Software Lantern",
  description:
    "Questions to ask battery passport software providers before you buy, organized by where you sit in the value chain, with a sequential guide to what actually matters for your product and role.",
  path: "/resources/blog/battery-passport-software-questions-to-ask-providers",
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
    q: "How do you calculate carbon footprint per battery model, and can you walk me through the methodology behind a figure, not just show me the output number?",
    why: "Carbon footprint declaration is one of the more technically involved parts of the passport, and methodologies vary in how directly they trace to a specific manufacturing batch versus using generic industry averages.",
    lookFor: "Ask for a worked example tied to a real battery model, not a description of the methodology in the abstract.",
  },
  {
    q: "How do you track recycled content share for cobalt, lithium, nickel, and lead, and where does that data actually come from?",
    why: "Recycled content has to be substantiated per material, not just estimated, and the underlying supplier evidence varies a lot in how complete it is.",
    lookFor: "Ask whether the platform validates supplier-submitted recycled content figures or just stores whatever number it's given.",
  },
  {
    q: "How is State of Health data collected and updated over the battery's life, and who's responsible for feeding it in after the battery leaves the factory?",
    why: "Unlike most of the passport's data, State of Health changes throughout the battery's life, not just at the point of manufacture.",
    lookFor: "Ask specifically what happens once the battery is in the field: is data pushed automatically from the battery management system, or does someone update it by hand?",
  },
  {
    q: "Which battery categories does your platform actually support, EV, LMT, industrial, or all three, and does the workflow differ meaningfully between them?",
    why: "Not every provider built for EV batteries handles industrial or LMT batteries equally well, and the underlying data models can differ.",
    lookFor: "Ask for a reference customer in your specific battery category, not just a general capability claim.",
  },
  {
    q: "If we're a cell manufacturer or materials supplier rather than the company placing the finished battery on the market, do you help us feed data into someone else's passport, or only support companies who own the full passport themselves?",
    why: "The passport obligation sits with whoever places the finished battery on the EU market, so upstream suppliers often need a different kind of tool built to hand off data cleanly, not to manage a full passport they don't own.",
    lookFor: "Ask how data handoff to a downstream customer's passport actually works technically, not just whether it's \"supported.\"",
  },
  {
    q: "How is the QR code and unique battery identifier generated and assigned, at what point in production, and what happens if a unit needs to be re-issued or corrected?",
    why: "The identifier has to stay unique and durable for the life of the battery, and mistakes at the assignment stage are hard to unwind later.",
    lookFor: "Ask to see the identifier generation step in a live walkthrough, not just the final QR code.",
  },
  {
    q: "Who can see what: how do you control access between the general public, regulators, and recycling operators, and can we configure that ourselves?",
    why: "The regulation tiers data access by audience, and how granular and controllable that access actually is varies significantly between platforms.",
    lookFor: "Ask for a live demonstration of the same passport viewed at two different access levels, not just a description of the access model.",
  },
  {
    q: "What does it take to connect this to our ERP, PLM, or MES systems, and which specific data actually flows automatically versus needing manual entry?",
    why: "Passport data originates across several systems: bill of materials in PLM, production records in MES, supplier records in ERP. A platform that only integrates with one of them still leaves manual work behind.",
    lookFor: "Ask for the specific fields that sync from each system, not just the system names the provider claims to support.",
  },
  {
    q: "How do you handle supply chain due diligence documentation, and does the platform manage that alongside the passport data itself?",
    why: "Due diligence records and passport data are closely related but not identical, and some platforms only really handle one of the two.",
    lookFor: "Ask whether due diligence documentation lives in the same platform or requires a separate system entirely.",
  },
  {
    q: "How is pricing structured, per battery, per SKU, or per unit produced, and how does the cost change as our production volume grows?",
    why: "Per-unit pricing models can scale very differently at real production volumes, so the starting price alone doesn't tell you much.",
    lookFor: "Ask them to model the cost at your expected production volume once the deadline hits, not today's volume.",
  },
  {
    q: "What does implementation actually require from our team, and how much of that depends on how much of our data is already systemized today?",
    why: "Setup effort varies a lot depending on whether your material, supplier, and production data already lives in structured systems or is still scattered across spreadsheets.",
    lookFor: "Ask for a realistic timeline based on your actual current systems, not a generic best-case estimate.",
  },
];

export default function BatteryPassportQuestionsArticlePage() {
  return (
    <main data-screen-label="Blog: Battery Passport software provider questions">
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
            <span className="text-[#c2c8d1]">/</span> Battery Passport software evaluation
          </p>

          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-3">
            How to Evaluate Battery Passport Software: A Buyer&apos;s Checklist and Questions to Ask
            Providers
          </h1>
          <p className="text-[13px] font-semibold text-[#5c6573] mb-6">
            Written by Johannes Cornelis de Boer, founder of Software Lantern
          </p>
          <p className="text-[15px] text-[#79818f] mb-14">
            Not sure whether the battery passport requirement even applies to you yet? Use the{" "}
            <Link href="/battery-passport#battery-passport-scope-checker" className={link}>
              scope checker on our Battery Passport page
            </Link>{" "}
            first to confirm your category and deadline. If the vendor landscape itself is what&apos;s
            confusing you, see{" "}
            <Link href="/resources/blog/why-battery-passport-software-market-is-fragmented" className={link}>
              why the battery passport software market is so fragmented
            </Link>{" "}
            first. This guide picks up from there and walks through how to evaluate battery passport
            software in order, with a script of questions to bring to a provider call.
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            Most guidance on how to evaluate battery passport software starts with a feature list.
            That&apos;s useful once you know what you&apos;re looking for, but it&apos;s the wrong
            starting point. The right starting point is where you sit in the battery value chain,
            since that determines which capabilities actually matter to you and which ones
            you&apos;d just be paying for.
          </p>

          <h2 className={h2}>Start with your position in the value chain, not the feature list</h2>
          <p className={p}>
            Battery passport software is built for very different buyers, and a platform sized for
            one is often a poor fit, and a poor price, for the other. The deadline itself,{" "}
            <strong>{BATTERY_PASSPORT_DEADLINE.display}</strong>, applies uniformly once a battery
            is in scope, regardless of company size or chain position, but what you actually need
            from a platform changes a lot depending on whether you own the passport obligation or
            you&apos;re feeding data into someone else&apos;s.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<CubeIcon />} title="If you're a cell or component manufacturer" accent="#047857">
              You&apos;re likely supplying cells, materials, or components into someone else&apos;s
              finished battery rather than placing a finished product on the EU market yourself.
              The passport obligation usually sits downstream of you, so prioritize a platform (or a
              data handoff process) built to feed accurate carbon footprint, recycled content, and
              material composition data into a customer&apos;s passport cleanly, not a full
              passport-management tool sized for an obligation you may not hold directly.
            </IconCard>
            <IconCard icon={<BuildingIcon />} title="If you're an OEM or final assembler">
              You&apos;re likely the party placing the finished battery on the EU market, whether
              that&apos;s an automotive OEM, a pack assembler selling direct, or an energy storage
              company. Prioritize depth: aggregating data from your own suppliers, State of Health
              tracking over the battery&apos;s life, QR/identifier generation and management,
              tiered access control, and integration with your ERP, PLM, or MES systems.
            </IconCard>
          </div>

          <h2 className={h2}>Then work through what actually matters for your product</h2>
          <p className={p}>
            Once you know your position in the chain, the next question is which parts of the
            passport data your platform needs to handle well: carbon footprint, recycled content,
            State of Health, identifier generation, access control, or due diligence documentation.
            Our{" "}
            <Link href="/battery-passport" className={link}>
              Battery Passport page
            </Link>{" "}
            outlines the core areas we&apos;ll ask about, so we won&apos;t repeat them here. Use it
            as your starting reference, then use the questions below to go deeper with any provider
            you talk to.
          </p>

          <h2 className={h2}>Questions to ask a provider</h2>
          <p className={p}>
            Bring these to a provider call. A specific, confident answer is a good sign. A vague or
            generic answer is worth pushing on.
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
            This is a general guide, not legal advice. Confirm your specific obligations against the
            regulation itself or with a qualified advisor. See our{" "}
            <Link href="/resources/regulations/battery-passport" className={link}>
              Battery Passport regulation explainer
            </Link>{" "}
            for what the law itself requires.
          </p>

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Skip the trial and error
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Tell us where you sit in the value chain and what your passport needs to cover, and
              we&apos;ll publish your brief to battery passport software providers in the category.
              The ones who believe they&apos;re a fit will respond.
            </p>
            <Link
              href={`/finder?category=${encodeURIComponent("Digital Battery Passport (DBP)")}`}
              className="inline-block bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
            >
              See software providers that handle Battery Passport compliance →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
