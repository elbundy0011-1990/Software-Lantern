"use client";

import { useEffect, useState } from "react";

function diffParts(dateIso: string) {
  const target = new Date(`${dateIso}T00:00:00Z`).getTime();
  const ms = target - Date.now();
  const past = ms <= 0;
  const abs = Math.abs(ms);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  return { days, hours, past };
}

// A live countdown computed client-side from Date.now() against a ledger ISO date,
// recomputed every minute. No server round-trip, no AI. Only ever mounted on a
// result screen (after every question is answered), which only exists client-side,
// so there's no server/client hydration mismatch to account for.
export function Countdown({ dateIso }: { dateIso: string }) {
  const [parts, setParts] = useState(() => diffParts(dateIso));

  useEffect(() => {
    const id = setInterval(() => setParts(diffParts(dateIso)), 60_000);
    return () => clearInterval(id);
  }, [dateIso]);

  if (parts.past) {
    return <span>In force</span>;
  }
  return (
    <span>
      {parts.days} day{parts.days === 1 ? "" : "s"}, {parts.hours} hour{parts.hours === 1 ? "" : "s"} from now
    </span>
  );
}
