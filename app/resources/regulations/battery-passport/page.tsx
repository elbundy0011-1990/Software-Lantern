import Link from "next/link";
import type { Metadata } from "next";
import { BATTERY_PASSPORT_DEADLINE } from "@/lib/battery-passport-dates";

export const metadata: Metadata = {
  title: "What Is a Battery Passport? The EU Battery Regulation Explained | Software Lantern",
  description:
    "What a battery passport is, how it differs from a Digital Product Passport, which batteries are in scope, and the current compliance deadline.",
  alternates: {
    canonical: "/resources/regulations/battery-passport",
  },
};

const h2 = "font-sans font-semibold text-[26px] leading-[1.2] tracking-[-0.02em] mt-16 mb-4";
const p = "text-[16px] leading-[1.7] text-[#3d4653] mb-4";
const link = "text-[#4f46e5] font-semibold";
const ul = "list-disc pl-6 mb-4 grid gap-2 text-[16px] leading-[1.7] text-[#3d4653]";

export default function BatteryPassportRegulationArticlePage() {
  return (
    <main data-screen-label="Battery Passport regulation article">
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
            <span className="text-[#c2c8d1]">/</span> Battery Passport
          </p>

          <h1 className="font-sans font-semibold text-[clamp(32px,4.4vw,44px)] leading-[1.1] tracking-[-0.03em] mb-3">
            What Is a Battery Passport? The EU Battery Regulation Explained
          </h1>
          <p className="text-[15px] text-[#79818f] mb-14">
            An explainer on the regulation itself — for software-specific guidance, see{" "}
            <Link href="/battery-passport" className={link}>
              Battery Passport software
            </Link>
            .
          </p>

          <p className={`${p} text-[19px] leading-[1.6] text-[#0d1117]`}>
            A battery passport is a digital record, required under the EU Battery Regulation
            (Regulation (EU) 2023/1542, Article 77), that has to accompany a battery placed on the
            EU market — accessible via a QR code and carrying the lifecycle data regulators, market
            surveillance bodies, and recyclers need to verify compliance.
          </p>

          <h2 className={h2}>Digital Product Passport vs. Battery Passport</h2>
          <p className={p}>
            &ldquo;Battery passport&rdquo; and &ldquo;digital product passport (DPP)&rdquo; are
            related but not the same thing. DPP is the broader concept the EU is rolling out across
            many product categories under separate legislation (the Ecodesign for Sustainable
            Products Regulation, ESPR); the battery passport is the specific, already-regulated
            implementation for batteries, with its own legal basis in the Battery Regulation. Some
            software platforms are built specifically for battery passports; others are general DPP
            tools configured to handle batteries as one product category among several.
          </p>

          <h2 className={h2}>Which batteries need a passport?</h2>
          <p className={p}>
            The requirement applies to <strong>EV batteries</strong>,{" "}
            <strong>LMT batteries</strong> (light means of transport — e-bikes, e-scooters, and
            similar), and <strong>industrial batteries above 2 kWh</strong>. Portable and
            starting-lighting-ignition (SLI) batteries are not currently in scope. The passport
            requirement applies from <strong>{BATTERY_PASSPORT_DEADLINE.display}</strong>.
          </p>

          <h2 className={h2}>What a battery passport has to cover</h2>
          <p className={p}>
            The detailed data requirements are set out in the regulation&apos;s annexes rather than
            in a single short list, but a battery passport is generally expected to cover things
            like:
          </p>
          <ul className={ul}>
            <li>Manufacturer identity, battery model, and manufacturing details</li>
            <li>Material composition and the presence of hazardous substances</li>
            <li>Carbon footprint, declared per manufacturing batch</li>
            <li>Recycled content share for key materials (cobalt, lithium, lead, nickel)</li>
            <li>Supply chain due diligence documentation</li>
            <li>Performance and durability data, including State of Health, updated over the battery&apos;s life</li>
            <li>Safety and dismantling information for repairers and recyclers</li>
          </ul>
          <p className={`${p} text-[15px] text-[#79818f]`}>
            Not all of this data is visible to everyone — the regulation tiers access between the
            general public, regulators, and recycling-service operators. Treat this list as a
            practical summary of what buyers should expect a passport to cover, not an exhaustive
            legal enumeration — confirm the specific data fields required for your product against
            the regulation&apos;s own annexes or a qualified advisor.
          </p>

          <p className={`${p} text-[15px] text-[#79818f]`}>
            This article is a general guide, not legal advice. Confirm your specific obligations
            against the regulation itself or with a qualified advisor.
          </p>

          <div className="mt-14 bg-[#eef1f8] rounded-2xl p-7 sm:p-10">
            <h2 className="font-sans font-semibold text-[24px] leading-[1.2] mb-3">
              Looking for battery passport software?
            </h2>
            <p className="text-[16px] text-[#3d4653] mb-6 max-w-[52ch]">
              Tell us where you sit in the value chain and what your passport needs to cover, and
              we&apos;ll connect you with providers that believe they can help.
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
