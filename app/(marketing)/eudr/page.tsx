import Link from "next/link";
import type { Metadata } from "next";
import { EUDR_DEADLINES } from "@/lib/eudr-dates";
import { EudrDeadlineCountdown } from "@/components/eudr-deadline-countdown";
import { EudrScopeChecker } from "@/components/eudr-scope-checker";

export const metadata: Metadata = {
  title: "EUDR Compliance Software | Compare Providers & Get Matched",
  description:
    "Looking for EUDR compliance software? Tell us about your supply chain and requirements — we'll connect you with up to 3 EUDR software providers that believe they can help, whether you're a large importer or a small business.",
  alternates: {
    canonical: "/eudr",
  },
  openGraph: {
    title: "EUDR Compliance Software | Compare Providers & Get Matched",
    description:
      "Tell us about your supply chain and requirements — we'll connect you with up to 3 EUDR software providers that believe they can help.",
    url: "/eudr",
  },
};

const eudrHref = `/finder?category=${encodeURIComponent("EUDR Software")}`;

export default function EudrPage() {
  return (
    <main data-screen-label="EUDR category page">
      <section className="relative overflow-hidden border-b border-[#0d1117]/[0.07]">
        <div className="absolute -top-[200px] -right-[140px] w-[700px] h-[560px] pointer-events-none bg-[radial-gradient(closest-side,rgba(79,70,229,0.10),rgba(255,255,255,0))]" />
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-10 pb-[88px]">
          <p className="mb-10 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Software categories{" "}
            <span className="text-[#c2c8d1]">/</span> EUDR software
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[72px] items-start">
            <div>
              <h1 className="font-sans font-semibold text-[clamp(34px,5.6vw,58px)] leading-[1.06] tracking-[-0.035em] mb-[22px] text-pretty">
                Looking for EUDR compliance software?
              </h1>
              <p className="text-[20px] leading-[1.5] text-[#3d4653] mb-4 max-w-[42ch]">
                EUDR software is a crowded, fast-moving market, and the right fit depends on your
                commodities, supply chain, supplier network and company size. Comparing every option
                yourself can take weeks.
              </p>
              <p className="text-[17px] text-[#5c6573] mb-[34px] max-w-[48ch]">
                Tell us about your business and requirements, and we&apos;ll publish your brief to EUDR
                software providers in the category — up to 3 who believe they&apos;re a fit will respond.
                Not a ranked list, and not a guess at which one is objectively best.
              </p>
              <Link
                href={eudrHref}
                className="inline-block bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[19px] shadow-[0_6px_18px_rgba(79,70,229,0.28)] hover:bg-[#4338ca]"
              >
                Find EUDR software →
              </Link>
              <p className="mt-6 text-[14px] font-semibold text-[#5c6573]">
                Free for buyers · No obligation · Providers respond by email within 24 hours
              </p>
            </div>
            <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-[30px] pb-[26px]">
              <p className="mb-[18px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                By commodity
              </p>
              <div className="grid">
                {["Timber & wood products", "Coffee", "Cocoa", "Furniture"].map((label, i, arr) => (
                  <Link
                    key={label}
                    href={eudrHref}
                    className={`flex justify-between items-center py-[13px] px-1 font-semibold text-[#0d1117] ${
                      i < arr.length - 1 ? "border-b border-[#0d1117]/[0.07]" : ""
                    }`}
                  >
                    {label} <span className="text-[#4338ca]">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <EudrDeadlineCountdown />

      <EudrScopeChecker />

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px]">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              What is EUDR compliance software?
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              EUDR compliance software helps companies meet the EU Deforestation Regulation&apos;s due
              diligence requirements: collecting supplier and plot-level geolocation data, running risk
              assessments, generating due diligence statements, and keeping an audit-ready traceability
              record for the commodities and products in scope — replacing spreadsheets and email chains
              with a system suppliers can actually populate.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Which platform fits best varies a lot by buyer: a large importer with dedicated compliance
              staff often needs deeper risk-assessment and audit-trail features, while a smaller trader
              handling this alongside everything else usually needs something simpler to run day to day.
              Providers are also built around different commodities and sourcing regions, so the same
              platform rarely suits everyone equally well.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              If your business also manages fashion, footwear, or accessories product development
              involving EUDR-relevant materials like leather or rubber, you may also want{" "}
              <Link href="/plm" className="text-[#4f46e5] font-semibold">
                fashion PLM software
              </Link>
              .
            </p>
            <p className="text-[15px] leading-[1.6] text-[#79818f]">
              Software Lantern does not provide legal advice, regulatory certification, or a compliance
              guarantee. We help you find and compare software providers whose platforms may fit your
              EUDR requirements — always confirm your specific obligations against the EU Deforestation
              Regulation itself or your own legal/compliance advisors.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px] mb-14">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              How to choose EUDR compliance software
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653]">
              No single vendor can neutrally tell you how it compares to its competitors. Here&apos;s what
              we&apos;d suggest evaluating yourself, and why each factor matters — whether or not you use
              Software Lantern to do it.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-9">
            {[
              [
                "Supplier data collection",
                "Every EUDR platform needs a way to collect commodity, quantity, and supplier information from your supply chain — the question is how much of that it automates versus leaving you to gather manually. Check whether the platform includes supplier outreach tools (invites, reminders, data requests) or expects you to already have this data assembled.",
              ],
              [
                "Geolocation (GPS/polygon handling)",
                "The regulation requires plot-level geolocation data for where relevant commodities were produced — points for smallholder plots under 4 hectares, polygons for larger areas. A platform's ability to validate, store, and check this geolocation data is often the most technically demanding requirement, so it's worth testing directly rather than taking a feature list at face value.",
              ],
              [
                "Risk assessment methodology",
                "You're required to assess — and where risk isn't negligible, mitigate — the risk that a product isn't deforestation-free or wasn't produced illegally. Platforms differ in how automated this is: some provide country/region risk scoring or overlay satellite deforestation data against your geolocations, others leave the methodology largely to you.",
              ],
              [
                "Due diligence statement (DDS) generation",
                "The DDS is the formal record submitted before a product enters the EU market. A platform that generates and manages these statements — including reference numbers for downstream use — removes real manual work compared to one that only helps you gather the underlying data.",
              ],
              [
                "TRACES / EU Information System submission",
                "Due diligence statements are ultimately filed through the EU's official information system, built on the TRACES platform. Some platforms submit directly via this system; others export data for you to file yourself. Worth confirming rather than assuming.",
              ],
              [
                "Document management and audit trail",
                "Customs and competent authorities can request the evidence behind a due diligence statement. A platform with a clear, exportable audit trail — who supplied what data, when, and what changed — matters more the more suppliers and shipments you handle.",
              ],
              [
                "Supplier portal (self-service submission)",
                "If you have more than a handful of suppliers, whether they can log in and submit their own data — rather than you chasing spreadsheets by email — changes how much ongoing admin this adds to your team.",
              ],
              [
                "ERP integration",
                "If commodity, purchase order, or shipment data already lives in an ERP or procurement system, a platform that connects to it directly avoids duplicate data entry. Matters far less if you're working from a small, stable supplier list you're happy to enter manually.",
              ],
              [
                "Commodity coverage",
                "EUDR covers seven commodities — cattle, cocoa, coffee, oil palm, rubber, soya, wood — and their derived products. Not every platform covers all seven equally well; confirm a platform genuinely supports your specific commodity and sourcing geography, not just \"EUDR\" generically.",
              ],
              [
                "Operator vs. trader workflow support",
                "EUDR defines two roles with different obligations: an operator is the entity that first places a relevant product on the EU market (or makes it available, if produced in the EU); a trader is any other business that makes the product available further down the supply chain. Operators carry the full due diligence burden; traders' obligations are narrower, especially for SME traders. A platform built for full operator workflows can be more than a trader actually needs.",
              ],
              [
                "Company size fit (SME vs. enterprise)",
                "Platforms built for large importers with dedicated compliance teams often assume a scale and workflow complexity a small trader or producer doesn't have — and price accordingly. A smaller business is usually better served by a tool sized for its actual supplier count and team.",
              ],
              [
                "Pricing model and transparency",
                "Per-supplier, per-shipment, flat subscription, or custom quote only — the pricing model affects whether a platform is a predictable cost or an open-ended one as your supplier base grows. Published pricing is the exception, not the norm, in this category.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <h3 className="font-sans font-semibold text-[19px] mb-[7px]">{title}</h3>
                <p className="text-[15px] leading-[1.6] text-[#5c6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-11 max-w-[24ch]">
            What your brief will cover
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              ["Due diligence & risk", "Risk assessment, due diligence statements and your role in the supply chain."],
              ["Supplier data & geolocation", "Supplier collection, plot-level geolocation and how far along you already are."],
              ["Traceability & audit trail", "Tracing products to origin and keeping a defensible record for audits."],
              ["Systems & integration", "Your current ERP or procurement system, and what a new tool needs to connect to."],
            ].map(([title, body]) => (
              <div key={title} className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-6">
                <h3 className="font-sans font-semibold text-[20px] mb-2">{title}</h3>
                <p className="text-[15px] text-[#5c6573]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="small-business" className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center bg-[#eef1f8] rounded-2xl p-7 sm:p-14">
            <div>
              <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                For small businesses
              </p>
              <h2 className="font-sans font-semibold text-[clamp(27px,3.6vw,38px)] leading-[1.12] mb-4 text-pretty">
                EUDR software for small businesses and SMEs
              </h2>
              <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-4 max-w-[52ch]">
                Most EUDR compliance software is built and priced for large importers with a dedicated
                compliance team. A small roaster, trader, or producer figuring this out alongside
                everything else it takes to run the business usually has genuinely different
                requirements, not just a smaller budget — often a simpler, more affordable EUDR tool
                fits better than an enterprise platform sized for a team you don&apos;t have.
              </p>
              <p className="text-[15px] text-[#5c6573] max-w-[52ch]">
                Tell us about your business and we&apos;ll identify EUDR software providers that appear
                appropriate to your size and requirements, not just the platforms built for the largest
                importers in the category.
              </p>
            </div>
            <Link
              href={eudrHref}
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap shadow-[0_6px_18px_rgba(79,70,229,0.24)] hover:bg-[#4338ca]"
            >
              Find EUDR software for my business →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em]">
            Questions buyers ask us
          </h2>
          <div className="grid gap-[26px]">
            {[
              [
                "How do you choose the three providers?",
                "We publish your brief to providers in the category. Any provider can review it and choose to respond — the providers you hear from are the ones that believe they can meet your requirements, not a ranking we've made.",
              ],
              [
                "How do I choose EUDR software?",
                "Start with what you actually need to prove: which commodities and suppliers are in scope, how much geolocation data you already have, and what system it needs to connect to. That's exactly what our questions cover, so your brief reaches providers with enough detail to judge their own fit, rather than a generic top-10 list.",
              ],
              [
                "What does EUDR software actually do?",
                "It helps you meet the EU Deforestation Regulation's due diligence requirements in practice: collecting supplier and geolocation data, assessing and documenting risk, generating due diligence statements, and keeping an audit-ready record — replacing a process that would otherwise run through spreadsheets, email, and manual filing.",
              ],
              [
                "What should an EUDR software platform include?",
                "At minimum: supplier data collection, geolocation handling, a documented risk-assessment approach, due diligence statement generation, and an audit trail. Whether you also need a supplier portal, ERP integration, or direct submission to the EU's information system depends on your supplier count, existing systems, and role in the supply chain — see the comparison framework above.",
              ],
              [
                "What's the difference between EUDR software for operators vs. traders?",
                `Operators — the businesses that first place a covered product on the EU market, or make it available if produced in the EU — carry the full due diligence burden: geolocation, risk assessment, and filing the due diligence statement, with obligations applying from ${EUDR_DEADLINES.largeMedium.display} for large and medium operators. Traders further down the supply chain have narrower obligations, particularly SME traders, who mainly need to reference the due diligence statement from their supplier rather than generate their own. A platform built for full operator workflows is often more than a trader actually needs.`,
              ],
              [
                "Do small businesses and SMEs need EUDR software?",
                `If you place or trade any of the seven EUDR-covered commodities (cattle, cocoa, coffee, oil palm, rubber, soya, wood) or their derived products on the EU market, EUDR applies to you regardless of size — large operators and traders must comply from ${EUDR_DEADLINES.largeMedium.display}, and micro and small operators have longer, until ${EUDR_DEADLINES.microSmall.display}. Even with a later deadline, an SME's requirements — supplier count, budget, and how much of this data is already systemized — are usually different from an enterprise's, not just smaller.`,
              ],
              [
                "What EUDR software is suitable for small businesses?",
                "It depends on your supplier count and budget, which is exactly why we ask — a platform built for a large importer with a compliance team is usually the wrong fit (and the wrong price) for a small business handling this themselves. Tell us your size, and it becomes part of the brief providers see before deciding whether to respond.",
              ],
              [
                "Is it really free?",
                "Yes. Buyers never pay. Software providers pay to be introduced to buyers who are actively looking.",
              ],
              [
                "How long does it take?",
                "The questions take a few minutes. Provider replies arrive by email within 24 hours.",
              ],
              [
                "Do I have to speak to all of them?",
                "No. You choose which providers to talk to, if any. There's no obligation and no sales pressure from us.",
              ],
            ].map(([q, a]) => (
              <div key={q}>
                <h3 className="font-sans font-semibold text-[21px] mb-[7px]">{q}</h3>
                <p className="text-[16px] text-[#3d4653]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-19 pb-25">
          <div className="bg-[#eef1f8] rounded-2xl p-7 sm:p-14 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="font-sans font-semibold text-[clamp(27px,3.6vw,38px)] leading-[1.1] mb-3">
                Tell us what your EUDR compliance needs to cover
              </h2>
              <p className="text-[17px] text-[#3d4653] max-w-[46ch]">
                A few questions. Three providers that believe they fit. You decide from there.
              </p>
            </div>
            <Link
              href={eudrHref}
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap hover:bg-[#4338ca]"
            >
              Find EUDR software →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
