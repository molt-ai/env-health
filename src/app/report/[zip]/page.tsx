import type { Metadata } from "next";
import ReportPageClient from "./ReportPageClient";

interface Props {
  params: Promise<{ zip: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { zip } = await params;
  return {
    title: `Environmental Health Report for ${zip} | EnviroHealth`,
    description: `Free environmental health report for ZIP code ${zip}. Air quality, water safety, toxic sites, health outcomes, and natural hazard data from EPA, CDC, AirNow, and FEMA.`,
    openGraph: {
      title: `Environmental Health Report for ${zip} | EnviroHealth`,
      description: `Free environmental health report for ZIP code ${zip}. Comprehensive analysis of air quality, water safety, toxic sites, and more.`,
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Environmental Health Report for ${zip}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Environmental Health Report for ${zip}`,
      description: `Air quality, water safety, toxic sites, health data, and natural hazards for ZIP ${zip}.`,
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { zip } = await params;
  return <ReportPageClient zip={zip} />;
}
