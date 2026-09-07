import { type Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import React from "react";

export async function generateMetadata({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://qr.tilobox.com"),
    title: {
      template: "%s | TiloBox QR Studio",
      default: t("title.default"),
    },
    description: t("description"),
    keywords: [
      "TiloBox QR Studio",
      "QR code generator",
      "Parametric QR code",
      "Custom QR code",
      "Restaurant QR menu",
      "Wi-Fi QR card",
      "vCard QR",
      "SVG QR code",
      "Client-side QR",
    ],
    openGraph: {
      title: "TiloBox QR Studio – Free Parametric & Artistic QR Code Generator",
      description:
        "Generate stunning, scannable custom QR codes for digital restaurant menus, barber booking, taxi cards, and guest Wi-Fi. 100% in-browser, free, and no database required.",
      siteName: "TiloBox QR Studio",
      type: "website",
      images: [
        {
          url: "/assets/img/tilobox-banner.png",
          width: 1376,
          height: 768,
          alt: "TiloBox QR Studio – The Designer's Studio for Custom QR Codes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "TiloBox QR Studio – Free Parametric & Artistic QR Code Generator",
      description:
        "Generate stunning, scannable custom QR codes for digital restaurant menus, barber booking, taxi cards, and guest Wi-Fi. 100% in-browser, free, and no database required.",
      images: ["/assets/img/tilobox-banner.png"],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "TiloBox QR Studio",
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
        { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/assets/favicon/icon-192x192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: "/assets/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export const layoutMetadata: Metadata = {
  metadataBase: new URL("https://qr.tilobox.com"),
  title: {
    template: "%s | TiloBox QR Studio",
    default: "TiloBox QR Studio – Free Parametric & Artistic QR Code Generator",
  },
  description:
    "Generate stunning, scannable custom QR codes for digital restaurant menus, barber booking, taxi cards, and guest Wi-Fi. 100% in-browser, free, and no database required.",
  keywords: [
    "TiloBox QR Studio",
    "QR Code",
    "Parametric QR Code",
    "Artistic QR",
    "Restaurant QR",
    "WiFi QR",
    "vCard QR",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TiloBox QR Studio",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/assets/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "TiloBox QR Studio – Free Parametric & Artistic QR Code Generator",
    description:
      "The Designer's Studio for Custom-Shaped & Geometric QR Codes. 100% in-browser, free, and no database required.",
    images: [
      {
        url: "/assets/img/tilobox-banner.png",
        width: 1376,
        height: 768,
        alt: "TiloBox QR Studio – The Designer's Studio for Custom QR Codes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TiloBox QR Studio – Free Parametric & Artistic QR Code Generator",
    description:
      "The Designer's Studio for Custom-Shaped & Geometric QR Codes. 100% in-browser, free, and no database required.",
    images: ["/assets/img/tilobox-banner.png"],
  },
};

export const layoutViewport: Viewport = {
  themeColor: "#0b5fa5",
  width: "device-width",
  height: "device-height",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export function LayoutHead() {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head>
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/assets/favicon/apple-touch-icon.png" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="default" name="apple-mobile-web-app-status-bar-style" />
      <meta content="TiloBox QR Studio" name="apple-mobile-web-app-title" />
      <meta name="theme-color" content="#0b5fa5" />
    </head>
  );
}
