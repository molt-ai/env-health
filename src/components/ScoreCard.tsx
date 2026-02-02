"use client";

import { CategoryScore } from "@/lib/types";

interface Props {
  grade: string;
  score: number;
  summary: string;
  categoryScores: CategoryScore[];
}

const gradeColors: Record<string, string> = {
  A: "var(--accent-green)",
  "B+": "#5ab88e",
  B: "var(--accent-blue)",
  "C+": "var(--accent-yellow)",
  C: "var(--accent-orange)",
  D: "var(--accent-red)",
  F: "#c43a3a",
};

export default function ScoreCard({ grade, score, summary, categoryScores }: Props) {
  const color = gradeColors[grade] || "var(--text-secondary)";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Grade Circle */}
        <div className="relative shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 377} 377`}
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dasharray 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color }}>
              {grade}
            </span>
            <span className="text-sm text-[var(--text-muted)]">{score}/100</span>
          </div>
        </div>

        {/* Summary */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Overall Environmental Health
          </h3>
          <p className="text-[var(--text-secondary)]">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: color, color }}>
              Score: {score}/100
            </span>
            <span className="px-3 py-1 rounded-full text-xs border border-[var(--border)] text-[var(--text-muted)]">
              Grade: {grade}
            </span>
          </div>
        </div>
      </div>

      {/* Category Score Breakdown */}
      {categoryScores.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
            Score Breakdown
          </h4>
          <div className="space-y-4">
            {categoryScores.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: cat.color }}>
                      {cat.score}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">/100</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2.5 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${cat.score}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  {cat.detail}
                </p>
              </div>
            ))}
          </div>

          {/* What's dragging the score down */}
          {categoryScores.some(c => c.score < 60) && (
            <div className="mt-6 bg-[var(--bg-secondary)] rounded-xl p-4">
              <p className="text-xs font-medium text-[var(--accent-orange)] mb-2">
                ⚠ Areas of Concern
              </p>
              <div className="space-y-1">
                {categoryScores
                  .filter(c => c.score < 60)
                  .sort((a, b) => a.score - b.score)
                  .map((cat, i) => (
                    <p key={i} className="text-xs text-[var(--text-muted)]">
                      {cat.icon} <strong className="text-[var(--text-secondary)]">{cat.name}</strong> ({cat.score}/100): {cat.detail}
                    </p>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
