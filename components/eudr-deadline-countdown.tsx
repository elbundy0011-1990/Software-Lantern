"use client";

import { useEffect, useState } from "react";
import { EUDR_DEADLINES } from "@/lib/eudr-dates";
import { daysUntil } from "@/lib/dates";
import { CalendarIcon } from "@/components/icons";

function DeadlineCard({
  label,
  display,
  days,
  accent,
  bg,
}: {
  label: string;
  display: string;
  days: number | null;
  accent: string;
  bg: string;
}) {
  return (
    <div
      className="flex-1 min-w-[240px] rounded-2xl border p-6 sm:p-7 text-center"
      style={{ borderColor: `${accent}33`, background: bg }}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <CalendarIcon color={accent} />
        <p
          className="text-[13px] font-bold tracking-[0.06em] uppercase"
          style={{ color: accent }}
        >
          {label}
        </p>
      </div>
      <p
        className="font-sans font-semibold leading-none tracking-[-0.02em] mb-2 tabular-nums"
        style={{ color: "#0d1117", fontSize: "clamp(44px, 8vw, 64px)" }}
      >
        {days !== null ? days : "–"}
      </p>
      <p className="text-[14px] font-semibold text-[#5c6573] mb-3">days remaining</p>
      <p className="text-[14px] text-[#79818f]">Deadline: {display}</p>
    </div>
  );
}

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
    <section className="border-b border-[#0d1117]/[0.07] bg-[#f6f7fb]">
      <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-16 text-center">
        <p className="mb-7 text-[12px] font-bold tracking-[0.09em] uppercase text-[#79818f]">
          EUDR compliance deadlines
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <DeadlineCard
            label={EUDR_DEADLINES.largeMedium.label}
            display={EUDR_DEADLINES.largeMedium.display}
            days={days ? days.largeMedium : null}
            accent="#4f46e5"
            bg="#eef1f8"
          />
          <DeadlineCard
            label={EUDR_DEADLINES.microSmall.label}
            display={EUDR_DEADLINES.microSmall.display}
            days={days ? days.microSmall : null}
            accent="#047857"
            bg="rgba(16,185,129,0.08)"
          />
        </div>
      </div>
    </section>
  );
}
