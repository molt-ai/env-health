import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EnviroHealth — Free Environmental Health Reports";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ fontSize: "80px", display: "flex" }}>🌿</div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#c4a35a",
              display: "flex",
            }}
          >
            EnviroHealth
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#a89f91",
              textAlign: "center",
              maxWidth: "800px",
              display: "flex",
            }}
          >
            Free Environmental Health Reports for Any US Address
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "24px",
            }}
          >
            {["💨 Air Quality", "💧 Water Safety", "☢️ Toxic Sites", "🏥 Health Data", "🌪️ Hazards"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    fontSize: "18px",
                    color: "#6b6358",
                    display: "flex",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#6b6358",
              marginTop: "16px",
              display: "flex",
            }}
          >
            Data from EPA • CDC • AirNow • FEMA
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
