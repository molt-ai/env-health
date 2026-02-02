import {
  AirQualityData,
  WaterSafetyData,
  ToxicSitesData,
  HealthOutcomesData,
  NaturalHazardsData,
  OverallScore,
  CategoryScore,
} from "./types";

export function calculateOverallScore(
  airQuality: AirQualityData | null,
  waterSafety: WaterSafetyData | null,
  toxicSites: ToxicSitesData | null,
  healthOutcomes: HealthOutcomesData | null,
  naturalHazards: NaturalHazardsData | null
): OverallScore {
  const categoryScores: CategoryScore[] = [];
  const factors: string[] = [];

  // Air Quality Score (0-100, higher is better)
  if (airQuality?.aqi !== null && airQuality?.aqi !== undefined) {
    const airScore = Math.max(0, Math.min(100, 100 - airQuality.aqi));
    let detail = "Good air quality";
    if (airScore >= 80) detail = "Excellent air quality with minimal pollution";
    else if (airScore >= 60) detail = "Acceptable air quality, some pollutants present";
    else if (airScore >= 40) detail = "Moderate concerns — sensitive groups should take care";
    else detail = "Poor air quality — significant health risk";
    if (airScore < 50) factors.push("poor air quality");
    categoryScores.push({
      name: "Air Quality",
      score: airScore,
      icon: "💨",
      color: getScoreColor(airScore),
      detail,
    });
  }

  // Water Safety Score
  if (waterSafety) {
    let waterScore = 100;
    if (waterSafety.totalViolations > 0) {
      waterScore = Math.max(0, 100 - waterSafety.totalViolations * 5);
    }
    let detail = "No violations on record";
    if (waterScore >= 80) detail = "Clean record with minimal or no violations";
    else if (waterScore >= 60) detail = "Some violations found — monitor water quality";
    else if (waterScore >= 40) detail = "Multiple violations — consider water testing";
    else detail = "Significant violations — water filtration recommended";
    if (waterScore < 50) factors.push("water quality violations");
    categoryScores.push({
      name: "Water Safety",
      score: waterScore,
      icon: "💧",
      color: getScoreColor(waterScore),
      detail,
    });
  }

  // Toxic Sites Score
  if (toxicSites) {
    let toxicScore = 100;
    if (toxicSites.totalFacilities > 0) {
      toxicScore = Math.max(0, 100 - toxicSites.totalFacilities * 8);
    }
    let detail = "No TRI facilities nearby";
    if (toxicScore >= 80) detail = "Very few or no toxic release facilities nearby";
    else if (toxicScore >= 60) detail = "Some TRI facilities in the area";
    else if (toxicScore >= 40) detail = "Several toxic release facilities nearby";
    else detail = "High density of toxic release facilities";
    if (toxicScore < 50) factors.push("nearby toxic release facilities");
    categoryScores.push({
      name: "Toxic Sites",
      score: toxicScore,
      icon: "☢️",
      color: getScoreColor(toxicScore),
      detail,
    });
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
    let detail = "Health outcomes are generally at or below national averages";
    if (healthScore >= 80) detail = "Community health indicators are strong";
    else if (healthScore >= 60) detail = "Some health metrics above national averages";
    else if (healthScore >= 40) detail = "Multiple health concerns above national averages";
    else detail = "Significant health disparities compared to national averages";
    if (healthScore < 50) factors.push("elevated disease rates");
    categoryScores.push({
      name: "Health Outcomes",
      score: healthScore,
      icon: "🏥",
      color: getScoreColor(healthScore),
      detail,
    });
  }

  // Natural Hazards Score
  if (naturalHazards && naturalHazards.hazards.length > 0) {
    const highRisk = naturalHazards.hazards.filter(
      (h) =>
        h.riskRating === "Very High" || h.riskRating === "Relatively High"
    ).length;
    const hazardScore = Math.max(0, 100 - highRisk * 15);
    let detail = "Low natural hazard risk";
    if (hazardScore >= 80) detail = "Minimal natural hazard exposure";
    else if (hazardScore >= 60) detail = "Some natural hazard risks to be aware of";
    else if (hazardScore >= 40) detail = "Notable natural hazard risks — preparedness recommended";
    else detail = "High natural hazard exposure — emergency preparedness essential";
    if (hazardScore < 50) factors.push("high natural hazard risks");
    categoryScores.push({
      name: "Natural Hazards",
      score: hazardScore,
      icon: "🌪️",
      color: getScoreColor(hazardScore),
      detail,
    });
  }

  // Calculate composite score
  const scores = categoryScores.map((c) => c.score);
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

  return { grade, score: composite, summary, categoryScores };
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

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 60) return "var(--accent-blue)";
  if (score >= 40) return "var(--accent-yellow)";
  if (score >= 20) return "var(--accent-orange)";
  return "var(--accent-red)";
}
