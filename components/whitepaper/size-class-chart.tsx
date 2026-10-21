import { C28_CHART_DATA, EUROSTAT_SOURCE, share50PlusPct } from "@/lib/eurostat-data";

const ACCENT = "#9a3412";
const NL_COLOR = "#3f4b52";
const WIDTH = 640;
const HEIGHT = 340;
const PAD_LEFT = 56;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 56;
const GROUP_GAP = 14;
const BAR_GAP = 4;

const SIZE_CLASSES: { key: "enterprises0_9" | "enterprises10_19" | "enterprises20_49" | "enterprises50_249" | "enterprisesGe250"; label: string }[] = [
  { key: "enterprises0_9", label: "0-9" },
  { key: "enterprises10_19", label: "10-19" },
  { key: "enterprises20_49", label: "20-49" },
  { key: "enterprises50_249", label: "50-249" },
  { key: "enterprisesGe250", label: "250+" },
];

// SVG, generated directly from lib/eurostat-data.ts, site palette and type. Enterprise
// counts for NACE C28 (machinery and equipment), by size class, Belgium vs. the
// Netherlands, 2024. Rendered identically in the open web page and the print/PDF
// edition, since both read the same component and the same data module.
export function SizeClassChart() {
  const maxValue = Math.max(
    ...C28_CHART_DATA.flatMap(({ entry }) => SIZE_CLASSES.map((sc) => (entry[sc.key] as number) ?? 0)),
  );
  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const groupWidth = (plotWidth - GROUP_GAP * (SIZE_CLASSES.length - 1)) / SIZE_CLASSES.length;
  const barWidth = (groupWidth - BAR_GAP) / 2;

  const yFor = (value: number) => PAD_TOP + plotHeight - (value / maxValue) * plotHeight;
  const barHeight = (value: number) => (value / maxValue) * plotHeight;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxValue * f));

  return (
    <figure>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Enterprises in NACE C28, machinery and equipment, by size class, Belgium versus the Netherlands, 2024" style={{ width: "100%", height: "auto", fontFamily: "var(--font-instrument-sans), sans-serif" }}>
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#ffffff" />
        {gridLines.map((v) => (
          <g key={v}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={yFor(v)} y2={yFor(v)} stroke="#3f4b52" strokeOpacity={0.12} />
            <text x={PAD_LEFT - 8} y={yFor(v)} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#3f4b52">
              {v}
            </text>
          </g>
        ))}
        <line x1={PAD_LEFT} x2={PAD_LEFT} y1={PAD_TOP} y2={PAD_TOP + plotHeight} stroke="#3f4b52" strokeOpacity={0.3} />
        <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={PAD_TOP + plotHeight} y2={PAD_TOP + plotHeight} stroke="#3f4b52" strokeOpacity={0.3} />

        {SIZE_CLASSES.map((sc, i) => {
          const groupX = PAD_LEFT + i * (groupWidth + GROUP_GAP);
          return (
            <g key={sc.key}>
              {C28_CHART_DATA.map(({ geo, entry }, gi) => {
                const value = (entry[sc.key] as number) ?? 0;
                const x = groupX + gi * (barWidth + BAR_GAP);
                const h = barHeight(value);
                return (
                  <g key={geo}>
                    <rect x={x} y={yFor(value)} width={barWidth} height={h} fill={geo === "BE" ? ACCENT : NL_COLOR} />
                    <text x={x + barWidth / 2} y={yFor(value) - 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1a1d22">
                      {value.toLocaleString("en-US")}
                    </text>
                  </g>
                );
              })}
              <text x={groupX + groupWidth / 2} y={PAD_TOP + plotHeight + 18} textAnchor="middle" fontSize={12} fill="#1a1d22">
                {sc.label}
              </text>
            </g>
          );
        })}

        <g transform={`translate(${PAD_LEFT}, ${HEIGHT - 16})`}>
          <rect x={0} y={-9} width={10} height={10} fill={ACCENT} />
          <text x={16} y={0} fontSize={12} fill="#1a1d22">Belgium</text>
          <rect x={90} y={-9} width={10} height={10} fill={NL_COLOR} />
          <text x={106} y={0} fontSize={12} fill="#1a1d22">Netherlands</text>
        </g>
      </svg>
      <figcaption className="text-[12px] text-[#3f4b52] mt-2">
        Enterprises in NACE C28 (machinery and equipment n.e.c.) by persons-employed size
        class, {EUROSTAT_SOURCE.year}. Share with 50 or more persons employed: Belgium{" "}
        {share50PlusPct(C28_CHART_DATA[0].entry)}%, Netherlands {share50PlusPct(C28_CHART_DATA[1].entry)}%.
        Source: Eurostat, dataset {EUROSTAT_SOURCE.datasetCode}, extracted {EUROSTAT_SOURCE.extractionDateDisplay}.
      </figcaption>
    </figure>
  );
}
