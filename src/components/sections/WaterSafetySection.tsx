"use client";

import { WaterSafetyData } from "@/lib/types";

interface Props {
  data: WaterSafetyData | null;
}

export default function WaterSafetySection({ data }: Props) {
  if (!data) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          💧 Water Safety
        </h3>
        <p className="text-[var(--text-muted)] text-sm">
          Unable to fetch water safety data.
        </p>
      </div>
    );
  }

  const isClean = data.totalViolations === 0;
  const statusColor = isClean ? "var(--accent-green)" : data.totalViolations > 10 ? "var(--accent-red)" : "var(--accent-yellow)";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            💧 Water Safety
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            EPA Safe Drinking Water Information System (SDWIS)
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-center"
          style={{ backgroundColor: `${statusColor}15`, border: `1px solid ${statusColor}33` }}
        >
          <span className="text-2xl font-bold block" style={{ color: statusColor }}>
            {data.totalViolations}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">violations</span>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {data.summary}
      </p>

      {data.violations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            Recent Violations
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data.violations.slice(0, 10).map((v, i) => (
              <div
                key={i}
                className="bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">
                      {v.contaminantName}
                    </span>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {v.pwsName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs px-2 py-1 rounded bg-[var(--accent-red)]15 text-[var(--accent-red)] border border-[var(--accent-red)]33">
                      {v.violationType}
                    </span>
                  </div>
                </div>
                {v.compliancePeriod && v.compliancePeriod !== "N/A" && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    📅 {v.compliancePeriod}
                  </p>
                )}
                {v.enforcementAction && (
                  <p className="text-xs text-[var(--accent-orange)] mt-1">
                    ⚠️ Enforcement: {v.enforcementAction}
                  </p>
                )}
              </div>
            ))}
          </div>
          {data.violations.length > 10 && (
            <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
              Showing 10 of {data.totalViolations} violations
            </p>
          )}
        </div>
      )}

      {isClean && (
        <div className="flex items-center gap-3 bg-[var(--accent-green)]10 rounded-lg px-4 py-3">
          <span className="text-2xl">✅</span>
          <p className="text-sm text-[var(--accent-green)]">
            No drinking water violations on record for this ZIP code.
          </p>
        </div>
      )}
    </div>
  );
}
