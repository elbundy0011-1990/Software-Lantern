import Link from "next/link";
import { requirePartner } from "@/lib/portal-auth";
import { Logo } from "@/components/logo";
import { PortalSignOutButton } from "./sign-out-button";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { partner } = await requirePartner();
  const initials = partner.company_name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <header className="sticky top-0 z-40 bg-white/[0.86] backdrop-blur-[8px] border-b border-[#0d1117]/[0.07]">
        <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-4 flex items-center gap-8">
          <Link href="/portal" className="flex items-center">
            <Logo height={34} />
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <span className="flex items-center gap-[9px] text-[14px] font-semibold text-[#3d4653] whitespace-nowrap">
              <span className="w-7 h-7 rounded-full bg-[#4f46e5]/[0.10] grid place-items-center text-[11px] font-bold text-[#4338ca]">
                {initials}
              </span>
              {partner.company_name}
            </span>
            <Link href="/portal/account" className="text-[14px] font-semibold text-[#5c6573] hover:text-[#4f46e5]">
              Account
            </Link>
            <PortalSignOutButton />
          </div>
        </div>
      </header>
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-10">{children}</div>
    </div>
  );
}
