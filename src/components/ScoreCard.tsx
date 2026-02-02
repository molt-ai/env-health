"use client";

import { CategoryScore } from "@/lib/types";

interface Props {
  grade: string;
  score: number;
  summary: string;
  categoryScores: CategoryScore[];
  onCategoryClick?: (name: string) => void;
}

const gradeColors: Record<string, string> = {
  A: "var(--accent-green)",
  "B+": "#3ecf8e",
  B: "var(--accent-blue)",
  "C+": "var(--accent-yellow)",
  C: "var(--accent-orange)",
  D: "var(--accent-red)",
  F: "#dc2626",
};

function getStatusWord(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

function getStatusColor(score: number): string {
  if (score >= 80) return "var(--accent-green)";
  if (score >= 60) return "var(--accent-yellow)";
  if (score >= 40) return "var(--accent-orange)";
  return "var(--accent-red)";
}

export default function ScoreCard({ grade, score, summary, categoryScores, onCategoryClick }: Props) {
  const color = gradeColors[grade] || "var(--text-secondary)";

  return (
    <div className="glass-card-solid p-6 sm:p-8">
      {/* Grade + Summary */}
      <div className="flex flex-col items-center text-center mb-8">
        {/* Grade Circle — large and prominent */}
        <div className="relative mb-5">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="4"
            />
            <circle
              cx="80"
              cy="80"
              r="68"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 427} 427`}
              transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dasharray 1s ease-out" }}
              opacity={0.8}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tracking-tight" style={{ color }}>
              {grade}
            </span>
            <span className="text-sm text-[var(--text-muted)] mt-0.5">{score}/100</span>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] max-w-lg text-sm leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Category Pills */}
      {categoryScores.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {categoryScores.map((cat, i) => {
            const statusWord = getStatusWord(cat.score);
            const statusColor = getStatusColor(cat.score);

            return (
              <button
                key={i}
                onClick={() => onCategoryClick?.(cat.name)}
                className="category-pill flex-col items-center text-center py-3 sm:py-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="status-dot"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {cat.name}
                  </span>
                </div>
                <div className="w-full">
                  <div className="inline-bar w-full">
                    <div
                      className="inline-bar-fill"
                      style={{
                        width: `${cat.score}%`,
                        backgroundColor: statusColor,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-1.5">
                  <span className="text-xs font-semibold" style={{ color: statusColor }}>
                    {cat.score}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {statusWord}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
