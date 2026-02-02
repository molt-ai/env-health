"use client";

import { useState } from "react";
import { AirQualityData } from "@/lib/types";
import {
  AQI_EXPLAINER,
  AQI_LEVELS,
  POLLUTANT_INFO,
} from "@/lib/explainers";

interface Props {
  data: AirQualityData | null;
}

const aqiColors: Record<string, string> = {
  Good: "var(--accent-green)",
  Moderate: "var(--accent-yellow)",
  "Unhealthy for Sensitive Groups": "var(--accent-orange)",
  Unhealthy: "var(--accent-red)",
  "Very Unhealthy": "#9e3a8e",
  Hazardous: "#7e0023",
};

export default function AirQualitySection({ data }: Props) {
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedPollutant, setExpandedPollutant] = useState<string | null>(null);

  if (!data) {
    return (
      <SectionShell title="💨 Air Quality" subtitle="No data available">
        <p className="text-[var(--text-muted)] text-sm">
          Unable to fetch air quality data for this location.
        </p>
      </SectionShell>
    );
  }

  const color = aqiColors[data.category] || "var(--text-secondary)";
  const levelInfo = AQI_LEVELS[data.category];

  return (
    <SectionShell
      title="💨 Air Quality"
      subtitle={
        data.reportingArea
          ? `${data.reportingArea}, ${data.stateCode} • ${data.dateObserved}`
          : data.dateObserved
      }
    >
      {data.aqi !== null ? (
        <>
          {/* AQI Main Display */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}
            >
              <span className="text-2xl font-bold" style={{ color }}>
                {data.aqi}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">AQI</span>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color }}>
                {data.category}
              </p>
              {levelInfo && (
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {levelInfo.meaning}
                </p>
              )}
            </div>
          </div>

          {/* Advice box */}
          {levelInfo && (
            <div
              className="rounded-xl px-4 py-3 mb-6"
              style={{ backgroundColor: `${color}10`, border: `1px solid ${color}25` }}
            >
              <p className="text-sm font-medium" style={{ color }}>
                💡 {levelInfo.advice}
              </p>
            </div>
          )}

          {/* AQI Scale */}
          <div className="mb-6">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="flex-1 bg-[var(--accent-green)]" />
              <div className="flex-1 bg-[var(--accent-yellow)]" />
              <div className="flex-1 bg-[var(--accent-orange)]" />
              <div className="flex-1 bg-[var(--accent-red)]" />
              <div className="flex-1 bg-[#9e3a8e]" />
              <div className="flex-1 bg-[#7e0023]" />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[var(--text-muted)]">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>500</span>
            </div>
            {/* Marker */}
            <div className="relative h-4">
              <div
                className="absolute w-2 h-2 bg-white rounded-full -top-1"
                style={{ left: `${Math.min((data.aqi / 500) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Seasonal note */}
          <div className="mb-6 bg-[var(--bg-secondary)] rounded-lg px-4 py-3">
            <p className="text-xs text-[var(--text-muted)]">
              📅 <strong className="text-[var(--text-secondary)]">Note:</strong> Air quality varies by season. Ozone tends to be worst in summer; particulate matter can spike during wildfire season and winter inversions. This reading is from {data.dateObserved} and reflects current conditions, not annual averages.
            </p>
          </div>

          {/* Pollutants */}
          {data.pollutants.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                Pollutant Breakdown
              </h4>
              <div className="grid gap-3">
                {data.pollutants.map((p, i) => {
                  const pInfo = POLLUTANT_INFO[p.name] || POLLUTANT_INFO[p.name.replace(".", "")];
                  const isExpanded = expandedPollutant === p.name;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedPollutant(isExpanded ? null : p.name)}
                        className="w-full flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-4 py-3 hover:bg-[var(--bg-card-hover)] transition text-left"
                      >
                        <div>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {pInfo ? pInfo.fullName : p.name}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] ml-2">
                            {p.concentration} {p.unit}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-bold"
                            style={{ color: aqiColors[p.category] || "var(--text-secondary)" }}
                          >
                            {p.aqi}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${aqiColors[p.category] || "var(--border)"}22`,
                              color: aqiColors[p.category] || "var(--text-muted)",
                            }}
                          >
                            {p.category}
                          </span>
                          <span className="text-[var(--text-muted)] text-xs ml-1">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </div>
                      </button>
                      {isExpanded && pInfo && (
                        <div className="mt-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-2 border-[var(--accent-gold-dim)] text-sm space-y-2">
                          <p className="text-[var(--text-secondary)]">{pInfo.description}</p>
                          <p className="text-[var(--text-muted)]">
                            <strong className="text-[var(--text-secondary)]">Sources:</strong> {pInfo.sources}
                          </p>
                          <p className="text-[var(--text-muted)]">
                            <strong className="text-[var(--text-secondary)]">Health effects:</strong> {pInfo.health}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explainer toggle */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="mt-6 text-xs text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)] transition flex items-center gap-1"
          >
            {showExplainer ? "▼ Hide" : "▶ What is the AQI?"} — Understanding Air Quality
          </button>
          {showExplainer && (
            <div className="mt-3 bg-[var(--bg-secondary)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
              <p dangerouslySetInnerHTML={{ __html: AQI_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
              <div className="grid gap-2 mt-4">
                {Object.entries(AQI_LEVELS).map(([level, info]) => (
                  <div key={level} className="flex items-start gap-3">
                    <span
                      className="w-3 h-3 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: aqiColors[level] || "var(--border)" }}
                    />
                    <div>
                      <span className="font-medium text-[var(--text-primary)]">{level}</span>
                      <span className="text-[var(--text-muted)]"> ({info.range})</span>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{info.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-[var(--text-muted)] text-sm">
          {data.category === "API key not configured"
            ? "Configure your AirNow API key in .env.local to see real-time air quality data."
            : "No air quality readings available for this location."}
        </p>
      )}
    </SectionShell>
  );
}

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
