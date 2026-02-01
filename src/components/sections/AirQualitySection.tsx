"use client";

import { AirQualityData } from "@/lib/types";

interface Props {
  data: AirQualityData | null;
}

const aqiColors: Record<string, string> = {
  Good: "var(--accent-green)",
  Moderate: "var(--accent-yellow)",
  "Unhealthy for Sensitive Groups": "var(--accent-orange)",
  Unhealthy: "var(--accent-red)",
  "Very Unhealthy": "#9e3a8e",
  Hazardous: "#7e0023",
};

export default function AirQualitySection({ data }: Props) {
  if (!data) {
    return (
      <SectionShell title="💨 Air Quality" subtitle="No data available">
        <p className="text-[var(--text-muted)] text-sm">
          Unable to fetch air quality data for this location.
        </p>
      </SectionShell>
    );
  }

  const color = aqiColors[data.category] || "var(--text-secondary)";

  return (
    <SectionShell
      title="💨 Air Quality"
      subtitle={
        data.reportingArea
          ? `${data.reportingArea}, ${data.stateCode} • ${data.dateObserved}`
          : data.dateObserved
      }
    >
      {data.aqi !== null ? (
        <>
          {/* AQI Main Display */}
          <div className="flex items-center gap-6 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center"
              style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}
            >
              <span className="text-2xl font-bold" style={{ color }}>
                {data.aqi}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">AQI</span>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{ color }}>
                {data.category}
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                {getAQIDescription(data.aqi)}
              </p>
            </div>
          </div>

          {/* AQI Scale */}
          <div className="mb-6">
            <div className="flex h-3 rounded-full overflow-hidden">
              <div className="flex-1 bg-[var(--accent-green)]" />
              <div className="flex-1 bg-[var(--accent-yellow)]" />
              <div className="flex-1 bg-[var(--accent-orange)]" />
              <div className="flex-1 bg-[var(--accent-red)]" />
              <div className="flex-1 bg-[#9e3a8e]" />
              <div className="flex-1 bg-[#7e0023]" />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-[var(--text-muted)]">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>500</span>
            </div>
            {/* Marker */}
            <div className="relative h-4">
              <div
                className="absolute w-2 h-2 bg-white rounded-full -top-1"
                style={{ left: `${Math.min((data.aqi / 500) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Pollutants */}
          {data.pollutants.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
                Pollutant Breakdown
              </h4>
              <div className="grid gap-3">
                {data.pollutants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg px-4 py-3"
                  >
                    <div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {p.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">
                        {p.concentration} {p.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: aqiColors[p.category] || "var(--text-secondary)" }}
                      >
                        {p.aqi}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${aqiColors[p.category] || "var(--border)"}22`,
                          color: aqiColors[p.category] || "var(--text-muted)",
                        }}
                      >
                        {p.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-[var(--text-muted)] text-sm">
          {data.category === "API key not configured"
            ? "Configure your AirNow API key in .env.local to see real-time air quality data."
            : "No air quality readings available for this location."}
        </p>
      )}
    </SectionShell>
  );
}

function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function getAQIDescription(aqi: number): string {
  if (aqi <= 50)
    return "Air quality is satisfactory, and air pollution poses little or no risk.";
  if (aqi <= 100)
    return "Air quality is acceptable. However, there may be a risk for some people.";
  if (aqi <= 150)
    return "Members of sensitive groups may experience health effects.";
  if (aqi <= 200)
    return "Some members of the general public may experience health effects.";
  if (aqi <= 300)
    return "Health alert: The risk of health effects is increased for everyone.";
  return "Health warning of emergency conditions.";
}
