import { MetadataRoute } from "next";

// Top 100 US ZIP codes by population
const TOP_ZIP_CODES = [
  "10001", "10002", "10003", "10011", "10013", // NYC
  "90001", "90002", "90003", "90004", "90005", // LA
  "60601", "60602", "60604", "60607", "60610", // Chicago
  "77001", "77002", "77003", "77004", "77005", // Houston
  "85001", "85003", "85004", "85006", "85007", // Phoenix
  "19101", "19102", "19103", "19104", "19106", // Philadelphia
  "78201", "78202", "78204", "78205", "78207", // San Antonio
  "92101", "92102", "92103", "92104", "92105", // San Diego
  "75201", "75202", "75203", "75204", "75205", // Dallas
  "95101", "95103", "95110", "95111", "95112", // San Jose
  "78701", "78702", "78703", "78704", "78705", // Austin
  "32099", "32202", "32204", "32205", "32206", // Jacksonville
  "76101", "76102", "76103", "76104", "76105", // Fort Worth
  "43201", "43202", "43203", "43204", "43205", // Columbus
  "46201", "46202", "46203", "46204", "46205", // Indianapolis
  "28201", "28202", "28203", "28204", "28205", // Charlotte
  "94102", "94103", "94104", "94105", "94107", // San Francisco
  "98101", "98102", "98103", "98104", "98105", // Seattle
  "80201", "80202", "80203", "80204", "80205", // Denver
  "20001", "20002", "20003", "20004", "20005", // DC
];

const BASE_URL = "https://envirohealth.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const reportPages: MetadataRoute.Sitemap = TOP_ZIP_CODES.map((zip) => ({
    url: `${BASE_URL}/report/${zip}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...reportPages];
}
