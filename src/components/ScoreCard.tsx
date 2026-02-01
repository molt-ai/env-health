"use client";

interface Props {
  grade: string;
  score: number;
  summary: string;
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

export default function ScoreCard({ grade, score, summary }: Props) {
  const color = gradeColors[grade] || "var(--text-secondary)";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
      {/* Grade Circle */}
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="var(--border)"
            strokeWidth="8"
          />
          {/* Score arc */}
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
  );
}
