// OT cybersecurity / NIS2 enquiries. No "published" status exists:
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
