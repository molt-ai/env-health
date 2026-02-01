"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LocationData } from "@/lib/types";
import ReportView from "@/components/ReportView";
import { EnvironmentalReport } from "@/lib/types";

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
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (text.length < 3) {
        setSuggestions([]);
        return;
      }

      // Use Geoapify if key available, otherwise Nominatim
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
        // Fallback to Nominatim (free, no key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              text
            )}&format=json&addressdetails=1&countrycodes=us&limit=5`,
            {
              headers: {
                "User-Agent": "EnviroHealth/1.0",
              },
            }
          );
          const data = await res.json();
          setSuggestions(
            data.map(
              (r: {
                display_name: string;
                address: {
                  postcode?: string;
                  county?: string;
                  state?: string;
                  city?: string;
                  town?: string;
                  village?: string;
                };
                lat: string;
                lon: string;
              }) => ({
                properties: {
                  formatted: r.display_name,
                  postcode: r.address?.postcode,
                  lat: parseFloat(r.lat),
                  lon: parseFloat(r.lon),
                  county: r.address?.county,
                  state: r.address?.state,
                  state_code: getStateCode(r.address?.state || ""),
                  city:
                    r.address?.city || r.address?.town || r.address?.village,
                },
              })
            )
          );
        } catch (e) {
          console.error("Nominatim error:", e);
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
      setError(
        "Could not determine ZIP code for this address. Please try a more specific address."
      );
      return;
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
    } catch (e) {
      console.error("Report error:", e);
      setError("Failed to generate environmental health report. Please try again.");
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
    inputRef.current?.focus();
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={handleReset} className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">
              EnviroHealth
            </h1>
          </button>
          {selectedLocation && (
            <button
              onClick={handleReset}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition"
            >
              ← New Search
            </button>
          )}
        </div>
      </header>

      {/* Hero / Search */}
      {!report && !loading && (
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">
            What&apos;s in Your Environment?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
            Enter an address to discover the environmental health profile of any
            location. Air quality, water safety, toxic sites, disease rates, and
            natural hazards — all in one report.
          </p>

          <div className="relative max-w-2xl mx-auto">
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
              className="w-full px-6 py-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition"
            />

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

          {error && (
            <p className="mt-4 text-[var(--accent-red)] text-sm">{error}</p>
          )}

          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { icon: "💨", label: "Air Quality" },
              { icon: "💧", label: "Water Safety" },
              { icon: "☢️", label: "Toxic Sites" },
              { icon: "🏥", label: "Health Data" },
              { icon: "🌪️", label: "Hazards" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs text-[var(--text-muted)]">
            Data from EPA, CDC PLACES, AirNow, FEMA National Risk Index, and
            other public sources.
            <br />
            Free and open source.
          </p>
        </section>
      )}

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
          {selectedLocation && (
            <p className="text-sm text-[var(--text-muted)]">
              📍 {selectedLocation.address}
            </p>
          )}

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

function getStateCode(stateName: string): string {
  const states: Record<string, string> = {
    Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
    California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
    Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID",
    Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
    Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
    Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
    Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
    Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
    Virginia: "VA", Washington: "WA", "West Virginia": "WV",
    Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC",
  };
  return states[stateName] || "";
}
