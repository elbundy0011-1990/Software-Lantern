import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Battery Passport Software | Compare Providers & Get Matched",
  description:
    "Looking for battery passport software? Tell us about your product and data requirements — we'll connect you with up to 3 digital battery passport software providers that believe they can help.",
  alternates: {
    canonical: "/battery-passport",
  },
  openGraph: {
    title: "Battery Passport Software | Compare Providers & Get Matched",
    description:
      "Tell us about your product and data requirements — we'll connect you with up to 3 battery passport software providers that believe they can help.",
    url: "/battery-passport",
  },
};

const batteryHref = `/finder?category=${encodeURIComponent("Digital Battery Passport (DBP)")}`;

export default function BatteryPassportPage() {
  return (
    <main data-screen-label="Battery Passport category page">
      <section className="relative overflow-hidden border-b border-[#0d1117]/[0.07]">
        <div className="absolute -top-[200px] -right-[140px] w-[700px] h-[560px] pointer-events-none bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),rgba(255,255,255,0))]" />
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-10 pb-[88px]">
          <p className="mb-10 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Software categories{" "}
            <span className="text-[#c2c8d1]">/</span> Battery Passport software
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[72px] items-start">
            <div>
              <h1 className="font-sans font-semibold text-[clamp(34px,5.6vw,58px)] leading-[1.06] tracking-[-0.035em] mb-[22px] text-pretty">
                Looking for battery passport software?
              </h1>
              <p className="text-[20px] leading-[1.5] text-[#3d4653] mb-4 max-w-[42ch]">
                Battery passport software spans everything from carbon-accounting add-ons to full
                lifecycle platforms, and the right fit depends on your product type, where you sit in the
                value chain, and what data your passport needs to carry. Comparing every option yourself
                can take weeks.
              </p>
              <p className="text-[17px] text-[#5c6573] mb-[34px] max-w-[48ch]">
                Tell us about your product and requirements, and we&apos;ll identify up to 3 battery
                passport software providers that appear relevant to your specific situation — not a
                ranked list, and not a guess at which one is objectively best.
              </p>
              <Link
                href={batteryHref}
                className="inline-block bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[19px] shadow-[0_6px_18px_rgba(79,70,229,0.28)] hover:bg-[#4338ca]"
              >
                Find battery passport software →
              </Link>
              <p className="mt-6 text-[14px] font-semibold text-[#5c6573]">
                Free for buyers · No obligation · Matches by email within 24 hours
              </p>
            </div>
            <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-[30px] pb-[26px]">
              <p className="mb-[18px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                By position in the chain
              </p>
              <div className="grid">
                {["Cell manufacturers", "Pack assemblers", "Automotive OEMs", "Energy storage"].map(
                  (label, i, arr) => (
                    <Link
                      key={label}
                      href={batteryHref}
                      className={`flex justify-between items-center py-[13px] px-1 font-semibold text-[#0d1117] ${
                        i < arr.length - 1 ? "border-b border-[#0d1117]/[0.07]" : ""
                      }`}
                    >
                      {label} <span className="text-[#4338ca]">→</span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px]">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              What is battery passport software?
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Battery passport software helps battery manufacturers and the companies in their supply
              chain collect, structure, and report the lifecycle data the EU Battery Regulation (EU
              2023/1542, Article 77) requires: material traceability, carbon footprint, recycled content,
              State of Health data, and the QR-linked digital passport itself — usually pulling data from
              suppliers, ERP, and PLM systems into one connected record instead of scattered spreadsheets.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              &ldquo;Battery passport&rdquo; and &ldquo;digital product passport (DPP)&rdquo; are related
              but not the same thing: DPP is the broader concept covering many product categories, while
              battery passport is the specific, regulated implementation for batteries. Some platforms are
              battery-specific; others are general DPP tools configured for batteries — both can be a
              genuine fit depending on whether batteries are your only product line or one of several.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Which is the better starting point for you depends on where you sit in the value chain and
              how much of this data you already have systemized — a cell manufacturer&apos;s requirements
              look very different from an automotive OEM&apos;s or an energy storage company&apos;s.
            </p>
            <p className="text-[15px] leading-[1.6] text-[#79818f]">
              Software Lantern does not provide legal advice, regulatory certification, or a compliance
              guarantee. We help you find and compare software providers whose platforms may fit your
              battery passport requirements — always confirm your specific obligations with the official
              EU sources or your own legal/compliance advisors.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f7fb] border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-11 max-w-[24ch]">
            What we&apos;ll match you on
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]">
            {[
              ["Position in the chain", "Cell manufacturer, pack assembler, automotive OEM, energy storage or materials supplier."],
              ["Passport data scope", "Material traceability, carbon footprint, due diligence data, State of Health, and more."],
              ["Current systems", "What you use today and what a new tool needs to integrate with."],
              ["Timeline", "How soon you need this live, and how that shapes which providers make sense."],
            ].map(([title, body]) => (
              <div key={title} className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-6">
                <h3 className="font-sans font-semibold text-[20px] mb-2">{title}</h3>
                <p className="text-[15px] text-[#5c6573]">{body}</p>
              </div>
            ))}
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
                "We take your requirements to providers in the category and share your brief with those whose platform is a plausible fit. The three you receive are providers that believe they can meet your requirements, not a ranking.",
              ],
              [
                "Which companies need battery passport software?",
                "Battery cell and pack manufacturers, automotive OEMs involved in batteries, light-transport manufacturers (e-bikes, e-scooters), industrial battery makers, and energy storage companies are the core audience — broadly, anyone placing batteries in scope of the EU Battery Regulation on the EU market.",
              ],
              [
                "How can I compare battery passport providers?",
                "Start with where you sit in the value chain and exactly what data the passport needs to carry for your product — that's what determines whether you need a battery-specific platform or a broader DPP tool, and it's exactly what our questions are built around.",
              ],
              [
                "Is Battery Passport software the same as Digital Product Passport software?",
                "Related, but not the same. Digital Product Passport (DPP) is the broader concept covering many product categories; Battery Passport is the specific, regulated implementation for batteries. Some platforms are battery-specific, others are general DPP tools configured for batteries — which one fits depends on whether batteries are your only product line.",
              ],
              [
                "Is it really free?",
                "Yes. Buyers never pay. Software providers pay to be introduced to buyers who are actively looking.",
              ],
              [
                "How long does it take?",
                "The questions take a few minutes. Your matches arrive by email within 24 hours.",
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
                Tell us what your battery passport needs to cover
              </h2>
              <p className="text-[17px] text-[#3d4653] max-w-[46ch]">
                A few questions. Three providers that believe they fit. You decide from there.
              </p>
            </div>
            <Link
              href={batteryHref}
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap hover:bg-[#4338ca]"
            >
              Find battery passport software →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
