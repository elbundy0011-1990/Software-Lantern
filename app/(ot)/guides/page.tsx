import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { OT_SITE_INDEXABLE } from "@/lib/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Guides: NIS2, Cyber Resilience Act & Machinery Regulation",
  description: "Source-cited guides on NIS2, the Cyber Resilience Act, the Machinery Regulation, and IEC 62443 for machine builders, operators, and integrators.",
  path: "/guides",
  noindex: !OT_SITE_INDEXABLE,
  siteName: "Software Lantern",
});

const GUIDES = [
  {
    href: "/guides/nis2-supply-chain-and-remote-access",
    title: "NIS2 supply chain and remote access, explained",
    body: "What Article 21(2) actually requires, and what it doesn't.",
  },
  {
    href: "/guides/cyber-resilience-act-for-machine-builders",
    title: "The Cyber Resilience Act for machine builders",
    body: "Product-level cybersecurity obligations, phased from September 2026.",
  },
  {
    href: "/guides/machinery-regulation-cybersecurity",
    title: "The Machinery Regulation's cybersecurity requirements",
    body: "New essential safety requirements linking cyberattacks to physical hazard, from January 2027.",
  },
  {
    href: "/guides/iec-62443-explained",
    title: "IEC 62443, explained",
    body: "A voluntary standard, not a law, though some customers or contracts require it.",
  },
];

export default function GuidesHubPage() {
  return (
    <main data-screen-label="Guides hub">
      <section>
        <div className="max-w-[760px] mx-auto px-5 sm:px-8 pt-16 pb-16">
          <h1 className="font-sans font-semibold text-[clamp(30px,4.2vw,42px)] leading-[1.1] tracking-[-0.03em] mb-8 text-[#1a1d22]">
            Guides
          </h1>
          <div className="grid gap-5">
            {GUIDES.map((g) => (
              <Link key={g.href} href={g.href} className="block rounded border border-[#3f4b52]/[0.2] bg-white px-6 py-6 hover:border-[#9a3412]">
                <h2 className="font-sans font-semibold text-[19px] mb-2 text-[#1a1d22]">{g.title}</h2>
                <p className="text-[14px] text-[#3f4b52]">{g.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
