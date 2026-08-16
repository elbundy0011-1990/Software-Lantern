import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EU Regulations for Compliance Software Buyers | Software Lantern",
  description:
    "Plain-language explainers on the EU regulations behind Software Lantern's categories — what they require, who they apply to, and current deadlines.",
  alternates: {
    canonical: "/resources/regulations",
  },
};

const ARTICLES = [
  {
    label: "EUDR",
    title: "What Is EUDR? The EU Deforestation Regulation Explained",
    blurb:
      "Who EUDR applies to, what due diligence it actually requires, and the current compliance deadlines.",
    href: "/resources/regulations/eudr",
  },
  {
    label: "EU Battery Regulation",
    title: "What Is a Battery Passport? The EU Battery Regulation Explained",
    blurb:
      "What a battery passport has to contain, how it differs from a Digital Product Passport, and which batteries are in scope.",
    href: "/resources/regulations/battery-passport",
  },
];

export default function RegulationsHubPage() {
  return (
    <main data-screen-label="Regulations hub">
      <section className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-16 pb-20">
          <p className="mb-8 text-[14px] text-[#79818f]">
            <Link href="/" className="text-[#4f46e5] font-semibold">
              Home
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span>{" "}
            <Link href="/resources/blog" className="text-[#4f46e5] font-semibold">
              Resources
            </Link>{" "}
            <span className="text-[#c2c8d1]">/</span> Regulations
          </p>

          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-4">
            EU Regulations for Compliance Software Buyers
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#3d4653] mb-14 max-w-[60ch]">
            Plain-language explainers on the regulations behind Software Lantern&apos;s categories —
            what they actually require, not marketing copy about them.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ARTICLES.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="block bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-7 hover:border-[#4f46e5]/[0.4] transition-colors duration-150"
              >
                <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                  {a.label}
                </p>
                <h2 className="font-sans font-semibold text-[21px] leading-[1.25] mb-2">{a.title}</h2>
                <p className="text-[15px] text-[#5c6573] leading-[1.5]">{a.blurb}</p>
                <span className="mt-4 inline-block text-[14px] font-semibold text-[#4338ca]">
                  Read the explainer →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
