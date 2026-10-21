import Link from "next/link";
import { COMPLIANCE_LEDGER, sourceLineText } from "@/lib/compliance-ledger";
import { getCountrySection } from "@/lib/country-report";
import {
  NACE_DATA,
  SECONDARY_NACE_CODES,
  EUROSTAT_SOURCE,
  CBS_CROSS_CHECK,
  CBS_50_PLUS,
  STATBEL_CROSS_CHECK_NOTE,
  share50PlusPct,
  naceEntry,
} from "@/lib/eurostat-data";
import {
  EXECUTIVE_FINDINGS,
  APPROACH_SUMMARIES,
  TRADEOFF_DIMENSIONS,
  ILLUSTRATIVE_SCENARIOS,
  ACTION_PLAN,
  METHODOLOGY_NOTE,
  SIZE_TEST_CAVEAT,
} from "@/lib/whitepaper-content";
import { VENDOR_CHECKLIST_ROWS } from "@/lib/vendor-checklist-rows";
import { SizeClassChart } from "@/components/whitepaper/size-class-chart";
import { RegulatoryTimeline } from "@/components/whitepaper/regulatory-timeline";

const ACCENT = "#9a3412";
const ACCENT_DARK = "#7c2d12";

export const h2 = "font-sans font-semibold text-[24px] leading-[1.2] tracking-[-0.02em] mt-12 mb-4 text-[#1a1d22]";
export const p = "text-[15px] leading-[1.7] text-[#3f4b52] mb-4";
const link = "font-semibold underline";
const linkStyle = { color: ACCENT_DARK };

export function SectionHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <h2 className={h2}>
      <span className="text-[13px] font-bold uppercase tracking-[0.07em] block mb-1" style={{ color: ACCENT }}>
        Part {number}
      </span>
      {children}
    </h2>
  );
}

export function ExecutiveSummarySection() {
  const nis2Be = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-be")!;
  const nis2Nl = COMPLIANCE_LEDGER.find((e) => e.id === "nis2-nl")!;
  return (
    <div>
      <SectionHeading number="1">Executive summary</SectionHeading>
      <p className={p}>
        Five findings, each traceable to a specific source cited where it appears in this report.
        None is this report&apos;s own judgment call.
      </p>
      {/* Plain block flow with space-y, not grid/flex: Chromium's print
          pagination can't fragment a grid or flex container across a page
          break, so a multi-item grid list either fits entirely on the current
          page or jumps whole to the next one, leaving the rest of the page
          blank. Block-level children break normally. */}
      <ol className="space-y-4 list-decimal pl-5">
        {EXECUTIVE_FINDINGS.map((f) => (
          <li key={f.id} className={p + " mb-0"}>
            {f.text}
            {f.id === "nis2-in-force" && (
              <>
                {" "}Belgium: <strong>{nis2Be.display}</strong> (
                <a href={nis2Be.citationUrl} target="_blank" rel="noopener noreferrer" className={link} style={linkStyle}>
                  {sourceLineText(nis2Be)}
                </a>
                ). Netherlands: <strong>{nis2Nl.display}</strong> (
                <a href={nis2Nl.citationUrl} target="_blank" rel="noopener noreferrer" className={link} style={linkStyle}>
                  {sourceLineText(nis2Nl)}
                </a>
                ).
              </>
            )}
            <span className="block text-[12px] text-[#6b7280] mt-1">Source: {f.sourceNote}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CountryComparisonSection() {
  const be = getCountrySection("BE")!;
  const nl = getCountrySection("NL")!;
  return (
    <div>
      <SectionHeading number="2">The two countries compared</SectionHeading>
      <p className={p}>{SIZE_TEST_CAVEAT}</p>
      <SizeClassChart />
      <p className={`${p} mt-4`}>
        The same 50-or-more-employed share for the five related NACE codes this report also pulled
        (computer/electronic/optical products, electrical equipment, motor vehicles, other transport
        equipment, and repair and installation of machinery), for context:
      </p>
      <div className="overflow-x-auto mb-4 -mx-1">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#3f4b52]/[0.2]">
              <th className="py-2 px-1 font-semibold text-[#1a1d22]">NACE code</th>
              <th className="py-2 px-1 font-semibold text-[#1a1d22]">Belgium: total / 50+ share</th>
              <th className="py-2 px-1 font-semibold text-[#1a1d22]">Netherlands: total / 50+ share</th>
            </tr>
          </thead>
          <tbody className="text-[#3f4b52]">
            {SECONDARY_NACE_CODES.map((code) => {
              const beEntry = naceEntry("BE", code);
              const nlEntry = naceEntry("NL", code);
              return (
                <tr key={code} className="border-b border-[#3f4b52]/[0.12] align-top">
                  <td className="py-2 px-1">{code} {beEntry.naceLabel}</td>
                  <td className="py-2 px-1">{beEntry.enterprisesTotal.toLocaleString("en-US")} / {share50PlusPct(beEntry)}%</td>
                  <td className="py-2 px-1">{nlEntry.enterprisesTotal.toLocaleString("en-US")} / {share50PlusPct(nlEntry)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-[#6b7280] mb-6">
        Source: Eurostat, dataset {EUROSTAT_SOURCE.datasetCode}, {EUROSTAT_SOURCE.year}, extracted{" "}
        {EUROSTAT_SOURCE.extractionDateDisplay}. Cross-check: CBS (Statistics Netherlands), table{" "}
        {CBS_CROSS_CHECK.datasetCode}, SBI {CBS_CROSS_CHECK.sbiCode}, {CBS_CROSS_CHECK.periodDisplay},
        extracted {CBS_CROSS_CHECK.extractionDateDisplay}: {CBS_CROSS_CHECK.totalEnterprises.toLocaleString("en-US")}{" "}
        total enterprises, {CBS_50_PLUS} with 50 or more employed, corroborating the Eurostat
        Netherlands figure in enterprise count though not in total (a quarterly business-register
        snapshot, not the same survey). {STATBEL_CROSS_CHECK_NOTE}
      </p>

      <h3 className="font-sans font-semibold text-[18px] mb-3 text-[#1a1d22]">Supervisory authority, registration, and incident reporting</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[{ label: "Belgium", section: be }, { label: "Netherlands", section: nl }].map(({ label, section }) => (
          <div key={label} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4">
            <p className="font-semibold text-[14px] text-[#1a1d22] mb-2">{label}</p>
            <ul className="space-y-2 text-[13px] text-[#3f4b52]">
              <li>
                <strong className="text-[#1a1d22]">In force since:</strong> {section.inForce.display}
              </li>
              <li>
                <strong className="text-[#1a1d22]">Supervisory authority:</strong>{" "}
                <a href={section.authority.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {section.authority.citationLabel}
                </a>
              </li>
              <li>
                <strong className="text-[#1a1d22]">Registration step:</strong>{" "}
                <a href={section.registration.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {section.registration.citationLabel}
                </a>
              </li>
              <li>
                <strong className="text-[#1a1d22]">Incident-reporting duty:</strong>{" "}
                <a href={section.incident.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {section.incident.citationLabel}
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegulatoryTimelineSection({ mode }: { mode: "live" | "static" }) {
  return (
    <div>
      <SectionHeading number="3">Regulatory timeline</SectionHeading>
      <p className={p}>
        {mode === "live"
          ? "Countdowns below are computed live, in your browser, as of today."
          : "Countdowns below are computed as of this edition's date and will not update after printing; see the open web page for a live countdown."}
      </p>
      <RegulatoryTimeline mode={mode} />
    </div>
  );
}

export function ApproachesSection() {
  return (
    <div>
      <SectionHeading number="4">How remote access works in practice</SectionHeading>
      <p className={p}>
        Six common approaches, condensed. None is named here as better or worse than another; see{" "}
        <Link href="/guides/remote-access-approaches" className={link} style={linkStyle}>
          the fuller guide
        </Link>{" "}
        for where each fits and exactly what to ask.
      </p>
      <div className="space-y-4">
        {APPROACH_SUMMARIES.map((a) => (
          <div key={a.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4">
            <p className="font-semibold text-[14px] text-[#1a1d22] mb-1">{a.name}</p>
            <p className="text-[13px] text-[#3f4b52] mb-1">{a.how}</p>
            <p className="text-[13px] text-[#3f4b52]"><strong className="text-[#1a1d22]">Trade-off:</strong> {a.tradeoff}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TradeoffsSection() {
  return (
    <div>
      <SectionHeading number="5">Trade-offs</SectionHeading>
      <p className={p}>
        Six dimensions worth weighing deliberately, each a genuine tension rather than a right
        answer. No approach or dimension is scored here.
      </p>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#3f4b52]/[0.2]">
              <th className="py-2 px-1 font-semibold text-[#1a1d22] w-[140px]">Dimension</th>
              <th className="py-2 px-1 font-semibold text-[#1a1d22]">The tension</th>
            </tr>
          </thead>
          <tbody className="text-[#3f4b52]">
            {TRADEOFF_DIMENSIONS.map((d) => (
              <tr key={d.id} className="border-b border-[#3f4b52]/[0.12] align-top">
                <td className="py-2 px-1 font-semibold text-[#1a1d22]">{d.name}</td>
                <td className="py-2 px-1">{d.tension}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BuyerMatrixSection() {
  const categories = [...new Set(VENDOR_CHECKLIST_ROWS.map((r) => r.category))];
  return (
    <div>
      <SectionHeading number="6">Buyer&apos;s evaluation matrix</SectionHeading>
      <p className={p}>
        Twenty-five requirements worth having an answer to, grouped by topic, each with why it
        matters and what to ask. This is a list of requirements to evaluate against, not a
        verdict on any product or vendor; it names none.
      </p>
      {categories.map((cat) => (
        <div key={cat} className="mb-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#3f4b52] mb-2">{cat}</p>
          <div className="space-y-3">
            {VENDOR_CHECKLIST_ROWS.filter((r) => r.category === cat).map((row) => (
              <div key={row.id} className="rounded border border-[#3f4b52]/[0.15] bg-white p-3">
                <p className="font-semibold text-[13px] text-[#1a1d22] mb-1">{row.criterion}</p>
                <p className="text-[12px] text-[#3f4b52] mb-1">{row.why}</p>
                <p className="text-[12px] text-[#1a1d22]"><strong>Ask:</strong> {row.askTheVendor}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className={p}>
        <Link href="/vendor-checklist" className={link} style={linkStyle}>
          Get the full 25-criteria vendor comparison checklist
        </Link>{" "}
        as an editable spreadsheet, with blank columns for your own requirement and up to three
        vendors&apos; answers.
      </p>
    </div>
  );
}

export function ScenariosSection() {
  return (
    <div>
      <SectionHeading number="7">Illustrative scenarios</SectionHeading>
      <p className={p}>
        Three generic, fictional situations, labelled illustrative throughout, used only to show
        which rules and trade-offs a situation like it touches. None describes a real company.
      </p>
      <div className="space-y-4">
        {ILLUSTRATIVE_SCENARIOS.map((s) => (
          <div key={s.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: ACCENT }}>
              Illustrative
            </p>
            <p className="font-semibold text-[14px] text-[#1a1d22] mb-2">{s.title}</p>
            <p className="text-[13px] text-[#3f4b52] mb-2">{s.situation}</p>
            <p className="text-[13px] text-[#3f4b52]"><strong className="text-[#1a1d22]">What it touches:</strong> {s.whatItTouches}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActionPlanSection() {
  const groups = [...new Set(ACTION_PLAN.map((a) => a.days))];
  return (
    <div>
      <SectionHeading number="8">A 90-day action plan</SectionHeading>
      {groups.map((g) => (
        <div key={g} className="mb-4">
          <p className="font-semibold text-[14px] text-[#1a1d22] mb-2">{g}</p>
          <ul className="space-y-2 text-[14px] text-[#3f4b52]">
            {ACTION_PLAN.filter((a) => a.days === g).map((a) => (
              <li key={a.text} className="flex gap-2">
                <span style={{ color: ACCENT }}>&#8226;</span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SourcesMethodologySection() {
  const ledgerUsed = COMPLIANCE_LEDGER.filter((e) =>
    ["nis2-be", "nis2-nl", "cra-reporting", "cra-full", "machinery-regulation"].includes(e.id),
  );
  return (
    <div>
      <SectionHeading number="9">Sources and methodology</SectionHeading>
      <p className={p}>{METHODOLOGY_NOTE}</p>
      <h3 className="font-sans font-semibold text-[16px] mb-2 text-[#1a1d22]">Regulatory dates cited</h3>
      <ul className="space-y-2 text-[13px] text-[#3f4b52] mb-4">
        {ledgerUsed.map((e) => (
          <li key={e.id}>
            {e.label}: <strong className="text-[#1a1d22]">{e.display}</strong>.{" "}
            <a href={e.citationUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {sourceLineText(e)}
            </a>
          </li>
        ))}
      </ul>
      <h3 className="font-sans font-semibold text-[16px] mb-2 text-[#1a1d22]">Enterprise and employment data</h3>
      <ul className="space-y-2 text-[13px] text-[#3f4b52] mb-4">
        <li>
          Eurostat, dataset {EUROSTAT_SOURCE.datasetCode} ({EUROSTAT_SOURCE.datasetLabel}),{" "}
          {EUROSTAT_SOURCE.year} figures, extracted {EUROSTAT_SOURCE.extractionDateDisplay}.{" "}
          <a href={EUROSTAT_SOURCE.queryUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Query used
          </a>
          .
        </li>
        <li>
          CBS (Statistics Netherlands) cross-check, table {CBS_CROSS_CHECK.datasetCode}, SBI code{" "}
          {CBS_CROSS_CHECK.sbiCode}, {CBS_CROSS_CHECK.periodDisplay}, extracted{" "}
          {CBS_CROSS_CHECK.extractionDateDisplay}.{" "}
          <a href={CBS_CROSS_CHECK.queryUrl} target="_blank" rel="noopener noreferrer" className="underline">
            Query used
          </a>
          .
        </li>
        <li>{STATBEL_CROSS_CHECK_NOTE}</li>
      </ul>
      <p className="text-[13px] text-[#3f4b52]">
        Full extraction methodology and raw API responses are recorded in this project&apos;s own
        documentation at the time of publication. No number in this report is modeled, projected,
        or estimated; every number traces to one of the sources above or to the compliance ledger
        entries listed earlier in this report.
      </p>
    </div>
  );
}

export function TableOfContents() {
  const items = [
    "Executive summary",
    "The two countries compared",
    "Regulatory timeline",
    "How remote access works in practice",
    "Trade-offs",
    "Buyer's evaluation matrix",
    "Illustrative scenarios",
    "A 90-day action plan",
    "Sources and methodology",
  ];
  return (
    <div className="rounded border border-[#3f4b52]/[0.18] bg-[#f6f5f1] p-5">
      <p className="font-semibold text-[14px] text-[#1a1d22] mb-3">Contents</p>
      <ol className="space-y-1.5 text-[14px] text-[#3f4b52] list-decimal pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

export const NACE_ROWS_FOR_QA = NACE_DATA;
