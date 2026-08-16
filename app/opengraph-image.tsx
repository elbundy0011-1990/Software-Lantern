import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const iconBuffer = await readFile(path.join(process.cwd(), "public/lantern-icon-reverse.png"));
  const iconDataUrl = `data:image/png;base64,${iconBuffer.toString("base64")}`;

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
          background: "linear-gradient(135deg, #1a2b54 0%, #3730a3 50%, #4f46e5 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <img src={iconDataUrl} width={42} height={56} alt="" />
          <span style={{ fontSize: 40, fontWeight: 600, color: "#ffffff" }}>Software Lantern</span>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 600, color: "#ffffff", lineHeight: 1.15, maxWidth: 900 }}>
          Tell us what software you need
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.82)", marginTop: 24, maxWidth: 820 }}>
          We&apos;ll connect you with up to 3 providers that believe they have a fitting solution.
        </div>
      </div>
    ),
    { ...size },
  );
}
