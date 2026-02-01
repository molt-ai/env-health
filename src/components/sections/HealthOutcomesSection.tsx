"use client";

import { HealthOutcomesData } from "@/lib/types";

interface Props {
  data: HealthOutcomesData | null;
}

export default function HealthOutcomesSection({ data }: Props) {
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

      <div className="space-y-6">
        {Object.entries(categories).map(([category, measures]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-[var(--accent-gold)] mb-3">
              {getCategoryIcon(category)} {category}
            </h4>
            <div className="grid gap-2">
              {measures.map((m, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-secondary)] rounded-lg px-4 py-3"
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
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
    Other: "📊",
  };
  return icons[category] || "📊";
}
