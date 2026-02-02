import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Environmental Health — Side by Side Location Comparison | EnviroHealth",
  description:
    "Compare the environmental health of two US locations side by side. Air quality, water safety, toxic sites, health outcomes, and natural hazards comparison.",
  openGraph: {
    title: "Compare Environmental Health | EnviroHealth",
    description:
      "Compare environmental health reports for two locations side by side. Powered by EPA, CDC, AirNow, and FEMA data.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Compare Environmental Health Locations",
      },
    ],
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
