"use client";

import { useTransition } from "react";
import { addLeadExclusion, removeLeadExclusion } from "../../actions";
import type { PartnerRef } from "@/lib/fuzzy-match";

export function ExclusionsPanel({
  leadId,
  partners,
  excludedIds,
  onChange,
}: {
  leadId: string;
  partners: PartnerRef[];
  excludedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const excludedSet = new Set(excludedIds);

  const toggle = (partnerId: string) => {
    const nowExcluded = excludedSet.has(partnerId);
    const next = nowExcluded ? excludedIds.filter((id) => id !== partnerId) : [...excludedIds, partnerId];
    onChange(next);
    startTransition(async () => {
      if (nowExcluded) {
        await removeLeadExclusion(leadId, partnerId);
      } else {
        await addLeadExclusion(leadId, partnerId);
      }
    });
  };

  return (
    <div className="bg-white border border-[#0d1117]/[0.08] rounded-2xl p-7 mb-8">
      <h2 className="font-sans font-semibold text-[18px] mb-1">Exclude partners</h2>
      <p className="text-[14px] text-[#5c6573] mb-4">
        Checked partners will never see this lead in their portal, even after publishing, unless
        they&apos;ve already unlocked it. Use this when a partner is the buyer&apos;s current vendor
        or otherwise shouldn&apos;t be shown this brief.
      </p>
      {partners.length === 0 ? (
        <p className="text-[14px] text-[#79818f]">No partners yet.</p>
      ) : (
        <div className="grid gap-2">
          {partners.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-3 bg-[#f6f7fb] border border-[#0d1117]/[0.08] rounded-xl px-4 py-[10px] text-[14px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={excludedSet.has(p.id)}
                disabled={isPending}
                onChange={() => toggle(p.id)}
                className="accent-[#4f46e5]"
              />
              {p.company_name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
