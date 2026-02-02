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

  const scrollToSection = (name: string) => {
    const sectionMap: Record<string, string> = {
      "Air Quality": "section-air",
      "Water Safety": "section-water",
      "Toxic Sites": "section-toxic",
      "Health Outcomes": "section-health",
      "Natural Hazards": "section-hazards",
    };
    const id = sectionMap[name];
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

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
              font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
              background: #111113;
              color: #ededef;
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
              line-height: 1.6;
            }
            h1 { color: #3ecf8e; font-size: 24px; margin-bottom: 8px; }
            h2 { color: #ededef; font-size: 18px; margin: 24px 0 12px; }
            h3 { color: #3ecf8e; font-size: 14px; margin: 16px 0 8px; }
            p { color: #a0a0a8; font-size: 13px; line-height: 1.6; margin-bottom: 8px; }
            .card { background: #1a1a1d; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
            .grade { text-align: center; font-size: 48px; font-weight: bold; color: ${overallScore.score >= 70 ? "#3ecf8e" : overallScore.score >= 50 ? "#eab308" : "#ef4444"}; }
            .score-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin: 4px 0 2px; }
            .score-fill { height: 100%; border-radius: 2px; }
            .flex { display: flex; justify-content: space-between; align-items: center; }
            .small { font-size: 11px; color: #5c5c66; }
            .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin: 2px; }
            .red { color: #ef4444; background: rgba(239,68,68,0.1); }
            .green { color: #3ecf8e; background: rgba(62,207,142,0.1); }
            .yellow { color: #eab308; background: rgba(234,179,8,0.1); }
            .blue { color: #60a5fa; background: rgba(96,165,250,0.1); }
            hr { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 20px 0; }
            .rec { border-left: 2px solid #3ecf8e; padding-left: 12px; margin-bottom: 12px; }
            .header { text-align: center; margin-bottom: 32px; }
            @media print {
              body { background: white; color: #333; padding: 20px; }
              .card { background: #f9f9f9; border-color: #ddd; }
              h1 { color: #2a9d6a; }
              h3 { color: #2a9d6a; }
              p { color: #555; }
              .small { color: #999; }
              .grade { color: ${overallScore.score >= 70 ? "#2a9d6a" : overallScore.score >= 50 ? "#b08930" : "#dc2626"}; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EnviroHealth Report</h1>
            <p>${location.city || location.address}${location.stateCode ? `, ${location.stateCode}` : ""}${location.zip ? ` ${location.zip}` : ""}</p>
            <p class="small">${location.county ? `${location.county} County · ` : ""}Generated ${new Date(report.generatedAt).toLocaleString()}</p>
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
              <span>${cat.name}</span>
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
              <h2>Air Quality</h2>
              <p><strong>AQI: ${report.airQuality.aqi}</strong> — ${report.airQuality.category}</p>
              ${report.airQuality.reportingArea ? `<p class="small">${report.airQuality.reportingArea}, ${report.airQuality.stateCode} · ${report.airQuality.dateObserved}</p>` : ""}
              ${report.airQuality.pollutants.map((p) => `<p class="small">${p.name}: AQI ${p.aqi} (${p.category})</p>`).join("")}
            </div>
          `
              : ""
          }
          
          ${
            report.waterSafety
              ? `
            <div class="card">
              <h2>Water Safety</h2>
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
              <h2>Toxic Release Sites</h2>
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
              <h2>Health Outcomes</h2>
              <p class="small">CDC PLACES — ${report.healthOutcomes.source} (${report.healthOutcomes.dataYear})</p>
              ${report.healthOutcomes.measures
                .filter((m) => m.comparison === "above")
                .slice(0, 10)
                .map(
                  (m) => `
                <p><span class="tag red">above avg</span> ${m.measureName}: ${m.dataValue}% (national: ${m.nationalAvg}%)</p>
              `
                )
                .join("")}
              ${report.healthOutcomes.measures
                .filter((m) => m.comparison === "below")
                .slice(0, 5)
                .map(
                  (m) => `
                <p><span class="tag green">below avg</span> ${m.measureName}: ${m.dataValue}%</p>
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
              <h2>Natural Hazards</h2>
              <p><strong>Overall Risk: ${report.naturalHazards.overallRiskRating}</strong></p>
              ${report.naturalHazards.hazards
                .slice(0, 10)
                .map(
                  (h) => `
                <p>${h.name}: <span class="tag ${h.riskRating.includes("High") ? "red" : h.riskRating.includes("Moderate") ? "yellow" : "green"}">${h.riskRating}</span></p>
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
            <h2>Recommendations</h2>
            ${recommendations
              .map(
                (r) => `
              <div class="rec">
                <p><strong>${r.title}</strong> <span class="tag ${r.priority === "high" ? "red" : r.priority === "medium" ? "yellow" : "blue"}">${r.priority}</span></p>
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
            EnviroHealth Report · Data from EPA, CDC PLACES, AirNow, FEMA NRI · ${new Date().toLocaleDateString()}
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
        showToast("Link copied to clipboard");
        trackReportShared(location.zip, "clipboard");
      } catch {
        showToast("Failed to copy link", "error");
      }
    }
  };

  const compareUrl = `/compare`;

  return (
    <div ref={reportRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
          Environmental Health Report
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {location.city || location.address}
          {location.stateCode ? `, ${location.stateCode}` : ""}
          {location.zip ? ` ${location.zip}` : ""}
        </h2>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {location.county ? `${location.county} County · ` : ""}
          {new Date(report.generatedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Overall Score */}
      <div
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: "50ms" }}
      >
        <ScoreCard
          grade={overallScore.grade}
          score={overallScore.score}
          summary={overallScore.summary}
          categoryScores={overallScore.categoryScores}
          onCategoryClick={scrollToSection}
        />
      </div>

      {/* Report Sections — each collapsible */}
      <div className="space-y-4">
        <div
          id="section-air"
          className="animate-fade-in-up scroll-mt-24"
          style={{ animationDelay: "100ms" }}
        >
          <AirQualitySection data={report.airQuality} />
        </div>

        <div
          id="section-water"
          className="animate-fade-in-up scroll-mt-24"
          style={{ animationDelay: "150ms" }}
        >
          <WaterSafetySection data={report.waterSafety} />
        </div>

        <div
          id="section-toxic"
          className="animate-fade-in-up scroll-mt-24"
          style={{ animationDelay: "200ms" }}
        >
          <ToxicSitesSection data={report.toxicSites} />
        </div>

        {/* Map */}
        {report.location.lat && report.location.lng && (
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "225ms" }}
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
          id="section-health"
          className="animate-fade-in-up scroll-mt-24"
          style={{ animationDelay: "250ms" }}
        >
          <HealthOutcomesSection data={report.healthOutcomes} />
        </div>

        <div
          id="section-hazards"
          className="animate-fade-in-up scroll-mt-24"
          style={{ animationDelay: "300ms" }}
        >
          <NaturalHazardsSection data={report.naturalHazards} />
        </div>

        {/* Recommendations — at the END */}
        {recommendations.length > 0 && (
          <div
            className="animate-fade-in-up scroll-mt-24"
            style={{ animationDelay: "350ms" }}
          >
            <RecommendationsSection recommendations={recommendations} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-12 text-center space-y-5">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-medium rounded-lg hover:opacity-90 transition min-h-[44px]"
          >
            Search Another Location
          </button>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-medium rounded-lg hover:border-[var(--border-light)] transition min-h-[44px]"
          >
            Download Report
          </button>
          <button
            onClick={handleShare}
            className="px-6 py-3 border border-[var(--border)] text-[var(--text-secondary)] font-medium rounded-lg hover:border-[var(--border-light)] transition min-h-[44px]"
          >
            Share
          </button>
        </div>

        <a
          href={compareUrl}
          onClick={() => trackCompareFromReport(location.zip)}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition"
        >
          Compare with another location
        </a>

        <p className="text-xs text-[var(--text-muted)]">
          Data sources: EPA Envirofacts, CDC PLACES, AirNow API, FEMA
          National Risk Index
        </p>
      </div>
    </div>
  );
}
