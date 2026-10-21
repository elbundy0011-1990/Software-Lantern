"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OtEnquiryStatus } from "@/lib/types";

export async function setOtEnquiryStatus(id: string, status: OtEnquiryStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("ot_enquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/ot-enquiries");
  revalidatePath(`/admin/ot-enquiries/${id}`);
}

// Records that you, personally, separately asked this person whether you
// could pass their details to a named company, and they said yes to that
// specific ask — see the consent copy this pairs with in
// components/ot-enquiry-form.tsx and docs/OT-CYBER-PLAN.md §6.2. This
// action does not itself send, forward, or share anything — it's a
// manual audit-trail entry for a conversation that already happened
// outside this system (email, phone, whatever). sharedWith empty clears
// the record (e.g. if entered by mistake).
export async function recordOtEnquiryShare(id: string, sharedWith: string, adminNotes: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const trimmed = sharedWith.trim();
  const { error } = await supabase
    .from("ot_enquiries")
    .update({
      shared_with: trimmed || null,
      shared_at: trimmed ? new Date().toISOString() : null,
      admin_notes: adminNotes.trim() || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/ot-enquiries/${id}`);
}
