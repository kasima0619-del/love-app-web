import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/lp", "/lp/crowdfunding", "/login"],
      disallow: [
        "/dashboard", "/admin", "/matching", "/messages", "/community",
        "/love-coin", "/profile", "/schedule", "/send", "/survey",
        "/ai-partner", "/partners", "/api",
      ],
    },
    sitemap: "https://app.love-ap.net/sitemap.xml",
  };
}
