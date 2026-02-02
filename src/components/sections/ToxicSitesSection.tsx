"use client";

import { useState } from "react";
import { ToxicSitesData } from "@/lib/types";
import { TRI_EXPLAINER, TRI_PROXIMITY_INFO, INDUSTRY_CHEMICAL_INFO } from "@/lib/explainers";

interface Props {
  data: ToxicSitesData | null;
}

export default function ToxicSitesSection({ data }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedFacility, setExpandedFacility] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return (
      <div className="section-card p-5">
        <div className="flex items-center gap-3">
          <span className="status-dot" style={{ backgroundColor: "var(--text-muted)" }} />
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Toxic Release Sites</h3>
            <p className="text-xs text-[var(--text-muted)]">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const isClean = data.totalFacilities === 0;
  const statusColor = isClean
    ? "var(--accent-green)"
    : data.totalFacilities > 5
    ? "var(--accent-red)"
    : "var(--accent-yellow)";

  const summaryLine = isClean
    ? "No TRI-reporting facilities found in this ZIP code."
    : `${data.totalFacilities} TRI-reporting facilit${data.totalFacilities === 1 ? "y" : "ies"} in this area.`;

  // Group by industry
  const industryCounts: Record<string, number> = {};
  for (const f of data.facilities) {
    const ind = f.industry || "Unknown";
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  }

  const visibleFacilities = showAll ? data.facilities : data.facilities.slice(0, 5);

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
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Toxic Release Sites</h3>
            <p className="text-xs text-[var(--text-muted)]">{summaryLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold" style={{ color: statusColor }}>
            {data.totalFacilities}
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
            EPA Toxics Release Inventory (TRI)
          </p>

          {isClean ? (
            <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(62, 207, 142, 0.06)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <p className="text-xs text-[var(--accent-green)] font-medium">
                  No TRI-reporting facilities found in this ZIP code.
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  No facilities report toxic chemical releases above EPA thresholds.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Context */}
              <p className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2 leading-relaxed">
                These facilities are required by law to report toxic chemical releases. Being on this list doesn&apos;t necessarily mean they&apos;re hazardous — it depends on what they release and how close you are.
              </p>

              {/* Industry breakdown — compact */}
              {Object.keys(industryCounts).length > 1 && (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(industryCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([industry, count]) => (
                      <span
                        key={industry}
                        className="text-[10px] px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(167, 139, 250, 0.06)", color: "var(--accent-purple)" }}
                      >
                        {industry}: {count}
                      </span>
                    ))}
                </div>
              )}

              {/* Facilities list */}
              <div className="space-y-1.5">
                {visibleFacilities.map((f, i) => {
                  const isExp = expandedFacility === i;
                  const chemInfo = INDUSTRY_CHEMICAL_INFO[f.industry] || null;

                  return (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedFacility(isExp ? null : i)}
                        className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-[var(--bg-card-hover)] transition min-h-[44px]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-medium text-[var(--text-primary)]">
                              {f.facilityName}
                            </span>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              {f.streetAddress}{f.city ? `, ${f.city}` : ""}
                            </p>
                          </div>
                          {f.industry && f.industry !== "Unknown" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "rgba(167,139,250,0.06)", color: "var(--accent-purple)" }}>
                              {f.industry}
                            </span>
                          )}
                        </div>
                      </button>
                      {isExp && (
                        <div className="ml-3 pl-3 border-l border-[var(--border)] mb-2 space-y-1.5">
                          {chemInfo && (
                            <p className="text-[10px] text-[var(--text-muted)]">
                              <span className="text-[var(--text-secondary)]">Typical chemicals:</span> {chemInfo}
                            </p>
                          )}
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {f.streetAddress}{f.city ? `, ${f.city}` : ""}{f.state ? `, ${f.state}` : ""} {f.zip}
                          </p>
                          {f.latitude && f.longitude && (
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {data.facilities.length > 5 && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition pl-3 min-h-[44px] flex items-center"
                  >
                    Show {data.facilities.length - 5} more facilities
                  </button>
                )}
              </div>
            </>
          )}

          {/* Explainer */}
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="text-xs text-[var(--accent-dim)] hover:text-[var(--accent)] transition flex items-center gap-1.5 min-h-[44px]"
          >
            <svg className={`w-3 h-3 transition-transform ${showExplainer ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            Understanding toxic release sites
          </button>
          {showExplainer && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: TRI_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
              <div className="mt-3 space-y-1.5">
                <p className="text-[var(--text-primary)] font-medium">Proximity & Risk:</p>
                {TRI_PROXIMITY_INFO.map((info, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-[var(--accent-dim)] shrink-0 w-16">{info.distance}</span>
                    <p className="text-[10px] text-[var(--text-muted)]">{info.risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
