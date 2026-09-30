import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mi jornada — Justicia cercana",
    short_name: "Mi jornada",
    description: "Tu juzgado de paz, incluso sin conexión.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5ef",
    theme_color: "#354e43",
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
