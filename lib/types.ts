export type LeadStatus = "new" | "published" | "discarded";

export interface Lead {
  id: string;
  created_at: string;
  status: LeadStatus;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  software_need: string | null;
  current_vendor: string | null;
  budget_range: string | null;
  timeline: string | null;
  notes: string | null;
  category: string | null;
  answers: Record<string, string | string[]>;
  custom_fields: Record<string, string>;
  unlock_count: number;
  max_unlocks: number;
  price_per_unlock: number | null;
}

export type PartnerStatus = "pending" | "approved" | "rejected";

export interface Partner {
  id: string;
  created_at: string;
  company_name: string;
  contact_email: string;
  auth_user_id: string;
  stripe_customer_id: string | null;
  categories: string[];
  status: PartnerStatus;
}

export type UnlockOutcome = "unknown" | "won" | "lost";

export interface Unlock {
  id: string;
  lead_id: string;
  partner_id: string;
  stripe_payment_id: string | null;
  amount_paid: number | null;
  unlocked_at: string;
  outcome: UnlockOutcome;
  outcome_set_by: "partner" | "admin" | null;
  outcome_updated_at: string | null;
}

// OT cybersecurity / NIS2 enquiries — fully separate from the Lead/
// Partner/Unlock marketplace model above. No "published" status exists:
// there is no automated distribution mechanism for this data (see
// supabase/ot-cyber-schema.sql).
export type OtEnquiryStatus = "new" | "reviewed" | "discarded";

export interface OtEnquiry {
  id: string;
  created_at: string;
  status: OtEnquiryStatus;
  country: string | null;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  answers: Record<string, string | string[]>;
  role: string | null;
  sector: string | null;
  builder_or_operator: string | null;
  current_remote_access: string | null;
  timeline: string | null;
  free_text: string | null;
  consent_review_given: boolean;
  shared_with: string | null;
  shared_at: string | null;
  admin_notes: string | null;
}

export interface PartnerLead {
  id: string;
  created_at: string;
  category: string | null;
  software_need: string | null;
  current_vendor: string | null;
  budget_range: string | null;
  timeline: string | null;
  answers: Record<string, string | string[]>;
  unlock_count: number;
  max_unlocks: number;
  price_per_unlock: number | null;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  unlocked: boolean;
  unlock_id: string | null;
  outcome: UnlockOutcome | null;
}
