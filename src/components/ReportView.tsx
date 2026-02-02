"use client";

import { useRef, useState, useCallback } from "react";
import { EnvironmentalReport } from "@/lib/types";
import { generateRecommendations } from "@/lib/explainers";
import { ReportJsonLd } from "@/components/JsonLd";
import Toast from "@/components/Toast";
import ScoreCard from "./ScoreCard";
import AirQualitySection from "./sections/AirQualitySection";
import WaterSafetySection from "./sections/WaterSafetySection";
import ToxicSitesSection from "./sections/ToxicSitesSection";
import HealthOutcomesSection from "./sections/HealthOutcomesSection";
import NaturalHazardsSection from "./sections/NaturalHazardsSection";
import RecommendationsSection from "./sections/RecommendationsSection";
import MapView from "./MapView";
import {
  trackReportShared,
  trackReportExportedPDF,
  trackCompareFromReport,
} from "@/lib/analytics";

interface Props {
  report: EnvironmentalReport;
  onReset: () => void;
}

export default function ReportView({ report, onReset }: Props) {
  const { location, overallScore } = report;
  const reportRef = useRef<HTMLDivElement>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setToastVisible(true);
  }, []);

  const recommendations = generateRecommendations(
    report.airQuality,
    report.waterSafety,
    report.toxicSites,
    report.healthOutcomes,
    report.naturalHazards
  );

  const handleExportPDF = async () => {
    trackReportExportedPDF(location.zip);

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        window.print();
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>EnviroHealth Report - ${location.city || location.address}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Georgia, serif;
              background: #0f0f0f;
              color: #e8e0d4;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
            }
            h1 { color: #c4a35a; font-size: 24px; margin-bottom: 8px; }
            h2 { color: #e8e0d4; font-size: 18px; margin: 24px 0 12px; }
            h3 { color: #c4a35a; font-size: 14px; margin: 16px 0 8px; }
            p { color: #a89f91; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
            .card { background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
            .grade { text-align: center; font-size: 48px; font-weight: bold; color: ${overallScore.score >= 70 ? "#4a9e6e" : overallScore.score >= 50 ? "#d4a843" : "#c45a5a"}; }
            .score-bar { height: 8px; background: #2a2a2a; border-radius: 4px; overflow: hidden; margin: 4px 0 2px; }
            .score-fill { height: 100%; border-radius: 4px; }
            .flex { display: flex; justify-content: space-between; align-items: center; }
            .small { font-size: 11px; color: #6b6358; }
            .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin: 2px; }
            .red { color: #c45a5a; background: rgba(196,90,90,0.1); }
            .green { color: #4a9e6e; background: rgba(74,158,110,0.1); }
            .yellow { color: #d4a843; background: rgba(212,168,67,0.1); }
            .blue { color: #5a8ec4; background: rgba(90,142,196,0.1); }
            hr { border: none; border-top: 1px solid #2a2a2a; margin: 20px 0; }
            .rec { border-left: 3px solid #c4a35a; padding-left: 12px; margin-bottom: 12px; }
            .header { text-align: center; margin-bottom: 32px; }
            @media print {
              body { background: white; color: #333; padding: 20px; }
              .card { background: #f9f9f9; border-color: #ddd; }
              h1 { color: #8b7640; }
              h3 { color: #8b7640; }
              p { color: #555; }
              .small { color: #999; }
              .grade { color: ${overallScore.score >= 70 ? "#2d7a4a" : overallScore.score >= 50 ? "#b08930" : "#a04040"}; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌿 EnviroHealth Report</h1>
            <p>📍 ${location.city || location.address}${location.stateCode ? `, ${location.stateCode}` : ""}${location.zip ? ` ${location.zip}` : ""}</p>
            <p class="small">${location.county ? `${location.county} County • ` : ""}Generated ${new Date(report.generatedAt).toLocaleString()}</p>
          </div>
          
          <div class="card" style="text-align:center;">
            <div class="grade">${overallScore.grade}</div>
            <p><strong>Overall Score: ${overallScore.score}/100</strong></p>
            <p>${overallScore.summary}</p>
          </div>

          ${overallScore.categoryScores
            .map(
              (cat) => `
            <div class="flex" style="margin-bottom:8px;">
              <span>${cat.icon} ${cat.name}</span>
              <strong style="color:${cat.color}">${cat.score}/100</strong>
            </div>
            <div class="score-bar">
              <div class="score-fill" style="width:${cat.score}%;background:${cat.color}"></div>
            </div>
            <p class="small">${cat.detail}</p>
          `
            )
            .join("")}
          
          <hr>
          
          ${
            report.airQuality?.aqi !== null &&
            report.airQuality?.aqi !== undefined
              ? `
            <div class="card">
              <h2>💨 Air Quality</h2>
              <p><strong>AQI: ${report.airQuality.aqi}</strong> — ${report.airQuality.category}</p>
              ${report.airQuality.reportingArea ? `<p class="small">${report.airQuality.reportingArea}, ${report.airQuality.stateCode} • ${report.airQuality.dateObserved}</p>` : ""}
              ${report.airQuality.pollutants.map((p) => `<p class="small">${p.name}: AQI ${p.aqi} (${p.category})</p>`).join("")}
            </div>
          `
              : ""
          }
          
          ${
            report.waterSafety
              ? `
            <div class="card">
              <h2>💧 Water Safety</h2>
              <p><strong>${report.waterSafety.totalViolations} violation(s)</strong></p>
              <p>${report.waterSafety.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            report.toxicSites
              ? `
            <div class="card">
              <h2>☢️ Toxic Release Sites</h2>
              <p><strong>${report.toxicSites.totalFacilities} TRI facilities</strong></p>
              <p>${report.toxicSites.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            report.healthOutcomes &&
            report.healthOutcomes.measures.length > 0
              ? `
            <div class="card">
              <h2>🏥 Health Outcomes</h2>
              <p class="small">CDC PLACES — ${report.healthOutcomes.source} (${report.healthOutcomes.dataYear})</p>
              ${report.healthOutcomes.measures
                .filter((m) => m.comparison === "above")
                .slice(0, 10)
                .map(
                  (m) => `
                <p><span class="tag red">▲ above avg</span> ${m.measureName}: ${m.dataValue}% (national: ${m.nationalAvg}%)</p>
              `
                )
                .join("")}
              ${report.healthOutcomes.measures
                .filter((m) => m.comparison === "below")
                .slice(0, 5)
                .map(
                  (m) => `
                <p><span class="tag green">▼ below avg</span> ${m.measureName}: ${m.dataValue}%</p>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            report.naturalHazards &&
            report.naturalHazards.hazards.length > 0
              ? `
            <div class="card">
              <h2>🌪️ Natural Hazards</h2>
              <p><strong>Overall Risk: ${report.naturalHazards.overallRiskRating}</strong></p>
              ${report.naturalHazards.hazards
                .slice(0, 10)
                .map(
                  (h) => `
                <p>${h.icon} ${h.name}: <span class="tag ${h.riskRating.includes("High") ? "red" : h.riskRating.includes("Moderate") ? "yellow" : "green"}">${h.riskRating}</span></p>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            recommendations.length > 0
              ? `
            <hr>
            <h2>📋 Recommendations</h2>
            ${recommendations
              .map(
                (r) => `
              <div class="rec">
                <p><strong>${r.icon} ${r.title}</strong> <span class="tag ${r.priority === "high" ? "red" : r.priority === "medium" ? "yellow" : "blue"}">${r.priority}</span></p>
                <p class="small">${r.description}</p>
                ${r.actions.map((a) => `<p class="small">→ ${a.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`).join("")}
              </div>
            `
              )
              .join("")}
          `
              : ""
          }
          
          <hr>
          <p class="small" style="text-align:center;">
            EnviroHealth Report • Data from EPA, CDC PLACES, AirNow, FEMA NRI • ${new Date().toLocaleDateString()}
          </p>
        </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } catch (err) {
      console.error("PDF export error:", err);
      window.print();
    }
  };

  // Build shareable URL
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/report/${location.zip}?address=${encodeURIComponent(location.address)}&lat=${location.lat}&lng=${location.lng}&county=${encodeURIComponent(location.county)}&state=${encodeURIComponent(location.state)}&stateCode=${location.stateCode}&city=${encodeURIComponent(location.city)}`
      : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `EnviroHealth Report - ${location.city || location.address}`,
          url: shareUrl,
        });
        trackReportShared(location.zip, "native_share");
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast("✓ Link copied to clipboard!");
        trackReportShared(location.zip, "clipboard");
      } catch {
        showToast("Failed to copy link", "error");
      }
    }
  };

  const compareUrl = `/compare`;

  return (
    <div ref={reportRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <ReportJsonLd
        city={location.city}
        state={location.stateCode}
        zip={location.zip}
        score={overallScore.score}
        grade={overallScore.grade}
      />
      <Toast
        message={toastMsg}
        visible={toastVisible}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      {/* Location Header */}
      <div className="mb-8 animate-fade-in-up">
        <p className="text-sm text-[var(--text-muted)] mb-1">
          Environmental Health Report for
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
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
      <div
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <ScoreCard
          grade={overallScore.grade}
          score={overallScore.score}
          summary={overallScore.summary}
          categoryScores={overallScore.categoryScores}
        />
      </div>

      {/* Recommendations - right after score */}
      {recommendations.length > 0 && (
        <div
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
          <RecommendationsSection recommendations={recommendations} />
        </div>
      )}

      {/* Report Sections */}
      <div className="space-y-8">
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <AirQualitySection data={report.airQuality} />
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <WaterSafetySection data={report.waterSafety} />
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <ToxicSitesSection data={report.toxicSites} />
        </div>

        {/* Map */}
        {report.location.lat && report.location.lng && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "450ms" }}
          >
            <MapView
              lat={report.location.lat}
              lng={report.location.lng}
              facilities={report.toxicSites?.facilities || []}
              locationName={location.city || location.address}
            />
          </div>
        )}

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <HealthOutcomesSection data={report.healthOutcomes} />
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <NaturalHazardsSection data={report.naturalHazards} />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 text-center space-y-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 sm:px-8 py-3 bg-[var(--accent-gold)] text-[var(--bg-primary)] font-bold rounded-lg hover:opacity-90 transition"
          >
            Search Another Location
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 sm:px-8 py-3 border border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold rounded-lg hover:bg-[var(--accent-gold)]/10 transition"
          >
            📄 Download Report
          </button>
          <button
            onClick={handleShare}
            className="px-6 sm:px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-bold rounded-lg hover:border-[var(--text-muted)] transition"
          >
            🔗 Share Report
          </button>
        </div>

        {/* Compare CTA */}
        <a
          href={compareUrl}
          onClick={() => trackCompareFromReport(location.zip)}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
        >
          ⚖️ Compare with another location
        </a>

        <div className="flex flex-wrap justify-center gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            Data sources: EPA Envirofacts, CDC PLACES, AirNow API, FEMA
            National Risk Index
          </p>
          <span className="text-xs text-[var(--text-muted)]">•</span>
          <a
            href="https://github.com/molt-ai/env-health/issues"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
            target="_blank"
            rel="noopener"
          >
            Report a problem
          </a>
        </div>
      </div>
    </div>
  );
}
