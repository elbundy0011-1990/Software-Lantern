import { LANTERN_VIEWBOX, LANTERN_PATHS } from "@/lib/lantern-paths";

// Recolored Software Lantern mark for the OT site (warm paper background,
// rust accent) — see lib/lantern-paths.ts for how the glyph was rebuilt.
// Deliberately a separate component from components/logo.tsx, which keeps
// serving the legacy marketplace pages in their original navy palette
// unchanged.
export function OtLogo({ height = 28 }: { height?: number }) {
  const width = Math.round((height * 120) / 160);
  return (
    <span className="inline-flex items-center gap-2">
      <svg width={width} height={height} viewBox={LANTERN_VIEWBOX} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d={LANTERN_PATHS.ring} fill="#9a3412" />
        <path d={LANTERN_PATHS.hood} fill="#9a3412" />
        <path d={LANTERN_PATHS.body} fill="#9a3412" />
        <path d={LANTERN_PATHS.flame} fill="#f6f5f1" />
        <path d={LANTERN_PATHS.footLeft} fill="#9a3412" />
        <path d={LANTERN_PATHS.footRight} fill="#9a3412" />
      </svg>
      <span className="font-sans font-semibold text-[#1a1d22]" style={{ fontSize: Math.round(height * 0.64) }}>
        Software Lantern
      </span>
    </span>
  );
}
