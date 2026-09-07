import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TiloBox QR Studio – Parametric & Artistic QR Code Generator",
    short_name: "TiloBox QR",
    description:
      "Generate, customize, and export agency-grade parametric and artistic QR codes with display cards 100% in-browser. Zero server storage, 100% private.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0b0f19",
    theme_color: "#0b5fa5",
    categories: ["utilities", "productivity", "graphics", "business", "design"],
    icons: [
      {
        src: "/assets/favicon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/favicon/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    shortcuts: [
      {
        name: "New QR Code",
        url: "/",
        description: "Create and customize a new QR code",
      },
    ],
  };
}
