import { HealthOutcomesData, HealthMeasure } from "../types";

// National averages (approximate, from CDC PLACES 2023 data)
const NATIONAL_AVERAGES: Record<string, number> = {
  ARTHRITIS: 24.2,
  BPHIGH: 32.4,
  CANCER: 6.2,
  CASTHMA: 9.8,
  CHD: 5.8,
  COPD: 6.5,
  CSMOKING: 14.1,
  DEPRESSION: 20.5,
  DIABETES: 11.3,
  HIGHCHOL: 30.3,
  KIDNEY: 3.0,
  OBESITY: 32.4,
  SLEEP: 34.4,
  STROKE: 3.4,
  TEETHLOST: 12.4,
};

const MEASURE_NAMES: Record<string, { name: string; category: string }> = {
  ARTHRITIS: { name: "Arthritis", category: "Chronic Disease" },
  BPHIGH: { name: "High Blood Pressure", category: "Cardiovascular" },
  CANCER: { name: "Cancer (excl. skin)", category: "Chronic Disease" },
  CASTHMA: { name: "Current Asthma", category: "Respiratory" },
  CHD: { name: "Coronary Heart Disease", category: "Cardiovascular" },
  COPD: { name: "COPD", category: "Respiratory" },
  CSMOKING: { name: "Current Smoking", category: "Risk Behavior" },
  DEPRESSION: { name: "Depression", category: "Mental Health" },
  DIABETES: { name: "Diabetes", category: "Chronic Disease" },
  HIGHCHOL: { name: "High Cholesterol", category: "Cardiovascular" },
  KIDNEY: { name: "Chronic Kidney Disease", category: "Chronic Disease" },
  OBESITY: { name: "Obesity", category: "Risk Behavior" },
  SLEEP: { name: "Sleeping <7 Hours", category: "Risk Behavior" },
  STROKE: { name: "Stroke", category: "Cardiovascular" },
  TEETHLOST: { name: "All Teeth Lost (65+)", category: "Other" },
  BINGE: { name: "Binge Drinking", category: "Risk Behavior" },
  LPA: { name: "Physical Inactivity", category: "Risk Behavior" },
  ACCESS2: { name: "Lack of Health Insurance", category: "Prevention" },
  BPMED: { name: "BP Medication Adherence", category: "Prevention" },
  CERVICAL: { name: "Cervical Cancer Screening", category: "Prevention" },
  CHECKUP: { name: "Annual Checkup", category: "Prevention" },
  CHOLSCREEN: { name: "Cholesterol Screening", category: "Prevention" },
  COLON_SCREEN: { name: "Colorectal Cancer Screening", category: "Prevention" },
  DENTAL: { name: "Dental Visit", category: "Prevention" },
  MAMMOUSE: { name: "Mammography Use", category: "Prevention" },
  MHLTH: { name: "Poor Mental Health (14+ days)", category: "Mental Health" },
  PHLTH: { name: "Poor Physical Health (14+ days)", category: "Health Outcomes" },
  GHLTH: { name: "Poor General Health", category: "Health Outcomes" },
  HEARING: { name: "Hearing Disability", category: "Disability" },
  VISION: { name: "Vision Disability", category: "Disability" },
  COGNITION: { name: "Cognitive Disability", category: "Disability" },
  MOBILITY: { name: "Mobility Disability", category: "Disability" },
  SELFCARE: { name: "Self-Care Disability", category: "Disability" },
  INDEPLIVE: { name: "Independent Living Disability", category: "Disability" },
  DISABILITY: { name: "Any Disability", category: "Disability" },
};

function mapCategory(apiCategory: string): string {
  const map: Record<string, string> = {
    "Health Outcomes": "Health Outcomes",
    "Health Risk Behaviors": "Risk Behavior",
    Prevention: "Prevention",
    "Health Status": "Health Outcomes",
    Disability: "Disability",
  };
  return map[apiCategory] || apiCategory || "Other";
}

export async function fetchCDCPlaces(zip: string): Promise<HealthOutcomesData | null> {
  try {
    // CDC PLACES ZCTA-level data
    // Dataset qnzd-25i4 is the ZCTA-level PLACES data with crude prevalence
    const url = `https://data.cdc.gov/resource/qnzd-25i4.json?locationname=${zip}&$limit=100&datavaluetypeid=CrdPrv`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`CDC PLACES API error: ${response.status}`);
      // Try fallback dataset
      const fallbackUrl = `https://data.cdc.gov/resource/cwsq-ngmh.json?locationname=${zip}&$limit=100`;
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: { Accept: "application/json" },
      });
      if (!fallbackResponse.ok) return null;
      const fallbackData = await fallbackResponse.json();
      if (!fallbackData || fallbackData.length === 0) return null;
      return parseCDCData(fallbackData);
    }

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return parseCDCData(data);
  } catch (error) {
    console.error("CDC PLACES fetch error:", error);
    return null;
  }
}

function parseCDCData(data: Record<string, string>[]): HealthOutcomesData {
  const measures: HealthMeasure[] = [];
  const seenMeasures = new Set<string>();
  let dataYear = "";

  for (const row of data) {
    const measureId = row.measureid || row.MEASUREID || row.measure;
    const shortName = row.short_question_text || row.SHORT_QUESTION_TEXT || measureId || "";
    const categoryFromAPI = row.category || row.CATEGORY || "";
    
    // Only use crude prevalence, skip age-adjusted to avoid duplicates
    const dvType = row.datavaluetypeid || row.DATAVALUETYPEID;
    if (dvType && dvType !== "CrdPrv") continue;
    
    if (!measureId || seenMeasures.has(measureId)) continue;
    seenMeasures.add(measureId);

    const value = parseFloat(row.data_value || row.DATA_VALUE || "0");
    if (isNaN(value) || value === 0) continue;

    const info = MEASURE_NAMES[measureId] || {
      name: shortName || measureId,
      category: mapCategory(categoryFromAPI),
    };

    const nationalAvg = NATIONAL_AVERAGES[measureId] ?? null;
    let comparison: "above" | "below" | "average" | "unknown" = "unknown";
    if (nationalAvg !== null) {
      const diff = value - nationalAvg;
      if (Math.abs(diff) < 1) comparison = "average";
      else if (diff > 0) comparison = "above";
      else comparison = "below";
    }

    if (!dataYear && (row.year || row.YEAR)) dataYear = row.year || row.YEAR;

    measures.push({
      category: info.category,
      measureName: info.name,
      shortName: shortName,
      dataValue: value,
      nationalAvg,
      unit: "%",
      comparison,
    });
  }

  // Sort by category, then by how far above national average
  measures.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    const aDiff = a.nationalAvg ? a.dataValue - a.nationalAvg : 0;
    const bDiff = b.nationalAvg ? b.dataValue - b.nationalAvg : 0;
    return bDiff - aDiff;
  });

  return {
    measures,
    dataYear: dataYear || "2023",
    source: "CDC PLACES",
  };
}
