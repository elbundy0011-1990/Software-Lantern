"use client";

import { useTransition } from "react";
import { setOtEnquiryStatus } from "./actions";
import type { OtEnquiryStatus } from "@/lib/types";

export function OtStatusButtons({ id, status }: { id: string; status: OtEnquiryStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {status !== "reviewed" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setOtEnquiryStatus(id, "reviewed"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#10b981]/[0.12] text-[#047857] hover:bg-[#10b981]/[0.2] disabled:opacity-50"
        >
          Mark reviewed
        </button>
      )}
      {status !== "discarded" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setOtEnquiryStatus(id, "discarded"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#0d1117]/[0.06] text-[#5c6573] hover:bg-[#0d1117]/[0.12] disabled:opacity-50"
        >
          Discard
        </button>
      )}
      {status !== "new" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => setOtEnquiryStatus(id, "new"))}
          className="rounded-full px-3 py-1 text-[13px] font-semibold bg-[#4f46e5]/[0.10] text-[#4338ca] hover:bg-[#4f46e5]/[0.18] disabled:opacity-50"
        >
          Reset
        </button>
      )}
    </div>
  );
}
