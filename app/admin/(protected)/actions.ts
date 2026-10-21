"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LeadStatus, PartnerStatus, UnlockOutcome } from "@/lib/types";

// Approve or reject a pending provider application (or flip either back to
// 'pending', though the admin UI only ever exposes approve/reject buttons
// for this phase). No rejection-reason field, no rejection email to the
// partner, no re-application flow: all flagged as future work, not built
// here. Runs through the service-role client, same pattern as every other
// admin action in this file.
export async function setPartnerStatus(partnerId: string, status: PartnerStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("partners").update({ status }).eq("id", partnerId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${partnerId}`);
}

// Admin override: unlike update_unlock_outcome() (partner-facing, RPC-gated,
// 'won'/'lost' only), admin can set outcome back to 'unknown' and always
// stamps outcome_set_by = 'admin', overwriting whatever a partner set
// before. Runs through the service-role client like every other admin
// action here, no new RLS/grant needed.
export async function setUnlockOutcome(unlockId: string, partnerId: string, outcome: UnlockOutcome) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("unlocks")
    .update({
      outcome,
      outcome_set_by: outcome === "unknown" ? null : "admin",
      outcome_updated_at: outcome === "unknown" ? null : new Date().toISOString(),
    })
    .eq("id", unlockId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/partners/${partnerId}`);
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
}

export async function addLeadExclusion(leadId: string, partnerId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lead_exclusions")
    .upsert({ lead_id: leadId, partner_id: partnerId }, { onConflict: "lead_id,partner_id" });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function removeLeadExclusion(leadId: string, partnerId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("lead_exclusions")
    .delete()
    .eq("lead_id", leadId)
    .eq("partner_id", partnerId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${leadId}`);
}

export interface LeadFieldUpdate {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  software_need: string;
  current_vendor: string;
  budget_range: string;
  timeline: string;
  notes: string;
  category: string;
  price_per_unlock: string;
  max_unlocks: string;
}

export async function updateLead(id: string, fields: LeadFieldUpdate) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("leads")
    .update({
      company_name: fields.company_name || null,
      contact_name: fields.contact_name || null,
      contact_email: fields.contact_email || null,
      contact_phone: fields.contact_phone || null,
      software_need: fields.software_need || null,
      current_vendor: fields.current_vendor || null,
      budget_range: fields.budget_range || null,
      timeline: fields.timeline || null,
      notes: fields.notes || null,
      category: fields.category || null,
      price_per_unlock: fields.price_per_unlock ? Number(fields.price_per_unlock) : null,
      max_unlocks: fields.max_unlocks ? Number(fields.max_unlocks) : 3,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
}

export async function setCustomFields(id: string, customFields: Record<string, string>) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").update({ custom_fields: customFields }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/leads/${id}`);
}
