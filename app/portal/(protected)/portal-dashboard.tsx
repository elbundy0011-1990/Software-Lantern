"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { PartnerLead } from "@/lib/types";
import { leadDetailRows, categoryShortCode } from "@/lib/finder-config";

const FILTERS = ["All categories", "EUDR", "PLM", "DBP"] as const;

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 0)} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function formatPrice(price: number | null): string {
  return price != null ? `€${price}` : "Contact us";
}

function defaultFilter(partnerCategories: string[]): (typeof FILTERS)[number] {
  // Only default to a single category when the partner declared exactly one
  // at signup — a multi-category partner (or one who hasn't set this yet)
  // still starts on "All categories" rather than guessing which one to show.
  if (partnerCategories.length === 1) {
    const only = partnerCategories[0];
    if ((FILTERS as readonly string[]).includes(only)) {
      return only as (typeof FILTERS)[number];
    }
  }
  return "All categories";
}

export function PortalDashboard({
  leads,
  loadError,
  partnerCategories,
}: {
  leads: PartnerLead[];
  loadError: boolean;
  partnerCategories: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unlockedParam = searchParams.get("unlocked");

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(() => defaultFilter(partnerCategories));
  const [openLeadId, setOpenLeadId] = useState<string | null>(unlockedParam);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (unlockedParam) {
      const t = setTimeout(() => router.refresh(), 3000);
      return () => clearTimeout(t);
    }
  }, [unlockedParam, router]);

  const visibleLeads = useMemo(
    () => (filter === "All categories" ? leads : leads.filter((l) => categoryShortCode(l.category) === filter)),
    [leads, filter],
  );

  const openLead = leads.find((l) => l.id === openLeadId) || null;

  const stats = useMemo(() => {
    const available = leads.filter((l) => !l.unlocked && l.unlock_count < l.max_unlocks).length;
    const mine = leads.filter((l) => l.unlocked).length;
    return [
      { label: "Leads available", value: String(available), color: "#4f46e5" },
      { label: "Unlocked by you", value: String(mine), color: "#047857" },
      { label: "Max buyers per lead", value: "3", color: "#0d1117" },
    ];
  }, [leads]);

  const startCheckout = async (leadId: string) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (data.url) {
        // Full-page redirect to Stripe's hosted checkout — intentionally
        // not router.push, this is leaving the app entirely.
        // eslint-disable-next-line react-hooks/immutability -- window.location is the standard external-redirect API, not reactive/component state
        window.location.href = data.url;
      } else {
        alert(data.error || "Could not start checkout.");
        setCheckoutLoading(false);
      }
    } catch {
      alert("Could not start checkout.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-7">
        <p className="mb-2 text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
          Partner portal
        </p>
        <h1 className="font-sans font-semibold text-[clamp(28px,3.6vw,38px)] leading-[1.1] tracking-[-0.03em] mb-2">
          Your leads
        </h1>
        <p className="text-[16px] text-[#5c6573]">
          Live briefs in your categories. Company and contact details unlock after purchase, and every
          lead is sold to a maximum of 3 providers.
        </p>
      </div>

      {loadError && (
        <p className="mb-6 text-[14px] font-semibold text-[#c0451f]">
          Could not load leads right now. Try refreshing.
        </p>
      )}

      {unlockedParam && (
        <p className="mb-6 text-[14px] font-semibold text-[#047857]">
          Payment received. Unlocking this lead now. If it still looks locked, give it a few seconds and
          refresh.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#0d1117]/[0.08] rounded-2xl px-[22px] py-5">
            <p className="mb-[6px] text-[13px] font-semibold text-[#5c6573]">{s.label}</p>
            <p className="font-sans font-semibold text-[30px] tracking-[-0.03em]" style={{ color: s.color }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-[10px] mb-[18px]">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-full px-[18px] py-[10px] font-sans font-semibold text-[14px] whitespace-nowrap"
            style={{
              border: `1px solid ${filter === f ? "#4f46e5" : "rgba(13,17,23,0.12)"}`,
              background: filter === f ? "#4f46e5" : "#ffffff",
              color: filter === f ? "#ffffff" : "#3d4653",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#0d1117]/[0.08] rounded-[18px] overflow-hidden shadow-[0_2px_6px_rgba(13,17,23,0.04)]">
        <div className="hidden sm:grid grid-cols-[2fr_1.5fr_1fr_0.8fr_1.1fr_auto] gap-5 px-6 py-[14px] border-b border-[#0d1117]/[0.07] bg-[#f6f7fb] text-[12px] font-bold tracking-[0.06em] uppercase text-[#79818f]">
          <span>Buyer</span>
          <span>Requirement</span>
          <span>Category</span>
          <span>Received</span>
          <span>Offers</span>
          <span>Access</span>
        </div>
        {visibleLeads.map((lead) => {
          const soldOut = !lead.unlocked && lead.unlock_count >= lead.max_unlocks;
          const status = lead.unlocked ? "Unlocked" : soldOut ? "Sold out" : "Available";
          const statusBg = lead.unlocked
            ? "rgba(16,185,129,0.12)"
            : soldOut
              ? "rgba(13,17,23,0.06)"
              : "rgba(79,70,229,0.10)";
          const statusColor = lead.unlocked ? "#047857" : soldOut ? "#5c6573" : "#4338ca";
          return (
            <div
              key={lead.id}
              onClick={() => setOpenLeadId(lead.id)}
              className="grid grid-cols-1 sm:grid-cols-[2fr_1.5fr_1fr_0.8fr_1.1fr_auto] gap-2 sm:gap-5 sm:items-center px-6 py-[18px] border-b border-[#0d1117]/[0.05] cursor-pointer hover:bg-[#4f46e5]/[0.04]"
            >
              <div className="min-w-0">
                <p className="mb-[3px] text-[16px] font-semibold text-[#0d1117]">
                  {lead.unlocked ? lead.company_name : `${categoryShortCode(lead.category)} buyer`}
                </p>
                <p className="text-[14px] text-[#5c6573]">
                  {lead.unlocked ? timeAgo(lead.created_at) : "Details unlock on purchase"}
                </p>
              </div>
              <p className="text-[14px] text-[#3d4653] leading-[1.45]">{lead.software_need}</p>
              <p className="text-[14px] font-semibold text-[#3d4653]">{categoryShortCode(lead.category)}</p>
              <p className="text-[14px] text-[#5c6573]">{timeAgo(lead.created_at)}</p>
              <div className="min-w-0">
                <div className="mb-[6px] text-[14px] font-bold" style={{ color: statusColor }}>
                  {lead.unlock_count}/{lead.max_unlocks}
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((idx) => (
                    <span
                      key={idx}
                      className="flex-1 h-[6px] rounded-full block"
                      style={{
                        background:
                          idx < lead.unlock_count
                            ? lead.unlocked && idx === lead.unlock_count - 1
                              ? "#10b981"
                              : "#4f46e5"
                            : "rgba(13,17,23,0.10)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <span
                className="justify-self-start rounded-full px-[14px] py-[6px] text-[13px] font-semibold whitespace-nowrap"
                style={{ background: statusBg, color: statusColor }}
              >
                {status}
              </span>
            </div>
          );
        })}
        {visibleLeads.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="mb-[6px] text-[17px] font-semibold text-[#0d1117]">Nothing here yet</p>
            <p className="text-[15px] text-[#5c6573]">
              New briefs in your categories land in this view as soon as buyers submit them.
            </p>
          </div>
        )}
      </div>

      {openLead && (
        <div
          className="fixed inset-0 bg-[#0d1117]/[0.42] flex justify-end z-[60]"
          onClick={() => setOpenLeadId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="box-border w-full sm:w-[520px] h-full flex flex-col bg-white border-l border-[#0d1117]/[0.08] shadow-[-24px_0_60px_rgba(13,17,23,0.18)]"
          >
            <div className="flex-none px-5 sm:px-8 pt-7 pb-5 border-b border-[#0d1117]/[0.07] flex items-start justify-between gap-4">
              <div>
                <p className="mb-[6px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#4f46e5]">
                  {categoryShortCode(openLead.category)}
                </p>
                <h2 className="font-sans font-semibold text-[26px] leading-[1.15] tracking-[-0.028em] mb-1">
                  {openLead.unlocked ? openLead.company_name : `${categoryShortCode(openLead.category)} buyer`}
                </h2>
                <p className="text-[15px] text-[#5c6573]">{timeAgo(openLead.created_at)}</p>
              </div>
              <button
                onClick={() => setOpenLeadId(null)}
                className="flex-none w-[34px] h-[34px] rounded-full border border-[#0d1117]/[0.12] text-[#3d4653] text-[16px] hover:bg-[#0d1117]/[0.05]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-4">
              <div className="grid gap-[2px] mb-[26px]">
                {leadDetailRows(openLead.category, openLead.answers).map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 py-3 border-t border-[#0d1117]/[0.07] text-[15px]"
                  >
                    <span className="text-[#79818f] font-semibold">{row.label}</span>
                    <span className="text-[#0d1117] font-medium leading-[1.5]">{row.value}</span>
                  </div>
                ))}
              </div>

              {!openLead.unlocked && openLead.unlock_count < openLead.max_unlocks && (
                <div className="bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-2xl p-[22px]">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                    <p className="text-[15px] font-semibold text-[#0d1117]">
                      Company and contact details are locked
                    </p>
                    <span className="rounded-full px-3 py-[5px] text-[13px] font-bold bg-[#4f46e5]/[0.10] text-[#4338ca] whitespace-nowrap">
                      {formatPrice(openLead.price_per_unlock)}
                    </span>
                  </div>
                  <p className="mb-[6px] text-[14px] text-[#5c6573] leading-[1.5]">
                    Unlock to see the buyer&apos;s company, the contact&apos;s name, work email and phone.
                    This lead is sold to a maximum of 3 providers, so you compete with at most two others.
                  </p>
                  <p className="mb-[14px] text-[14px] text-[#5c6573] leading-[1.5]">
                    For more info email{" "}
                    <a href="mailto:jdb@softwarelantern.com" className="text-[#4f46e5]">
                      jdb@softwarelantern.com
                    </a>
                  </p>
                  <span className="text-[14px] font-bold text-[#4338ca]">
                    {openLead.unlock_count}/{openLead.max_unlocks} offers
                  </span>
                </div>
              )}
              {!openLead.unlocked && openLead.unlock_count >= openLead.max_unlocks && (
                <div className="bg-[#0d1117]/[0.04] border border-[#0d1117]/[0.09] rounded-2xl p-[22px]">
                  <p className="mb-[6px] text-[15px] font-semibold text-[#0d1117]">
                    This lead is fully allocated
                  </p>
                  <p className="text-[14px] text-[#5c6573] leading-[1.5]">
                    Three providers already bought it. We cap every brief at 3 so buyers are never
                    overwhelmed.
                  </p>
                </div>
              )}
              {openLead.unlocked && (
                <div className="bg-[#10b981]/[0.08] border border-[#10b981]/[0.22] rounded-2xl p-[22px]">
                  <p className="mb-[10px] text-[12px] font-bold tracking-[0.09em] uppercase text-[#047857]">
                    Unlocked contact details
                  </p>
                  <p className="mb-1 text-[16px] font-semibold text-[#0d1117]">{openLead.company_name}</p>
                  <p className="mb-[10px] text-[15px] text-[#3d4653]">{openLead.contact_name}</p>
                  <p className="text-[15px] text-[#3d4653]">{openLead.contact_email}</p>
                  <p className="text-[15px] text-[#3d4653]">{openLead.contact_phone}</p>
                </div>
              )}
            </div>

            <div className="flex-none px-5 sm:px-8 py-[18px] border-t border-[#0d1117]/[0.07] bg-white flex flex-wrap gap-3">
              {!openLead.unlocked && openLead.unlock_count < openLead.max_unlocks && (
                <button
                  onClick={() => startCheckout(openLead.id)}
                  disabled={checkoutLoading}
                  className="bg-[#4f46e5] text-white rounded-full px-[26px] py-[15px] font-sans font-semibold text-[16px] shadow-[0_6px_18px_rgba(79,70,229,0.24)] hover:bg-[#4338ca] disabled:opacity-60"
                >
                  {checkoutLoading ? "Starting checkout…" : `Unlock for ${formatPrice(openLead.price_per_unlock)}`}
                </button>
              )}
              {openLead.unlocked && (
                <a
                  href={`mailto:${openLead.contact_email}?subject=${encodeURIComponent(
                    `Your ${categoryShortCode(openLead.category)} brief via Software Lantern`,
                  )}`}
                  className="bg-[#4f46e5] text-white rounded-full px-[26px] py-[15px] font-sans font-semibold text-[16px] no-underline"
                >
                  Email the buyer
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
