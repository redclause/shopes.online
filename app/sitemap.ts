import type { MetadataRoute } from "next";

const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shopes.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  const categories = ["home-living", "tech", "style"];
  return [
    { url: origin, lastModified: updated, changeFrequency: "daily", priority: 1 },
    ...categories.map((slug) => ({
      url: `${origin}/category/${slug}`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}