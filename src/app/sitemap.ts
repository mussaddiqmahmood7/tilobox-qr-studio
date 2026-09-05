import { MetadataRoute } from "next";
import { locales } from "@/navigation";
import { qrStyleList } from "@/lib/qr_style_list";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qr.tilobox.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const styles = qrStyleList.map((s) => s.id);
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Root domain
  entries.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // Localized routes
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    for (const style of styles) {
      entries.push({
        url: `${baseUrl}/${locale}/style/${style}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
