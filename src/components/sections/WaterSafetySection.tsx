"use client";

import { useState } from "react";
import { WaterSafetyData } from "@/lib/types";
import {
  WATER_EXPLAINER,
  VIOLATION_TYPE_INFO,
  CONTAMINANT_HEALTH,
} from "@/lib/explainers";

interface Props {
  data: WaterSafetyData | null;
}

export default function WaterSafetySection({ data }: Props) {
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedViolation, setExpandedViolation] = useState<number | null>(null);

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

  // Build timeline info
  const violationDates = data.violations
    .map(v => v.compliancePeriod)
    .filter(d => d && d !== "N/A")
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  const newestViolation = violationDates.length > 0 ? violationDates[0] : null;
  const oldestViolation = violationDates.length > 0 ? violationDates[violationDates.length - 1] : null;
  const now = new Date();
  const recentViolations = violationDates.filter(d => (now.getTime() - d.getTime()) < 3 * 365 * 24 * 60 * 60 * 1000).length;
  const historicalViolations = data.totalViolations - recentViolations;

  // Count by violation type for context
  const typeCounts: Record<string, number> = {};
  for (const v of data.violations) {
    const type = v.violationType || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  const severityCounts = { high: 0, medium: 0, low: 0 };
  for (const [type, count] of Object.entries(typeCounts)) {
    const info = VIOLATION_TYPE_INFO[type];
    if (info) {
      severityCounts[info.severity as keyof typeof severityCounts] += count;
    }
  }

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

      {/* Timeline context */}
      {data.totalViolations > 0 && violationDates.length > 0 && (
        <div className="mb-6 bg-[var(--bg-secondary)] rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)]">📅 Historical Context</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">{recentViolations}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Last 3 years</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--text-primary)]">{historicalViolations}</p>
              <p className="text-[10px] text-[var(--text-muted)]">Older</p>
            </div>
            {newestViolation && (
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{newestViolation.toLocaleDateString()}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Most recent</p>
              </div>
            )}
            {oldestViolation && (
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{oldestViolation.toLocaleDateString()}</p>
                <p className="text-[10px] text-[var(--text-muted)]">Oldest</p>
              </div>
            )}
          </div>
          
          {recentViolations === 0 && data.totalViolations > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-[var(--accent-green)]">✓</span>
              <p className="text-[var(--accent-green)] text-xs">
                Good news: All violations are older than 3 years. The water system appears to have resolved these issues.
              </p>
            </div>
          )}
          {recentViolations > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="text-[var(--accent-orange)]">⚠</span>
              <p className="text-[var(--accent-orange)] text-xs">
                {recentViolations} violation(s) occurred in the last 3 years — these may still be relevant.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Violation severity breakdown */}
      {data.totalViolations > 0 && (severityCounts.high > 0 || severityCounts.medium > 0 || severityCounts.low > 0) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {severityCounts.high > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent-red)]15 text-[var(--accent-red)] border border-[var(--accent-red)]33">
              🔴 {severityCounts.high} health-based (MCL)
            </span>
          )}
          {severityCounts.medium > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent-yellow)]15 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]33">
              🟡 {severityCounts.medium} treatment technique
            </span>
          )}
          {severityCounts.low > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent-blue)]15 text-[var(--accent-blue)] border border-[var(--accent-blue)]33">
              🔵 {severityCounts.low} monitoring/reporting
            </span>
          )}
        </div>
      )}

      {data.violations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            Violations
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.violations.slice(0, 10).map((v, i) => {
              const typeInfo = VIOLATION_TYPE_INFO[v.violationType];
              const healthInfo = CONTAMINANT_HEALTH[v.contaminantName];
              const isExpanded = expandedViolation === i;

              return (
                <div key={i}>
                  <button
                    onClick={() => setExpandedViolation(isExpanded ? null : i)}
                    className="w-full bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm text-left hover:bg-[var(--bg-card-hover)] transition"
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
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: typeInfo?.severity === "high" ? "var(--accent-red)15" : typeInfo?.severity === "medium" ? "var(--accent-yellow)15" : "var(--accent-blue)15",
                            color: typeInfo?.severity === "high" ? "var(--accent-red)" : typeInfo?.severity === "medium" ? "var(--accent-yellow)" : "var(--accent-blue)",
                          }}
                        >
                          {v.violationType}
                        </span>
                        <span className="text-[var(--text-muted)] text-xs">
                          {isExpanded ? "▲" : "▼"}
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
                        ⚠️ {v.enforcementAction}
                      </p>
                    )}
                  </button>
                  {isExpanded && (
                    <div className="mt-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-2 border-[var(--accent-gold-dim)] text-sm space-y-2">
                      {typeInfo && (
                        <div>
                          <p className="text-xs font-medium text-[var(--accent-gold)]">Violation Type: {typeInfo.name}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{typeInfo.meaning}</p>
                        </div>
                      )}
                      {healthInfo && (
                        <div>
                          <p className="text-xs font-medium text-[var(--accent-gold)]">Health Impact of {v.contaminantName}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{healthInfo}</p>
                        </div>
                      )}
                      {!healthInfo && !v.contaminantName.includes("No contaminant") && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Health info not available for this specific contaminant. Check EPA.gov for details.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
          <div>
            <p className="text-sm text-[var(--accent-green)] font-medium">
              No drinking water violations on record for this ZIP code.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              This means the local water systems have consistently met EPA standards. Your tap water is considered safe based on available records.
            </p>
          </div>
        </div>
      )}

      {/* Explainer */}
      <button
        onClick={() => setShowExplainer(!showExplainer)}
        className="mt-6 text-xs text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)] transition flex items-center gap-1"
      >
        {showExplainer ? "▼ Hide" : "▶ Understanding water violations"}
      </button>
      {showExplainer && (
        <div className="mt-3 bg-[var(--bg-secondary)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
          <p dangerouslySetInnerHTML={{ __html: WATER_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
          <div className="mt-4 space-y-2">
            <p className="font-medium text-[var(--text-primary)]">Types of violations:</p>
            {[
              { key: "MCL", label: "MCL", color: "var(--accent-red)" },
              { key: "TT", label: "Treatment Technique", color: "var(--accent-yellow)" },
              { key: "MR", label: "Monitoring & Reporting", color: "var(--accent-blue)" },
            ].map(({ key, label, color }) => {
              const info = VIOLATION_TYPE_INFO[key];
              return info ? (
                <div key={key} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <span className="text-[var(--text-primary)] font-medium">{label}</span>
                    <p className="text-xs text-[var(--text-muted)]">{info.meaning}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
