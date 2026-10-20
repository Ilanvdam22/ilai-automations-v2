import { ImageResponse } from "next/og";

// Deelplaatje voor WhatsApp, LinkedIn, enz.: de robot van de homepage, vlak getekend
export const alt = "ILAI Automations: AI-automatisering voor MKB en sport";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUE = "#4d87e6";
const RIM = "#a9c8ff";

export default function OpengraphImage() {
  const eye = {
    width: 92,
    height: 124,
    borderRadius: "50%",
    background: "#05060a",
    border: `9px solid ${RIM}`,
  } as const;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", color: "#fff", padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)" }}>ILAI Automations</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.0, letterSpacing: -3 }}>AI-automatisering voor MKB en sport</div>
            <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>Leads, opvolging, CRM en outreach. Vanuit Den Helder.</div>
          </div>
          <div style={{ fontSize: 26, color: RIM }}>ilaiautomations.com</div>
        </div>

        {/* De robot */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 40, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: 22, height: 70, borderRadius: 11, background: BLUE, marginRight: 8 }} />
            <div
              style={{
                width: 310,
                height: 236,
                borderRadius: 96,
                background: BLUE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 36,
              }}
            >
              <div style={eye} />
              <div style={eye} />
            </div>
            <div style={{ width: 22, height: 70, borderRadius: 11, background: BLUE, marginLeft: 8 }} />
          </div>
          <div style={{ width: 70, height: 40, borderRadius: 14, background: BLUE, marginTop: 10 }} />
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 22, marginTop: 24 }}>
              <div style={{ width: 34, height: 130, borderRadius: 17, background: BLUE }} />
              <div style={{ width: 52, height: 52, borderRadius: 26, background: BLUE, marginTop: 4 }} />
            </div>
            <div
              style={{
                width: 210,
                height: 250,
                background: BLUE,
                borderTopLeftRadius: 105,
                borderTopRightRadius: 105,
                borderBottomLeftRadius: 44,
                borderBottomRightRadius: 44,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 22, marginTop: 24 }}>
              <div style={{ width: 34, height: 130, borderRadius: 17, background: BLUE }} />
              <div style={{ width: 52, height: 52, borderRadius: 26, background: BLUE, marginTop: 4 }} />
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
