import { COMPLIANCE_LEDGER_SORTED, sourceLineText, type LedgerEntry } from "@/lib/compliance-ledger";

const STATUS_COLOR: Record<LedgerEntry["status"], string> = {
  in_force: "#166534",
  upcoming: "#9a3412",
};

// The site's signature element (docs/OT-CYBER-PLAN.md Part B §B.2.4):
// styled like an actual OT remote-access session log, but populated only
// with real, cited, dated regulatory facts from lib/compliance-ledger.ts,
// never fabricated activity, customers, or counts. An entry only renders
// here once `verified` is true and it carries evidence — unverified
// entries stay in the data file, flagged, until evidence is supplied.
// See docs/CLAIMS.md.
export function ComplianceLedger({ limit }: { limit?: number }) {
  const verifiedEntries = COMPLIANCE_LEDGER_SORTED.filter((entry) => entry.verified);
  const entries = limit ? verifiedEntries.slice(0, limit) : verifiedEntries;

  return (
    <div
      className="rounded border border-[#3f4b52]/[0.25] bg-[#1a1d22] px-5 py-4"
      style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
    >
      {/* 2026-10-19 audit fix: this used to be a single whitespace-nowrap
          line per entry inside an overflow-x-auto container, which just
          cut rows off at the edge on a 375px screen with no visible
          scroll affordance. Each row now wraps naturally (flex-wrap)
          instead of requiring horizontal scroll at all. */}
      <ul className="grid gap-[10px] text-[13px] leading-[1.5]">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-[2px] text-[#f6f5f1]">
            <span className="text-[#9ca3af]">{entry.display.toUpperCase()}</span>
            <span style={{ color: STATUS_COLOR[entry.status] }}>
              {entry.status === "in_force" ? "●" : "○"}
            </span>
            <span className="text-[#e5e7eb]">{entry.label}</span>
            <a
              href={entry.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9ca3af] underline underline-offset-2"
            >
              {sourceLineText(entry)}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-[#9ca3af]">
        ● in force · ○ upcoming · checked against the sources above on{" "}
        {entries[0]?.lastVerifiedDisplay ?? ""}.
      </p>
    </div>
  );
}
