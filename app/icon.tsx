import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
          borderRadius: 8,
          color: "white",
          fontWeight: 900,
          fontSize: 15,
          letterSpacing: "-0.5px",
          fontFamily: "sans-serif",
          boxShadow: "inset 0 0 0 1px rgba(254, 243, 199, 0.6)",
        }}
      >
        TC
      </div>
    ),
    {
      ...size,
    }
  );
}
