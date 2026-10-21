import { ImageResponse } from "next/og";
import { LANTERN_PATHS } from "@/lib/lantern-paths";

// Favicon for the OT site only (route-segment metadata override), rust
// lantern mark on warm paper. The root app/icon.png serves anything
// without its own override. See lib/lantern-paths.ts for how the glyph was built.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f5f1",
        }}
      >
        <svg width="24" height="32" viewBox="0 0 120 160" fill="none">
          <path d={LANTERN_PATHS.ring} fill="#9a3412" />
          <path d={LANTERN_PATHS.hood} fill="#9a3412" />
          <path d={LANTERN_PATHS.body} fill="#9a3412" />
          <path d={LANTERN_PATHS.flame} fill="#f6f5f1" />
          <path d={LANTERN_PATHS.footLeft} fill="#9a3412" />
          <path d={LANTERN_PATHS.footRight} fill="#9a3412" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
