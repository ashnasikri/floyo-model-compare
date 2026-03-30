import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Floyo Model Compare — Find the right AI video model";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0d0b11",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#AF7FF4",
            }}
          />
          <span
            style={{
              color: "#AF7FF4",
              fontSize: "14px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            floyo.ai
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "62px",
            fontWeight: 800,
            color: "#e8e3f0",
            lineHeight: 1.1,
            marginBottom: "20px",
            maxWidth: "820px",
          }}
        >
          AI Video Model{" "}
          <span style={{ color: "#AF7FF4" }}>Compare</span>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: "22px",
            color: "#a89fc0",
            lineHeight: 1.5,
            maxWidth: "700px",
            marginBottom: "48px",
          }}
        >
          Compare 24+ AI video generation models side by side. Specs, scores, pricing, open vs closed source.
        </div>

        {/* Model tier pills */}
        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { tier: "S", color: "#AF7FF4" },
            { tier: "A", color: "#7dd8b0" },
            { tier: "B", color: "#ffaa5c" },
            { tier: "C", color: "#6b6480" },
          ].map(({ tier, color }) => (
            <div
              key={tier}
              style={{
                border: `1px solid ${color}60`,
                borderRadius: "6px",
                padding: "4px 10px",
                color,
                fontSize: "13px",
                fontWeight: 700,
                background: `${color}18`,
              }}
            >
              {tier}
            </div>
          ))}
          <div
            style={{
              border: "1px solid #2e2840",
              borderRadius: "6px",
              padding: "4px 14px",
              color: "#7dd8b0",
              fontSize: "13px",
              fontWeight: 700,
              background: "#7dd8b015",
            }}
          >
            Open
          </div>
          <div
            style={{
              border: "1px solid #2e2840",
              borderRadius: "6px",
              padding: "4px 14px",
              color: "#ffaa5c",
              fontSize: "13px",
              fontWeight: 700,
              background: "#ffaa5c15",
            }}
          >
            Closed
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
