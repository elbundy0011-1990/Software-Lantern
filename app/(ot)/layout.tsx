import Link from "next/link";
import type { Metadata } from "next";
import { OtLogo } from "@/components/ot-logo";

export const OT_TAGLINE = "Practical OT security guidance";

// Default metadata for the (ot) route group: the fallback every OT page
// would inherit if it didn't set its own pageMetadata() call. Every
// current page does set its own, so this never overrides anything
// today, but it's the one place a future page's metadata would fall
// back to, and it carries the tagline per the standing rule.
export const metadata: Metadata = {
  description: `${OT_TAGLINE}: what NIS2, the Cyber Resilience Act, and the Machinery Regulation mean for machine builders, factory operators, and system integrators in the Netherlands, Belgium, and Luxembourg.`,
};

// New site identity, deliberately separate from components/site-header.tsx
// / components/site-footer.tsx (the EUDR/PLM/Battery-Passport marketplace
// nav): this is the site's new public identity, and /admin, /portal, and
// the marketplace pages are deliberately not linked from here (constraint
// 8), while staying reachable at their existing URLs for anyone who
// already has them.
//
// The disclosure slot (components/disclosure-slot.tsx) is intentionally
// not rendered here per the 2026-10-19 instruction. The component is kept
// in the codebase, unmodified, so it can be reinstated with a single
// import + JSX line whenever the real disclosure text is ready.
const NAV = [
  { label: "Machine builders", href: "/machine-builders" },
  { label: "Factory operators", href: "/factory-operators" },
  { label: "System integrators", href: "/system-integrators" },
  { label: "Guides", href: "/guides" },
];

export default function OtLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f6f5f1" }}>
      <header className="border-b border-[#3f4b52]/[0.15] bg-[#f6f5f1]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-4 flex items-center gap-8">
          <Link href="/" aria-label="Software Lantern home" className="flex items-center gap-3">
            <OtLogo height={26} />
            <span className="hidden sm:inline text-[13px] font-semibold text-[#3f4b52]">{OT_TAGLINE}</span>
          </Link>
          <nav className="hidden min-[900px]:flex items-center gap-6 ml-auto text-[14px] font-semibold text-[#3f4b52]">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#9a3412]">
                {item.label}
              </Link>
            ))}
            <Link
              href="/checker"
              className="rounded px-4 py-[9px] font-semibold text-white whitespace-nowrap"
              style={{ background: "#9a3412" }}
            >
              Check your situation
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-[#3f4b52]/[0.15] mt-10">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-[14px]">
          <div className="sm:col-span-2">
            <OtLogo height={24} />
            <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.07em] text-[#9a3412]">{OT_TAGLINE}</p>
            <p className="text-[#3f4b52] max-w-[36ch] mt-2">
              Secure remote access to machines and OT, and what NIS2, the Cyber Resilience Act, and
              the Machinery Regulation mean for machine builders, factory operators, and system
              integrators in the Netherlands, Belgium, and Luxembourg.
            </p>
          </div>
          <div>
            <p className="mb-2 font-bold text-[12px] uppercase tracking-[0.07em] text-[#3f4b52]">Site</p>
            <div className="grid gap-2">
              <Link href="/checker" className="text-[#9a3412] hover:underline">Check your situation</Link>
              <Link href="/guides" className="text-[#9a3412] hover:underline">Guides</Link>
            </div>
          </div>
          <div>
            <p className="mb-2 font-bold text-[12px] uppercase tracking-[0.07em] text-[#3f4b52]">Legal</p>
            <div className="grid gap-2">
              <Link href="/privacy" className="text-[#9a3412] hover:underline">Privacy Policy</Link>
              <a href="mailto:info@softwarelantern.com" className="text-[#9a3412] hover:underline">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
