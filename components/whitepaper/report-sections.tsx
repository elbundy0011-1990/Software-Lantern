import Link from "next/link";
import {
  COMPLIANCE_LEDGER,
  SUPPLEMENTARY_EVIDENCE,
  sourceLineText,
  type LedgerEntry,
  type SupplementaryQuote,
} from "@/lib/compliance-ledger";
import { getCountrySection, evidenceSummary } from "@/lib/country-report";
import { incidentById, EXCLUDED_INCIDENTS, type IncidentEvidence } from "@/lib/incident-evidence";
import {
  EUROSTAT_SOURCE,
  CBS_CROSS_CHECK,
  CBS_50_PLUS,
  STATBEL_CROSS_CHECK_NOTE,
  naceEntry,
  share50PlusPct,
} from "@/lib/eurostat-data";
import {
  REPORT_SECTIONS,
  partLabel,
  sectionById,
  type SectionId,
  type ContentLabel,
  type EvidenceRef,
  THESIS,
  READERS,
  LABEL_KEY,
  FINDINGS,
  MODEL_INTRO,
  MODEL_ASSUMPTIONS,
  MODEL_READING,
  SPRAWL_HIDING_PLACES,
  FAILURE_PATTERNS,
  DIMENSIONS,
  ASSESSMENT_RULE,
  ARCHITECTURES,
  ARCHITECTURE_NOTE,
  NO_PRODUCT_MANDATE,
  REGULATION_BLOCKS,
  ANNEX_III_NOTE,
  REGULATION_EXCLUDED,
  INCIDENT_INTRO,
  INCIDENT_READINGS,
  PLAN_STEPS,
  SIZE_TEST_CAVEAT,
  CONTEXT_READING,
  MATRIX_GROUPS,
  UNACCEPTABLE_ANSWERS,
  METHOD_POINTS,
} from "@/lib/whitepaper-content";
import { VENDOR_CHECKLIST_ROWS } from "@/lib/vendor-checklist-rows";
import { SizeClassChart } from "@/components/whitepaper/size-class-chart";
import { AccessSprawlModel } from "@/components/whitepaper/access-sprawl-model";

const ACCENT = "#9a3412";
const ACCENT_DARK = "#7c2d12";
const INK = "#1a1d22";

export const p = "text-[14px] leading-[1.65] text-[#3f4b52] mb-3";
const small = "text-[11.5px] leading-[1.5] text-[#6b7280]";
const linkStyle = { color: ACCENT_DARK };

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

export function SectionHeading({ id }: { id: SectionId }) {
  const s = sectionById(id);
  return (
    <h2 id={id} className="font-sans font-semibold text-[23px] leading-[1.2] tracking-[-0.02em] mb-3 text-[#1a1d22]">
      <span className="text-[12px] font-bold uppercase tracking-[0.07em] block mb-1" style={{ color: ACCENT }}>
        {partLabel(id)}
      </span>
      {s.title}
    </h2>
  );
}

const TAG_COLORS: Record<ContentLabel, { bg: string; fg: string }> = {
  Data: { bg: "#e7efe9", fg: "#166534" },
  Interpretation: { bg: "#eef0f3", fg: "#3f4b52" },
  Model: { bg: "#fbeee6", fg: ACCENT_DARK },
};

export function Tag({ kind }: { kind: ContentLabel }) {
  const c = TAG_COLORS[kind];
  return (
    <span
      className="inline-block rounded px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-[0.06em] align-middle mr-1.5"
      style={{ background: c.bg, color: c.fg }}
    >
      {kind}
    </span>
  );
}

type AnyLedger = LedgerEntry | SupplementaryQuote;

function ledgerEntry(id: string): AnyLedger {
  const e: AnyLedger | undefined =
    COMPLIANCE_LEDGER.find((x) => x.id === id && x.verified) ?? SUPPLEMENTARY_EVIDENCE.find((x) => x.id === id);
  if (!e) throw new Error(`Report cites a missing or unverified ledger entry: ${id}`);
  return e;
}

function ledgerSourceLine(e: AnyLedger): string {
  const line = sourceLineText(e);
  return e.ojReference ? `${line.replace(/\.$/, "")}. ${e.ojReference}.` : line;
}

function incidentSourceLine(i: IncidentEvidence): string {
  return `Source: ${i.recordLabel}, ${i.recordId}${i.recordDateDisplay ? `, ${i.recordDateDisplay}` : ""}, checked ${i.lastVerifiedDisplay}`;
}

function eurostatSourceLine(): string {
  return `Source: Eurostat, dataset ${EUROSTAT_SOURCE.datasetCode}, ${EUROSTAT_SOURCE.year}, extracted ${EUROSTAT_SOURCE.extractionDateDisplay}`;
}

function shortCite(r: EvidenceRef): { text: string; url: string } {
  if (r.kind === "ledger") {
    const e = ledgerEntry(r.id);
    return { text: e.citationLabel, url: e.citationUrl };
  }
  if (r.kind === "incident") {
    const i = incidentById(r.id);
    return { text: `${i.name} ${i.recordType}, ${i.recordId}`, url: i.recordUrl };
  }
  return { text: `Eurostat ${EUROSTAT_SOURCE.datasetCode}, ${EUROSTAT_SOURCE.year}`, url: EUROSTAT_SOURCE.queryUrl };
}

// Compact, linked citations in the body. The full source line for each (check
// date, Official Journal reference, URL) is listed once in Appendix B.
function EvidenceList({ refs }: { refs: EvidenceRef[] }) {
  return (
    <p className={`${small} mt-0.5`}>
      <Tag kind="Data" />
      Sources:{" "}
      {refs.map((r, i) => {
        const c = shortCite(r);
        return (
          <span key={i}>
            {i > 0 && "; "}
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
              {c.text}
            </a>
          </span>
        );
      })}
      .
    </p>
  );
}

function LedgerQuotes({ id }: { id: string }) {
  const e = ledgerEntry(id);
  if (e.evidence.kind !== "quote") return null;
  return (
    <div className="mb-2.5" style={{ breakInside: "avoid" }}>
      {e.evidence.quotes.map((q) => (
        <blockquote key={q.article} className="border-l-2 pl-3 mb-1" style={{ borderColor: ACCENT }}>
          <p className="text-[12.5px] leading-[1.55] text-[#1a1d22]">
            <span className="font-semibold">{q.article}: </span>&ldquo;{q.translation ?? q.text}&rdquo;
          </p>
        </blockquote>
      ))}
      <p className={small}>
        <a href={e.citationUrl} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
          {ledgerSourceLine(e)}
        </a>
      </p>
    </div>
  );
}

function groupByUrl(entries: AnyLedger[]): [string, AnyLedger[]][] {
  const map = new Map<string, AnyLedger[]>();
  for (const e of entries) map.set(e.citationUrl, [...(map.get(e.citationUrl) ?? []), e]);
  return [...map.entries()];
}

// Days from the edition date, fixed, so the printed report never claims to
// know today's date.
function statusAsOfEdition(iso: string): string {
  const edition = new Date(`${EUROSTAT_SOURCE.extractionDate}T00:00:00Z`).getTime();
  const target = new Date(`${iso}T00:00:00Z`).getTime();
  return target <= edition ? "applies as of the edition date" : "applies after the edition date";
}

// ---------------------------------------------------------------------------
// Front matter
// ---------------------------------------------------------------------------

export function HowToRead() {
  return (
    <div>
      <p className="text-[16px] leading-[1.6] text-[#1a1d22] mb-3 font-medium">{THESIS}</p>
      <p className={p}>{READERS}</p>
      <div className="rounded border border-[#3f4b52]/[0.18] bg-[#f6f5f1] p-4 mt-4">
        <p className="font-semibold text-[14px] text-[#1a1d22] mb-2">How to read this report</p>
        <p className={p}>
          Every block carries one label. Short citations in the text link to their source; the full
          source line for each, with its check date and Official Journal reference, is in{" "}
          {partLabel("method")}.
        </p>
        <ul className="space-y-1.5">
          {LABEL_KEY.map((k) => (
            <li key={k.label} className="text-[13px] leading-[1.55] text-[#3f4b52]">
              <Tag kind={k.label} />
              {k.meaning}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TableOfContents() {
  return (
    <div className="rounded border border-[#3f4b52]/[0.18] bg-white p-4">
      <p className="font-semibold text-[14px] text-[#1a1d22] mb-2">Contents</p>
      <ol className="space-y-1 text-[14px] text-[#3f4b52]">
        {REPORT_SECTIONS.map((s) => (
          <li key={s.id} className="flex gap-2">
            <span className="w-[86px] shrink-0 font-semibold" style={{ color: ACCENT }}>
              {partLabel(s.id)}
            </span>
            <span>{s.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 1
// ---------------------------------------------------------------------------

export function BriefingSection() {
  return (
    <div>
      <SectionHeading id="briefing" />
      <p className={p}>
        Four findings. Each states what the evidence says (Data), then what it means for the plant&apos;s
        security lead and for the machine builder (Interpretation).
      </p>
      <ol className="space-y-4">
        {FINDINGS.map((f, i) => (
          <li key={f.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4" style={{ breakInside: "avoid" }}>
            <p className="font-semibold text-[15px] text-[#1a1d22] mb-1.5">
              {i + 1}. {f.headline}
            </p>
            <p className="text-[13px] leading-[1.6] text-[#3f4b52] mb-1">
              <Tag kind="Data" />
              {f.body}
            </p>
            <EvidenceList refs={f.evidence} />
            <p className="text-[13px] leading-[1.6] text-[#3f4b52] mt-2">
              <Tag kind="Interpretation" />
              <strong className="text-[#1a1d22]">For the plant:</strong> {f.forOperator}
            </p>
            <p className="text-[13px] leading-[1.6] text-[#3f4b52] mt-1">
              <Tag kind="Interpretation" />
              <strong className="text-[#1a1d22]">For the builder:</strong> {f.forBuilder}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 2
// ---------------------------------------------------------------------------

export function SprawlSection({ interactive }: { interactive: boolean }) {
  return (
    <div>
      <SectionHeading id="sprawl" />
      <p className={p}>
        <Tag kind="Interpretation" />
        {MODEL_INTRO}
      </p>
      <AccessSprawlModel interactive={interactive} />
      <p className="text-[12.5px] font-semibold text-[#1a1d22] mt-4 mb-1">
        <Tag kind="Model" />
        Assumptions
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[12.5px] leading-[1.55] text-[#3f4b52]">
        {MODEL_ASSUMPTIONS.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <p className="text-[12.5px] font-semibold text-[#1a1d22] mt-4 mb-1">
        <Tag kind="Interpretation" />
        Reading the model
      </p>
      <ul className="list-disc pl-5 space-y-1 text-[12.5px] leading-[1.55] text-[#3f4b52]">
        {MODEL_READING.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <p className="text-[12.5px] font-semibold text-[#1a1d22] mt-4 mb-1">
        <Tag kind="Interpretation" />
        Where sprawl hides
      </p>
      <ul className="space-y-1 text-[12.5px] leading-[1.55] text-[#3f4b52]">
        {SPRAWL_HIDING_PLACES.map((h) => (
          <li key={h.name}>
            <strong className="text-[#1a1d22]">{h.name}.</strong> {h.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 3
// ---------------------------------------------------------------------------

export function FailuresSection() {
  return (
    <div>
      <SectionHeading id="failures" />
      <p className={p}>
        Five ways governance of remote access fails. Each shows what it looks like, which rule or
        public record it maps to, and what fixed looks like.
      </p>
      <div className="space-y-3">
        {FAILURE_PATTERNS.map((f) => (
          <div key={f.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-3.5" style={{ breakInside: "avoid" }}>
            <p className="font-semibold text-[14px] text-[#1a1d22] mb-1">{f.name}</p>
            <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mb-1">
              <Tag kind="Interpretation" />
              <strong className="text-[#1a1d22]">What it looks like:</strong> {f.looksLike}
            </p>
            <p className="text-[12.5px] leading-[1.55] text-[#3f4b52]">
              <Tag kind="Data" />
              {f.evidenceNote}
            </p>
            <EvidenceList refs={f.evidence} />
            <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mt-1.5">
              <Tag kind="Interpretation" />
              <strong className="text-[#1a1d22]">What fixed looks like:</strong> {f.fixed}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 4
// ---------------------------------------------------------------------------

export function AssessmentGrid() {
  return (
    <div>
      <SectionHeading id="assessment" />
      <p className={p}>
        <Tag kind="Interpretation" />
        Five dimensions of remote access governance. Mark each one verified, partial or unknown for your
        own setup.
      </p>
      <p className={p}>{ASSESSMENT_RULE}</p>
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b-2 border-[#3f4b52]/[0.25]">
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22] w-[96px]">Dimension</th>
            <th className="py-1.5 pr-2 font-semibold text-[#166534]">Verified means</th>
            <th className="py-1.5 pr-2 font-semibold text-[#92400e]">Partial</th>
            <th className="py-1.5 pr-2 font-semibold text-[#6b7280]">Unknown</th>
            <th className="py-1.5 font-semibold text-[#1a1d22] w-[64px]">Your mark</th>
          </tr>
        </thead>
        <tbody className="text-[#3f4b52]">
          {DIMENSIONS.map((d) => (
            <tr key={d.id} className="border-b border-[#3f4b52]/[0.12] align-top" style={{ breakInside: "avoid" }}>
              <td className="py-2 pr-2">
                <span className="font-semibold text-[#1a1d22] block">{d.name}</span>
                <span className="text-[11px] leading-[1.4] block mt-0.5">{d.question}</span>
              </td>
              <td className="py-2 pr-2">{d.verified}</td>
              <td className="py-2 pr-2">{d.partial}</td>
              <td className="py-2 pr-2">{d.unknown}</td>
              <td className="py-2 text-[11px] leading-[1.7]">
                &#9744; V<br />&#9744; P<br />&#9744; U
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArchitecturesSection() {
  return (
    <div>
      <h3 className="font-sans font-semibold text-[18px] mb-2 text-[#1a1d22]">Six access architectures against the five dimensions</h3>
      <p className={p}>
        <Tag kind="Interpretation" />
        {ARCHITECTURE_NOTE}
      </p>
      <div className="space-y-3">
        {ARCHITECTURES.map((a) => (
          <div key={a.id} style={{ breakInside: "avoid" }}>
            <p className="font-semibold text-[14px] text-[#1a1d22]">{a.name}</p>
            <p className="text-[11.5px] text-[#6b7280] mb-1">Assumption: {a.assumption}</p>
            <table className="w-full text-left border-collapse text-[11px] leading-[1.35]">
              <thead>
                <tr className="border-b border-[#3f4b52]/[0.25]">
                  <th className="py-[3px] pr-2 font-semibold text-[#1a1d22] w-[84px]">Dimension</th>
                  <th className="py-[3px] pr-2 font-semibold text-[#1a1d22]">Constrained by design</th>
                  <th className="py-[3px] pr-2 font-semibold text-[#1a1d22]">Depends on configuration</th>
                  <th className="py-[3px] font-semibold text-[#1a1d22]">Residual risk</th>
                </tr>
              </thead>
              <tbody className="text-[#3f4b52]">
                {DIMENSIONS.map((d) => {
                  const c = a.cells[d.id];
                  return (
                    <tr key={d.id} className="border-b border-[#3f4b52]/[0.1] align-top">
                      <td className="py-[3px] pr-2 font-semibold text-[#1a1d22]">{d.name}</td>
                      <td className="py-[3px] pr-2">{c.design}</td>
                      <td className="py-[3px] pr-2">{c.config}</td>
                      <td className="py-[3px]">{c.residual}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p className={`${small} mt-3`}>
        For a longer description of each architecture and what to ask about it, see{" "}
        <Link href="/guides/remote-access-approaches" className="underline" style={linkStyle}>
          the remote access approaches guide
        </Link>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 5
// ---------------------------------------------------------------------------

export function RegulationIntro() {
  return (
    <div>
      <SectionHeading id="regulation" />
      <p className={p}>
        Three EU acts, three different things regulated. For each: who is in scope, the provisions that
        touch remote access (quoted, Data), what they mean for remote access and what evidence to keep
        (Interpretation). Only provisions verified against the official text are quoted.
      </p>
      <div className="rounded border-l-4 bg-[#f6f5f1] p-3 mb-2" style={{ borderColor: ACCENT }}>
        <p className="text-[13px] leading-[1.6] text-[#1a1d22]">{NO_PRODUCT_MANDATE}</p>
      </div>
    </div>
  );
}

export function RegulationBlockSection({ id }: { id: string }) {
  const b = REGULATION_BLOCKS.find((x) => x.id === id)!;
  return (
    <div>
      <h3 className="font-sans font-semibold text-[18px] mb-1 text-[#1a1d22]">{b.name}</h3>
      <p className="text-[13px] text-[#3f4b52] mb-2">
        <strong className="text-[#1a1d22]">Regulates:</strong> {b.regulates}
      </p>
      <p className="text-[12.5px] leading-[1.55] text-[#3f4b52]">
        <Tag kind="Interpretation" />
        <strong className="text-[#1a1d22]">Scope:</strong> {b.scopeNote}
      </p>
      <EvidenceList refs={b.scope} />
      <ul className={`${small} mt-1 mb-3 space-y-0.5`}>
        {b.datesLedgerIds.map((lid) => {
          const e = COMPLIANCE_LEDGER.find((x) => x.id === lid && x.verified)!;
          return (
            <li key={lid}>
              <Tag kind="Data" />
              <span className="text-[#1a1d22] font-semibold">{e.label}: {e.display}</span> ({statusAsOfEdition(e.date)}).{" "}
              <a href={e.citationUrl} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
                {ledgerSourceLine(e)}
              </a>
            </li>
          );
        })}
      </ul>
      <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#3f4b52] mb-1.5">
        <Tag kind="Data" />
        The provisions
      </p>
      {b.quotes.map((q) => (
        <LedgerQuotes key={q} id={q} />
      ))}
      <div className="grid grid-cols-2 gap-3 mt-2" style={{ breakInside: "avoid" }}>
        <div>
          <p className="text-[12.5px] font-semibold text-[#1a1d22] mb-1">
            <Tag kind="Interpretation" />
            What it means for remote access
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[12px] leading-[1.5] text-[#3f4b52]">
            {b.remoteAccessMeaning.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12.5px] font-semibold text-[#1a1d22] mb-1">
            <Tag kind="Interpretation" />
            Evidence to keep
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[12px] leading-[1.5] text-[#3f4b52]">
            {b.evidenceToKeep.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
      {b.id === "cra" && (
        <div className="mt-3">
          <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mb-1">
            <Tag kind="Interpretation" />
            {ANNEX_III_NOTE}
          </p>
          <LedgerQuotes id="cra-annex3-class1-iam-vpn" />
        </div>
      )}
    </div>
  );
}

export function BeneluxAndExcluded() {
  const countries = [
    { label: "Belgium", section: getCountrySection("BE")! },
    { label: "Netherlands", section: getCountrySection("NL")! },
  ];
  const lu = getCountrySection("LU")!;
  return (
    <div>
      <h3 className="font-sans font-semibold text-[18px] mb-2 text-[#1a1d22]">
        <Tag kind="Data" />
        NIS2 in Belgium and the Netherlands
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {countries.map(({ label, section }) => (
          <div key={label} className="rounded border border-[#3f4b52]/[0.18] bg-white p-3">
            <p className="font-semibold text-[13.5px] text-[#1a1d22] mb-1.5">{label}</p>
            <ul className="space-y-1.5 text-[12px] leading-[1.45] text-[#3f4b52]">
              <li>
                <strong className="text-[#1a1d22]">In force since:</strong> {section.inForce.display}
              </li>
              {[
                { name: "Supervisory authority", e: section.authority },
                { name: "Registration", e: section.registration },
                { name: "Incident reporting", e: section.incident },
              ].map(({ name, e }) => (
                <li key={name}>
                  <strong className="text-[#1a1d22]">{name}:</strong>{" "}
                  <a href={e.citationUrl} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
                    {e.citationLabel}
                  </a>
                  , checked {e.lastVerifiedDisplay}
                  {name === "Incident reporting" && (
                    <span className="block mt-0.5 text-[11px] text-[#6b7280]">&ldquo;{evidenceSummary(e)}&rdquo;</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`${small} mt-2`}>
        Luxembourg: NIS2 in force since {lu.inForce.display}; competent authority, registration and
        incident notification per{" "}
        <a href={lu.authority.citationUrl} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
          {lu.authority.citationLabel}
        </a>
        , checked {lu.authority.lastVerifiedDisplay}.
      </p>

      <div className="rounded border border-dashed border-[#3f4b52]/[0.4] p-3 mt-4">
        <p className="font-semibold text-[13.5px] text-[#1a1d22] mb-1.5">Excluded: not verified or not applicable</p>
        <ul className="space-y-1 text-[12px] leading-[1.5] text-[#3f4b52]">
          {REGULATION_EXCLUDED.map((x) => (
            <li key={x.item}>
              <strong className="text-[#1a1d22]">{x.item}.</strong> {x.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 6
// ---------------------------------------------------------------------------

export function IncidentsSection() {
  return (
    <div>
      <SectionHeading id="incidents" />
      <p className={p}>{INCIDENT_INTRO}</p>
      <div className="space-y-4">
        {INCIDENT_READINGS.map((r) => {
          const i = incidentById(r.incidentId);
          return (
            <div key={i.id} className="rounded border border-[#3f4b52]/[0.18] bg-white p-4" style={{ breakInside: "avoid" }}>
              <p className="font-semibold text-[15px] text-[#1a1d22] mb-2">
                {i.name}, {i.year}
              </p>
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#3f4b52] mb-1.5">
                <Tag kind="Data" />
                What the record says
              </p>
              {i.quotes.map((q) => (
                <blockquote key={q.text} className="border-l-2 pl-3 mb-1.5" style={{ borderColor: ACCENT }}>
                  <p className="text-[12.5px] leading-[1.55] text-[#1a1d22]">&ldquo;{q.text}&rdquo;</p>
                  {q.speaker && <p className="text-[11px] text-[#6b7280]">{q.speaker}</p>}
                </blockquote>
              ))}
              <p className={small}>
                <a href={i.recordUrl} target="_blank" rel="noopener noreferrer" className="underline" style={linkStyle}>
                  {incidentSourceLine(i)}
                </a>
              </p>
              <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mt-2">
                <Tag kind="Interpretation" />
                <strong className="text-[#1a1d22]">What it shows:</strong> {r.shows}
              </p>
              <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mt-1">
                <Tag kind="Interpretation" />
                <strong className="text-[#1a1d22]">What it does not show:</strong> {r.doesNotShow}
              </p>
            </div>
          );
        })}
      </div>
      {EXCLUDED_INCIDENTS.map((x) => (
        <p key={x.name} className={`${small} mt-3`}>
          <strong>Left out: {x.name}.</strong> {x.reason}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 7
// ---------------------------------------------------------------------------

export function PlanSection() {
  const blocks = [...new Set(PLAN_STEPS.map((s) => s.block))];
  return (
    <div>
      <SectionHeading id="plan" />
      <p className={p}>
        <Tag kind="Interpretation" />
        Nine steps in three blocks of 30 days. Each has an owner, a deliverable, and a way to verify it
        was done. The verification column is what turns a step into evidence.
      </p>
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b-2 border-[#3f4b52]/[0.25]">
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22]">Step</th>
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22] w-[110px]">Owner</th>
            <th className="py-1.5 pr-2 font-semibold text-[#1a1d22] w-[120px]">Deliverable</th>
            <th className="py-1.5 font-semibold text-[#1a1d22]">Verification</th>
          </tr>
        </thead>
        {blocks.map((b) => (
          <tbody key={b} className="text-[#3f4b52]">
            <tr>
              <td colSpan={4} className="pt-3 pb-1 font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
                {b}
              </td>
            </tr>
            {PLAN_STEPS.filter((s) => s.block === b).map((s) => (
              <tr key={s.step} className="border-b border-[#3f4b52]/[0.12] align-top">
                <td className="py-1.5 pr-2 text-[#1a1d22]">{s.step}</td>
                <td className="py-1.5 pr-2">{s.owner}</td>
                <td className="py-1.5 pr-2">{s.deliverable}</td>
                <td className="py-1.5">{s.verification}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Part 8
// ---------------------------------------------------------------------------

export function ContextSection() {
  const be = naceEntry("BE", "C28");
  const nl = naceEntry("NL", "C28");
  return (
    <div>
      <SectionHeading id="context" />
      <p className="text-[13px] leading-[1.6] text-[#3f4b52] mb-2">
        <Tag kind="Data" />
        Machinery and equipment manufacturers (NACE C28), {EUROSTAT_SOURCE.year}: {be.enterprisesTotal.toLocaleString("en-US")}{" "}
        enterprises in Belgium, {share50PlusPct(be)}% with 50 or more persons employed;{" "}
        {nl.enterprisesTotal.toLocaleString("en-US")} in the Netherlands, {share50PlusPct(nl)}% with 50 or more.
      </p>
      <SizeClassChart />
      <p className="text-[12px] leading-[1.55] text-[#3f4b52] mt-3">{SIZE_TEST_CAVEAT}</p>
      <p className="text-[12.5px] leading-[1.55] text-[#3f4b52] mt-2">
        <Tag kind="Interpretation" />
        {CONTEXT_READING}
      </p>
      <p className={`${small} mt-3`}>
        <strong>Limitation.</strong> {STATBEL_CROSS_CHECK_NOTE} The Netherlands figure is cross-checked against
        CBS table {CBS_CROSS_CHECK.datasetCode} (SBI {CBS_CROSS_CHECK.sbiCode}, {CBS_CROSS_CHECK.periodDisplay},
        extracted {CBS_CROSS_CHECK.extractionDateDisplay}): {CBS_50_PLUS} enterprises with 50 or more employed, a
        quarterly register count rather than the same survey, so totals differ.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Appendices
// ---------------------------------------------------------------------------

export function MatrixAppendix() {
  return (
    <div>
      <SectionHeading id="matrix" />
      <p className={p}>
        <Tag kind="Interpretation" />
        The 25 rows of this site&apos;s vendor comparison checklist, regrouped under the five dimensions
        in {partLabel("assessment")}. Use it on your own setup or in a supplier questionnaire. It names no
        product and scores no one.
      </p>
      <div className="rounded border-l-4 bg-[#f6f5f1] p-3 mb-4" style={{ borderColor: ACCENT, breakInside: "avoid" }}>
        <p className="font-semibold text-[13.5px] text-[#1a1d22] mb-1.5">Unacceptable answers</p>
        <ul className="space-y-1.5 text-[12px] leading-[1.45] text-[#3f4b52]">
          {UNACCEPTABLE_ANSWERS.map((u) => (
            <li key={u.answer}>
              <strong className="text-[#1a1d22]">{u.answer}</strong> <span className="text-[#6b7280]">({u.dimension})</span>
              <EvidenceList refs={u.evidence} />
            </li>
          ))}
        </ul>
      </div>
      {MATRIX_GROUPS.map((g) => (
        <div key={g.title} className="mb-3" style={{ breakInside: "avoid" }}>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: g.dimension === "fit" ? "#6b7280" : ACCENT }}>
            {g.title}
          </p>
          <table className="w-full text-left border-collapse text-[11.5px]">
            <tbody className="text-[#3f4b52]">
              {g.rowIds.map((rid) => {
                const row = VENDOR_CHECKLIST_ROWS.find((r) => r.id === rid)!;
                return (
                  <tr key={rid} className="border-b border-[#3f4b52]/[0.1] align-top">
                    <td className="py-1 pr-3 font-semibold text-[#1a1d22] w-[44%]">{row.criterion}</td>
                    <td className="py-1">{row.askTheVendor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      <p className={small}>
        The editable spreadsheet version, with columns for your requirement and suppliers&apos; answers:{" "}
        <Link href="/vendor-checklist" className="underline" style={linkStyle}>
          vendor comparison checklist
        </Link>
        .
      </p>
    </div>
  );
}

export function MethodAppendix() {
  const ledgerIds = new Set<string>();
  const incidentIds = new Set<string>();
  const collect = (refs: EvidenceRef[]) =>
    refs.forEach((r) => {
      if (r.kind === "ledger") ledgerIds.add(r.id);
      if (r.kind === "incident") incidentIds.add(r.id);
    });
  FINDINGS.forEach((f) => collect(f.evidence));
  FAILURE_PATTERNS.forEach((f) => collect(f.evidence));
  UNACCEPTABLE_ANSWERS.forEach((u) => collect(u.evidence));
  REGULATION_BLOCKS.forEach((b) => {
    collect(b.scope);
    b.quotes.forEach((q) => ledgerIds.add(q));
    b.datesLedgerIds.forEach((q) => ledgerIds.add(q));
  });
  ledgerIds.add("cra-annex3-class1-iam-vpn");
  for (const c of ["BE", "NL", "LU"] as const) {
    const s = getCountrySection(c)!;
    [s.inForce.id, s.authority.id, s.registration.id, s.incident.id].forEach((id) => ledgerIds.add(id));
  }
  INCIDENT_READINGS.forEach((r) => incidentIds.add(r.incidentId));

  return (
    <div>
      <SectionHeading id="method" />
      <ul className="list-disc pl-5 space-y-1.5 text-[12.5px] leading-[1.55] text-[#3f4b52] mb-4">
        {METHOD_POINTS.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <p className="text-[13px] font-semibold text-[#1a1d22] mb-1">Legal sources ({ledgerIds.size} ledger entries, grouped by official URL)</p>
      <ul className="space-y-1 text-[10.5px] leading-[1.45] text-[#3f4b52] mb-3">
        {groupByUrl([...ledgerIds].map(ledgerEntry)).map(([url, entries]) => (
          <li key={url}>
            {entries.map((e, i) => (
              <span key={e.id}>
                {i > 0 && "; "}
                {e.citationLabel} (checked {e.lastVerifiedDisplay}
                {e.evidence.kind === "quote" && e.evidence.tier === "corroborated" ? ", wording cross-checked against published copies" : ""})
              </span>
            ))}
            {entries[0].ojReference ? `. ${entries[0].ojReference}` : ""}.{" "}
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline break-all" style={linkStyle}>
              {url}
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[13px] font-semibold text-[#1a1d22] mb-1">Incident records</p>
      <ul className="space-y-0.5 text-[10.5px] leading-[1.45] text-[#3f4b52] mb-3">
        {[...incidentIds].map((id) => {
          const i = incidentById(id);
          return (
            <li key={id}>
              {incidentSourceLine(i)}. <span className="text-[#6b7280] break-all">{i.recordUrl}</span>
            </li>
          );
        })}
      </ul>
      <p className="text-[13px] font-semibold text-[#1a1d22] mb-1">Data</p>
      <ul className="space-y-0.5 text-[10.5px] leading-[1.45] text-[#3f4b52] mb-3">
        <li>
          {eurostatSourceLine()} ({EUROSTAT_SOURCE.datasetLabel}). <span className="text-[#6b7280] break-all">{EUROSTAT_SOURCE.queryUrl}</span>
        </li>
        <li>
          CBS (Statistics Netherlands), table {CBS_CROSS_CHECK.datasetCode}, extracted {CBS_CROSS_CHECK.extractionDateDisplay}.{" "}
          <span className="text-[#6b7280] break-all">{CBS_CROSS_CHECK.queryUrl}</span>
        </li>
      </ul>
      <p className={small} style={{ color: INK }}>
        Edition: data and sources checked as of {EUROSTAT_SOURCE.extractionDateDisplay}. Regulatory dates and
        country facts can change after this date. Check the cited official sources before relying on
        any of them.
      </p>
    </div>
  );
}
