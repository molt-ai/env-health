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

    // Query all data sources in parallel
    const [airQuality, waterSafety, toxicSites, healthOutcomes, naturalHazards] =
      await Promise.all([
        fetchAirQuality(location.zip),
        fetchWaterViolations(location.zip),
        fetchToxicReleases(location.zip),
        fetchCDCPlaces(location.zip),
        fetchNaturalHazards(location.county || "", location.stateCode || ""),
      ]);

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
