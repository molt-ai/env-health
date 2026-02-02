"use client";

import { useState } from "react";
import { NaturalHazardsData } from "@/lib/types";
import { HAZARD_EXPLAINER, HAZARD_DETAILS } from "@/lib/explainers";

interface Props {
  data: NaturalHazardsData | null;
}

const ratingColors: Record<string, string> = {
  "Very High": "var(--accent-red)",
  "Relatively High": "var(--accent-orange)",
  "Relatively Moderate": "var(--accent-yellow)",
  "Relatively Low": "var(--accent-blue)",
  "Very Low": "var(--accent-green)",
};

export default function NaturalHazardsSection({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedHazard, setExpandedHazard] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--text-muted)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Natural Hazards</h3>
            <p className="text-xs text-[var(--text-muted)]">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const overallColor =
    ratingColors[data.overallRiskRating] || "var(--text-muted)";

  const highRiskHazards = data.hazards.filter(
    h => h.riskRating === "Very High" || h.riskRating === "Relatively High"
  );

  const summaryLine = highRiskHazards.length === 0
    ? `${data.overallRiskRating} overall natural hazard risk.`
    : `${highRiskHazards.length} elevated-risk hazard${highRiskHazards.length !== 1 ? "s" : ""} identified.`;

  const visibleHazards = showAll ? data.hazards : data.hazards.slice(0, 6);

  return (
    <div className="section-card" style={{ borderLeftColor: overallColor, borderLeftWidth: expanded ? 2 : 1 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: overallColor }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Natural Hazards</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${overallColor}12`, color: overallColor }}>
            {data.overallRiskRating}
          </span>
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

      {/* Expanded */}
      <div className={`section-content ${expanded ? "expanded" : "collapsed"}`}>
        <div className="px-5 pb-5 space-y-4">
          <p className="text-xs text-[var(--text-muted)]">
            FEMA National Risk Index{data.county ? ` · ${data.county}, ${data.state}` : ""}
          </p>

          {/* Context */}
          <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2 leading-relaxed">
            {highRiskHazards.length === 0
              ? "This county has relatively low natural hazard risk compared to other U.S. counties."
              : `Elevated risk for ${highRiskHazards.map(h => h.name.toLowerCase()).join(", ")}. A preparedness plan is recommended.`}
            {" "}Ratings are relative to other U.S. counties.
          </p>

          {data.hazards.length > 0 ? (
            <div className="space-y-1.5">
              {visibleHazards.map((h, i) => {
                const color = ratingColors[h.riskRating] || "var(--text-muted)";
                const details = HAZARD_DETAILS[h.name];
                const isExp = expandedHazard === h.name;

                return (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedHazard(isExp ? null : h.name)}
                      className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--bg-card-hover)] transition min-h-[44px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="status-dot" style={{ backgroundColor: color }} />
                        <span className="text-xs text-[var(--text-primary)]">
                          {h.name}
                        </span>
                      </div>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${color}12`, color }}
                      >
                        {h.riskRating}
                      </span>
                    </button>
                    {isExp && details && (
                      <div className="ml-3 pl-3 border-l border-[var(--border)] mb-2 space-y-1.5">
                        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{details.meaning}</p>
                        {details.preparedness.length > 0 && (
                          <div>
                            <p className="text-[10px] text-[var(--text-secondary)] font-medium mb-1">Preparedness:</p>
                            <ul className="space-y-0.5">
                              {details.preparedness.map((tip, j) => (
                                <li key={j} className="text-[10px] text-[var(--text-muted)] flex items-start gap-1.5">
                                  <span className="text-[var(--accent-dim)] shrink-0">·</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {data.hazards.length > 6 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition pl-3 min-h-[44px] flex items-center"
                >
                  Show {data.hazards.length - 6} more hazards
                </button>
              )}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-xs">
              No detailed hazard data available for this county.
            </p>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-[9px]">
            {Object.entries(ratingColors).map(([rating, color]) => (
              <div key={rating} className="flex items-center gap-1">
                <span className="status-dot" style={{ backgroundColor: color, width: 5, height: 5 }} />
                <span className="text-[var(--text-muted)]">{rating}</span>
              </div>
            ))}
          </div>

          {/* Explainer */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition flex items-center gap-1.5 min-h-[44px]"
          >
            <svg className={`w-3 h-3 transition-transform ${showExplainer ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            About the National Risk Index
          </button>
          {showExplainer && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: HAZARD_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
