import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { SignOutButton } from "./sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <header className="bg-white border-b border-[#0d1117]/[0.08]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex items-center gap-6">
          <Link href="/admin" className="font-sans font-semibold text-[18px] text-[#0d1117]">
            Software Lantern <span className="text-[#4f46e5]">Admin</span>
          </Link>
          <span className="ml-auto text-[14px] text-[#5c6573]">{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10">{children}</div>
    </div>
  );
}
