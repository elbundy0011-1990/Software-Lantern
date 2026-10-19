import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";
import { ComplianceLedger } from "@/components/compliance-ledger";
// components/disclosure-slot.tsx is intentionally not imported/rendered
// here per the 2026-10-19 instruction; the file is kept unmodified so it
// can be reinstated once the real disclosure text is ready.

export const metadata: Metadata = pageMetadata({
  // 54 chars, ~497px at 20px Arial (same ~9.2px/char ratio lib/site.ts's
  // SITE_TITLE comment measured), comfortably under the ~600px SERP
  // truncation threshold. The original 83-char version measured ~764px by
  // the same ratio, well past it — shortened for the 2026-10-19 audit.
  title: "Secure Remote Access: NIS2, CRA & Machinery Regulation",
  description:
    "What NIS2/Cyberbeveiligingswet, the Cyber Resilience Act, and the Machinery Regulation mean for machine builders, factory operators, and system integrators in the Netherlands, Belgium, and Luxembourg.",
  path: "/",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const AUDIENCES = [
  {
    href: "/machine-builders",
    title: "Machine builder",
    body: "You design, build, or sell machinery or equipment. Your product has its own rules.",
  },
  {
    href: "/factory-operators",
    title: "Factory or plant operator",
    body: "You run production. Your organization and your suppliers' remote access both matter.",
  },
  {
    href: "/system-integrators",
    title: "System integrator",
    body: "You install or service equipment for others. You can sit on both sides of these rules.",
  },
];

export default function OtHomePage() {
  return (
    <main data-screen-label="OT Cybersecurity homepage">
      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 pt-16 pb-14">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#9a3412]">
            Practical OT security guidance
          </p>
          <h1 className="font-sans font-semibold text-[clamp(32px,4.8vw,52px)] leading-[1.08] tracking-[-0.03em] mb-5 text-[#1a1d22] text-left">
            Secure remote access to machines, under NIS2, the Cyber Resilience Act, and the
            Machinery Regulation
          </h1>
          <p className="text-[18px] leading-[1.6] text-[#3f4b52] mb-8 max-w-[640px]">
            For machine builders, factory operators, and system integrators in the Netherlands,
            Belgium, and Luxembourg. Three different EU rules, three different reasons they apply,
            explained plainly and cited.
          </p>
          <div className="flex flex-wrap items-start gap-x-3 gap-y-2 mb-10">
            <div>
              <Link
                href="/checker"
                className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-white inline-block"
                style={{ background: "#9a3412" }}
              >
                Check your situation →
              </Link>
              <p className="mt-2 text-[13px] text-[#3f4b52]">About 2 minutes. No email needed.</p>
            </div>
            <Link
              href="/guides"
              className="rounded px-6 py-[13px] font-sans font-semibold text-[15px] text-[#1a1d22] border border-[#3f4b52]/[0.3] inline-block"
            >
              Read the guides
            </Link>
          </div>
          <ComplianceLedger />
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-sans font-semibold text-[26px] mb-8 text-[#1a1d22]">Which of these is you?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {AUDIENCES.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="block rounded border border-[#3f4b52]/[0.2] bg-white px-6 py-7 hover:border-[#9a3412]"
              >
                <h3 className="font-sans font-semibold text-[19px] mb-2 text-[#1a1d22]">{a.title}</h3>
                <p className="text-[14px] text-[#3f4b52]">{a.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#3f4b52]/[0.15]">
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-sans font-semibold text-[26px] mb-6 text-[#1a1d22]">
            Three EU rules, three different things
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[15px] text-[#3f4b52]">
            <div>
              <p className="font-semibold text-[#1a1d22] mb-1">NIS2</p>
              <p>Regulates your organization: is your company managing cyber risk, if it&apos;s in scope.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1d22] mb-1">Cyber Resilience Act</p>
              <p>Regulates your product: is the machine itself built securely before it&apos;s placed on the market.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1a1d22] mb-1">Machinery Regulation</p>
              <p>Regulates safety, newly extended to cover cyberattacks that could create a physical hazard.</p>
            </div>
          </div>
          <p className="mt-6 text-[14px] text-[#3f4b52]">
            A machine builder can face all three at once, for the same machine, for different
            reasons. None of them name or require any specific product category.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-16">
          <h2 className="font-sans font-semibold text-[22px] mb-4 text-[#1a1d22]">Guides</h2>
          <div className="grid gap-2 text-[15px]">
            <Link href="/guides/nis2-supply-chain-and-remote-access" className="text-[#9a3412] hover:underline">
              NIS2 supply chain and remote access, explained
            </Link>
            <Link href="/guides/cyber-resilience-act-for-machine-builders" className="text-[#9a3412] hover:underline">
              The Cyber Resilience Act for machine builders
            </Link>
            <Link href="/guides/machinery-regulation-cybersecurity" className="text-[#9a3412] hover:underline">
              The Machinery Regulation&apos;s cybersecurity requirements
            </Link>
            <Link href="/guides/iec-62443-explained" className="text-[#9a3412] hover:underline">
              IEC 62443, explained
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
