import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2v2.4M8.5 4.4h7l1.3 4.2c.5 1.6.4 3.3-.3 4.8L14.6 18h-5.2l-1.9-4.6c-.7-1.5-.8-3.2-.3-4.8l1.3-4.2Z"
              stroke="#ffffff"
              strokeWidth="1.6"
            />
            <path d="M9.4 18h5.2l.7 2.4a1 1 0 0 1-1 1.6h-4.6a1 1 0 0 1-1-1.6l.7-2.4Z" stroke="#ffffff" strokeWidth="1.6" />
            <path d="M9 9h6M8.4 12h7.2" stroke="#ffffff" strokeWidth="1.6" />
          </svg>
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
