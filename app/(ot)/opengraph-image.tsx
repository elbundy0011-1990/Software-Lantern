import { ImageResponse } from "next/og";
import { LANTERN_PATHS } from "@/lib/lantern-paths";

// Social share image for the OT site only (route-segment override). New
// palette throughout: warm paper background, rust mark, ink text.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f6f5f1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <svg width="42" height="56" viewBox="0 0 120 160" fill="none">
            <path d={LANTERN_PATHS.ring} fill="#9a3412" />
            <path d={LANTERN_PATHS.hood} fill="#9a3412" />
            <path d={LANTERN_PATHS.body} fill="#9a3412" />
            <path d={LANTERN_PATHS.flame} fill="#f6f5f1" />
            <path d={LANTERN_PATHS.footLeft} fill="#9a3412" />
            <path d={LANTERN_PATHS.footRight} fill="#9a3412" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 600, color: "#1a1d22" }}>Software Lantern</span>
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 600, color: "#1a1d22", lineHeight: 1.15, maxWidth: 980 }}>
          Secure remote access to machines, under NIS2, the CRA, and the Machinery Regulation
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#3f4b52", marginTop: 24, maxWidth: 860 }}>
          For machine builders, factory operators, and system integrators in the Netherlands, Belgium, and Luxembourg.
        </div>
      </div>
    ),
    { ...size },
  );
}
