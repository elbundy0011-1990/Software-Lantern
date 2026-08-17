"use client";

import { useState, useTransition } from "react";
import { setLeadStatus, addLeadExclusion } from "./actions";
import { suggestPartnerMatch, type PartnerRef } from "@/lib/fuzzy-match";

// Shared by both admin publish entry points (the leads list's quick-action
// button and the lead detail page's status switcher) so there is exactly one
// place that can trigger a publish, and therefore no path that bypasses the
// fuzzy-match confirm. Never call setLeadStatus(id, "published") directly
// from a button; always go through requestPublish() from this hook.
export function usePublishConfirm({
  leadId,
  currentVendor,
  partners,
  excludedPartnerIds,
  onExcluded,
}: {
  leadId: string;
  currentVendor: string | null;
  partners: PartnerRef[];
  excludedPartnerIds: string[];
  onExcluded?: (partnerId: string) => void;
}) {
  const [pendingMatch, setPendingMatch] = useState<PartnerRef | null>(null);
  const [isPending, startTransition] = useTransition();

  const requestPublish = () => {
    const excludedSet = new Set(excludedPartnerIds);
    const match = suggestPartnerMatch(currentVendor, partners);
    if (match && !excludedSet.has(match.id)) {
      setPendingMatch(match);
      return;
    }
    startTransition(() => setLeadStatus(leadId, "published"));
  };

  const confirmExcludeAndPublish = () => {
    if (!pendingMatch) return;
    const partnerId = pendingMatch.id;
    setPendingMatch(null);
    onExcluded?.(partnerId);
    startTransition(async () => {
      await addLeadExclusion(leadId, partnerId);
      await setLeadStatus(leadId, "published");
    });
  };

  const confirmPublishAnyway = () => {
    setPendingMatch(null);
    startTransition(() => setLeadStatus(leadId, "published"));
  };

  const cancel = () => setPendingMatch(null);

  const dialog = pendingMatch ? (
    <div
      className="fixed inset-0 bg-[#0d1117]/[0.42] flex items-center justify-center z-[80] px-4"
      onClick={cancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white border border-[#0d1117]/[0.08] rounded-2xl p-6 shadow-[0_24px_60px_rgba(13,17,23,0.18)]"
      >
        <h3 className="font-sans font-semibold text-[18px] mb-2">Possible current-vendor match</h3>
        <p className="text-[14px] leading-[1.55] text-[#3d4653] mb-5">
          This lead&apos;s current vendor looks like it might be{" "}
          <strong>{pendingMatch.company_name}</strong>. Exclude them from seeing this lead before
          publishing?
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={confirmExcludeAndPublish}
            disabled={isPending}
            className="bg-[#4f46e5] text-white rounded-full px-5 py-[10px] text-[14px] font-semibold hover:bg-[#4338ca] disabled:opacity-60"
          >
            Exclude and publish
          </button>
          <button
            onClick={confirmPublishAnyway}
            disabled={isPending}
            className="border border-[#0d1117]/[0.14] rounded-full px-5 py-[10px] text-[14px] font-semibold hover:bg-[#0d1117]/[0.05] disabled:opacity-60"
          >
            Publish without excluding
          </button>
          <button
            onClick={cancel}
            disabled={isPending}
            className="text-[14px] font-semibold text-[#5c6573] px-3 py-[10px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { requestPublish, dialog, isPending };
}
