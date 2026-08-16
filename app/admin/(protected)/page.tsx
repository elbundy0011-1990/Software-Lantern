import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead, LeadStatus } from "@/lib/types";
import { StatusButtons } from "./status-buttons";

const TABS: { label: string; value: LeadStatus | "all" }[] = [
  { label: "New", value: "new" },
  { label: "Published", value: "published" },
  { label: "Discarded", value: "discarded" },
  { label: "All", value: "all" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeTab = (status as LeadStatus | "all") || "new";

  const supabase = createAdminClient();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (activeTab !== "all") query = query.eq("status", activeTab);
  const { data: leads } = await query;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Admin</p>
        <h1 className="font-sans font-semibold text-[30px]">Leads</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin?status=${tab.value}`}
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

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-[#f6f7fb] border-b border-[#0d1117]/[0.07] text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f]">
          <span>Company / need</span>
          <span>Category</span>
          <span>Received</span>
          <span>Status</span>
          <span>Unlocks</span>
          <span>Actions</span>
        </div>
        {(leads as Lead[] | null)?.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-[#0d1117]/[0.05] text-[14px]"
          >
            <div className="min-w-0">
              <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-[#0d1117] hover:text-[#4f46e5]">
                {lead.company_name || lead.contact_email || "Untitled lead"}
              </Link>
              <p className="text-[#5c6573] truncate">{lead.software_need}</p>
            </div>
            <span className="text-[#3d4653]">{lead.category || "N/A"}</span>
            <span className="text-[#5c6573]">{new Date(lead.created_at).toLocaleDateString()}</span>
            <span className="capitalize">{lead.status}</span>
            <span>
              {lead.unlock_count}/{lead.max_unlocks}
            </span>
            <StatusButtons id={lead.id} status={lead.status} />
          </div>
        ))}
        {(!leads || leads.length === 0) && (
          <div className="px-6 py-14 text-center text-[#5c6573]">No leads in this view yet.</div>
        )}
      </div>
    </div>
  );
}
