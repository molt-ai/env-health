"use client";

import { useState } from "react";
import { ToxicSitesData } from "@/lib/types";
import { TRI_EXPLAINER, TRI_PROXIMITY_INFO, INDUSTRY_CHEMICAL_INFO } from "@/lib/explainers";

interface Props {
  data: ToxicSitesData | null;
}

export default function ToxicSitesSection({ data }: Props) {
  const [showExplainer, setShowExplainer] = useState(false);
  const [expandedFacility, setExpandedFacility] = useState<number | null>(null);

  if (!data) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          ☢️ Toxic Release Sites
        </h3>
        <p className="text-[var(--text-muted)] text-sm">
          Unable to fetch toxic release data.
        </p>
      </div>
    );
  }

  const isClean = data.totalFacilities === 0;
  const statusColor = isClean
    ? "var(--accent-green)"
    : data.totalFacilities > 5
    ? "var(--accent-red)"
    : "var(--accent-yellow)";

  // Group by industry
  const industryCounts: Record<string, number> = {};
  for (const f of data.facilities) {
    const ind = f.industry || "Unknown";
    industryCounts[ind] = (industryCounts[ind] || 0) + 1;
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            ☢️ Toxic Release Sites
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            EPA Toxics Release Inventory (TRI)
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-center"
          style={{
            backgroundColor: `${statusColor}15`,
            border: `1px solid ${statusColor}33`,
          }}
        >
          <span
            className="text-2xl font-bold block"
            style={{ color: statusColor }}
          >
            {data.totalFacilities}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
            facilit{data.totalFacilities === 1 ? "y" : "ies"}
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4">
        {data.summary}
      </p>

      {/* Context about what TRI means */}
      {data.totalFacilities > 0 && (
        <div className="mb-6 bg-[var(--bg-secondary)] rounded-xl p-4">
          <p className="text-xs text-[var(--text-muted)]">
            <strong className="text-[var(--text-secondary)]">What this means:</strong> These facilities are <em>required</em> by law to report their toxic chemical releases. Being on this list doesn&apos;t mean they&apos;re necessarily hazardous to nearby residents — it depends on what they release, in what quantities, and how close you are. Many facilities operate safely within permitted limits.
          </p>
        </div>
      )}

      {/* Industry breakdown */}
      {Object.keys(industryCounts).length > 1 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            Industry Breakdown
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(industryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([industry, count]) => (
                <span
                  key={industry}
                  className="text-xs px-3 py-1.5 rounded-full bg-[var(--accent-purple)]10 text-[var(--accent-purple)] border border-[var(--accent-purple)]25"
                >
                  {industry}: {count}
                </span>
              ))}
          </div>
        </div>
      )}

      {data.facilities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            TRI Facilities in This ZIP Code
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data.facilities.slice(0, 15).map((f, i) => {
              const isExpanded = expandedFacility === i;
              const chemInfo = INDUSTRY_CHEMICAL_INFO[f.industry] || null;

              return (
                <div key={i}>
                  <button
                    onClick={() => setExpandedFacility(isExpanded ? null : i)}
                    className="w-full bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm text-left hover:bg-[var(--bg-card-hover)] transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">
                          {f.facilityName}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {f.streetAddress}
                          {f.city ? `, ${f.city}` : ""}
                          {f.state ? `, ${f.state}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {f.industry && f.industry !== "Unknown" && (
                          <span className="text-xs px-2 py-1 rounded bg-[var(--accent-purple)]15 text-[var(--accent-purple)] border border-[var(--accent-purple)]33">
                            {f.industry}
                          </span>
                        )}
                        <span className="text-[var(--text-muted)] text-xs">
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="mt-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 border-l-2 border-[var(--accent-gold-dim)] text-sm space-y-2">
                      {chemInfo && (
                        <div>
                          <p className="text-xs font-medium text-[var(--accent-gold)]">Typical chemicals for {f.industry}:</p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{chemInfo}</p>
                        </div>
                      )}
                      <p className="text-xs text-[var(--text-muted)]">
                        📍 Located at {f.streetAddress}{f.city ? `, ${f.city}` : ""}{f.state ? `, ${f.state}` : ""} {f.zip}
                      </p>
                      {f.latitude && f.longitude && (
                        <p className="text-xs text-[var(--text-muted)]">
                          📐 Coordinates: {f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}
                        </p>
                      )}
                      <p className="text-xs text-[var(--accent-blue)]">
                        🔗 Search EPA TRI Explorer for detailed release data on this facility
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {data.facilities.length > 15 && (
            <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
              Showing 15 of {data.totalFacilities} facilities
            </p>
          )}
        </div>
      )}

      {isClean && (
        <div className="flex items-center gap-3 bg-[var(--accent-green)]10 rounded-lg px-4 py-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm text-[var(--accent-green)] font-medium">
              No TRI-reporting facilities found in this ZIP code.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              This means there are no facilities in this ZIP code that report toxic chemical releases above EPA thresholds.
            </p>
          </div>
        </div>
      )}

      {/* Proximity guide */}
      <button
        onClick={() => setShowExplainer(!showExplainer)}
        className="mt-6 text-xs text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)] transition flex items-center gap-1"
      >
        {showExplainer ? "▼ Hide" : "▶ Understanding toxic release sites & proximity risk"}
      </button>
      {showExplainer && (
        <div className="mt-3 bg-[var(--bg-secondary)] rounded-xl p-4 text-sm text-[var(--text-secondary)] space-y-3">
          <p dangerouslySetInnerHTML={{ __html: TRI_EXPLAINER.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>') }} />
          <div className="mt-4">
            <p className="font-medium text-[var(--text-primary)] mb-2">Proximity & Risk:</p>
            <div className="space-y-2">
              {TRI_PROXIMITY_INFO.map((info, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-mono text-[var(--accent-gold)] shrink-0 w-20">{info.distance}</span>
                  <p className="text-xs text-[var(--text-muted)]">{info.risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
