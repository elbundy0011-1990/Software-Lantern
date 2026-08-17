import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";
import type { PartnerRef } from "@/lib/fuzzy-match";
import { LeadEditForm } from "./lead-edit-form";

export default async function AdminLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: lead }, { data: partners }, { data: exclusions }] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("partners").select("id, company_name").order("company_name"),
    supabase.from("lead_exclusions").select("partner_id").eq("lead_id", id),
  ]);

  if (!lead) notFound();

  return (
    <LeadEditForm
      lead={lead as Lead}
      partners={(partners as PartnerRef[] | null) || []}
      excludedPartnerIds={(exclusions || []).map((e) => e.partner_id)}
    />
  );
}
