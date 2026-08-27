import { ImageResponse } from "next/og";

export const alt = "Wang Jingjing — Selected Technical Work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#f6f7f8",
          padding: "72px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Selected Technical Work / Singapore
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 116,
            lineHeight: 0.86,
            letterSpacing: "-0.045em",
          }}
        >
          <span>Wang</span>
          <span>Jingjing</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <span>Systems / Infrastructure / Software</span>
          <span>2026</span>
        </div>
      </div>
    ),
    size,
  );
}
