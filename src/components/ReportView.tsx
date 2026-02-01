"use client";

import { EnvironmentalReport } from "@/lib/types";
import ScoreCard from "./ScoreCard";
import AirQualitySection from "./sections/AirQualitySection";
import WaterSafetySection from "./sections/WaterSafetySection";
import ToxicSitesSection from "./sections/ToxicSitesSection";
import HealthOutcomesSection from "./sections/HealthOutcomesSection";
import NaturalHazardsSection from "./sections/NaturalHazardsSection";

interface Props {
  report: EnvironmentalReport;
  onReset: () => void;
}

export default function ReportView({ report, onReset }: Props) {
  const { location, overallScore } = report;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Location Header */}
      <div className="mb-8 animate-fade-in-up">
        <p className="text-sm text-[var(--text-muted)] mb-1">
          Environmental Health Report for
        </p>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          📍 {location.city || location.address}
          {location.stateCode ? `, ${location.stateCode}` : ""}
          {location.zip ? ` ${location.zip}` : ""}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {location.county ? `${location.county} County • ` : ""}
          Generated {new Date(report.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* Overall Score */}
      <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <ScoreCard
          grade={overallScore.grade}
          score={overallScore.score}
          summary={overallScore.summary}
        />
      </div>

      {/* Report Sections */}
      <div className="space-y-8">
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <AirQualitySection data={report.airQuality} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <WaterSafetySection data={report.waterSafety} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <ToxicSitesSection data={report.toxicSites} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <HealthOutcomesSection data={report.healthOutcomes} />
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <NaturalHazardsSection data={report.naturalHazards} />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 text-center space-y-4">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-[var(--accent-gold)] text-[var(--bg-primary)] font-bold rounded-lg hover:opacity-90 transition"
        >
          Search Another Location
        </button>
        <p className="text-xs text-[var(--text-muted)]">
          Data sources: EPA Envirofacts, CDC PLACES, AirNow API, FEMA National
          Risk Index
        </p>
      </div>
    </div>
  );
}
