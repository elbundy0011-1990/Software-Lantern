"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LeadStatus } from "@/lib/types";

export async function setLeadStatus(id: string, status: LeadStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);
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
