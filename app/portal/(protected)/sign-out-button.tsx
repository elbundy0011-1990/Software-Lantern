"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function PortalSignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } finally {
          router.push("/portal/login");
          router.refresh();
        }
      }}
      className="border border-[#0d1117]/[0.12] rounded-full px-[18px] py-[9px] font-sans font-semibold text-[14px] text-[#3d4653] hover:bg-[#0d1117]/[0.05]"
    >
      Sign out
    </button>
  );
}
