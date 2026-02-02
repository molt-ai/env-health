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

      // Track first search per session
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

  // Close suggestions when clicking outside
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
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">
              EnviroHealth
            </h1>
          </button>
          <div className="flex items-center gap-4">
            <a
              href="/compare"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition"
            >
              ⚖️ Compare
            </a>
            {selectedLocation && (
              <button
                onClick={handleReset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
              >
                ← New Search
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero / Search / Landing */}
      {!report && !loading && !error && (
        <>
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)] leading-tight">
              What&apos;s in Your Environment?
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 sm:mb-12 max-w-xl mx-auto">
              Get a free, instant environmental health report for any US
              address. Air quality, water safety, toxic sites, disease rates,
              and natural hazards — all in one place.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
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
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-2xl text-[var(--text-primary)] text-base sm:text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition shadow-lg"
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
                  className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl z-50"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(s)}
                      className="w-full text-left px-6 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border-b border-[var(--border)] last:border-b-0 transition"
                    >
                      <span className="text-[var(--text-muted)] mr-2">📍</span>
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

            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Try: &quot;Richmond, VA&quot; or &quot;90210&quot; or &quot;123
              Main St, Austin, TX&quot;
            </p>
          </section>

          {/* How it works */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
            <h3 className="text-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-8">
              How It Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  step: "1",
                  icon: "📍",
                  title: "Enter an Address",
                  desc: "Type any US address, city name, or ZIP code into the search bar.",
                },
                {
                  step: "2",
                  icon: "🔍",
                  title: "We Query Federal Databases",
                  desc: "We pull real-time data from 5+ federal sources including EPA, CDC, AirNow, and FEMA.",
                },
                {
                  step: "3",
                  icon: "📊",
                  title: "Get Your Free Report",
                  desc: "Receive a comprehensive environmental health grade with actionable recommendations.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent-gold)]15 text-[var(--accent-gold)] text-lg font-bold mb-4 border border-[var(--accent-gold)]33">
                    {item.step}
                  </div>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What&apos;s in a report */}
          <section className="bg-[var(--bg-secondary)] border-y border-[var(--border)] py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h3 className="text-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                What You Get
              </h3>
              <p className="text-center text-2xl font-bold text-[var(--text-primary)] mb-10">
                Five Key Environmental Health Dimensions
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                {[
                  {
                    icon: "💨",
                    label: "Air Quality",
                    desc: "Real-time AQI & pollutants",
                  },
                  {
                    icon: "💧",
                    label: "Water Safety",
                    desc: "Drinking water violations",
                  },
                  {
                    icon: "☢️",
                    label: "Toxic Sites",
                    desc: "TRI facilities nearby",
                  },
                  {
                    icon: "🏥",
                    label: "Health Data",
                    desc: "Disease rates & outcomes",
                  },
                  {
                    icon: "🌪️",
                    label: "Hazards",
                    desc: "Flood, fire, storm risk",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 sm:p-5"
                  >
                    <span className="text-3xl sm:text-4xl">{item.icon}</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {item.label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] text-center">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <h3 className="text-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-8">
              Powered by Official Federal Data
            </h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { name: "EPA", full: "Environmental Protection Agency", icon: "🏛️" },
                { name: "CDC", full: "Centers for Disease Control", icon: "🏥" },
                { name: "AirNow", full: "Air Quality Index", icon: "💨" },
                { name: "FEMA", full: "Federal Emergency Mgmt Agency", icon: "🌊" },
              ].map((source) => (
                <div
                  key={source.name}
                  className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-3"
                >
                  <span className="text-xl">{source.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      {source.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {source.full}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Use Cases */}
          <section className="bg-[var(--bg-secondary)] border-y border-[var(--border)] py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h3 className="text-center text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Use Cases
              </h3>
              <p className="text-center text-2xl font-bold text-[var(--text-primary)] mb-10">
                Who Uses EnviroHealth?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: "🏠",
                    title: "House Hunting",
                    desc: "Research the environmental health of a neighborhood before you buy or rent. Know what you're breathing, drinking, and living near.",
                  },
                  {
                    icon: "🔬",
                    title: "Health Research",
                    desc: "Investigate environmental factors that may affect community health outcomes. Compare disease rates against environmental conditions.",
                  },
                  {
                    icon: "⚖️",
                    title: "Environmental Justice",
                    desc: "Identify communities disproportionately affected by environmental hazards. Use data to advocate for change.",
                  },
                  {
                    icon: "🏢",
                    title: "Real Estate Agents",
                    desc: "Provide clients with environmental health data for listings. Differentiate yourself with comprehensive location intelligence.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.icon}</span>
                      <h4 className="text-lg font-bold text-[var(--text-primary)]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">
              Ready to Check Your Environment?
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              It&apos;s free, instant, and no sign-up required. Just enter an
              address and get your report.
            </p>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => inputRef.current?.focus(), 500);
              }}
              className="px-8 py-4 bg-[var(--accent-gold)] text-[var(--bg-primary)] font-bold text-lg rounded-xl hover:opacity-90 transition shadow-lg"
            >
              🌿 Get Your Free Report
            </button>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-[var(--text-muted)]">
              <span>✓ 100% Free</span>
              <span>✓ No Sign-up</span>
              <span>✓ Instant Results</span>
              <span>✓ Open Source</span>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-[var(--border)] py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <span className="text-sm font-bold text-[var(--accent-gold)]">
                    EnviroHealth
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    — Environmental health data aggregator
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                  <a
                    href="/privacy"
                    className="hover:text-[var(--accent-gold)] transition"
                  >
                    Privacy
                  </a>
                  <a
                    href="/compare"
                    className="hover:text-[var(--accent-gold)] transition"
                  >
                    Compare
                  </a>
                  <a
                    href="https://github.com/molt-ai/env-health"
                    className="hover:text-[var(--accent-gold)] transition"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://github.com/molt-ai/env-health/issues"
                    className="hover:text-[var(--accent-gold)] transition"
                    target="_blank"
                    rel="noopener"
                  >
                    Feedback
                  </a>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                Data from EPA, CDC PLACES, AirNow, and FEMA National Risk
                Index. Free and open source.
              </p>
            </div>
          </footer>
        </>
      )}

      {/* Loading State */}
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
          {selectedLocation && (
            <p className="text-sm text-[var(--text-muted)]">
              📍 {selectedLocation.address}
            </p>
          )}

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
                <div className="skeleton h-6 flex-1 rounded" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
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
                onClick={handleRetry}
                className="px-6 py-2.5 bg-[var(--accent-gold)] text-[var(--bg-primary)] rounded-lg font-bold hover:opacity-90 transition"
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] rounded-lg font-bold hover:border-[var(--text-muted)] transition"
              >
                ← New Search
              </button>
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

      {/* Footer (when report or loading is shown) */}
      {(report || loading) && (
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
      )}
    </main>
  );
}
