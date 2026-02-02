import { MetadataRoute } from "next";
import { TOP_CITIES } from "@/lib/cities";

const BASE_URL = "https://envirohealth.us";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Programmatic SEO pages for top US cities
  const cityPages: MetadataRoute.Sitemap = TOP_CITIES.map((city) => ({
    url: `${BASE_URL}/report/${city.zip}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages];
}
