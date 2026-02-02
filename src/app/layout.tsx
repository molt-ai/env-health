import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnviroHealth — Free Environmental Health Reports by Address",
  description:
    "Get a free environmental health report for any US address. Air quality, water safety, toxic sites, health outcomes, and natural hazards — powered by EPA, CDC, AirNow, and FEMA data.",
  metadataBase: new URL("https://envirohealth.us"),
  alternates: {
    canonical: "https://envirohealth.us",
  },
  keywords: [
    "environmental health",
    "air quality",
    "water safety",
    "toxic sites",
    "EPA",
    "CDC",
    "health report",
    "environmental justice",
    "pollution",
    "FEMA",
    "natural hazards",
  ],
  authors: [{ name: "EnviroHealth", url: "https://github.com/molt-ai/env-health" }],
  openGraph: {
    type: "website",
    title: "EnviroHealth — Free Environmental Health Reports by Address",
    description:
      "Discover the environmental health profile of any US location. Air quality, water safety, toxic sites, disease rates, and natural hazards — all in one free report.",
    siteName: "EnviroHealth",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EnviroHealth — Environmental Health Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EnviroHealth — Free Environmental Health Reports",
    description:
      "Get a free environmental health report for any US address. Powered by EPA, CDC, AirNow, and FEMA data.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
