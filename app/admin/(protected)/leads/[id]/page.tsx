import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";
import { LeadEditForm } from "./lead-edit-form";

export default async function AdminLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();

  if (!lead) notFound();

  return <LeadEditForm lead={lead as Lead} />;
}
