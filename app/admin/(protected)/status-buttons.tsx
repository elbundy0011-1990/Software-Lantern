"use client";

import { useTransition } from "react";
import { setLeadStatus } from "./actions";
import { usePublishConfirm } from "./publish-confirm";
import type { PartnerRef } from "@/lib/fuzzy-match";
import type { LeadStatus } from "@/lib/types";

export function StatusButtons({
  id,
  status,
  currentVendor,
  partners,
  excludedPartnerIds,
}: {
  id: string;
  status: LeadStatus;
  currentVendor: string | null;
  partners: PartnerRef[];
  excludedPartnerIds: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const {
    requestPublish,
    dialog,
    isPending: publishPending,
  } = usePublishConfirm({ leadId: id, currentVendor, partners, excludedPartnerIds });

  return (
    <div className="flex gap-2">
      {status !== "published" && (
        <button
          disabled={isPending || publishPending}
          onClick={requestPublish}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#10b981]/[0.12] text-[#047857] hover:bg-[#10b981]/[0.2] disabled:opacity-50"
        >
          Publish
        </button>
      )}
      {status !== "discarded" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setLeadStatus(id, "discarded"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#0d1117]/[0.06] text-[#5c6573] hover:bg-[#0d1117]/[0.12] disabled:opacity-50"
        >
          Discard
        </button>
      )}
      {status !== "new" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setLeadStatus(id, "new"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#4f46e5]/[0.10] text-[#4338ca] hover:bg-[#4f46e5]/[0.18] disabled:opacity-50"
        >
          Reset
        </button>
      )}
      {dialog}
    </div>
  );
}
