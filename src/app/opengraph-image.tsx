import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LootBoxes.com — Game Deals & Monetization Analysis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0074c5 0%, #005a9e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "bold",
              color: "#0074c5",
            }}
          >
            L
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            LootBoxes.com
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: "24px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Compare game deals across 30+ stores. Transparent loot box analysis.
        </div>

        {/* Feature pills */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            gap: "12px",
          }}
        >
          {["Best Deals", "Price History", "Drop Rates", "Lootboxes Score"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          lootboxes.com
        </div>
      </div>
    ),
    { ...size }
  );
}
