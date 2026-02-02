"use client";

import { Recommendation } from "@/lib/explainers";

interface Props {
  recommendations: Recommendation[];
}

const priorityStyles = {
  high: {
    border: "border-[var(--accent-red)]40",
    bg: "bg-[var(--accent-red)]05",
    badge: "bg-[var(--accent-red)]15 text-[var(--accent-red)] border-[var(--accent-red)]33",
    label: "High Priority",
  },
  medium: {
    border: "border-[var(--accent-yellow)]40",
    bg: "bg-[var(--accent-yellow)]05",
    badge: "bg-[var(--accent-yellow)]15 text-[var(--accent-yellow)] border-[var(--accent-yellow)]33",
    label: "Recommended",
  },
  low: {
    border: "border-[var(--border)]",
    bg: "",
    badge: "bg-[var(--accent-blue)]15 text-[var(--accent-blue)] border-[var(--accent-blue)]33",
    label: "Good to Know",
  },
};

export default function RecommendationsSection({ recommendations }: Props) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          ✅ Recommendations
        </h3>
        <div className="flex items-center gap-3 bg-[var(--accent-green)]10 rounded-lg px-4 py-3">
          <span className="text-2xl">🎉</span>
          <p className="text-sm text-[var(--accent-green)]">
            No specific concerns identified. This location has good environmental health indicators across all categories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          📋 Actionable Recommendations
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Based on the environmental data for this location
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => {
          const style = priorityStyles[rec.priority];
          return (
            <div
              key={i}
              className={`rounded-xl border ${style.border} p-5`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rec.icon}</span>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {rec.title}
                    </h4>
                    <span className="text-xs text-[var(--text-muted)]">{rec.category}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${style.badge}`}>
                  {style.label}
                </span>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4">
                {rec.description}
              </p>

              <div className="space-y-2">
                {rec.actions.map((action, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm">
                    <span className="text-[var(--accent-gold)] shrink-0 mt-0.5">→</span>
                    <span
                      className="text-[var(--text-secondary)]"
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
      </div>
    </div>
  );
}
