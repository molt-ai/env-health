"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LocationData, EnvironmentalReport } from "@/lib/types";
import ReportView from "@/components/ReportView";
import { trackReportGenerated } from "@/lib/analytics";

interface Props {
  zip: string;
  preloadCity?: string;
  preloadState?: string;
  preloadCounty?: string;
  preloadLat?: number;
  preloadLng?: number;
}

function ReportPageInner({ zip, preloadCity, preloadState, preloadCounty, preloadLat, preloadLng }: Props) {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<EnvironmentalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use search params if available, fall back to preloaded city data
      const city = searchParams.get("city") || preloadCity || "";
      const state = searchParams.get("state") || preloadState || "";
      const stateCode = searchParams.get("stateCode") || preloadState || "";
      const county = searchParams.get("county") || preloadCounty || "";
      const lat = parseFloat(searchParams.get("lat") || "") || preloadLat || 0;
      const lng = parseFloat(searchParams.get("lng") || "") || preloadLng || 0;
      const address = searchParams.get("address") || (city ? `${city}, ${stateCode}` : `ZIP ${zip}`);

      const location: LocationData = {
        address,
        zip,
        lat,
        lng,
        county,
        state,
        stateCode,
        city,
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

  const displayName = preloadCity
    ? `${preloadCity}, ${preloadState}`
    : `ZIP ${zip}`;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v10l6.5-3" />
            </svg>
            <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              EnviroHealth
            </h1>
          </a>
          <div className="flex items-center gap-5">
            <a href="/compare" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition">
              Compare
            </a>
            <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition">
              New Search
            </a>
          </div>
        </div>
      </header>

      {/* Loading skeleton */}
      {loading && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 text-center">
          <div className="animate-pulse-slow mb-6">
            <div className="w-12 h-12 rounded-full mx-auto" style={{ background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-teal))' }} />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
            Analyzing {displayName}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Querying EPA, CDC, AirNow, and FEMA databases
          </p>
          <p className="text-xs text-[var(--text-muted)]">ZIP Code: {zip}</p>

          <div className="mt-12 space-y-3 max-w-sm mx-auto">
            {["Air Quality", "Water Safety", "Toxic Sites", "Health Outcomes", "Natural Hazards"].map((label, i) => (
              <div key={label} className="flex items-center gap-3" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                <div className="skeleton h-5 flex-1 rounded" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error */}
      {error && !loading && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 text-center">
          <div className="glass-card-solid p-8 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-[var(--accent-red)] font-medium mb-2">Something went wrong</p>
            <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={loadReport}
                className="px-5 py-2.5 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg font-medium hover:opacity-90 transition min-h-[44px]"
              >
                Try Again
              </button>
              <a href="/" className="px-5 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg font-medium hover:border-[var(--border-light)] transition min-h-[44px] inline-flex items-center">
                New Search
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Report */}
      {report && <ReportView report={report} onReset={handleReset} />}

      {/* SEO Content for crawlers (hidden when report loads) */}
      {!report && !loading && !error && preloadCity && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Environmental Health Report for {preloadCity}, {preloadState}
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Get a comprehensive environmental health assessment for {preloadCity}, {preloadState} ({zip}).
            This report covers air quality index (AQI), drinking water safety violations,
            nearby toxic release inventory (TRI) sites, community health outcomes from CDC PLACES data,
            and natural hazard risks from FEMA&apos;s National Risk Index.
          </p>
          <p className="text-[var(--text-secondary)] mb-4">
            {preloadCity} residents can use this free tool to understand environmental health risks
            in their area and make informed decisions about where to live, work, and play.
          </p>
          <a href="/" className="text-[var(--accent)] hover:underline">
            Search any US address →
          </a>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            EnviroHealth — Environmental health data aggregator.{" "}
            <a href="https://github.com/molt-ai/env-health" className="text-[var(--accent-dim)] hover:text-[var(--accent)]" target="_blank" rel="noopener">
              Open source
            </a>
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href="/privacy" className="hover:text-[var(--text-secondary)] transition">Privacy</a>
            <a href="https://github.com/molt-ai/env-health/issues" className="hover:text-[var(--text-secondary)] transition" target="_blank" rel="noopener">
              Report a Problem
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function ReportPageClient(props: Props) {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 text-center">
          <div className="animate-pulse-slow mb-6">
            <div className="w-12 h-12 rounded-full mx-auto" style={{ background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-teal))' }} />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">Loading report...</h2>
        </div>
      </main>
    }>
      <ReportPageInner {...props} />
    </Suspense>
  );
}
