"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import { LocationData, EnvironmentalReport } from "@/lib/types";
import ReportView from "@/components/ReportView";

interface Props {
  params: Promise<{ zip: string }>;
}

export default function ReportPage({ params }: Props) {
  const { zip } = use(params);
  const searchParams = useSearchParams();
  const [report, setReport] = useState<EnvironmentalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
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
      } catch (e) {
        console.error("Report error:", e);
        setError("Failed to generate report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [zip, searchParams]);

  const handleReset = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">
              EnviroHealth
            </h1>
          </a>
          <a
            href="/"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
          >
            ← New Search
          </a>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <section className="max-w-3xl mx-auto px-6 pt-16 text-center">
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
          <div className="mt-12 space-y-4 max-w-md mx-auto">
            {["Air Quality", "Water Safety", "Toxic Sites", "Health Outcomes", "Natural Hazards"].map(
              (label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-4"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                  <div className="skeleton h-6 flex-1 rounded" />
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="max-w-3xl mx-auto px-6 pt-16 text-center">
          <p className="text-[var(--accent-red)] mb-4">{error}</p>
          <a
            href="/"
            className="px-6 py-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] rounded-lg font-bold hover:opacity-90 transition"
          >
            Back to Search
          </a>
        </section>
      )}

      {/* Report */}
      {report && <ReportView report={report} onReset={handleReset} />}

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-6 text-center text-xs text-[var(--text-muted)]">
        <p>
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
      </footer>
    </main>
  );
}
