"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } finally {
          router.push("/admin/login");
          router.refresh();
        }
      }}
      className="border border-[#0d1117]/[0.12] rounded-full px-4 py-[8px] text-[14px] font-semibold text-[#3d4653] hover:bg-[#0d1117]/[0.05]"
    >
      Sign out
    </button>
  );
}
