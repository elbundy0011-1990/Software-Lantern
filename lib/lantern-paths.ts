// Shared path data for the Software Lantern mark, recolored for the OT
// site's palette (docs/OT-CYBER-PLAN.md Part B §B.2.4). Rebuilt by hand as
// SVG paths from the existing raster mark (public/lantern-icon.png,
// public/lantern-icon-reverse.png), since no vector source was found in
// the repo — this is a faithful redraw of that mark's silhouette (ring
// handle, hood, body, flame cutout, twin feet), not a pixel trace. If
// pixel-perfect vector tracing is ever wanted, a proper vectorization
// pass against the original PNG should replace this.
//
// viewBox is 0 0 120 160, matching the original asset's ~117:156 aspect
// ratio. Used by components/ot-logo.tsx (client, regular <svg>) and by
// app/(ot)/icon.tsx, app/(ot)/apple-icon.tsx, app/(ot)/opengraph-image.tsx
// (next/og ImageResponse, which supports this same subset of SVG via
// Satori) so the glyph is defined in exactly one place.
export const LANTERN_VIEWBOX = "0 0 120 160";

export const LANTERN_PATHS = {
  ring: "M47 20 C47 10 53 3 60 3 C67 3 73 10 73 20 L73 24 L65 24 L65 20 C65 15 63 12 60 12 C57 12 55 15 55 20 L55 24 L47 24 Z",
  hood: "M38 24 L82 24 L98 50 L22 50 Z",
  body: "M26 50 L94 50 L104 128 L16 128 Z",
  flame:
    "M60 66 C51 80 49 90 56 99 C53 104 58 113 60 118 C62 113 67 104 64 99 C71 90 69 80 60 66 Z",
  footLeft: "M16 128 L38 128 L34 146 L12 146 Z",
  footRight: "M82 128 L104 128 L108 146 L86 146 Z",
} as const;
