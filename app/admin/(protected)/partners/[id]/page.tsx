import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Partner, Unlock, Lead } from "@/lib/types";
import { timeAgo } from "@/lib/dates";
import { OutcomeSelect } from "./outcome-select";
import { PartnerStatusButtons } from "../partner-status-buttons";

function formatEuro(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

const OUTCOME_COLOR: Record<string, string> = {
  won: "#047857",
  lost: "#c0451f",
  unknown: "#79818f",
};

export default async function AdminPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: partner }, { data: unlocks }] = await Promise.all([
    supabase.from("partners").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("unlocks")
      .select("id, lead_id, amount_paid, unlocked_at, outcome, outcome_set_by, outcome_updated_at")
      .eq("partner_id", id)
      .order("unlocked_at", { ascending: false }),
  ]);

  if (!partner) notFound();

  const unlockRows = (unlocks as Unlock[] | null) || [];
  const leadIds = unlockRows.map((u) => u.lead_id);

  const { data: leads } =
    leadIds.length > 0
      ? await supabase.from("leads").select("id, category, software_need").in("id", leadIds)
      : { data: [] as Pick<Lead, "id" | "category" | "software_need">[] };

  const leadsById = new Map(
    ((leads as Pick<Lead, "id" | "category" | "software_need">[] | null) || []).map((l) => [l.id, l]),
  );

  const { data: authUser } = await supabase.auth.admin.getUserById((partner as Partner).auth_user_id);
  const lastSignIn = authUser?.user?.last_sign_in_at || null;
  const totalSpent = unlockRows.reduce((sum, u) => sum + (u.amount_paid ? Number(u.amount_paid) : 0), 0);

  return (
    <div>
      <p className="mb-8 text-[14px] text-[#79818f]">
        <Link href="/admin/partners" className="text-[#4f46e5] font-semibold">
          Partners
        </Link>{" "}
        <span className="text-[#c2c8d1]">/</span> {(partner as Partner).company_name}
      </p>

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <h1 className="font-sans font-semibold text-[26px]">{(partner as Partner).company_name}</h1>
          <PartnerStatusButtons id={(partner as Partner).id} status={(partner as Partner).status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 text-[14px]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Status
            </p>
            <p className="text-[#0d1117] capitalize">{(partner as Partner).status}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Contact email
            </p>
            <p className="text-[#0d1117]">{(partner as Partner).contact_email}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Categories
            </p>
            <p className="text-[#0d1117]">
              {(partner as Partner).categories.length > 0
                ? (partner as Partner).categories.join(", ")
                : "All"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Signed up
            </p>
            <p className="text-[#0d1117]">
              {new Date((partner as Partner).created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Last login
            </p>
            <p className="text-[#0d1117]">
              {lastSignIn ? new Date(lastSignIn).toLocaleDateString() : "Never"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f] mb-1">
              Total spent
            </p>
            <p className="text-[#0d1117] font-semibold">{formatEuro(totalSpent)}</p>
          </div>
        </div>
      </div>

      <h2 className="font-sans font-semibold text-[20px] mb-3">Purchase history</h2>
      <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_1.8fr_1fr_1fr_1.4fr] gap-4 px-6 py-3 bg-[#f6f7fb] border-b border-[#0d1117]/[0.07] text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f]">
          <span>Category</span>
          <span>Requirement summary</span>
          <span>Amount paid</span>
          <span>Unlocked</span>
          <span>Outcome</span>
        </div>
        {unlockRows.map((u) => {
          const lead = leadsById.get(u.lead_id);
          return (
            <div
              key={u.id}
              className="grid grid-cols-[1fr_1.8fr_1fr_1fr_1.4fr] gap-4 items-center px-6 py-4 border-b border-[#0d1117]/[0.05] text-[14px]"
            >
              <span className="text-[#3d4653]">{lead?.category || "N/A"}</span>
              <span className="text-[#5c6573] truncate">{lead?.software_need || "Not given"}</span>
              <span className="font-semibold text-[#0d1117]">
                {u.amount_paid != null ? formatEuro(Number(u.amount_paid)) : "Unknown"}
              </span>
              <span className="text-[#5c6573]">{new Date(u.unlocked_at).toLocaleDateString()}</span>
              <div>
                <OutcomeSelect unlockId={u.id} partnerId={id} outcome={u.outcome} />
                {u.outcome_set_by && u.outcome_updated_at && (
                  <p className="mt-1 text-[12px]" style={{ color: OUTCOME_COLOR[u.outcome] }}>
                    Set by {u.outcome_set_by}, {timeAgo(u.outcome_updated_at)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        {unlockRows.length === 0 && (
          <div className="px-6 py-14 text-center text-[#5c6573]">No unlocks yet.</div>
        )}
      </div>
    </div>
  );
}
