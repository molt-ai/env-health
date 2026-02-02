"use client";

import { useState } from "react";
import { Recommendation } from "@/lib/explainers";

interface Props {
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: {
    color: "var(--accent-red)",
    bgColor: "rgba(239, 68, 68, 0.06)",
    label: "High Priority",
  },
  medium: {
    color: "var(--accent-yellow)",
    bgColor: "rgba(234, 179, 8, 0.06)",
    label: "Recommended",
  },
  low: {
    color: "var(--accent-blue)",
    bgColor: "rgba(96, 165, 250, 0.06)",
    label: "Good to Know",
  },
};

export default function RecommendationsSection({ recommendations }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (recommendations.length === 0) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--accent-green)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recommendations</h3>
            <p className="text-xs text-[var(--text-muted)]">No specific concerns identified. Good environmental health indicators.</p>
          </div>
        </div>
      </div>
    );
  }

  const highCount = recommendations.filter(r => r.priority === "high").length;
  const summaryLine = highCount > 0
    ? `${highCount} high-priority action${highCount !== 1 ? "s" : ""} recommended.`
    : `${recommendations.length} suggestion${recommendations.length !== 1 ? "s" : ""} based on local conditions.`;

  const visibleRecs = showAll ? recommendations : recommendations.slice(0, 3);

  return (
    <div className="section-card" style={{ borderLeftColor: "var(--accent)", borderLeftWidth: expanded ? 2 : 1 }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left min-h-[56px]"
      >
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--accent)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recommendations</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            {recommendations.length}
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
        <div className="px-5 pb-5 space-y-3">
          {visibleRecs.map((rec, i) => {
            const config = priorityConfig[rec.priority];

            return (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{ backgroundColor: config.bgColor }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                    {rec.title}
                  </h4>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                  {rec.description}
                </p>

                <div className="space-y-1.5">
                  {rec.actions.slice(0, 3).map((action, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <span className="text-[var(--accent-dim)] shrink-0 mt-0.5">→</span>
                      <span
                        className="text-[var(--text-secondary)] leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: action.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>'),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {recommendations.length > 3 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition min-h-[44px] flex items-center"
            >
              Show {recommendations.length - 3} more recommendations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
