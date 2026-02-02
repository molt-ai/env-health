"use client";

import { useState } from "react";
import { HealthOutcomesData } from "@/lib/types";
import { HEALTH_EXPLAINER, MEASURE_DESCRIPTIONS } from "@/lib/explainers";

interface Props {
  data: HealthOutcomesData | null;
}

export default function HealthOutcomesSection({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedMeasure, setExpandedMeasure] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!data || data.measures.length === 0) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--text-muted)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Health Outcomes</h3>
            <p className="text-xs text-[var(--text-muted)]">No CDC PLACES data available</p>
          </div>
        </div>
      </div>
    );
  }

  const aboveCount = data.measures.filter((m) => m.comparison === "above").length;
  const belowCount = data.measures.filter((m) => m.comparison === "below").length;

  const statusColor = aboveCount === 0 ? "var(--accent-green)" : aboveCount <= 3 ? "var(--accent-yellow)" : "var(--accent-red)";

  const summaryLine = aboveCount === 0
    ? "All indicators at or below national averages."
    : `${aboveCount} condition${aboveCount !== 1 ? "s" : ""} above national average.`;

  // Group by category
  const categories: Record<string, typeof data.measures> = {};
  for (const m of data.measures) {
    if (!categories[m.category]) categories[m.category] = [];
    categories[m.category].push(m);
  }

  // For collapsed view, show most concerning first
  const sortedAbove = data.measures
    .filter(m => m.comparison === "above" && m.nationalAvg !== null)
    .sort((a, b) => (b.dataValue - (b.nationalAvg || 0)) - (a.dataValue - (a.nationalAvg || 0)));

  return (
    <div className="section-card" style={{ borderLeftColor: statusColor, borderLeftWidth: expanded ? 2 : 1 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: statusColor }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Health Outcomes</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-1.5">
            {aboveCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", color: "var(--accent-red)" }}>
                {aboveCount} above
              </span>
            )}
            {belowCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(62, 207, 142, 0.08)", color: "var(--accent-green)" }}>
                {belowCount} below
              </span>
            )}
          </div>
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
            CDC PLACES — {data.source} ({data.dataYear})
          </p>

          {/* Top concerns first */}
          {sortedAbove.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Above National Average
              </h4>
              {sortedAbove.slice(0, showAll ? undefined : 5).map((m, i) => {
                const key = `above-${i}`;
                const isExp = expandedMeasure === key;
                const description = MEASURE_DESCRIPTIONS[m.measureName];
                const diff = m.nationalAvg !== null ? (m.dataValue - m.nationalAvg).toFixed(1) : null;

                return (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedMeasure(isExp ? null : key)}
                      className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-[var(--bg-card-hover)] transition min-h-[44px]"
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-xs text-[var(--text-primary)]">
                          {m.measureName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">
                            {m.dataValue}%
                          </span>
                          {diff && (
                            <span className="text-[10px] text-[var(--accent-red)]">
                              +{diff}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Inline comparison bar */}
                      {m.nationalAvg !== null && (
                        <div className="relative">
                          <div className="h-1 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((m.dataValue / Math.max(m.dataValue, m.nationalAvg) / 1.2) * 100, 100)}%`,
                                backgroundColor: "var(--accent-red)",
                                opacity: 0.6,
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-0.5">
                            <span className="text-[9px] text-[var(--text-muted)]">
                              Local: {m.dataValue}%
                            </span>
                            <span className="text-[9px] text-[var(--text-muted)]">
                              Natl: {m.nationalAvg}%
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                    {isExp && (
                      <div className="ml-3 pl-3 border-l border-[var(--border)] mb-2 space-y-1.5">
                        {description ? (
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{description}</p>
                        ) : (
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {m.dataValue}% of adults affected, compared to {m.nationalAvg !== null ? `${m.nationalAvg}% nationally` : "unknown national average"}.
                          </p>
                        )}
                        {m.nationalAvg !== null && (
                          <p className="text-[10px] text-[var(--accent-orange)]">
                            Roughly {Math.round((m.dataValue - m.nationalAvg) * 10)} more people per 1,000 affected compared to the national average.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {sortedAbove.length > 5 && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition pl-3 min-h-[44px] flex items-center"
                >
                  Show {sortedAbove.length - 5} more conditions
                </button>
              )}
            </div>
          )}

          {/* Below average — compact list */}
          {belowCount > 0 && (
            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                At or Below Average
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {data.measures
                  .filter(m => m.comparison === "below" || m.comparison === "average")
                  .slice(0, 8)
                  .map((m, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(62, 207, 142, 0.06)", color: "var(--accent-green)" }}>
                      {m.measureName} {m.dataValue}%
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Note */}
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
            These are model-based CDC estimates for {data.dataYear}, not direct measurements. Individual risk may differ from community averages.
          </p>

          {/* Explainer */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition flex items-center gap-1.5 min-h-[44px]"
          >
            <svg className={`w-3 h-3 transition-transform ${showExplainer ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            About CDC PLACES data
          </button>
          {showExplainer && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: HEALTH_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
              <p className="text-[10px] text-[var(--text-muted)] mt-2">
                These are community-level estimates. Your personal health depends on individual factors like genetics, lifestyle, occupation, and healthcare access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
