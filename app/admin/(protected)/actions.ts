"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { categoryShortCode, partnerNotificationClassification } from "@/lib/finder-config";
import { sendEmail } from "@/lib/resend";
import { buildLeadPublishedPartnerEmail } from "@/lib/email-templates";
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

  // Read the current status before updating so we can detect a genuine
  // new/discarded -> published transition, not every subsequent edit to an
  // already-published lead. Pull everything the notification needs in the
  // same query since this is already a round trip.
  const { data: before } = await supabase
    .from("leads")
    .select("status, category, software_need, timeline, answers")
    .eq("id", id)
    .maybeSingle();
  const wasPublished = before?.status === "published";

  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath(`/admin/leads/${id}`);

  if (status === "published" && !wasPublished) {
    const category = before?.category ?? null;
    const softwareNeed = before?.software_need ?? null;
    const timeline = before?.timeline ?? null;
    const answers = (before?.answers as Record<string, string | string[] | undefined>) ?? {};
    // Scheduled via after() rather than awaited or fire-and-forget: this is a
    // server action invoked from a serverless function, which can freeze
    // once the action returns, and a bare un-awaited promise risks never
    // completing. after() (Vercel-safe, waitUntil under the hood) keeps the
    // admin UI from waiting on partner-count-many email sends while still
    // guaranteeing they run to completion.
    after(() =>
      notifyPartnersOfPublishedLead(id, category, softwareNeed, timeline, answers).catch((err) =>
        console.error("Failed to notify partners of published lead", id, err),
      ),
    );
  }
}

// TRIGGER 2. Matching logic mirrors
// portal-dashboard.tsx's defaultFilter soft-default exactly (categoryShortCode
// shared from lib/finder-config.ts): a partner sees this if their categories
// include this lead's category, or they haven't set any categories at all.
// Excluded partners (lead_exclusions) are dropped before sending, so an
// excluded partner never gets the "new lead in your category" email in the
// normal case (exclusions set before publish, which the publish-time fuzzy
// match confirm in publish-confirm.tsx is designed to encourage).
async function notifyPartnersOfPublishedLead(
  leadId: string,
  category: string | null,
  softwareNeed: string | null,
  timeline: string | null,
  answers: Record<string, string | string[] | undefined>,
) {
  const supabase = createAdminClient();

  const [{ data: partners }, { data: exclusions }] = await Promise.all([
    supabase.from("partners").select("id, contact_email, categories"),
    supabase.from("lead_exclusions").select("partner_id").eq("lead_id", leadId),
  ]);

  const excludedIds = new Set((exclusions || []).map((e) => e.partner_id));
  const shortCode = categoryShortCode(category);
  const matching = (partners || []).filter((p) => {
    if (excludedIds.has(p.id)) return false;
    const categories = (p.categories as string[] | null) || [];
    return categories.length === 0 || categories.includes(shortCode);
  });

  if (matching.length === 0) return;

  const { subject, html } = buildLeadPublishedPartnerEmail({
    category,
    softwareNeed: softwareNeed || "",
    timeline,
    classification: partnerNotificationClassification(category, answers),
  });
  await Promise.allSettled(matching.map((p) => sendEmail({ to: p.contact_email, subject, html })));
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
