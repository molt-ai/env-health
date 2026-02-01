"use client";

import { NaturalHazardsData } from "@/lib/types";

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

      {data.hazards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.hazards.map((h, i) => {
            const color = ratingColors[h.riskRating] || "var(--text-muted)";
            return (
              <div
                key={i}
                className="bg-[var(--bg-secondary)] rounded-lg px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{h.icon}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {h.name}
                  </span>
                </div>
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
    </div>
  );
}
