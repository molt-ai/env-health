interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "EnviroHealth",
        url: "https://envirohealth.app",
        description:
          "Free environmental health reports for any US address. Includes air quality, water safety, toxic sites, health outcomes, and natural hazards.",
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        creator: {
          "@type": "Organization",
          name: "EnviroHealth",
          url: "https://github.com/molt-ai/env-health",
        },
        featureList: [
          "Air quality monitoring (AirNow EPA data)",
          "Water safety analysis (EPA Envirofacts)",
          "Toxic release site mapping (EPA TRI)",
          "Health outcomes data (CDC PLACES)",
          "Natural hazard risk assessment (FEMA NRI)",
          "Location comparison tool",
          "PDF export",
        ],
      }}
    />
  );
}

export function ReportJsonLd({
  city,
  state,
  zip,
  score,
  grade,
}: {
  city: string;
  state: string;
  zip: string;
  score: number;
  grade: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Report",
        name: `Environmental Health Report for ${city ? `${city}, ${state}` : ""} ${zip}`,
        description: `Environmental health analysis for ZIP code ${zip}. Overall grade: ${grade} (${score}/100). Includes air quality, water safety, toxic sites, health outcomes, and natural hazard data.`,
        url: `https://envirohealth.app/report/${zip}`,
        datePublished: new Date().toISOString(),
        publisher: {
          "@type": "Organization",
          name: "EnviroHealth",
          url: "https://envirohealth.app",
        },
        about: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: state,
            postalCode: zip,
            addressCountry: "US",
          },
        },
        mainEntity: {
          "@type": "Dataset",
          name: "Environmental Health Data",
          description: "Aggregated environmental and health data from EPA, CDC, AirNow, and FEMA",
          creator: [
            { "@type": "Organization", name: "US Environmental Protection Agency (EPA)" },
            { "@type": "Organization", name: "Centers for Disease Control and Prevention (CDC)" },
            { "@type": "Organization", name: "AirNow (EPA)" },
            { "@type": "Organization", name: "Federal Emergency Management Agency (FEMA)" },
          ],
        },
      }}
    />
  );
}
