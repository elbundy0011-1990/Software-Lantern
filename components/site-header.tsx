"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";

const NAV_CATEGORIES = [
  {
    label: "EUDR Software",
    blurb: "Deforestation due diligence, geolocation and compliance reporting",
    href: "/eudr",
  },
  {
    label: "Product Lifecycle Management (PLM)",
    blurb: "Tech packs, BOM, materials and supplier collaboration",
    href: "/plm",
  },
  {
    label: "Digital Battery Passport (DBP)",
    blurb: "Traceability, carbon data and the QR-linked passport",
    href: "/battery-passport",
  },
];

const REGULATIONS = [
  {
    label: "EUDR",
    blurb: "EU Deforestation Regulation: due diligence and geolocation",
    href: "/eudr",
  },
  {
    label: "EU Battery Regulation",
    blurb: "Digital battery passport, carbon footprint and due diligence",
    href: "/battery-passport",
  },
  {
    label: "ESPR",
    blurb: "Ecodesign for Sustainable Products and the digital product passport",
    href: "/finder",
  },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [regMenuOpen, setRegMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/[0.86] backdrop-blur-[8px] border-b border-[#0d1117]/[0.07]">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-4 flex items-center gap-8">
        <Link href="/" aria-label="Software Lantern home" className="flex items-center">
          <Logo height={34} />
        </Link>

        <nav className="hidden min-[1041px]:flex items-center gap-[26px] ml-auto text-[15px] font-semibold">
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-[7px] bg-transparent border-0 py-2 cursor-pointer whitespace-nowrap"
              style={{ color: menuOpen ? "#4f46e5" : "#3d4653" }}
            >
              Find providers
              <span
                className="block w-[7px] h-[7px] border-r-2 border-b-2 -mt-[3px] transition-transform duration-150"
                style={{ borderColor: "currentColor", transform: menuOpen ? "rotate(-135deg)" : "rotate(45deg)" }}
              />
            </button>
            {menuOpen && (
              <div className="absolute top-full -left-5 w-[380px] pt-3">
                <div className="bg-white border border-[#0d1117]/[0.09] rounded-[18px] p-3 shadow-[0_24px_60px_rgba(13,17,23,0.14),0_2px_6px_rgba(13,17,23,0.04)]">
                  <p className="mx-[10px] mt-[6px] mb-[10px] text-[11px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                    Software categories
                  </p>
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-left bg-transparent rounded-xl px-[10px] py-[11px] transition-colors duration-130 hover:bg-[#4f46e5]/[0.08]"
                    >
                      <span className="block text-[15px] font-semibold text-[#0d1117]">{cat.label}</span>
                      <span className="block text-[13px] font-medium text-[#5c6573] leading-[1.4]">{cat.blurb}</span>
                    </Link>
                  ))}
                  <div className="mx-[10px] mt-[10px] mb-1 pt-3 border-t border-[#0d1117]/[0.07]">
                    <Link
                      href="/finder"
                      onClick={() => setMenuOpen(false)}
                      className="bg-transparent text-[14px] font-semibold text-[#4f46e5]"
                    >
                      Not sure which? Tell us what you need →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/#how-it-works" className="bg-transparent whitespace-nowrap" style={{ color: "#3d4653" }}>
            How it works
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setRegMenuOpen(true)}
            onMouseLeave={() => setRegMenuOpen(false)}
          >
            <button
              onClick={() => setRegMenuOpen((v) => !v)}
              className="flex items-center gap-[7px] bg-transparent border-0 py-2 cursor-pointer whitespace-nowrap"
              style={{ color: regMenuOpen ? "#4f46e5" : "#3d4653" }}
            >
              Regulations
              <span
                className="block w-[7px] h-[7px] border-r-2 border-b-2 -mt-[3px] transition-transform duration-150"
                style={{ borderColor: "currentColor", transform: regMenuOpen ? "rotate(-135deg)" : "rotate(45deg)" }}
              />
            </button>
            {regMenuOpen && (
              <div className="absolute top-full -left-5 w-[360px] pt-3">
                <div className="bg-white border border-[#0d1117]/[0.09] rounded-[18px] p-3 shadow-[0_24px_60px_rgba(13,17,23,0.14),0_2px_6px_rgba(13,17,23,0.04)]">
                  <p className="mx-[10px] mt-[6px] mb-[10px] text-[11px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                    EU regulations
                  </p>
                  {REGULATIONS.map((reg) => (
                    <Link
                      key={reg.label}
                      href={reg.href}
                      onClick={() => setRegMenuOpen(false)}
                      className="block w-full text-left bg-transparent rounded-xl px-[10px] py-[11px] transition-colors duration-130 hover:bg-[#4f46e5]/[0.08]"
                    >
                      <span className="block text-[15px] font-semibold text-[#0d1117]">{reg.label}</span>
                      <span className="block text-[13px] font-medium text-[#5c6573] leading-[1.4]">{reg.blurb}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/finder"
            className="bg-[#4f46e5] text-white rounded-full px-[22px] py-[11px] font-semibold text-[15px] whitespace-nowrap hover:bg-[#4338ca]"
          >
            Find my software
          </Link>
        </nav>
      </div>
    </header>
  );
}
