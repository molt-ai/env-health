import { NaturalHazardsData, HazardRisk } from "../types";

// FEMA NRI API endpoint - community-level data
// Using the FEMA NRI API: https://hazards.fema.gov/nri/
export async function fetchNaturalHazards(
  county: string,
  stateCode: string,
  lat?: number,
  lng?: number
): Promise<NaturalHazardsData | null> {
  try {
    // Try the FEMA NRI API (county-level) via ArcGIS Online
    // Format county for query: "Richmond City" or "Henrico"
    const cleanCounty = county.replace(/ County$/i, "").trim();

    let url: string;

    if (cleanCounty && stateCode) {
      // Query by county name + state
      url = `https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer/0/query?where=STATEABBRV%3D%27${stateCode}%27+AND+COUNTY+LIKE+%27%25${encodeURIComponent(cleanCounty)}%25%27&outFields=COUNTY,STATEABBRV,RISK_SCORE,RISK_RATNG,ERQK_RISKS,ERQK_RISKR,RFLD_RISKS,RFLD_RISKR,HRCN_RISKS,HRCN_RISKR,TRND_RISKS,TRND_RISKR,WFIR_RISKS,WFIR_RISKR,WNTW_RISKS,WNTW_RISKR,HAIL_RISKS,HAIL_RISKR,HWAV_RISKS,HWAV_RISKR,SWND_RISKS,SWND_RISKR,LTNG_RISKS,LTNG_RISKR,DRGT_RISKS,DRGT_RISKR,CFLD_RISKS,CFLD_RISKR,IFLD_RISKS,IFLD_RISKR&returnGeometry=false&f=json`;
    } else if (lat && lng) {
      // Spatial query fallback — find county by lat/lng point
      url = `https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer/0/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=COUNTY,STATEABBRV,RISK_SCORE,RISK_RATNG,ERQK_RISKS,ERQK_RISKR,RFLD_RISKS,RFLD_RISKR,HRCN_RISKS,HRCN_RISKR,TRND_RISKS,TRND_RISKR,WFIR_RISKS,WFIR_RISKR,WNTW_RISKS,WNTW_RISKR,HAIL_RISKS,HAIL_RISKR,HWAV_RISKS,HWAV_RISKR,SWND_RISKS,SWND_RISKR,LTNG_RISKS,LTNG_RISKR,DRGT_RISKS,DRGT_RISKR,CFLD_RISKS,CFLD_RISKR,IFLD_RISKS,IFLD_RISKR&inSR=4326&returnGeometry=false&f=json`;
    } else {
      return getFallbackHazardData(county, stateCode);
    }

    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`FEMA NRI API error: ${response.status}, using fallback`);
      return getFallbackHazardData(county, stateCode);
    }

    const json = await response.json();

    if (!json.features || json.features.length === 0) {
      // Try spatial query fallback if we have coordinates
      if (lat && lng && cleanCounty) {
        console.log(`FEMA NRI: county name query returned no results for "${cleanCounty}, ${stateCode}", trying spatial query...`);
        const spatialUrl = `https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer/0/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=COUNTY,STATEABBRV,RISK_SCORE,RISK_RATNG,ERQK_RISKS,ERQK_RISKR,RFLD_RISKS,RFLD_RISKR,HRCN_RISKS,HRCN_RISKR,TRND_RISKS,TRND_RISKR,WFIR_RISKS,WFIR_RISKR,WNTW_RISKS,WNTW_RISKR,HAIL_RISKS,HAIL_RISKR,HWAV_RISKS,HWAV_RISKR,SWND_RISKS,SWND_RISKR,LTNG_RISKS,LTNG_RISKR,DRGT_RISKS,DRGT_RISKR,CFLD_RISKS,CFLD_RISKR,IFLD_RISKS,IFLD_RISKR&inSR=4326&returnGeometry=false&f=json`;
        const spatialResp = await fetch(spatialUrl, { signal: AbortSignal.timeout(15000) });
        if (spatialResp.ok) {
          const spatialJson = await spatialResp.json();
          if (spatialJson.features && spatialJson.features.length > 0) {
            // Use the spatial result — jump back to processing
            const spatialAttrs = spatialJson.features[0].attributes;
            return processNriAttributes(spatialAttrs, county, stateCode);
          }
        }
      }
      return getFallbackHazardData(county, stateCode);
    }

    const attrs = json.features[0].attributes;
    return processNriAttributes(attrs, county, stateCode);
  } catch (error) {
    console.error("FEMA NRI fetch error:", error);
    return getFallbackHazardData(county, stateCode);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processNriAttributes(attrs: Record<string, any>, county: string, stateCode: string): NaturalHazardsData {
    const cleanCounty = county.replace(/ County$/i, "").trim();

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
      overallRiskScore: (attrs.RISK_SCORE as number) || null,
      overallRiskRating: ratingFromScore(attrs.RISK_RATNG as string) || "Not Rated",
      hazards: validHazards,
      county: cleanCounty,
      state: stateCode,
    };
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
