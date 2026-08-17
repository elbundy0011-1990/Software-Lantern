import Link from "next/link";
import type { Metadata } from "next";
import { EUDR_DEADLINES } from "@/lib/eudr-dates";
import { pageMetadata } from "@/lib/metadata";
import {
  LeafIcon,
  DocumentIcon,
  ShieldIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ExchangeIcon,
  ChecklistIcon,
} from "@/components/icons";

export const metadata: Metadata = pageMetadata({
  title: "What Is EUDR? The EU Deforestation Regulation Explained | Software Lantern",
  description:
    "What EUDR is, who it applies to, what it requires, and the current compliance deadlines, explained in plain language, verified against the regulation text.",
  path: "/resources/regulations/eudr",
});

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4";
const p = "text-[16px] leading-[1.7] text-[#3d4653] mb-4";
const link = "text-[#4f46e5] font-semibold";

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

export default function EudrRegulationArticlePage() {
  return (
    <main data-screen-label="EUDR regulation article">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <p className="mb-8 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span>{" "}
            <Link href="/resources/regulations" className="text-[#4f46e5] font-semibold">
              Regulations
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> EUDR
          </p>

          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-3">
            What Is EUDR? The EU Deforestation Regulation Explained
          </h1>
          <p className="text-[13px] font-semibold text-[#5c6573] mb-6">
            Written by Johannes Cornelis de Boer, founder of Software Lantern
          </p>
          <p className="text-[15px] text-[#79818f] mb-14">
            An explainer on the regulation itself: for software-specific guidance, see{" "}
            <Link href="/eudr" className={link}>
              EUDR compliance software
            </Link>
            .
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            EUDR, the EU Deforestation Regulation (formally Regulation (EU) 2023/1115), requires
            companies placing certain commodities on the EU market, or exporting them from it, to
            prove those commodities weren&apos;t grown on land deforested after 31 December 2020,
            and were produced legally. It applies regardless of company size, though the deadline
            differs by size.
          </p>

          <h2 className={h2}>Who does EUDR apply to?</h2>
          <p className={p}>
            EUDR defines two roles, and which one applies to you determines the scope of your
            obligations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<DocumentIcon />} title="Operator">
              The business that first places a covered product on the EU market, or makes it
              available on the market if it was produced within the EU. This covers importers and
              EU-based producers. Operators carry the full due diligence burden.
            </IconCard>
            <IconCard icon={<ExchangeIcon />} title="Trader" accent="#047857">
              Any other business that makes the product available further down the supply chain,
              after an operator has already placed it on the market (for example, distributing or
              retailing it within the EU). Traders have narrower obligations than operators.
            </IconCard>
          </div>
          <p className={p}>
            The regulation also applies to <strong>exporting</strong> these products from the EU,
            which carries its own due diligence obligation similar to an operator&apos;s.
          </p>
          <p className={p}>EUDR covers seven commodities and their derived products:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {["Cattle", "Cocoa", "Coffee", "Oil palm", "Rubber", "Soya", "Wood"].map((c) => (
              <div
                key={c}
                className="flex items-center gap-2 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-xl px-4 py-3"
              >
                <span className="shrink-0 text-[#047857]">
                  <LeafIcon size={18} />
                </span>
                <span className="font-sans font-semibold text-[15px] text-[#0d1117]">{c}</span>
              </div>
            ))}
          </div>

          <h2 className={h2}>EUDR requirements</h2>
          <p className={p}>
            Full due diligence under EUDR has four parts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<DocumentIcon />} title="Information collection">
              Commodity type and quantity, supplier details, and plot-level geolocation data for
              where the commodity was produced (points for smallholder plots under 4 hectares,
              polygons for larger areas).
            </IconCard>
            <IconCard icon={<MagnifyingGlassIcon />} title="Risk assessment" accent="#047857">
              Assessing the risk that the product isn&apos;t deforestation-free or wasn&apos;t
              produced legally, based on the collected information and the country&apos;s risk
              classification.
            </IconCard>
            <IconCard icon={<ShieldIcon />} title="Risk mitigation">
              Where risk isn&apos;t negligible, taking steps to reduce it before the product can be
              placed on the market.
            </IconCard>
            <IconCard icon={<ChecklistIcon />} title="A due diligence system" accent="#047857">
              Maintaining the internal procedures and records that make the above auditable, on an
              ongoing basis, not just once.
            </IconCard>
          </div>
          <p className={p}>
            The regulation also sets up a country-level risk benchmarking system (low, standard, or
            high risk). Operators sourcing exclusively from countries classified as low risk can use
            a simplified procedure that skips the risk assessment and risk mitigation steps. The
            information collection and due diligence system requirements still apply. Only a small
            number of countries are currently classified high risk; most others are low or standard
            risk by default.
          </p>

          <h2 className={h2}>EUDR deadlines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <IconCard icon={<CalendarIcon />} title={EUDR_DEADLINES.largeMedium.label}>
              Due diligence obligations apply from{" "}
              <strong>{EUDR_DEADLINES.largeMedium.display}</strong> for large and medium operators
              and traders.
            </IconCard>
            <IconCard icon={<CalendarIcon />} title={EUDR_DEADLINES.microSmall.label} accent="#047857">
              Micro and small operators, established as such by 31 December 2024, have until{" "}
              <strong>{EUDR_DEADLINES.microSmall.display}</strong>. This later date is specific to
              operators; the regulation&apos;s text doesn&apos;t extend it to traders regardless of
              size.
            </IconCard>
          </div>
          <p className={`${p} text-[15px] text-[#79818f]`}>
            These dates reflect Regulation (EU) 2025/2650, which amended the original regulation and
            superseded an earlier delay (Regulation (EU) 2024/3234). If you&apos;ve seen different
            dates elsewhere, they&apos;re likely referencing that earlier, now-outdated timeline.
          </p>

          <h2 className={h2}>The due diligence statement</h2>
          <p className={p}>
            Before placing a covered product on the EU market (or exporting it), operators must
            submit a due diligence statement confirming the due diligence process was carried out
            and the risk was found to be negligible. It&apos;s filed through the EU&apos;s official
            information system, built on the TRACES platform, and generates a reference number that
            downstream traders can cite rather than repeating the process themselves.
          </p>

          <h2 className={h2}>Frequently asked questions</h2>
          <div className="grid gap-[22px]">
            <div>
              <h3 className="font-sans font-semibold text-[18px] mb-1">
                What&apos;s the difference between an operator and a trader under EUDR?
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#5c6573]">
                An operator is the business that first places a covered product on the EU market,
                or makes it available if it was produced within the EU, and carries the full due
                diligence burden. A trader is any other business further down the supply chain
                that makes the product available afterward, and has narrower obligations than an
                operator.
              </p>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[18px] mb-1">
                Do micro and small businesses get more time to comply with EUDR?
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#5c6573]">
                Micro and small operators, established as such by 31 December 2024, have until{" "}
                {EUDR_DEADLINES.microSmall.display}, compared to{" "}
                {EUDR_DEADLINES.largeMedium.display} for large and medium operators and traders.
                This later date applies to operators specifically; the regulation&apos;s text
                doesn&apos;t extend it to traders regardless of size.
              </p>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[18px] mb-1">
                What happens if I source only from low-risk countries?
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#5c6573]">
                Operators sourcing exclusively from countries the EU classifies as low risk can use
                a simplified procedure that skips the risk assessment and risk mitigation steps.
                The information collection and due diligence system requirements still apply
                either way.
              </p>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[18px] mb-1">
                Where do I file an EUDR due diligence statement?
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#5c6573]">
                Through the EU&apos;s official information system, built on the TRACES platform.
                Filing generates a reference number that downstream traders can cite rather than
                repeating the process themselves.
              </p>
            </div>
            <div>
              <h3 className="font-sans font-semibold text-[18px] mb-1">
                Has the EUDR compliance deadline changed?
              </h3>
              <p className="text-[15px] leading-[1.6] text-[#5c6573]">
                Yes. Regulation (EU) 2025/2650 amended the original regulation and superseded an
                earlier delay set by Regulation (EU) 2024/3234. If you&apos;ve seen different dates
                elsewhere, they&apos;re likely referencing that earlier, now-outdated timeline.
              </p>
            </div>
          </div>

          <p className={`${p} text-[15px] text-[#79818f] mt-14`}>
            This article is a general guide, not legal advice. Confirm your specific obligations
            against the regulation itself or with a qualified advisor.
          </p>

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Not sure if EUDR applies to you?
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Use the scope checker on our EUDR page: a few questions, a plain-language answer on
              your role and deadline.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/eudr#eudr-scope-checker"
                className="bg-white border border-[#0d1117]/[0.12] text-[#0d1117] rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:border-[#4f46e5]"
              >
                Use our scope checker →
              </Link>
              <Link
                href="/finder?category=EUDR%20Software"
                className="bg-[#4f46e5] text-white rounded-full px-6 py-[13px] font-sans font-semibold text-[15px] hover:bg-[#4338ca]"
              >
                See software providers that handle EUDR compliance →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
