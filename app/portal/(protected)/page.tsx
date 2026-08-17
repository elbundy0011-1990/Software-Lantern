import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { requirePartner } from "@/lib/portal-auth";
import type { PartnerLead } from "@/lib/types";
import { PortalDashboard } from "./portal-dashboard";

// Gate #1's UI half: get_partner_leads() already returns zero rows for a
// pending/rejected partner (enforced in the RPC itself, see
// supabase/schema.sql), but showing that as a bare empty leads list would
// be a confusing dead end. This checks the partner's own status directly
// (legal under the existing "partners read own row" RLS policy, no new
// policy needed) and shows an honest reason instead.
function PendingScreen() {
  return (
    <div className="max-w-[520px] mx-auto text-center py-20">
      <p className="mb-2 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
        Application status
      </p>
      <h1 className="font-sans font-semibold text-[28px] mb-3">Your application is under review</h1>
      <p className="text-[16px] leading-[1.6] text-[#5c6573]">
        We review new provider applications by hand. Once approved, matching briefs will appear here
        automatically. If it&apos;s been a while, email{" "}
        <a href="mailto:jdb@softwarelantern.com" className="text-[#4f46e5] font-semibold">
          jdb@softwarelantern.com
        </a>
        .
      </p>
    </div>
  );
}

function RejectedScreen() {
  return (
    <div className="max-w-[520px] mx-auto text-center py-20">
      <p className="mb-2 text-[12px] font-bold tracking-[0.09em] uppercase text-[#79818f]">
        Application status
      </p>
      <h1 className="font-sans font-semibold text-[28px] mb-3">Your application wasn&apos;t approved</h1>
      <p className="text-[16px] leading-[1.6] text-[#5c6573]">
        This account doesn&apos;t have access to the provider portal. If you think this is a mistake,
        email{" "}
        <a href="mailto:jdb@softwarelantern.com" className="text-[#4f46e5] font-semibold">
          jdb@softwarelantern.com
        </a>
        .
      </p>
    </div>
  );
}

export default async function PortalPage() {
  const supabase = await createClient();
  const [{ data, error }, { partner }] = await Promise.all([
    supabase.rpc("get_partner_leads"),
    requirePartner(),
  ]);

  if (partner.status === "pending") return <PendingScreen />;
  if (partner.status === "rejected") return <RejectedScreen />;

  return (
    <Suspense fallback={null}>
      <PortalDashboard
        leads={(data as PartnerLead[] | null) || []}
        loadError={!!error}
        partnerCategories={(partner.categories as string[] | undefined) || []}
      />
    </Suspense>
  );
}
