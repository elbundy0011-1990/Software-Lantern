import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PartnerLead } from "@/lib/types";
import { PortalDashboard } from "./portal-dashboard";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_partner_leads");

  return (
    <Suspense fallback={null}>
      <PortalDashboard leads={(data as PartnerLead[] | null) || []} loadError={!!error} />
    </Suspense>
  );
}
