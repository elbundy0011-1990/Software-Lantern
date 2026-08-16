"use client";

import { useEffect, useState } from "react";
import { EUDR_DEADLINES, daysUntil } from "@/lib/eudr-dates";

export function EudrDeadlineCountdown() {
  // Day counts are computed client-side, after mount, rather than at build
  // time — /eudr is statically prerendered, so baking "X days remaining"
  // into the HTML would go stale between deploys. The dates themselves
  // ("30 December 2026") are plain constants and always present; only the
  // live day count is deferred to hydration.
  const [days, setDays] = useState<{ largeMedium: number; microSmall: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync of a clock-derived value on mount, not a derived/cascading update
    setDays({
      largeMedium: daysUntil(EUDR_DEADLINES.largeMedium.date),
      microSmall: daysUntil(EUDR_DEADLINES.microSmall.date),
    });
  }, []);

  return (
    <div className="border-b border-[#0d1117]/[0.07] bg-[#f6f7fb]">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center gap-x-8 gap-y-2">
        <p className="text-[12px] font-bold tracking-[0.08em] uppercase text-[#79818f] whitespace-nowrap">
          EUDR compliance deadlines
        </p>
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#3d4653]">
          <span className="w-[7px] h-[7px] rounded-full bg-[#4f46e5] shrink-0" />
          {EUDR_DEADLINES.largeMedium.label}: {EUDR_DEADLINES.largeMedium.display}
          {days && <span className="text-[#79818f] font-normal"> — {days.largeMedium} days</span>}
        </div>
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[#3d4653]">
          <span className="w-[7px] h-[7px] rounded-full bg-[#10b981] shrink-0" />
          {EUDR_DEADLINES.microSmall.label}: {EUDR_DEADLINES.microSmall.display}
          {days && <span className="text-[#79818f] font-normal"> — {days.microSmall} days</span>}
        </div>
      </div>
    </div>
  );
}
