import { NaturalHazardsData, HazardRisk } from "../types";

// FEMA NRI API endpoint - community-level data
// Using the FEMA NRI API: https://hazards.fema.gov/nri/
export async function fetchNaturalHazards(
  county: string,
  stateCode: string
): Promise<NaturalHazardsData | null> {
  try {
    // Try the FEMA NRI API (county-level) via ArcGIS Online
    // Format county for query: "Richmond City" or "Henrico"
    const cleanCounty = county.replace(/ County$/i, "").trim();

    // The NRI data is available via ArcGIS Online feature service
    const url = `https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer/0/query?where=STATEABBRV%3D%27${stateCode}%27+AND+COUNTY+LIKE+%27%25${encodeURIComponent(cleanCounty)}%25%27&outFields=COUNTY,STATEABBRV,RISK_SCORE,RISK_RATNG,ERQK_RISKS,ERQK_RISKR,RFLD_RISKS,RFLD_RISKR,HRCN_RISKS,HRCN_RISKR,TRND_RISKS,TRND_RISKR,WFIR_RISKS,WFIR_RISKR,WNTW_RISKS,WNTW_RISKR,HAIL_RISKS,HAIL_RISKR,HWAV_RISKS,HWAV_RISKR,SWND_RISKS,SWND_RISKR,LTNG_RISKS,LTNG_RISKR,DRGT_RISKS,DRGT_RISKR,CFLD_RISKS,CFLD_RISKR,IFLD_RISKS,IFLD_RISKR&returnGeometry=false&f=json`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`FEMA NRI API error: ${response.status}, using fallback`);
      return getFallbackHazardData(county, stateCode);
    }

    const json = await response.json();

    if (!json.features || json.features.length === 0) {
      // Try broader search
      return getFallbackHazardData(county, stateCode);
    }

    const attrs = json.features[0].attributes;

    const hazards: HazardRisk[] = [
      {
        name: "Earthquake",
        riskScore: attrs.ERQK_RISKS || null,
        riskRating: ratingFromScore(attrs.ERQK_RISKR),
        icon: "🌍",
      },
      {
        name: "Riverine Flooding",
        riskScore: attrs.RFLD_RISKS || null,
        riskRating: ratingFromScore(attrs.RFLD_RISKR),
        icon: "🌊",
      },
      {
        name: "Inland Flooding",
        riskScore: attrs.IFLD_RISKS || null,
        riskRating: ratingFromScore(attrs.IFLD_RISKR),
        icon: "🌧️",
      },
      {
        name: "Hurricane",
        riskScore: attrs.HRCN_RISKS || null,
        riskRating: ratingFromScore(attrs.HRCN_RISKR),
        icon: "🌀",
      },
      {
        name: "Tornado",
        riskScore: attrs.TRND_RISKS || null,
        riskRating: ratingFromScore(attrs.TRND_RISKR),
        icon: "🌪️",
      },
      {
        name: "Wildfire",
        riskScore: attrs.WFIR_RISKS || null,
        riskRating: ratingFromScore(attrs.WFIR_RISKR),
        icon: "🔥",
      },
      {
        name: "Winter Weather",
        riskScore: attrs.WNTW_RISKS || null,
        riskRating: ratingFromScore(attrs.WNTW_RISKR),
        icon: "❄️",
      },
      {
        name: "Hail",
        riskScore: attrs.HAIL_RISKS || null,
        riskRating: ratingFromScore(attrs.HAIL_RISKR),
        icon: "🧊",
      },
      {
        name: "Heat Wave",
        riskScore: attrs.HWAV_RISKS || null,
        riskRating: ratingFromScore(attrs.HWAV_RISKR),
        icon: "🌡️",
      },
      {
        name: "Strong Wind",
        riskScore: attrs.SWND_RISKS || null,
        riskRating: ratingFromScore(attrs.SWND_RISKR),
        icon: "💨",
      },
      {
        name: "Lightning",
        riskScore: attrs.LTNG_RISKS || null,
        riskRating: ratingFromScore(attrs.LTNG_RISKR),
        icon: "⚡",
      },
      {
        name: "Drought",
        riskScore: attrs.DRGT_RISKS || null,
        riskRating: ratingFromScore(attrs.DRGT_RISKR),
        icon: "☀️",
      },
      {
        name: "Coastal Flooding",
        riskScore: attrs.CFLD_RISKS || null,
        riskRating: ratingFromScore(attrs.CFLD_RISKR),
        icon: "🏖️",
      },
    ];

    // Filter out hazards with no data and sort by risk score
    const validHazards = hazards
      .filter((h) => h.riskScore !== null && h.riskScore > 0)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

    return {
      overallRiskScore: attrs.RISK_SCORE || null,
      overallRiskRating: ratingFromScore(attrs.RISK_RATNG) || "Not Rated",
      hazards: validHazards,
      county: cleanCounty,
      state: stateCode,
    };
  } catch (error) {
    console.error("FEMA NRI fetch error:", error);
    return getFallbackHazardData(county, stateCode);
  }
}

function ratingFromScore(rating: string | number | null | undefined): string {
  if (!rating) return "Not Rated";
  const r = String(rating).toLowerCase();
  if (r.includes("very high")) return "Very High";
  if (r.includes("relatively high")) return "Relatively High";
  if (r.includes("relatively moderate") || r.includes("relatively mod")) return "Relatively Moderate";
  if (r.includes("relatively low")) return "Relatively Low";
  if (r.includes("very low")) return "Very Low";
  // Numeric ratings
  if (r === "5") return "Very High";
  if (r === "4") return "Relatively High";
  if (r === "3") return "Relatively Moderate";
  if (r === "2") return "Relatively Low";
  if (r === "1") return "Very Low";
  return String(rating);
}

function getFallbackHazardData(county: string, stateCode: string): NaturalHazardsData {
  return {
    overallRiskScore: null,
    overallRiskRating: "Data unavailable",
    hazards: [],
    county: county.replace(/ County$/i, ""),
    state: stateCode,
  };
}
