import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Cabo Natural Way — Fresh Organic Produce from Baja";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2D5016 0%, #1a3009 100%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(232,168,56,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(232,168,56,0.08)",
          }}
        />

        {/* Emoji cluster */}
        <div style={{ display: "flex", gap: 24, marginBottom: 36, fontSize: 72 }}>
          <span>🌿</span>
          <span>🍋</span>
          <span>🥬</span>
          <span>🍯</span>
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-1px",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Cabo Natural Way
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          Fresh Organic Produce from Baja California
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#E8A838",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
