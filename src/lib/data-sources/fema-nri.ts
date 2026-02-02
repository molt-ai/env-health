import { NaturalHazardsData, HazardRisk } from "../types";

// FEMA NRI API endpoint via ArcGIS Online
// https://hazards.fema.gov/nri/

const FEMA_NRI_BASE =
  "https://services.arcgis.com/XG15cJAlne2vxtgt/arcgis/rest/services/National_Risk_Index_Counties/FeatureServer/0/query";

const OUT_FIELDS = [
  "COUNTY", "STATEABBRV", "RISK_SCORE", "RISK_RATNG",
  "ERQK_RISKS", "ERQK_RISKR", "RFLD_RISKS", "RFLD_RISKR",
  "HRCN_RISKS", "HRCN_RISKR", "TRND_RISKS", "TRND_RISKR",
  "WFIR_RISKS", "WFIR_RISKR", "WNTW_RISKS", "WNTW_RISKR",
  "HAIL_RISKS", "HAIL_RISKR", "HWAV_RISKS", "HWAV_RISKR",
  "SWND_RISKS", "SWND_RISKR", "LTNG_RISKS", "LTNG_RISKR",
  "DRGT_RISKS", "DRGT_RISKR", "CFLD_RISKS", "CFLD_RISKR",
  "IFLD_RISKS", "IFLD_RISKR",
].join(",");

const FETCH_OPTIONS: RequestInit = {
  headers: {
    "User-Agent": "EnviroHealth/1.0 (github.com/molt-ai/env-health)",
    "Accept": "application/json",
  },
  signal: AbortSignal.timeout(20000),
};

async function queryFema(params: Record<string, string>): Promise<Record<string, unknown> | null> {
  const searchParams = new URLSearchParams({
    ...params,
    outFields: OUT_FIELDS,
    returnGeometry: "false",
    f: "json",
  });

  // URLSearchParams encodes commas as %2C — ArcGIS requires raw commas in outFields
  const url = `${FEMA_NRI_BASE}?${searchParams.toString().replace(/%2C/gi, ",")}`;

  try {
    const response = await fetch(url, FETCH_OPTIONS);

    if (!response.ok) {
      console.error(`FEMA NRI HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const text = await response.text();

    // ArcGIS sometimes returns HTML error pages
    if (text.startsWith("<") || text.startsWith("<!")) {
      console.error("FEMA NRI returned HTML instead of JSON:", text.substring(0, 200));
      return null;
    }

    const json = JSON.parse(text);

    if (json.error) {
      console.error("FEMA NRI API error:", JSON.stringify(json.error));
      return null;
    }

    if (!json.features || json.features.length === 0) {
      return null;
    }

    return json.features[0].attributes;
  } catch (error) {
    console.error("FEMA NRI fetch error:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function fetchNaturalHazards(
  county: string,
  stateCode: string,
  lat?: number,
  lng?: number
): Promise<NaturalHazardsData | null> {
  const cleanCounty = county.replace(/ County$/i, "").replace(/ Parish$/i, "").trim();

  // Strategy 1: Spatial query (most reliable — finds exact county by coordinates)
  if (lat && lng && lat !== 0 && lng !== 0) {
    console.log(`FEMA NRI: trying spatial query (${lat}, ${lng})...`);
    const attrs = await queryFema({
      geometry: `${lng},${lat}`,
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      inSR: "4326",
    });

    if (attrs) {
      console.log(`FEMA NRI: spatial query success → ${attrs.COUNTY}, ${attrs.STATEABBRV}`);
      return processNriAttributes(attrs, county, stateCode);
    }
    console.warn("FEMA NRI: spatial query returned no results");
  }

  // Strategy 2: County name query
  if (cleanCounty && stateCode) {
    console.log(`FEMA NRI: trying county name query (${cleanCounty}, ${stateCode})...`);
    const attrs = await queryFema({
      where: `STATEABBRV='${stateCode}' AND COUNTY LIKE '%${cleanCounty}%'`,
    });

    if (attrs) {
      console.log(`FEMA NRI: county name query success → ${attrs.COUNTY}, ${attrs.STATEABBRV}`);
      return processNriAttributes(attrs, county, stateCode);
    }
    console.warn(`FEMA NRI: county name query returned no results for "${cleanCounty}, ${stateCode}"`);
  }

  // Strategy 3: State-only query with first result (better than nothing)
  if (stateCode && lat && lng) {
    console.log(`FEMA NRI: trying envelope query around coordinates...`);
    // Query a small bounding box around the point
    const buffer = 0.15; // ~10 miles
    const attrs = await queryFema({
      geometry: `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`,
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      inSR: "4326",
    });

    if (attrs) {
      console.log(`FEMA NRI: envelope query success → ${attrs.COUNTY}, ${attrs.STATEABBRV}`);
      return processNriAttributes(attrs, county, stateCode);
    }
    console.warn("FEMA NRI: envelope query returned no results");
  }

  console.warn("FEMA NRI: all strategies exhausted, returning fallback");
  return getFallbackHazardData(county, stateCode);
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
    county: (attrs.COUNTY as string) || cleanCounty,
    state: (attrs.STATEABBRV as string) || stateCode,
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
