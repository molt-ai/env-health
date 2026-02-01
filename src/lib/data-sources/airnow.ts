import { AirQualityData, AirPollutant } from "../types";

export async function fetchAirQuality(zip: string): Promise<AirQualityData | null> {
  const apiKey = process.env.AIRNOW_API_KEY;

  if (!apiKey || apiKey === "YOUR_AIRNOW_KEY") {
    console.warn("AirNow API key not configured. Set AIRNOW_API_KEY in .env.local");
    // Return mock/placeholder data
    return {
      aqi: null,
      category: "API key not configured",
      pollutants: [],
      reportingArea: "N/A",
      stateCode: "",
      dateObserved: new Date().toISOString().split("T")[0],
    };
  }

  try {
    const url = `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zip}&distance=50&API_KEY=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`AirNow API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        aqi: null,
        category: "No data available",
        pollutants: [],
        reportingArea: "",
        stateCode: "",
        dateObserved: new Date().toISOString().split("T")[0],
      };
    }

    // Find the highest AQI reading
    let maxAqi = 0;
    let maxCategory = "";
    const pollutants: AirPollutant[] = [];

    for (const obs of data) {
      const aqi = obs.AQI || 0;
      if (aqi > maxAqi) {
        maxAqi = aqi;
        maxCategory = obs.Category?.Name || getCategoryFromAQI(aqi);
      }

      pollutants.push({
        name: obs.ParameterName || "Unknown",
        aqi: aqi,
        category: obs.Category?.Name || getCategoryFromAQI(aqi),
        concentration: obs.Concentration || 0,
        unit: obs.Unit || "µg/m³",
      });
    }

    return {
      aqi: maxAqi,
      category: maxCategory,
      pollutants,
      reportingArea: data[0]?.ReportingArea || "",
      stateCode: data[0]?.StateCode || "",
      dateObserved: data[0]?.DateObserved || new Date().toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("AirNow fetch error:", error);
    return null;
  }
}

function getCategoryFromAQI(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
