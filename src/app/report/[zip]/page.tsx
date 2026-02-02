import type { Metadata } from "next";
import ReportPageClient from "./ReportPageClient";
import { getCityByZip, getAllCityZips } from "@/lib/cities";

interface Props {
  params: Promise<{ zip: string }>;
}

export async function generateStaticParams() {
  return getAllCityZips().map((zip) => ({ zip }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zip } = await params;
  const city = getCityByZip(zip);

  const locationName = city
    ? `${city.city}, ${city.stateCode}`
    : `ZIP Code ${zip}`;

  const title = city
    ? `Environmental Health Report for ${city.city}, ${city.stateCode} | EnviroHealth`
    : `Environmental Health Report for ${zip} | EnviroHealth`;

  const description = city
    ? `Free environmental health report for ${city.city}, ${city.stateCode} (${zip}). Check air quality, water safety, toxic sites, health outcomes, and natural hazard risks in ${city.city}. Data from EPA, CDC, AirNow, and FEMA.`
    : `Free environmental health report for ZIP code ${zip}. Air quality, water safety, toxic sites, health outcomes, and natural hazard data from EPA, CDC, AirNow, and FEMA.`;

  const canonical = `https://envirohealth.us/report/${zip}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: city
        ? `Discover the environmental health profile of ${city.city}, ${city.stateCode}. Air quality, water safety, toxic sites, and more — all in one free report.`
        : `Free environmental health report for ZIP code ${zip}. Comprehensive analysis of air quality, water safety, toxic sites, and more.`,
      type: "article",
      url: canonical,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Environmental Health Report for ${locationName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Environmental Health Report for ${locationName}`,
      description: city
        ? `Air quality, water safety, toxic sites, health data, and natural hazards for ${city.city}, ${city.stateCode}.`
        : `Air quality, water safety, toxic sites, health data, and natural hazards for ZIP ${zip}.`,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { zip } = await params;
  const city = getCityByZip(zip);

  return (
    <ReportPageClient
      zip={zip}
      preloadCity={city?.city}
      preloadState={city?.stateCode}
      preloadCounty={city?.county}
      preloadLat={city?.lat}
      preloadLng={city?.lng}
    />
  );
}
