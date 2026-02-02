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
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedHazard, setExpandedHazard] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          🌪️ Natural Hazards
        </h3>
        <p className="text-[var(--text-muted)] text-sm">
          Unable to fetch natural hazard data.
        </p>
      </div>
    );
  }

  const overallColor =
    ratingColors[data.overallRiskRating] || "var(--text-muted)";

  const highRiskHazards = data.hazards.filter(
    h => h.riskRating === "Very High" || h.riskRating === "Relatively High"
  );

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            🌪️ Natural Hazards
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            FEMA National Risk Index
            {data.county ? ` • ${data.county}, ${data.state}` : ""}
          </p>
        </div>
        {data.overallRiskScore !== null && (
          <div
            className="px-4 py-2 rounded-xl text-center"
            style={{
              backgroundColor: `${overallColor}15`,
              border: `1px solid ${overallColor}33`,
            }}
          >
            <span
              className="text-lg font-bold block"
              style={{ color: overallColor }}
            >
              {data.overallRiskRating}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              overall risk
            </span>
          </div>
        )}
      </div>

      {/* Summary context */}
      {data.hazards.length > 0 && (
        <div className="mb-6 bg-[var(--bg-secondary)] rounded-xl p-4">
          <p className="text-xs text-[var(--text-muted)]">
            <strong className="text-[var(--text-secondary)]">What this means:</strong>{" "}
            {highRiskHazards.length === 0 ? (
              "This county has relatively low natural hazard risk compared to other U.S. counties. Basic emergency preparedness is still recommended."
            ) : highRiskHazards.length <= 2 ? (
              `This county has elevated risk for ${highRiskHazards.map(h => h.name.toLowerCase()).join(" and ")}. Being prepared for these specific hazards is important.`
            ) : (
              `This county faces elevated risk for ${highRiskHazards.length} hazard types. A comprehensive emergency plan is strongly recommended.`
            )}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Risk ratings are relative to other U.S. counties. &quot;Very High&quot; means this county is in the top tier nationally for that hazard — not that a disaster is imminent.
          </p>
        </div>
      )}

      {data.hazards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.hazards.map((h, i) => {
            const color = ratingColors[h.riskRating] || "var(--text-muted)";
            const details = HAZARD_DETAILS[h.name];
            const isExpanded = expandedHazard === h.name;

            return (
              <div key={i}>
                <button
                  onClick={() => setExpandedHazard(isExpanded ? null : h.name)}
                  className="w-full bg-[var(--bg-secondary)] rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{h.icon}</span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {h.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {h.riskRating}
                    </span>
                    <span className="text-[var(--text-muted)] text-xs">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </button>
                {isExpanded && details && (
                  <div className="mt-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-2 border-[var(--accent-gold-dim)] text-sm space-y-2">
                    <p className="text-xs text-[var(--text-muted)]">{details.meaning}</p>
                    {details.preparedness.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-[var(--accent-gold)] mt-2">Preparedness tips:</p>
                        <ul className="mt-1 space-y-1">
                          {details.preparedness.map((tip, j) => (
                            <li key={j} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                              <span className="text-[var(--accent-gold)] shrink-0">•</span>
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
        </div>
      ) : (
        <p className="text-[var(--text-muted)] text-sm">
          No detailed hazard data available for this county. FEMA National Risk
          Index data may not cover all areas.
        </p>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3 text-[10px]">
        {Object.entries(ratingColors).map(([rating, color]) => (
          <div key={rating} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[var(--text-muted)]">{rating}</span>
          </div>
        ))}
      </div>

      {/* Explainer */}
      <button
        onClick={() => setShowExplainer(!showExplainer)}
        className="mt-4 text-xs text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)] transition flex items-center gap-1"
      >
        {showExplainer ? "▼ Hide" : "▶ About the National Risk Index"}
      </button>
      {showExplainer && (
        <div className="mt-3 bg-[var(--bg-secondary)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
          <p dangerouslySetInnerHTML={{ __html: HAZARD_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
        </div>
      )}
    </div>
  );
}
