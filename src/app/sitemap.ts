import type { MetadataRoute } from "next";

const BASE_URL = "https://app.love-ap.net";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE_URL}/lp`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/lp/crowdfunding`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
}
