"use client";

import { CategoryScore } from "@/lib/types";
import { useEffect, useState } from "react";

interface Props {
  grade: string;
  score: number;
  summary: string;
  categoryScores: CategoryScore[];
  onCategoryClick?: (name: string) => void;
}

const gradeColors: Record<string, string> = {
  A: "#34d399",
  "A+": "#34d399",
  "B+": "#34d399",
  B: "#60a5fa",
  "B-": "#60a5fa",
  "C+": "#fbbf24",
  C: "#fbbf24",
  "C-": "#fb923c",
  D: "#f87171",
  "D+": "#fb923c",
  "D-": "#f87171",
  F: "#ef4444",
};

function getStatusWord(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Poor";
  return "Critical";
}

function getStatusColor(score: number): string {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

export default function ScoreCard({ grade, score, summary, categoryScores, onCategoryClick }: Props) {
  const color = gradeColors[grade] || "var(--text-secondary)";
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Animate the score number
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [score]);

  const circumference = 2 * Math.PI * 68; // radius = 68
  const dashArray = mounted ? `${(score / 100) * circumference} ${circumference}` : `0 ${circumference}`;

  return (
    <div className="score-card-glow glass-card-solid p-6 sm:p-8 relative">
      {/* Grade + Summary */}
      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        {/* Grade Circle */}
        <div className="relative mb-6 animate-scale-in">
          <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-lg">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r="68"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="5"
            />
            {/* Animated score ring */}
            <circle
              cx="90"
              cy="90"
              r="68"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={dashArray}
              transform="rotate(-90 90 90)"
              style={{
                transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: `drop-shadow(0 0 8px ${color}40)`,
              }}
            />
            {/* Inner glow circle */}
            <circle
              cx="90"
              cy="90"
              r="56"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.15"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-[3.5rem] font-bold tracking-tighter leading-none"
              style={{ color, textShadow: `0 0 40px ${color}30` }}
            >
              {grade}
            </span>
            <span className="text-base font-medium text-[var(--text-muted)] mt-1 tabular-nums">
              {animatedScore}<span className="text-[var(--text-muted)] opacity-50">/100</span>
            </span>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] max-w-lg text-sm leading-relaxed relative z-10">
          {summary}
        </p>
      </div>

      {/* Category Pills */}
      {categoryScores.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 relative z-10">
          {categoryScores.map((cat, i) => {
            const statusWord = getStatusWord(cat.score);
            const statusColor = getStatusColor(cat.score);

            return (
              <button
                key={i}
                onClick={() => onCategoryClick?.(cat.name)}
                className="category-pill flex-col items-center text-center py-3.5 sm:py-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="status-dot"
                    style={{
                      backgroundColor: statusColor,
                      boxShadow: `0 0 6px ${statusColor}40`,
                    }}
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
                        width: mounted ? `${cat.score}%` : '0%',
                        backgroundColor: statusColor,
                        boxShadow: `0 0 4px ${statusColor}30`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full mt-2">
                  <span className="text-xs font-semibold tabular-nums" style={{ color: statusColor }}>
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
