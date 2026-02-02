import { NaturalHazardsData, HazardRisk } from "../types";
import nriData from "./fema-nri-data.json";

// Static FEMA NRI data — 3,232 US counties pre-loaded
// Source: FEMA National Risk Index via ArcGIS (https://hazards.fema.gov/nri/)
// Downloaded 2026-02-02. Refresh periodically.

interface NriEntry {
  c: string;   // county name
  s: string;   // state abbreviation
  f?: string;  // FIPS code
  rs: number | null;  // overall risk score
  rr: string;  // overall risk rating
  h: Array<{
    n: string;  // hazard name
    s: number;  // risk score
    r: string;  // risk rating
  }>;
}

const data = nriData as Record<string, NriEntry>;

export async function fetchNaturalHazards(
  county: string,
  stateCode: string,
  _lat?: number,
  _lng?: number
): Promise<NaturalHazardsData | null> {
  const cleanCounty = county
    .replace(/ County$/i, "")
    .replace(/ Parish$/i, "")
    .replace(/ Borough$/i, "")
    .replace(/ Census Area$/i, "")
    .replace(/ Municipality$/i, "")
    .trim();

  const state = (stateCode || "").toUpperCase();

  // Strategy 1: Exact match on STATE:COUNTY
  let entry = data[`${state}:${cleanCounty.toUpperCase()}`];

  // Strategy 2: Fuzzy — try partial match
  if (!entry && cleanCounty && state) {
    const needle = cleanCounty.toUpperCase();
    const key = Object.keys(data).find(
      (k) =>
        k.startsWith(`${state}:`) &&
        (k.includes(needle) || needle.includes(k.split(":")[1]))
    );
    if (key) {
      entry = data[key];
      console.log(`FEMA NRI: fuzzy match "${cleanCounty}, ${state}" → ${key}`);
    }
  }

  // Strategy 3: Try city name as county (for independent cities like Richmond, VA)
  if (!entry && state) {
    // Some geocoders return the city name instead of county
    const cityKey = `${state}:${cleanCounty.toUpperCase()}`;
    if (data[cityKey]) {
      entry = data[cityKey];
    }
  }

  if (!entry) {
    console.warn(`FEMA NRI: no data for "${cleanCounty}, ${state}"`);
    return {
      overallRiskScore: null,
      overallRiskRating: "Data unavailable",
      hazards: [],
      county: cleanCounty,
      state: state,
    };
  }

  // Build hazard list
  const hazardIcons: Record<string, string> = {
    Earthquake: "🌍",
    "Coastal Flooding": "🏖️",
    Hurricane: "🌀",
    Tornado: "🌪️",
    Wildfire: "🔥",
    "Winter Weather": "❄️",
    Hail: "🧊",
    "Heat Wave": "🌡️",
    "Strong Wind": "💨",
    Lightning: "⚡",
    Drought: "☀️",
    "Ice Storm": "🧊",
    Avalanche: "🏔️",
    "Cold Wave": "🥶",
    Landslide: "⛰️",
    Tsunami: "🌊",
    "Volcanic Activity": "🌋",
  };

  const hazards: HazardRisk[] = (entry.h || [])
    .map((h) => ({
      name: h.n,
      riskScore: h.s,
      riskRating: normalizeRating(h.r),
      icon: hazardIcons[h.n] || "⚠️",
    }))
    .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

  return {
    overallRiskScore: entry.rs,
    overallRiskRating: normalizeRating(entry.rr) || "Not Rated",
    hazards,
    county: entry.c,
    state: entry.s,
  };
}

function normalizeRating(rating: string | null | undefined): string {
  if (!rating) return "Not Rated";
  const r = rating.toLowerCase();
  if (r.includes("very high")) return "Very High";
  if (r.includes("relatively high")) return "Relatively High";
  if (r.includes("relatively moderate") || r.includes("relatively mod"))
    return "Relatively Moderate";
  if (r.includes("relatively low")) return "Relatively Low";
  if (r.includes("very low")) return "Very Low";
  if (r.includes("not applicable")) return "Not Applicable";
  return rating;
}
