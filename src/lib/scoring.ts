import {
  AirQualityData,
  WaterSafetyData,
  ToxicSitesData,
  HealthOutcomesData,
  NaturalHazardsData,
  OverallScore,
} from "./types";

export function calculateOverallScore(
  airQuality: AirQualityData | null,
  waterSafety: WaterSafetyData | null,
  toxicSites: ToxicSitesData | null,
  healthOutcomes: HealthOutcomesData | null,
  naturalHazards: NaturalHazardsData | null
): OverallScore {
  const scores: number[] = [];
  const factors: string[] = [];

  // Air Quality Score (0-100, higher is better)
  if (airQuality?.aqi !== null && airQuality?.aqi !== undefined) {
    const airScore = Math.max(0, Math.min(100, 100 - airQuality.aqi));
    scores.push(airScore);
    if (airScore < 50) factors.push("poor air quality");
  }

  // Water Safety Score
  if (waterSafety) {
    let waterScore = 100;
    if (waterSafety.totalViolations > 0) {
      waterScore = Math.max(0, 100 - waterSafety.totalViolations * 5);
    }
    scores.push(waterScore);
    if (waterScore < 50) factors.push("water quality violations");
  }

  // Toxic Sites Score
  if (toxicSites) {
    let toxicScore = 100;
    if (toxicSites.totalFacilities > 0) {
      toxicScore = Math.max(0, 100 - toxicSites.totalFacilities * 8);
    }
    scores.push(toxicScore);
    if (toxicScore < 50) factors.push("nearby toxic release facilities");
  }

  // Health Outcomes Score
  if (healthOutcomes && healthOutcomes.measures.length > 0) {
    const aboveAvg = healthOutcomes.measures.filter(
      (m) => m.comparison === "above"
    ).length;
    const total = healthOutcomes.measures.filter(
      (m) => m.comparison !== "unknown"
    ).length;

    let healthScore = 100;
    if (total > 0) {
      const aboveRatio = aboveAvg / total;
      healthScore = Math.round(100 * (1 - aboveRatio * 0.8));
    }
    scores.push(healthScore);
    if (healthScore < 50) factors.push("elevated disease rates");
  }

  // Natural Hazards Score
  if (naturalHazards && naturalHazards.hazards.length > 0) {
    const highRisk = naturalHazards.hazards.filter(
      (h) =>
        h.riskRating === "Very High" || h.riskRating === "Relatively High"
    ).length;
    let hazardScore = Math.max(0, 100 - highRisk * 15);
    scores.push(hazardScore);
    if (hazardScore < 50) factors.push("high natural hazard risks");
  }

  // Calculate composite score
  const composite =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 50;

  const grade = getGrade(composite);

  let summary: string;
  if (composite >= 80) {
    summary = "This location has excellent environmental health indicators.";
  } else if (composite >= 60) {
    summary = "This location has generally good environmental health, with some areas to monitor.";
  } else if (composite >= 40) {
    summary = `This location has moderate environmental health concerns${factors.length > 0 ? `, including ${factors.join(" and ")}` : ""}.`;
  } else {
    summary = `This location has significant environmental health concerns${factors.length > 0 ? `: ${factors.join(", ")}` : ""}.`;
  }

  return { grade, score: composite, summary };
}

function getGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C+";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}
