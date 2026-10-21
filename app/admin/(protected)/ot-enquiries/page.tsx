import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OtEnquiry, OtEnquiryStatus } from "@/lib/types";
import { REVIEW_PROMPT_OPTIONS } from "@/lib/remote-access-session";
import { OtStatusButtons } from "./status-buttons";

const TABS: { label: string; value: OtEnquiryStatus | "all" }[] = [
  { label: "New", value: "new" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Discarded", value: "discarded" },
  { label: "All", value: "all" },
];

type SortKey = "created_at" | "company_name" | "country" | "tool" | "timeline" | "review_prompt" | "role";

function toolOf(e: OtEnquiry): string {
  const v = e.answers?.tool;
  if (!v) return "checker";
  return Array.isArray(v) ? v.join(", ") : v;
}

// The remote-access situation check's eighth, optional question. Its answer
// lands in the answers jsonb blob under one of two keys depending on how it
// was submitted: "remoteAccessCheck" (the full enquiry form, components/ot-
// enquiry-form.tsx) or "remoteAccessAnswers" ("email me a copy"/country
// report, components/result-actions.tsx and components/country-report-
// form.tsx) — both are checked since either path can carry it.
function reviewPromptOf(e: OtEnquiry): string {
  const answers = e.answers as unknown as Record<string, unknown> | null;
  const nested =
    (answers?.remoteAccessCheck as { reviewPrompt?: string } | undefined) ??
    (answers?.remoteAccessAnswers as { reviewPrompt?: string } | undefined);
  const value = nested?.reviewPrompt;
  if (!value) return "";
  return REVIEW_PROMPT_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function sortValue(e: OtEnquiry, key: SortKey): string {
  if (key === "tool") return toolOf(e);
  if (key === "country") return e.country || "";
  if (key === "company_name") return e.company_name || "";
  if (key === "timeline") return e.timeline || "";
  if (key === "review_prompt") return reviewPromptOf(e);
  if (key === "role") return e.role || "";
  return e.created_at;
}

function SortableHeader({
  label,
  sortKey,
  activeSort,
  activeDir,
  status,
}: {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  activeDir: "asc" | "desc";
  status: string;
}) {
  const isActive = activeSort === sortKey;
  const nextDir = isActive && activeDir === "asc" ? "desc" : "asc";
  return (
    <th className="px-5 py-3">
      <Link
        href={`/admin/ot-enquiries?status=${status}&sort=${sortKey}&dir=${nextDir}`}
        className="inline-flex items-center gap-1 hover:text-[#4f46e5]"
      >
        {label}
        {isActive && <span>{activeDir === "asc" ? "↑" : "↓"}</span>}
      </Link>
    </th>
  );
}

export default async function AdminOtEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string; dir?: string }>;
}) {
  const { status, sort, dir } = await searchParams;
  const activeTab = (status as OtEnquiryStatus | "all") || "new";
  const activeSort: SortKey = (
    ["created_at", "company_name", "country", "tool", "timeline", "review_prompt", "role"].includes(sort || "")
      ? sort
      : "created_at"
  ) as SortKey;
  const activeDir: "asc" | "desc" = dir === "asc" ? "asc" : "desc";

  const supabase = createAdminClient();
  let query = supabase.from("ot_enquiries").select("*").order("created_at", { ascending: false });
  if (activeTab !== "all") query = query.eq("status", activeTab);
  const { data: enquiries } = await query;

  const sorted = [...((enquiries as OtEnquiry[] | null) || [])].sort((a, b) => {
    const av = sortValue(a, activeSort);
    const bv = sortValue(b, activeSort);
    const cmp = av.localeCompare(bv);
    return activeDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Admin</p>
        <h1 className="font-sans font-semibold text-[30px]">OT Cybersecurity Enquiries</h1>
        <p className="mt-2 text-[14px] text-[#5c6573] max-w-[640px]">
          No publish step. Sharing with any other company is a manual action you record on the
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
        {sorted.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#f6f7fb] text-[12px] font-bold uppercase tracking-[0.05em] text-[#79818f]">
                <tr>
                  <SortableHeader label="Company" sortKey="company_name" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <SortableHeader label="Tool" sortKey="tool" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <SortableHeader label="Country" sortKey="country" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <th className="px-5 py-3">Builder/Operator</th>
                  <SortableHeader label="Role" sortKey="role" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <SortableHeader label="Timeline" sortKey="timeline" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <SortableHeader label="Prompted by" sortKey="review_prompt" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <SortableHeader label="Submitted" sortKey="created_at" activeSort={activeSort} activeDir={activeDir} status={activeTab} />
                  <th className="px-5 py-3">Shared?</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => (
                  <tr key={e.id} className="border-t border-[#0d1117]/[0.06]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/ot-enquiries/${e.id}`} className="font-semibold text-[#4f46e5]">
                        {e.company_name || "(no company name)"}
                      </Link>
                      <div className="text-[13px] text-[#79818f]">{e.contact_email}</div>
                    </td>
                    <td className="px-5 py-3">{toolOf(e)}</td>
                    <td className="px-5 py-3">{e.country || "—"}</td>
                    <td className="px-5 py-3">{e.builder_or_operator || "—"}</td>
                    <td className="px-5 py-3">{e.role || "—"}</td>
                    <td className="px-5 py-3">{e.timeline || "—"}</td>
                    <td className="px-5 py-3">{reviewPromptOf(e) || "—"}</td>
                    <td className="px-5 py-3">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3">{e.shared_with ? `Yes — ${e.shared_with}` : "No"}</td>
                    <td className="px-5 py-3">
                      <OtStatusButtons id={e.id} status={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-8 text-[14px] text-[#79818f]">No enquiries in this view.</p>
        )}
      </div>
    </div>
  );
}
