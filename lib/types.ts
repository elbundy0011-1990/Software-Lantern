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
}
