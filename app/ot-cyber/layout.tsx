import type { Metadata } from "next";

// Deliberately not nested under app/(marketing) and not linked from its
// nav: per docs/OT-CYBER-PLAN.md §3, this is being built toward a
// separate brand/domain, sharing this codebase and infra via host-based
// routing once a domain is chosen (open decision §7.1) — not a new
// section of softwarelantern.com. Until that domain exists, these pages
// are reachable only by direct URL, carry their own noindex below
// (belt-and-suspenders alongside Vercel's own preview noindex header),
// and are deliberately left out of app/sitemap.ts and app/robots.ts's
// allow list — see the explicit disallow entry added there instead.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OtCyberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f8faf9" }}>
      <header className="border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-4">
          <span className="font-sans font-semibold text-[17px] text-[#0d1117]">
            OT Cybersecurity Readiness
          </span>
          <span className="ml-2 text-[12px] text-[#79818f]">
            (working name, not yet finalized)
          </span>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#0d1117]/[0.07] mt-10">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 text-[13px] text-[#79818f]">
          <p>This is a preview build. Not yet publicly announced or finalized.</p>
        </div>
      </footer>
    </div>
  );
}
