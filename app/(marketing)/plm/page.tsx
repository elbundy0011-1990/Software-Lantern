import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fashion PLM Software | Compare Providers & Get Matched",
  description:
    "Looking for fashion PLM software? Tell us about your brand, products and requirements — we'll connect you with up to 3 fashion PLM providers that believe they can help.",
  alternates: {
    canonical: "/plm",
  },
  openGraph: {
    title: "Fashion PLM Software | Compare Providers & Get Matched",
    description:
      "Tell us about your brand, products and requirements — we'll connect you with up to 3 fashion PLM providers that believe they can help.",
    url: "/plm",
  },
};

const plmHref = `/finder?category=${encodeURIComponent("Product Lifecycle Management (PLM)")}`;

export default function PlmPage() {
  return (
    <main data-screen-label="PLM category page">
      <section className="relative overflow-hidden border-b border-[#0d1117]/[0.07]">
        <div className="absolute -top-[200px] -right-[140px] w-[700px] h-[560px] pointer-events-none bg-[radial-gradient(closest-side,rgba(16,185,129,0.10),rgba(255,255,255,0))]" />
        <div className="relative max-w-[1160px] mx-auto px-5 sm:px-8 pt-10 pb-[88px]">
          <p className="mb-10 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Software categories{" "}
            <span className="text-[#c2c8d1]">/</span> Fashion PLM software
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-[72px] items-start">
            <div>
              <h1 className="font-sans font-semibold text-[clamp(34px,5.6vw,58px)] leading-[1.06] tracking-[-0.035em] mb-[22px] text-pretty">
                Looking for fashion PLM software?
              </h1>
              <p className="text-[20px] leading-[1.5] text-[#3d4653] mb-4 max-w-[42ch]">
                Fashion PLM is a crowded market, and the right platform depends on your product
                development workflow, collection complexity, sourcing model and supplier network.
                Comparing every option yourself can take weeks.
              </p>
              <p className="text-[17px] text-[#5c6573] mb-[34px] max-w-[48ch]">
                Tell us about your brand and requirements, and we&apos;ll publish your brief to fashion PLM
                providers in the category — up to 3 who believe they&apos;re a fit will respond. Not a
                ranked list, and not a guess at which one is objectively best.
              </p>
              <Link
                href={plmHref}
                className="inline-block bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[19px] shadow-[0_6px_18px_rgba(79,70,229,0.28)] hover:bg-[#4338ca]"
              >
                Find my PLM →
              </Link>
              <p className="mt-6 text-[14px] font-semibold text-[#5c6573]">
                Free for buyers · No obligation · Providers respond by email within 24 hours
              </p>
            </div>
            <div
              className="border border-[#0d1117]/[0.08] rounded-2xl p-[30px] pb-[26px]"
              style={{
                backgroundImage:
                  "linear-gradient(160deg, rgba(246,247,251,0.55) 0%, rgba(238,241,248,0.42) 100%), url('/plm-industry-bg.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <p className="mb-[18px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                By industry
              </p>
              <div className="grid">
                {[
                  "Fashion & apparel PLM",
                  "Footwear PLM",
                  "Accessories PLM",
                  "Fashion retail PLM",
                ].map((label, i, arr) => (
                  <Link
                    key={label}
                    href={plmHref}
                    className={`flex justify-between items-center py-[13px] px-3 -mx-3 rounded-lg font-semibold text-[#0d1117] transition-colors duration-150 hover:bg-white/[0.6] hover:text-[#4338ca] focus-visible:bg-white/[0.6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] ${
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

      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-21">
          <div className="max-w-[860px]">
            <h2 className="font-sans font-semibold text-[clamp(28px,3.8vw,40px)] leading-[1.1] tracking-[-0.03em] mb-4">
              What is fashion PLM software?
            </h2>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Fashion PLM (Product Lifecycle Management) software is the system fashion and apparel
              companies use to manage a product from first sketch to shipped order: tech packs, bills of
              materials, sampling, supplier collaboration, costing, and collection calendars, all in one
              place instead of spreadsheets and email. It differs meaningfully from generic PLM used in
              industries like automotive or industrial manufacturing — fashion-specific platforms are
              built around seasons, colourways, sizing, and fast-moving supplier networks rather than
              long, fixed product cycles.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-3">
              Which platform fits best depends on your collection complexity, SKU count, and sourcing
              model — a small direct-to-consumer brand usually needs a lighter tool than a multi-brand
              group coordinating dozens of supplier relationships across several product categories.
            </p>
            <p className="text-[17px] leading-[1.6] text-[#3d4653]">
              If your sourcing involves EUDR-relevant materials — leather, rubber, or other regulated
              commodities — you may also want{" "}
              <Link href="/eudr" className="text-[#4f46e5] font-semibold">
                EUDR compliance software
              </Link>
              .
            </p>
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
              ["Product development", "Line planning, seasonal calendars, tech packs and revisions."],
              ["BOM & materials", "Bills of materials, libraries, colourways and component data."],
              ["Supplier collaboration", "Sampling rounds, comments and approvals with factories."],
              ["Costing & compliance", "Target costing, margins, sustainability and audit trails."],
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
                "We publish your brief to providers in the category. Any provider can review it and choose to respond — the providers you hear from are the ones that believe they can meet your requirements, not a ranking we've made.",
              ],
              [
                "How do I choose a fashion PLM system?",
                "Start with your product development workflow and where it breaks down today — tech packs, BOM, supplier collaboration, costing, or all of the above. That's exactly what our questions cover, so your brief reaches providers with enough detail for them to judge their own fit to your workflow and company size, not a generic top-10 list.",
              ],
              [
                "What's the difference between general PLM and fashion PLM?",
                "General PLM, used in industries like automotive and industrial manufacturing, is usually built around long, fixed product cycles. Fashion PLM is built around seasons, colourways, sizing, and fast-moving supplier networks — which is why a generic PLM platform is rarely the right fit for a fashion or apparel business.",
              ],
              [
                "Is it really free?",
                "Yes. Buyers never pay. Software providers pay to be introduced to buyers who are actively looking.",
              ],
              [
                "How long does it take?",
                "The questions take about three minutes. Provider replies arrive by email within 24 hours.",
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
                Tell us what your PLM needs to do
              </h2>
              <p className="text-[17px] text-[#3d4653] max-w-[46ch]">
                Six questions. Three providers that believe they fit. You decide from there.
              </p>
            </div>
            <Link
              href={plmHref}
              className="justify-self-start lg:justify-self-end bg-[#4f46e5] text-white rounded-full px-6 sm:px-8 py-[17px] font-sans font-semibold text-[18px] whitespace-nowrap hover:bg-[#4338ca]"
            >
              Find my PLM →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
