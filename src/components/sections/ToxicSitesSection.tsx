"use client";

import { ToxicSitesData } from "@/lib/types";

interface Props {
  data: ToxicSitesData | null;
}

export default function ToxicSitesSection({ data }: Props) {
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

      {data.facilities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            TRI Facilities in This ZIP Code
          </h4>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {data.facilities.slice(0, 15).map((f, i) => (
              <div
                key={i}
                className="bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm"
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
                  {f.industry && f.industry !== "Unknown" && (
                    <span className="text-xs px-2 py-1 rounded bg-[var(--accent-purple)]15 text-[var(--accent-purple)] border border-[var(--accent-purple)]33 shrink-0">
                      {f.industry}
                    </span>
                  )}
                </div>
              </div>
            ))}
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
          <p className="text-sm text-[var(--accent-green)]">
            No TRI-reporting facilities found in this ZIP code.
          </p>
        </div>
      )}
    </div>
  );
}
