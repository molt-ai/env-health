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

function getSummaryLine(data: AirQualityData): string {
  if (data.aqi === null) return "No data available";
  if (data.aqi <= 50) return "Air quality is satisfactory with minimal risk.";
  if (data.aqi <= 100) return "Acceptable air quality; sensitive individuals may notice effects.";
  if (data.aqi <= 150) return "Sensitive groups may experience health effects.";
  return "Air quality is unhealthy. Limit outdoor exposure.";
}

export default function AirQualitySection({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedPollutant, setExpandedPollutant] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--text-muted)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Air Quality</h3>
            <p className="text-xs text-[var(--text-muted)]">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const color = aqiColors[data.category] || "var(--text-secondary)";
  const levelInfo = AQI_LEVELS[data.category];
  const summaryLine = getSummaryLine(data);

  return (
    <div className="section-card" style={{ borderLeftColor: color, borderLeftWidth: expanded ? 2 : 1 }}>
      {/* Collapsed Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: color }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Air Quality</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {data.aqi !== null && (
            <span className="text-lg font-bold" style={{ color }}>
              {data.aqi}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      <div className={`section-content ${expanded ? "expanded" : "collapsed"}`}>
        {data.aqi !== null ? (
          <div className="px-5 pb-5 space-y-5">
            {/* AQI Display */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
              >
                <span className="text-xl font-bold" style={{ color }}>
                  {data.aqi}
                </span>
                <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">AQI</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color }}>
                  {data.category}
                </p>
                {levelInfo && (
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    {levelInfo.meaning}
                  </p>
                )}
                {data.reportingArea && (
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">
                    {data.reportingArea}, {data.stateCode} · {data.dateObserved}
                  </p>
                )}
              </div>
            </div>

            {/* AQI Scale — minimal */}
            <div>
              <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--accent-green)" }} />
                <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--accent-yellow)" }} />
                <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--accent-orange)" }} />
                <div className="flex-1 rounded-full" style={{ backgroundColor: "var(--accent-red)" }} />
                <div className="flex-1 rounded-full" style={{ backgroundColor: "#9e3a8e" }} />
                <div className="flex-1 rounded-full" style={{ backgroundColor: "#7e0023" }} />
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-[var(--text-muted)]">
                <span>0</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300+</span>
              </div>
            </div>

            {/* Advice */}
            {levelInfo && (
              <p className="text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-lg px-4 py-3 leading-relaxed">
                {levelInfo.advice}
              </p>
            )}

            {/* Pollutants — show top 3, rest behind "Show more" */}
            {data.pollutants.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Pollutants
                </h4>
                <div className="space-y-1.5">
                  {data.pollutants.slice(0, expandedPollutant === "all" ? undefined : 3).map((p, i) => {
                    const pInfo = POLLUTANT_INFO[p.name] || POLLUTANT_INFO[p.name.replace(".", "")];
                    const isExpanded = expandedPollutant === p.name;
                    const pColor = aqiColors[p.category] || "var(--text-secondary)";

                    return (
                      <div key={i}>
                        <button
                          onClick={() => setExpandedPollutant(isExpanded ? null : p.name)}
                          className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--bg-card-hover)] transition text-left min-h-[44px]"
                        >
                          <span className="text-xs text-[var(--text-primary)]">
                            {pInfo ? pInfo.fullName : p.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold" style={{ color: pColor }}>
                              {p.aqi}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {p.category}
                            </span>
                          </div>
                        </button>
                        {isExpanded && pInfo && (
                          <div className="ml-3 pl-3 border-l border-[var(--border)] mb-2 space-y-1.5">
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{pInfo.description}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              <span className="text-[var(--text-secondary)]">Sources:</span> {pInfo.sources}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              <span className="text-[var(--text-secondary)]">Health:</span> {pInfo.health}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {data.pollutants.length > 3 && expandedPollutant !== "all" && (
                    <button
                      onClick={() => setExpandedPollutant("all")}
                      className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition pl-3 min-h-[44px] flex items-center"
                    >
                      Show {data.pollutants.length - 3} more pollutants
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Seasonal note */}
            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
              Air quality varies by season. This reading from {data.dateObserved} reflects current conditions, not annual averages.
            </p>

            {/* Explainer */}
            <button
              onClick={() => setShowExplainer(!showExplainer)}
              className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition flex items-center gap-1.5 min-h-[44px]"
            >
              <svg className={`w-3 h-3 transition-transform ${showExplainer ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              What is the AQI?
            </button>
            {showExplainer && (
              <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: AQI_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
                <div className="space-y-1.5 mt-3">
                  {Object.entries(AQI_LEVELS).map(([level, info]) => (
                    <div key={level} className="flex items-start gap-2">
                      <span
                        className="status-dot mt-1"
                        style={{ backgroundColor: aqiColors[level] || "var(--border)" }}
                      />
                      <div>
                        <span className="text-[var(--text-primary)] font-medium">{level}</span>
                        <span className="text-[var(--text-muted)]"> ({info.range})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-5 pb-5">
            <p className="text-[var(--text-muted)] text-xs">
              {data.category === "API key not configured"
                ? "Configure your AirNow API key in .env.local to see real-time air quality data."
                : "No air quality readings available for this location."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
