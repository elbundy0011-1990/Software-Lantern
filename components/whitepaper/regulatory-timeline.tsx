import { COMPLIANCE_LEDGER, sourceLineText, type LedgerEntry } from "@/lib/compliance-ledger";
import { EUROSTAT_SOURCE } from "@/lib/eurostat-data";
import { Countdown } from "@/components/countdown";

const ACCENT = "#9a3412";
const IN_FORCE = "#166534";

const TIMELINE_IDS = ["nis2-be", "nis2-nl", "cra-reporting", "cra-full", "machinery-regulation"];

export const TIMELINE_ENTRIES: LedgerEntry[] = TIMELINE_IDS.map((id) => {
  const entry = COMPLIANCE_LEDGER.find((e) => e.id === id);
  if (!entry || !entry.verified) throw new Error(`Timeline ledger entry missing or unverified: ${id}`);
  return entry;
}).sort((a, b) => a.date.localeCompare(b.date));

// Days between two ISO dates, computed once, as of a fixed date, for the static
// print/PDF edition, which can't run a ticking clock after it's generated. The
// live open-web-page version instead reuses the site's existing Countdown
// component (components/countdown.tsx), computed fresh in the reader's own
// browser on every visit.
function daysAsOfEdition(targetIso: string): { days: number; past: boolean } {
  const target = new Date(`${targetIso}T00:00:00Z`).getTime();
  const edition = new Date(`${EUROSTAT_SOURCE.extractionDate}T00:00:00Z`).getTime();
  const ms = target - edition;
  return { days: Math.round(Math.abs(ms) / 86_400_000), past: ms <= 0 };
}

function StatusDot({ status }: { status: LedgerEntry["status"] }) {
  return <span style={{ color: status === "in_force" ? IN_FORCE : ACCENT }}>{status === "in_force" ? "●" : "○"}</span>;
}

export function RegulatoryTimeline({ mode }: { mode: "live" | "static" }) {
  return (
    <ul className="grid gap-3">
      {TIMELINE_ENTRIES.map((entry) => (
        <li key={entry.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
            <span className="font-semibold text-[14px] text-[#1a1d22]">
              <StatusDot status={entry.status} /> {entry.label}
            </span>
            <span className="text-[13px] font-semibold" style={{ color: ACCENT }}>
              {entry.display}
              {mode === "live" ? (
                <>
                  {" "}
                  &middot; <Countdown dateIso={entry.date} />
                </>
              ) : (
                (() => {
                  const d = daysAsOfEdition(entry.date);
                  return d.past ? " · in force as of the edition date" : ` · ${d.days} day${d.days === 1 ? "" : "s"} after the edition date`;
                })()
              )}
            </span>
          </div>
          <a href={entry.citationUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] underline" style={{ color: "#7c2d12" }}>
            {sourceLineText(entry)}
          </a>
        </li>
      ))}
    </ul>
  );
}
