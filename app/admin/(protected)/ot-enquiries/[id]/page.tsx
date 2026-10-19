import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OtEnquiry } from "@/lib/types";
import { OtStatusButtons } from "../status-buttons";
import { ShareForm } from "./share-form";

function fieldRow(label: string, value: string) {
  return (
    <div className="flex gap-3 py-2 border-b border-[#0d1117]/[0.06]">
      <span className="w-[140px] shrink-0 text-[13px] font-semibold text-[#79818f]">{label}</span>
      <span className="text-[14px] text-[#0d1117]">{value}</span>
    </div>
  );
}

export default async function AdminOtEnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: enquiry } = await supabase.from("ot_enquiries").select("*").eq("id", id).maybeSingle();

  if (!enquiry) notFound();
  const e = enquiry as OtEnquiry;

  return (
    <div className="grid gap-6 max-w-[760px]">
      <div className="flex items-center justify-between">
        <h1 className="font-sans font-semibold text-[26px]">{e.company_name || "(no company name)"}</h1>
        <OtStatusButtons id={e.id} status={e.status} />
      </div>

      <div className="bg-white rounded-2xl border border-[#0d1117]/[0.08] p-6">
        {fieldRow("Submitted", new Date(e.created_at).toLocaleString())}
        {fieldRow("Contact", e.contact_name || "—")}
        {fieldRow("Email", e.contact_email || "—")}
        {fieldRow("Phone", e.contact_phone || "—")}
        {fieldRow("Country", e.country || "—")}
        {fieldRow("Role", e.role || "—")}
        {fieldRow("Sector", e.sector || "—")}
        {fieldRow("Builder/operator/integrator", e.builder_or_operator || "—")}
        {fieldRow("Current remote access", e.current_remote_access || "—")}
        {fieldRow("Timeline", e.timeline || "—")}
        {fieldRow("Free text", e.free_text || "—")}
        {fieldRow("Review consent given", e.consent_review_given ? "Yes" : "No")}
      </div>

      <div className="bg-white rounded-2xl border border-[#0d1117]/[0.08] p-6">
        <h3 className="font-sans font-semibold text-[17px] mb-3">Checker answers</h3>
        <pre className="text-[13px] bg-[#f6f7fb] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(e.answers, null, 2)}
        </pre>
      </div>

      <ShareForm id={e.id} initialSharedWith={e.shared_with} initialAdminNotes={e.admin_notes} />
    </div>
  );
}
