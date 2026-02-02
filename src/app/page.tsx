"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LocationData } from "@/lib/types";
import ReportView from "@/components/ReportView";
import { EnvironmentalReport } from "@/lib/types";
import { WebApplicationJsonLd } from "@/components/JsonLd";
import {
  trackReportGenerated,
  trackAddressSearched,
} from "@/lib/analytics";

interface GeoapifySuggestion {
  properties: {
    formatted: string;
    postcode?: string;
    lat: number;
    lon: number;
    county?: string;
    state?: string;
    state_code?: string;
    city?: string;
    address_line1?: string;
    address_line2?: string;
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoapifySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<EnvironmentalReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTracked = useRef(false);

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      if (!searchTracked.current && text.length >= 3) {
        trackAddressSearched(text);
        searchTracked.current = true;
      }

      if (apiKey && apiKey !== "YOUR_GEOAPIFY_KEY") {
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
              text
            )}&filter=countrycode:us&format=json&apiKey=${apiKey}`
          );
          const data = await res.json();
          if (data.results) {
            setSuggestions(
              data.results.map((r: Record<string, unknown>) => ({
                properties: r,
              }))
            );
          }
        } catch (e) {
          console.error("Geoapify error:", e);
        }
      } else {
        try {
          const res = await fetch(
            `/api/geocode?q=${encodeURIComponent(text)}`
          );
          const data = await res.json();
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
        } catch (e) {
          console.error("Geocode error:", e);
        }
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = async (suggestion: GeoapifySuggestion) => {
    const props = suggestion.properties;
    setQuery(props.formatted);
    setShowSuggestions(false);

    const location: LocationData = {
      address: props.formatted,
      zip: props.postcode || "",
      lat: props.lat,
      lng: props.lon,
      county: props.county || "",
      state: props.state || "",
      stateCode: (props.state_code || "").toUpperCase(),
      city: props.city || "",
    };

    if (!location.zip) {
      const zipMatch = suggestion.properties.formatted.match(/\b(\d{5})\b/);
      if (zipMatch) {
        location.zip = zipMatch[1];
      } else {
        setError(
          "Could not determine ZIP code for this address. Try entering a more specific address with ZIP."
        );
        return;
      }
    }

    setSelectedLocation(location);
    setError(null);
    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/health-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });

      if (!res.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await res.json();
      setReport(data);
      trackReportGenerated(
        location.zip,
        location.city,
        location.stateCode
      );
    } catch (e) {
      console.error("Report error:", e);
      setError(
        "Failed to generate environmental health report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setReport(null);
    setSelectedLocation(null);
    setError(null);
    setSuggestions([]);
    searchTracked.current = false;
    inputRef.current?.focus();
  };

  const handleRetry = () => {
    if (selectedLocation) {
      setError(null);
      setLoading(true);
      setReport(null);
      fetch("/api/health-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLocation),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          return res.json();
        })
        .then((data) => {
          setReport(data);
          trackReportGenerated(
            selectedLocation.zip,
            selectedLocation.city,
            selectedLocation.stateCode
          );
        })
        .catch(() =>
          setError("Failed to generate report. Please try again.")
        )
        .finally(() => setLoading(false));
    }
  };

  return (
    <main className="min-h-screen">
      <WebApplicationJsonLd />

      {/* Header */}
      <header className="border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 hover:opacity-80 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v10l6.5-3" />
            </svg>
            <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              EnviroHealth
            </h1>
          </button>
          <div className="flex items-center gap-5">
            <a
              href="/compare"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
            >
              Compare
            </a>
            {selectedLocation && (
              <button
                onClick={handleReset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
              >
                New Search
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero / Search / Landing */}
      {!report && !loading && !error && (
        <>
          <section className="hero-gradient relative max-w-2xl mx-auto px-4 sm:px-6 pt-28 sm:pt-40 pb-16 sm:pb-24 text-center">
            {/* Decorative accent line */}
            <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0ms' }}>
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent)]" style={{ opacity: 0.4 }} />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent-dim)]">
                Environmental Intelligence
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--accent)]" style={{ opacity: 0.4 }} />
            </div>

            <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-bold mb-5 text-[var(--text-primary)] leading-[1.05] tracking-[-0.035em] animate-fade-in-up" style={{ animationDelay: '50ms' }}>
              Know what you&apos;re
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-teal)] bg-clip-text text-transparent">
                breathing.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-14 max-w-md mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Instant environmental health reports for any US address. Free forever.
            </p>

            <div className="relative max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="search-input-wrapper relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    setError(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Enter an address, city, or ZIP code..."
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 bg-[var(--bg-card-solid)] border border-[var(--border)] rounded-2xl text-[var(--text-primary)] text-base sm:text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-dim)] transition-all duration-300"
                  style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)' }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card-solid)] border border-[var(--border)] rounded-xl overflow-hidden z-50 animate-fade-in"
                  style={{ boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)' }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(s)}
                      className="w-full text-left px-5 py-3.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border-b border-[var(--border)] last:border-b-0 transition-colors duration-150 min-h-[44px]"
                    >
                      <span className="text-[var(--text-muted)] mr-2">
                        <svg className="inline w-3.5 h-3.5 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      {s.properties.formatted}
                      {s.properties.postcode && (
                        <span className="text-[var(--text-muted)] ml-2">
                          ({s.properties.postcode})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-5 text-xs text-[var(--text-muted)] animate-fade-in" style={{ animationDelay: '250ms' }}>
              Try &quot;Richmond, VA&quot; or &quot;90210&quot; or &quot;123 Main St, Austin, TX&quot;
            </p>
          </section>

          {/* Features */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Air Quality", icon: "🌬️", desc: "Real-time AQI" },
                { label: "Water Safety", icon: "💧", desc: "EPA violations" },
                { label: "Toxic Sites", icon: "☣️", desc: "TRI facilities" },
                { label: "Health Data", icon: "🏥", desc: "CDC PLACES" },
                { label: "Hazards", icon: "⚡", desc: "FEMA NRI" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-light)] transition-all duration-200"
                >
                  <span className="text-xl mb-2">{item.icon}</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{item.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)] mt-0.5">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Trust bar */}
          <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {["EPA", "CDC PLACES", "AirNow", "FEMA NRI"].map((src) => (
                <span key={src} className="data-source-tag">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent-dim)' }}
                  />
                  {src}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-[var(--text-muted)] opacity-60">
              Free. No sign-up required. Powered by federal data sources.
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-[var(--border)] py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    EnviroHealth
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                  <a href="/privacy" className="hover:text-[var(--text-secondary)] transition">
                    Privacy
                  </a>
                  <a href="/compare" className="hover:text-[var(--text-secondary)] transition">
                    Compare
                  </a>
                  <a
                    href="https://github.com/molt-ai/env-health"
                    className="hover:text-[var(--text-secondary)] transition"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Loading State */}
      {loading && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 text-center">
          <div className="animate-pulse-slow mb-6">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-teal))' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,12,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 2v10l6.5-3" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
            Analyzing location
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Querying EPA, CDC, AirNow, and FEMA databases
          </p>
          {selectedLocation && (
            <p className="text-xs text-[var(--text-muted)]">
              {selectedLocation.address}
            </p>
          )}

          <div className="mt-12 space-y-3 max-w-sm mx-auto">
            {[
              "Air Quality",
              "Water Safety",
              "Toxic Sites",
              "Health Outcomes",
              "Natural Hazards",
            ].map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-3"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                <div className="skeleton h-5 flex-1 rounded" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 text-center">
          <div className="glass-card-solid p-8 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.15)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-[var(--accent-red)] font-medium mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {error}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={handleRetry} className="btn-primary">
                Try Again
              </button>
              <button onClick={handleReset} className="btn-secondary">
                New Search
              </button>
            </div>
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)]">
            Persistent issues?{" "}
            <a
              href="https://github.com/molt-ai/env-health/issues"
              className="text-[var(--accent-dim)] hover:underline"
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

      {/* Footer (when report or loading is shown) */}
      {(report || loading) && (
        <footer className="border-t border-[var(--border)] mt-16 py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[var(--text-muted)]">
              EnviroHealth — Environmental health data aggregator.{" "}
              <a
                href="https://github.com/molt-ai/env-health"
                className="text-[var(--accent-dim)] hover:text-[var(--accent)]"
                target="_blank"
                rel="noopener"
              >
                Open source
              </a>
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <a href="/privacy" className="hover:text-[var(--text-secondary)] transition">
                Privacy
              </a>
              <a
                href="https://github.com/molt-ai/env-health/issues"
                className="hover:text-[var(--text-secondary)] transition"
                target="_blank"
                rel="noopener"
              >
                Report a Problem
              </a>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
