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
  const [expanded, setExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedViolation, setExpandedViolation] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--text-muted)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Water Safety</h3>
            <p className="text-xs text-[var(--text-muted)]">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const isClean = data.totalViolations === 0;
  const statusColor = isClean ? "var(--accent-green)" : data.totalViolations > 10 ? "var(--accent-red)" : "var(--accent-yellow)";
  const summaryLine = isClean
    ? "No violations on record — water meets EPA standards."
    : `${data.totalViolations} violation${data.totalViolations !== 1 ? "s" : ""} found in drinking water records.`;

  // Timeline info
  const violationDates = data.violations
    .map(v => v.compliancePeriod)
    .filter(d => d && d !== "N/A")
    .map(d => new Date(d))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  const now = new Date();
  const recentViolations = violationDates.filter(d => (now.getTime() - d.getTime()) < 3 * 365 * 24 * 60 * 60 * 1000).length;

  // Severity counts
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

  const visibleViolations = showAll ? data.violations : data.violations.slice(0, 5);

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
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Water Safety</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold" style={{ color: statusColor }}>
            {data.totalViolations}
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
        <div className="px-5 pb-5 space-y-4">
          <p className="text-xs text-[var(--text-muted)]">
            EPA Safe Drinking Water Information System (SDWIS)
          </p>

          {isClean ? (
            <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(62, 207, 142, 0.06)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <p className="text-xs text-[var(--accent-green)] font-medium">
                  No drinking water violations on record for this ZIP code.
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  Local water systems have consistently met EPA standards.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Severity pills */}
              <div className="flex flex-wrap gap-2">
                {severityCounts.high > 0 && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", color: "var(--accent-red)" }}>
                    {severityCounts.high} health-based (MCL)
                  </span>
                )}
                {severityCounts.medium > 0 && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(234, 179, 8, 0.08)", color: "var(--accent-yellow)" }}>
                    {severityCounts.medium} treatment technique
                  </span>
                )}
                {severityCounts.low > 0 && (
                  <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(96, 165, 250, 0.08)", color: "var(--accent-blue)" }}>
                    {severityCounts.low} monitoring/reporting
                  </span>
                )}
              </div>

              {/* Timeline context */}
              {recentViolations === 0 && data.totalViolations > 0 && (
                <p className="text-xs text-[var(--accent-green)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
                  All violations are older than 3 years — the water system appears to have resolved these issues.
                </p>
              )}
              {recentViolations > 0 && (
                <p className="text-xs text-[var(--accent-orange)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
                  {recentViolations} violation{recentViolations !== 1 ? "s" : ""} occurred in the last 3 years.
                </p>
              )}

              {/* Violations list */}
              {data.violations.length > 0 && (
                <div className="space-y-1.5">
                  {visibleViolations.map((v, i) => {
                    const typeInfo = VIOLATION_TYPE_INFO[v.violationType];
                    const healthInfo = CONTAMINANT_HEALTH[v.contaminantName];
                    const isExp = expandedViolation === i;

                    return (
                      <div key={i}>
                        <button
                          onClick={() => setExpandedViolation(isExp ? null : i)}
                          className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-[var(--bg-card-hover)] transition min-h-[44px]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <span className="text-xs font-medium text-[var(--text-primary)]">
                                {v.contaminantName}
                              </span>
                              {v.compliancePeriod && v.compliancePeriod !== "N/A" && (
                                <span className="text-[10px] text-[var(--text-muted)] ml-2">
                                  {v.compliancePeriod}
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: typeInfo?.severity === "high" ? "rgba(239,68,68,0.08)" : typeInfo?.severity === "medium" ? "rgba(234,179,8,0.08)" : "rgba(96,165,250,0.08)",
                                color: typeInfo?.severity === "high" ? "var(--accent-red)" : typeInfo?.severity === "medium" ? "var(--accent-yellow)" : "var(--accent-blue)",
                              }}
                            >
                              {v.violationType}
                            </span>
                          </div>
                        </button>
                        {isExp && (
                          <div className="ml-3 pl-3 border-l border-[var(--border)] mb-2 space-y-1.5">
                            <p className="text-[10px] text-[var(--text-muted)]">{v.pwsName}</p>
                            {typeInfo && (
                              <p className="text-[10px] text-[var(--text-muted)]">{typeInfo.meaning}</p>
                            )}
                            {healthInfo && (
                              <p className="text-[10px] text-[var(--text-secondary)]">{healthInfo}</p>
                            )}
                            {v.enforcementAction && (
                              <p className="text-[10px] text-[var(--accent-orange)]">
                                Enforcement: {v.enforcementAction}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {data.violations.length > 5 && !showAll && (
                    <button
                      onClick={() => setShowAll(true)}
                      className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition pl-3 min-h-[44px] flex items-center"
                    >
                      Show {data.violations.length - 5} more violations
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Explainer */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition flex items-center gap-1.5 min-h-[44px]"
          >
            <svg className={`w-3 h-3 transition-transform ${showExplainer ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            Understanding water violations
          </button>
          {showExplainer && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: WATER_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
              <div className="mt-3 space-y-1.5">
                {[
                  { key: "MCL", label: "MCL", color: "var(--accent-red)" },
                  { key: "TT", label: "Treatment Technique", color: "var(--accent-yellow)" },
                  { key: "MR", label: "Monitoring & Reporting", color: "var(--accent-blue)" },
                ].map(({ key, label, color }) => {
                  const info = VIOLATION_TYPE_INFO[key];
                  return info ? (
                    <div key={key} className="flex items-start gap-2">
                      <span className="status-dot mt-1" style={{ backgroundColor: color }} />
                      <div>
                        <span className="text-[var(--text-primary)] font-medium">{label}</span>
                        <p className="text-[10px] text-[var(--text-muted)]">{info.meaning}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
