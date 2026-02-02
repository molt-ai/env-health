"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationData, EnvironmentalReport } from "@/lib/types";
import ReportView from "@/components/ReportView";
import { trackReportGenerated } from "@/lib/analytics";

interface Props {
  zip: string;
}

export default function ReportPageClient({ zip }: Props) {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<EnvironmentalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const location: LocationData = {
        address: searchParams.get("address") || `ZIP ${zip}`,
        zip: zip,
        lat: parseFloat(searchParams.get("lat") || "0"),
        lng: parseFloat(searchParams.get("lng") || "0"),
        county: searchParams.get("county") || "",
        state: searchParams.get("state") || "",
        stateCode: searchParams.get("stateCode") || "",
        city: searchParams.get("city") || "",
      };

      const res = await fetch("/api/health-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });

      if (!res.ok) throw new Error("Failed to generate report");

      const data = await res.json();
      setReport(data);
      trackReportGenerated(zip, location.city, location.stateCode);
    } catch (e) {
      console.error("Report error:", e);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  const handleReset = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">
              EnviroHealth
            </h1>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/compare"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
            >
              ⚖️ Compare
            </a>
            <a
              href="/"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
            >
              ← New Search
            </a>
          </div>
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
          <div className="animate-pulse-slow mb-8">
            <span className="text-6xl">🌿</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Analyzing Environmental Health
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Querying EPA, CDC, AirNow, and FEMA databases...
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            📍 ZIP Code: {zip}
          </p>

          {/* Loading skeleton cards */}
          <div className="mt-12 space-y-4 max-w-md mx-auto">
            {[
              "Air Quality",
              "Water Safety",
              "Toxic Sites",
              "Health Outcomes",
              "Natural Hazards",
            ].map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-4"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-6 flex-1 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error */}
      {error && !loading && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 text-center">
          <div className="bg-[var(--bg-card)] border border-[var(--accent-red)]40 rounded-2xl p-8 max-w-md mx-auto">
            <span className="text-4xl block mb-4">⚠️</span>
            <p className="text-[var(--accent-red)] font-semibold mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {error}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={loadReport}
                className="px-6 py-2.5 bg-[var(--accent-gold)] text-[var(--bg-primary)] rounded-lg font-bold hover:opacity-90 transition"
              >
                🔄 Try Again
              </button>
              <a
                href="/"
                className="px-6 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg font-bold hover:border-[var(--text-muted)] transition inline-block"
              >
                ← New Search
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)]">
            Persistent issues?{" "}
            <a
              href="https://github.com/molt-ai/env-health/issues"
              className="text-[var(--accent-gold)] hover:underline"
              target="_blank"
              rel="noopener"
            >
              Report a problem
            </a>
          </p>
        </section>
      )}

      {/* Report */}
      {report && <ReportView report={report} onReset={handleReset} />}

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            EnviroHealth — Environmental health data aggregator.{" "}
            <a
              href="https://github.com/molt-ai/env-health"
              className="text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)]"
              target="_blank"
              rel="noopener"
            >
              Open source
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a
              href="/privacy"
              className="hover:text-[var(--accent-gold)] transition"
            >
              Privacy
            </a>
            <a
              href="https://github.com/molt-ai/env-health/issues"
              className="hover:text-[var(--accent-gold)] transition"
              target="_blank"
              rel="noopener"
            >
              Report a Problem
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
