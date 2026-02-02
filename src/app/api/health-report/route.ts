import { NextRequest, NextResponse } from "next/server";
import { LocationData, EnvironmentalReport } from "@/lib/types";
import { fetchCDCPlaces } from "@/lib/data-sources/cdc-places";
import { fetchAirQuality } from "@/lib/data-sources/airnow";
import { fetchWaterViolations } from "@/lib/data-sources/epa-water";
import { fetchToxicReleases } from "@/lib/data-sources/epa-tri";
import { fetchNaturalHazards } from "@/lib/data-sources/fema-nri";
import { calculateOverallScore } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const location: LocationData = await request.json();

    if (!location.zip) {
      return NextResponse.json(
        { error: "ZIP code is required" },
        { status: 400 }
      );
    }

    // Query all data sources in parallel - catch individual failures
    const results = await Promise.allSettled([
      fetchAirQuality(location.zip),
      fetchWaterViolations(location.zip),
      fetchToxicReleases(location.zip),
      fetchCDCPlaces(location.zip),
      fetchNaturalHazards(location.county || "", location.stateCode || "", location.lat, location.lng),
    ]);

    const airQuality = results[0].status === "fulfilled" ? results[0].value : {
      aqi: null, category: "Data unavailable", pollutants: [], reportingArea: "N/A", stateCode: "", dateObserved: new Date().toISOString().split("T")[0],
    };
    const waterSafety = results[1].status === "fulfilled" ? results[1].value : {
      totalViolations: 0, violations: [], summary: "Water data temporarily unavailable.",
    };
    const toxicSites = results[2].status === "fulfilled" ? results[2].value : {
      totalFacilities: 0, facilities: [], summary: "Toxic release data temporarily unavailable.",
    };
    const healthOutcomes = results[3].status === "fulfilled" ? results[3].value : {
      measures: [], dataYear: "", source: "CDC PLACES", summary: "Health outcomes data temporarily unavailable.",
    };
    const naturalHazards = results[4].status === "fulfilled" ? results[4].value : {
      overallRiskScore: null, overallRiskRating: "Unknown", hazards: [], county: location.county || "", state: location.stateCode || "",
    };

    // Log any failures
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const names = ["AirQuality", "WaterSafety", "ToxicSites", "CDCPlaces", "NaturalHazards"];
        console.error(`${names[i]} failed:`, r.reason);
      }
    });

    // Calculate overall score
    const overallScore = calculateOverallScore(
      airQuality,
      waterSafety,
      toxicSites,
      healthOutcomes,
      naturalHazards
    );

    const report: EnvironmentalReport = {
      location,
      overallScore,
      airQuality,
      waterSafety,
      toxicSites,
      healthOutcomes,
      naturalHazards,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
