// Location extracted from address autocomplete
export interface LocationData {
  address: string;
  zip: string;
  lat: number;
  lng: number;
  county: string;
  state: string;
  stateCode: string;
  city: string;
}

// Overall report shape
export interface EnvironmentalReport {
  location: LocationData;
  overallScore: OverallScore;
  airQuality: AirQualityData | null;
  waterSafety: WaterSafetyData | null;
  toxicSites: ToxicSitesData | null;
  healthOutcomes: HealthOutcomesData | null;
  naturalHazards: NaturalHazardsData | null;
  generatedAt: string;
}

export interface OverallScore {
  grade: string; // A-F
  score: number; // 0-100
  summary: string;
  categoryScores: CategoryScore[];
}

export interface CategoryScore {
  name: string;
  score: number;
  icon: string;
  color: string;
  detail: string;
}

// Air Quality
export interface AirQualityData {
  aqi: number | null;
  category: string;
  pollutants: AirPollutant[];
  reportingArea: string;
  stateCode: string;
  dateObserved: string;
}

export interface AirPollutant {
  name: string;
  aqi: number;
  category: string;
  concentration: number;
  unit: string;
}

// Water Safety
export interface WaterSafetyData {
  totalViolations: number;
  violations: WaterViolation[];
  summary: string;
}

export interface WaterViolation {
  contaminantName: string;
  violationType: string;
  compliancePeriod: string;
  pwsName: string;
  enforcementAction: string | null;
}

// Toxic Sites
export interface ToxicSitesData {
  totalFacilities: number;
  facilities: ToxicFacility[];
  summary: string;
}

export interface ToxicFacility {
  facilityName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  industry: string;
  latitude: number | null;
  longitude: number | null;
}

// Health Outcomes (CDC PLACES)
export interface HealthOutcomesData {
  measures: HealthMeasure[];
  dataYear: string;
  source: string;
}

export interface HealthMeasure {
  category: string;
  measureName: string;
  shortName: string;
  dataValue: number;
  nationalAvg: number | null;
  unit: string;
  comparison: "above" | "below" | "average" | "unknown";
}

// Natural Hazards (FEMA NRI)
export interface NaturalHazardsData {
  overallRiskScore: number | null;
  overallRiskRating: string;
  hazards: HazardRisk[];
  county: string;
  state: string;
}

export interface HazardRisk {
  name: string;
  riskScore: number | null;
  riskRating: string;
  icon: string;
}
