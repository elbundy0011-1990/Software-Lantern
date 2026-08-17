import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Partner, PartnerStatus, Unlock } from "@/lib/types";
import { PartnerStatusButtons } from "./partner-status-buttons";

type SortKey = "spent" | "login";

const TABS: { label: string; value: PartnerStatus | "all" }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

function formatEuro(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export default async function AdminPartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; status?: string }>;
}) {
  const { sort, status } = await searchParams;
  const activeSort: SortKey = sort === "login" ? "login" : "spent";
  const activeTab = (status as PartnerStatus | "all") || "pending";

  const supabase = createAdminClient();
  let query = supabase
    .from("partners")
    .select("id, company_name, contact_email, categories, created_at, auth_user_id, status");
  if (activeTab !== "all") query = query.eq("status", activeTab);

  const [{ data: partners }, { data: unlocks }, { data: authList }] = await Promise.all([
    query,
    supabase.from("unlocks").select("partner_id, amount_paid"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const statsByPartner = new Map<string, { count: number; total: number }>();
  ((unlocks as Pick<Unlock, "partner_id" | "amount_paid">[] | null) || []).forEach((u) => {
    const cur = statsByPartner.get(u.partner_id) || { count: 0, total: 0 };
    cur.count += 1;
    cur.total += u.amount_paid ? Number(u.amount_paid) : 0;
    statsByPartner.set(u.partner_id, cur);
  });

  const lastSignInByAuthId = new Map(
    (authList?.users || []).map((u) => [u.id, u.last_sign_in_at as string | null]),
  );

  const rows = ((partners as Partner[] | null) || []).map((p) => ({
    partner: p,
    unlockCount: statsByPartner.get(p.id)?.count || 0,
    totalSpent: statsByPartner.get(p.id)?.total || 0,
    lastSignIn: lastSignInByAuthId.get(p.auth_user_id) || null,
  }));

  rows.sort((a, b) => {
    if (activeSort === "login") {
      const aTime = a.lastSignIn ? new Date(a.lastSignIn).getTime() : 0;
      const bTime = b.lastSignIn ? new Date(b.lastSignIn).getTime() : 0;
      return bTime - aTime;
    }
    return b.totalSpent - a.totalSpent;
  });

  const sortLinkClass = (key: SortKey) =>
    `hover:text-[#4338ca] ${activeSort === key ? "text-[#4338ca]" : ""}`;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">Admin</p>
        <h1 className="font-sans font-semibold text-[30px]">Partners</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/partners?status=${tab.value}${sort ? `&sort=${sort}` : ""}`}
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
        <div className="grid grid-cols-[1.3fr_1.3fr_0.9fr_0.7fr_0.6fr_0.8fr_0.8fr_0.8fr_auto] gap-4 px-6 py-3 bg-[#f6f7fb] border-b border-[#0d1117]/[0.07] text-[11px] font-bold uppercase tracking-[0.06em] text-[#79818f]">
          <span>Company</span>
          <span>Contact email</span>
          <span>Categories</span>
          <span>Status</span>
          <span>Unlocked</span>
          <Link href={`/admin/partners?status=${activeTab}&sort=spent`} className={sortLinkClass("spent")}>
            Total spent ↓
          </Link>
          <Link href={`/admin/partners?status=${activeTab}&sort=login`} className={sortLinkClass("login")}>
            Last login ↓
          </Link>
          <span>Signed up</span>
          <span>Actions</span>
        </div>
        {rows.map(({ partner, unlockCount, totalSpent, lastSignIn }) => (
          <div
            key={partner.id}
            className="grid grid-cols-[1.3fr_1.3fr_0.9fr_0.7fr_0.6fr_0.8fr_0.8fr_0.8fr_auto] gap-4 items-center px-6 py-4 border-b border-[#0d1117]/[0.05] text-[14px]"
          >
            <Link
              href={`/admin/partners/${partner.id}`}
              className="font-semibold text-[#0d1117] hover:text-[#4f46e5] truncate"
            >
              {partner.company_name}
            </Link>
            <span className="text-[#5c6573] truncate">{partner.contact_email}</span>
            <span className="text-[#3d4653]">
              {partner.categories.length > 0 ? partner.categories.join(", ") : "All"}
            </span>
            <span className="capitalize">{partner.status}</span>
            <span>{unlockCount}</span>
            <span className="font-semibold text-[#0d1117]">{formatEuro(totalSpent)}</span>
            <span className="text-[#5c6573]">
              {lastSignIn ? new Date(lastSignIn).toLocaleDateString() : "Never"}
            </span>
            <span className="text-[#5c6573]">{new Date(partner.created_at).toLocaleDateString()}</span>
            <PartnerStatusButtons id={partner.id} status={partner.status} />
          </div>
        ))}
        {rows.length === 0 && (
          <div className="px-6 py-14 text-center text-[#5c6573]">No partners in this view yet.</div>
        )}
      </div>
    </div>
  );
}
