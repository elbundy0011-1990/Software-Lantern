"use client";

import { useTransition } from "react";
import { setUnlockOutcome } from "../../actions";
import type { UnlockOutcome } from "@/lib/types";

const OPTIONS: { value: UnlockOutcome; label: string }[] = [
  { value: "unknown", label: "Unknown" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function OutcomeSelect({
  unlockId,
  partnerId,
  outcome,
}: {
  unlockId: string;
  partnerId: string;
  outcome: UnlockOutcome;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={outcome}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => setUnlockOutcome(unlockId, partnerId, e.target.value as UnlockOutcome))
      }
      className="rounded-full border border-[#0d1117]/[0.14] bg-white px-3 py-1 text-[13px] font-semibold text-[#3d4653] disabled:opacity-50"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
