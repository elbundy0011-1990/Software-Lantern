import { ImageResponse } from "next/og";
import { LANTERN_PATHS } from "@/lib/lantern-paths";

// Apple touch icon for the OT site only (route-segment override). Apple's
// own convention expects a filled square with no transparency, so this
// uses the warm paper background at full bleed rather than letting the
// device composite its own, same as the favicon above.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <svg width="110" height="146" viewBox="0 0 120 160" fill="none">
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
