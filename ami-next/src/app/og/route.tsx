import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
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
          background: "#6E1B2E",
          position: "relative",
        }}
      >
        {/* arch pattern dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.08,
            backgroundImage:
              "radial-gradient(circle, #B5944A 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* gold top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #B5944A, #CBA85C, #B5944A)",
          }}
        />

        {/* gold bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #B5944A, #CBA85C, #B5944A)",
          }}
        />

        {/* wordmark text */}
        <div
          style={{
            fontSize: 88,
            fontWeight: 400,
            color: "#F0E6D2",
            letterSpacing: "0.08em",
            fontFamily: "serif",
            marginBottom: 16,
          }}
        >
          ami
        </div>

        {/* divider */}
        <div
          style={{
            width: 48,
            height: 1,
            background: "#B5944A",
            marginBottom: 20,
          }}
        />

        {/* subtitle */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#CBA85C",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: 32,
          }}
        >
          by arham
        </div>

        {/* tagline */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(240,230,210,0.78)",
            fontFamily: "serif",
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          The beloved, made by hand.
        </div>

        {/* bottom detail */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 13,
            fontFamily: "sans-serif",
            letterSpacing: "0.2em",
            color: "rgba(181,148,74,0.55)",
            textTransform: "uppercase",
          }}
        >
          IGI Certified · BIS Hallmarked · Lab-grown Diamonds
        </div>
      </div>
    ),
    { ...size }
  );
}
