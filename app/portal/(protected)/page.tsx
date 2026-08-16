import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { requirePartner } from "@/lib/portal-auth";
import type { PartnerLead } from "@/lib/types";
import { PortalDashboard } from "./portal-dashboard";

export default async function PortalPage() {
  const supabase = await createClient();
  const [{ data, error }, { partner }] = await Promise.all([
    supabase.rpc("get_partner_leads"),
    requirePartner(),
  ]);

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
