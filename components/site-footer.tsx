import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#0d1117]/[0.07] bg-[#f6f7fb]">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 pt-[60px] pb-11 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
        <div>
          <Logo height={32} />
          <p className="mt-4 text-[15px] text-[#5c6573] max-w-[34ch]">
            Tell us what software you need. We&apos;ll connect you with 3 providers that believe they can help.
          </p>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">For buyers</p>
          <div className="grid gap-2 text-[15px]">
            <Link href="/finder" className="text-[#4f46e5] hover:text-[#4338ca]">Find my software</Link>
            <Link href="/#how-it-works" className="text-[#4f46e5] hover:text-[#4338ca]">How it works</Link>
            <Link href="/plm" className="text-[#4f46e5] hover:text-[#4338ca]">Fashion PLM software</Link>
            <Link href="/eudr" className="text-[#4f46e5] hover:text-[#4338ca]">
              EUDR software
            </Link>
            <Link href="/battery-passport" className="text-[#4f46e5] hover:text-[#4338ca]">
              Battery Passport software
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">For providers</p>
          <div className="grid gap-2 text-[15px]">
            <Link href="/providers" className="text-[#4f46e5] hover:text-[#4338ca]">Become a provider</Link>
            <Link href="/providers" className="text-[#4f46e5] hover:text-[#4338ca]">How matching works</Link>
            <Link href="/portal/login" className="text-[#4f46e5] hover:text-[#4338ca]">Provider login</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Company</p>
          <div className="grid gap-2 text-[15px]">
            <a href="mailto:hello@softwarelantern.com" className="text-[#4f46e5] hover:text-[#4338ca]">Contact</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto px-8 pb-11 text-[13px] text-[#79818f]">
        © {new Date().getFullYear()} Software Lantern. All rights reserved.
      </div>
    </footer>
  );
}
