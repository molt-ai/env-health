"use client";

import { useState } from "react";
import { HealthOutcomesData } from "@/lib/types";
import { HEALTH_EXPLAINER, MEASURE_DESCRIPTIONS } from "@/lib/explainers";

interface Props {
  data: HealthOutcomesData | null;
}

export default function HealthOutcomesSection({ data }: Props) {
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedMeasure, setExpandedMeasure] = useState<string | null>(null);

  if (!data || data.measures.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          🏥 Health Outcomes
        </h3>
        <p className="text-[var(--text-muted)] text-sm">
          No CDC PLACES data available for this ZIP code.
        </p>
      </div>
    );
  }

  // Group by category
  const categories: Record<string, typeof data.measures> = {};
  for (const m of data.measures) {
    if (!categories[m.category]) categories[m.category] = [];
    categories[m.category].push(m);
  }

  const aboveCount = data.measures.filter((m) => m.comparison === "above").length;
  const belowCount = data.measures.filter((m) => m.comparison === "below").length;
  const totalCompared = data.measures.filter(m => m.comparison !== "unknown").length;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            🏥 Health Outcomes
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            CDC PLACES — {data.source} ({data.dataYear})
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          {aboveCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-[var(--accent-red)]15 text-[var(--accent-red)] border border-[var(--accent-red)]33">
              {aboveCount} above avg
            </span>
          )}
          {belowCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-[var(--accent-green)]15 text-[var(--accent-green)] border border-[var(--accent-green)]33">
              {belowCount} below avg
            </span>
          )}
        </div>
      </div>

      {/* Summary context */}
      <div className="mb-6 bg-[var(--bg-secondary)] rounded-xl p-4">
        <p className="text-xs text-[var(--text-muted)]">
          <strong className="text-[var(--text-secondary)]">What this means:</strong>{" "}
          {aboveCount === 0 ? (
            "All measured health indicators are at or below national averages. This suggests the community is generally healthier than typical on these measures."
          ) : aboveCount <= 3 ? (
            `${aboveCount} of ${totalCompared} measured conditions are above the national average. This is common and may reflect local demographics, economic factors, or environmental conditions.`
          ) : aboveCount <= 7 ? (
            `${aboveCount} of ${totalCompared} conditions are above national averages. This suggests elevated health burdens in this community. Proactive screening and preventive care are recommended.`
          ) : (
            `${aboveCount} of ${totalCompared} conditions exceed national averages — a significant number. This community faces notable health challenges that may be influenced by environmental, economic, and access-to-care factors.`
          )}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          📅 Data year: {data.dataYear}. These are model-based estimates from CDC, not direct measurements. Individual risk may differ from community averages.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(categories).map(([category, measures]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-[var(--accent-gold)] mb-3">
              {getCategoryIcon(category)} {category}
            </h4>
            <div className="grid gap-2">
              {measures.map((m, i) => {
                const isExpanded = expandedMeasure === `${category}-${i}`;
                const description = MEASURE_DESCRIPTIONS[m.measureName];

                return (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedMeasure(isExpanded ? null : `${category}-${i}`)}
                      className="w-full bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-left hover:bg-[var(--bg-card-hover)] transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {m.measureName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)]">
                            {m.dataValue}%
                          </span>
                          {m.comparison !== "unknown" && (
                            <span
                              className="text-xs"
                              style={{
                                color:
                                  m.comparison === "above"
                                    ? "var(--accent-red)"
                                    : m.comparison === "below"
                                    ? "var(--accent-green)"
                                    : "var(--text-muted)",
                              }}
                            >
                              {m.comparison === "above"
                                ? "▲"
                                : m.comparison === "below"
                                ? "▼"
                                : "●"}{" "}
                              {m.comparison === "average" ? "avg" : m.comparison}
                            </span>
                          )}
                          <span className="text-[var(--text-muted)] text-xs ml-1">
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      {/* Bar comparison */}
                      {m.nationalAvg !== null && (
                        <div className="relative">
                          <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((m.dataValue / Math.max(m.dataValue, m.nationalAvg) / 1.2) * 100, 100)}%`,
                                backgroundColor:
                                  m.comparison === "above"
                                    ? "var(--accent-red)"
                                    : m.comparison === "below"
                                    ? "var(--accent-green)"
                                    : "var(--accent-yellow)",
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-[var(--text-muted)]">
                              Local: {m.dataValue}%
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              National avg: {m.nationalAvg}%
                            </span>
                          </div>
                        </div>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-2 border-[var(--accent-gold-dim)] text-sm space-y-2">
                        {description ? (
                          <p className="text-xs text-[var(--text-muted)]">{description}</p>
                        ) : (
                          <p className="text-xs text-[var(--text-muted)]">
                            {m.measureName}: {m.dataValue}% of adults in this area are affected, compared to {m.nationalAvg !== null ? `${m.nationalAvg}% nationally` : "unknown national average"}.
                          </p>
                        )}
                        {m.comparison === "above" && m.nationalAvg !== null && (
                          <p className="text-xs text-[var(--accent-orange)]">
                            ⚠ The local rate ({m.dataValue}%) is {(m.dataValue - m.nationalAvg).toFixed(1)} percentage points above the national average ({m.nationalAvg}%). 
                            This means roughly {Math.round((m.dataValue - m.nationalAvg) * 10)} more people per 1,000 are affected compared to a typical U.S. community.
                          </p>
                        )}
                        {m.comparison === "below" && m.nationalAvg !== null && (
                          <p className="text-xs text-[var(--accent-green)]">
                            ✓ The local rate ({m.dataValue}%) is {(m.nationalAvg - m.dataValue).toFixed(1)} percentage points below the national average ({m.nationalAvg}%). This is a positive indicator.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Explainer */}
      <button
        onClick={() => setShowExplainer(!showExplainer)}
        className="mt-6 text-xs text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)] transition flex items-center gap-1"
      >
        {showExplainer ? "▼ Hide" : "▶ About CDC PLACES data"}
      </button>
      {showExplainer && (
        <div className="mt-3 bg-[var(--bg-secondary)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
          <p dangerouslySetInnerHTML={{ __html: HEALTH_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
          <p className="text-xs text-[var(--text-muted)] mt-2">
            <strong>Important:</strong> These are community-level estimates. Your personal health depends on individual factors like genetics, lifestyle, occupation, and healthcare access. Use this data to be more aware and proactive, not to predict your own health.
          </p>
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Cardiovascular: "❤️",
    Respiratory: "🫁",
    "Chronic Disease": "🔬",
    "Mental Health": "🧠",
    "Risk Behavior": "⚠️",
    Prevention: "🛡️",
    "Health Outcomes": "📊",
    Disability: "♿",
    Other: "📊",
  };
  return icons[category] || "📊";
}
