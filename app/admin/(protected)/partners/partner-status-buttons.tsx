"use client";

import { useTransition } from "react";
import { setPartnerStatus } from "../actions";
import type { PartnerStatus } from "@/lib/types";

export function PartnerStatusButtons({ id, status }: { id: string; status: PartnerStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {status !== "approved" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setPartnerStatus(id, "approved"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#10b981]/[0.12] text-[#047857] hover:bg-[#10b981]/[0.2] disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setPartnerStatus(id, "rejected"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#0d1117]/[0.06] text-[#5c6573] hover:bg-[#0d1117]/[0.12] disabled:opacity-50"
        >
          Reject
        </button>
      )}
      {status !== "pending" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setPartnerStatus(id, "pending"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#4f46e5]/[0.10] text-[#4338ca] hover:bg-[#4f46e5]/[0.18] disabled:opacity-50"
        >
          Reset
        </button>
      )}
    </div>
  );
}
