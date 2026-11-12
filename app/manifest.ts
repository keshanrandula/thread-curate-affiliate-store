import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "THREAD & CURATE",
    short_name: "Thread & Curate",
    description:
      "Discover handpicked designer clothes, footwear, outerwear, and accessories. Curated deals with verified affiliate links.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

