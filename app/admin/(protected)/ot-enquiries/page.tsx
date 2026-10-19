import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OtEnquiry, OtEnquiryStatus } from "@/lib/types";
import { OtStatusButtons } from "./status-buttons";

const TABS: { label: string; value: OtEnquiryStatus | "all" }[] = [
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Discarded", value: "discarded" },
  { label: "All", value: "all" },
];

export default async function AdminOtEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab = (status as OtEnquiryStatus | "all") || "new";

  const supabase = createAdminClient();
  let query = supabase.from("ot_enquiries").select("*").order("created_at", { ascending: false });
  if (activeTab !== "all") query = query.eq("status", activeTab);
  const { data: enquiries } = await query;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Admin</p>
        <h1 className="font-sans font-semibold text-[30px]">OT Cybersecurity Enquiries</h1>
        <p className="mt-2 text-[14px] text-[#5c6573] max-w-[640px]">
          Separate table from the EUDR/PLM/Battery Passport leads, never shown to any partner, no
          publish step. Sharing with any other company is a manual action you record on the
          enquiry page after you&apos;ve separately asked the person and they said yes.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/ot-enquiries?status=${tab.value}`}
            className="rounded-full px-4 py-2 text-[14px] font-semibold"
            style={{
              background: activeTab === tab.value ? "#4f46e5" : "#ffffff",
              color: activeTab === tab.value ? "#ffffff" : "#3d4653",
              border: `1px solid ${activeTab === tab.value ? "#4f46e5" : "rgba(13,17,23,0.12)"}`,
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#0d1117]/[0.08] overflow-hidden">
        {(enquiries as OtEnquiry[] | null)?.length ? (
          <table className="w-full text-left text-[14px]">
            <thead className="bg-[#f6f7fb] text-[12px] font-bold uppercase tracking-[0.05em] text-[#79818f]">
              <tr>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Builder/Operator</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Shared?</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(enquiries as OtEnquiry[]).map((e) => (
                <tr key={e.id} className="border-t border-[#0d1117]/[0.06]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/ot-enquiries/${e.id}`} className="font-semibold text-[#4f46e5]">
                      {e.company_name || "(no company name)"}
                    </Link>
                    <div className="text-[13px] text-[#79818f]">{e.contact_email}</div>
                  </td>
                  <td className="px-5 py-3">{e.country || "—"}</td>
                  <td className="px-5 py-3">{e.builder_or_operator || "—"}</td>
                  <td className="px-5 py-3">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">{e.shared_with ? `Yes — ${e.shared_with}` : "No"}</td>
                  <td className="px-5 py-3">
                    <OtStatusButtons id={e.id} status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-5 py-8 text-[14px] text-[#79818f]">No enquiries in this view.</p>
        )}
      </div>
    </div>
  );
}
