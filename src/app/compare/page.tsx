"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LocationData, EnvironmentalReport, CategoryScore } from "@/lib/types";
import {
  trackCompareStarted,
  trackCompareCompleted,
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
  };
}

type Side = "a" | "b";

export default function ComparePage() {
  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [suggestionsA, setSuggestionsA] = useState<GeoapifySuggestion[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<GeoapifySuggestion[]>([]);
  const [showSugA, setShowSugA] = useState(false);
  const [showSugB, setShowSugB] = useState(false);
  const [locationA, setLocationA] = useState<LocationData | null>(null);
  const [locationB, setLocationB] = useState<LocationData | null>(null);
  const [reportA, setReportA] = useState<EnvironmentalReport | null>(null);
  const [reportB, setReportB] = useState<EnvironmentalReport | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceA = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceB = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compareTracked = useRef(false);
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

  // Track compare page visit
  useEffect(() => {
    trackCompareStarted();
  }, []);

  const fetchSuggestions = useCallback(
    async (text: string, side: Side) => {
      if (text.length < 3) {
        side === "a" ? setSuggestionsA([]) : setSuggestionsB([]);
        return;
      }
      if (apiKey && apiKey !== "YOUR_GEOAPIFY_KEY") {
        try {
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:us&format=json&apiKey=${apiKey}`
          );
          const data = await res.json();
          if (data.results) {
            const mapped = data.results.map((r: Record<string, unknown>) => ({ properties: r }));
            side === "a" ? setSuggestionsA(mapped) : setSuggestionsB(mapped);
          }
        } catch (e) {
          console.error("Geoapify error:", e);
        }
      } else {
        try {
          const res = await fetch(`/api/geocode?q=${encodeURIComponent(text)}`);
          const data = await res.json();
          if (data.suggestions) {
            side === "a" ? setSuggestionsA(data.suggestions) : setSuggestionsB(data.suggestions);
          }
        } catch (e) {
          console.error("Geocode error:", e);
        }
      }
    },
    [apiKey]
  );

  useEffect(() => {
    if (debounceA.current) clearTimeout(debounceA.current);
    debounceA.current = setTimeout(() => fetchSuggestions(queryA, "a"), 300);
    return () => { if (debounceA.current) clearTimeout(debounceA.current); };
  }, [queryA, fetchSuggestions]);

  useEffect(() => {
    if (debounceB.current) clearTimeout(debounceB.current);
    debounceB.current = setTimeout(() => fetchSuggestions(queryB, "b"), 300);
    return () => { if (debounceB.current) clearTimeout(debounceB.current); };
  }, [queryB, fetchSuggestions]);

  const handleSelect = async (suggestion: GeoapifySuggestion, side: Side) => {
    const props = suggestion.properties;
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
      const zipMatch = props.formatted.match(/\b(\d{5})\b/);
      if (zipMatch) location.zip = zipMatch[1];
      else {
        setError("Could not determine ZIP code. Try a more specific address.");
        return;
      }
    }

    if (side === "a") {
      setQueryA(props.formatted);
      setShowSugA(false);
      setLocationA(location);
      setLoadingA(true);
      setReportA(null);
    } else {
      setQueryB(props.formatted);
      setShowSugB(false);
      setLocationB(location);
      setLoadingB(true);
      setReportB(null);
    }

    setError(null);

    try {
      const res = await fetch("/api/health-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });
      if (!res.ok) throw new Error("Failed to generate report");
      const data = await res.json();
      side === "a" ? setReportA(data) : setReportB(data);
    } catch {
      setError(`Failed to generate report for ${side === "a" ? "Location A" : "Location B"}.`);
    } finally {
      side === "a" ? setLoadingA(false) : setLoadingB(false);
    }
  };

  const bothReady = reportA && reportB;

  // Track when comparison is complete
  useEffect(() => {
    if (bothReady && !compareTracked.current) {
      trackCompareCompleted(reportA.location.zip, reportB.location.zip);
      compareTracked.current = true;
    }
  }, [bothReady, reportA, reportB]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="text-2xl">🌿</span>
            <h1 className="text-xl font-bold text-[var(--accent-gold)]">EnviroHealth</h1>
          </a>
          <a href="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition">
            ← Back to Search
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Compare Locations</h2>
          <p className="text-[var(--text-secondary)]">
            Thinking about moving? Compare the environmental health of two locations side by side.
          </p>
        </div>

        {/* Two search inputs */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Location A */}
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--accent-gold)] mb-2">📍 Location A</label>
            <input
              type="text"
              value={queryA}
              onChange={(e) => { setQueryA(e.target.value); setShowSugA(true); }}
              onFocus={() => setShowSugA(true)}
              placeholder="Enter address or ZIP..."
              className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition"
            />
            {showSugA && suggestionsA.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto">
                {suggestionsA.map((s, i) => (
                  <button key={i} onClick={() => handleSelect(s, "a")}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border-b border-[var(--border)] last:border-b-0 transition">
                    📍 {s.properties.formatted}
                  </button>
                ))}
              </div>
            )}
            {loadingA && <p className="text-xs text-[var(--text-muted)] mt-2 animate-pulse">Loading report...</p>}
          </div>

          {/* Location B */}
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--accent-gold)] mb-2">📍 Location B</label>
            <input
              type="text"
              value={queryB}
              onChange={(e) => { setQueryB(e.target.value); setShowSugB(true); }}
              onFocus={() => setShowSugB(true)}
              placeholder="Enter address or ZIP..."
              className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition"
            />
            {showSugB && suggestionsB.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto">
                {suggestionsB.map((s, i) => (
                  <button key={i} onClick={() => handleSelect(s, "b")}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border-b border-[var(--border)] last:border-b-0 transition">
                    📍 {s.properties.formatted}
                  </button>
                ))}
              </div>
            )}
            {loadingB && <p className="text-xs text-[var(--text-muted)] mt-2 animate-pulse">Loading report...</p>}
          </div>
        </div>

        {error && <p className="text-center text-[var(--accent-red)] text-sm mb-6">{error}</p>}

        {/* Comparison Results */}
        {bothReady && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Overall Winner */}
            <ComparisonSummary reportA={reportA} reportB={reportB} />

            {/* Category-by-category comparison */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Category Comparison</h3>
              <div className="space-y-5">
                {reportA.overallScore.categoryScores.map((catA, i) => {
                  const catB = reportB.overallScore.categoryScores.find(c => c.name === catA.name);
                  if (!catB) return null;
                  const diff = catA.score - catB.score;
                  const winner = diff > 5 ? "a" : diff < -5 ? "b" : "tie";
                  return (
                    <div key={i} className="border-b border-[var(--border)] pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span>{catA.icon}</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{catA.name}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        {/* A score */}
                        <div className="text-center">
                          <span className={`text-2xl font-bold ${winner === "a" ? "" : "opacity-60"}`}
                            style={{ color: winner === "a" ? catA.color : "var(--text-muted)" }}>
                            {catA.score}
                          </span>
                          {winner === "a" && <span className="text-xs text-[var(--accent-green)] block">✓ Better</span>}
                        </div>

                        {/* Visual comparison bar */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 w-full">
                            <div className="flex-1 h-2 rounded-full overflow-hidden bg-[var(--border)]">
                              <div className="h-full rounded-full" style={{ width: `${catA.score}%`, backgroundColor: catA.color }} />
                            </div>
                            <span className="text-[10px] text-[var(--text-muted)] w-4 text-center">vs</span>
                            <div className="flex-1 h-2 rounded-full overflow-hidden bg-[var(--border)]">
                              <div className="h-full rounded-full" style={{ width: `${catB.score}%`, backgroundColor: catB.color }} />
                            </div>
                          </div>
                          {winner === "tie" && <span className="text-[10px] text-[var(--text-muted)] mt-1">≈ Similar</span>}
                        </div>

                        {/* B score */}
                        <div className="text-center">
                          <span className={`text-2xl font-bold ${winner === "b" ? "" : "opacity-60"}`}
                            style={{ color: winner === "b" ? catB.color : "var(--text-muted)" }}>
                            {catB.score}
                          </span>
                          {winner === "b" && <span className="text-xs text-[var(--accent-green)] block">✓ Better</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side by side details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                <h4 className="text-sm font-bold text-[var(--accent-gold)] mb-1">Location A</h4>
                <p className="text-lg font-bold text-[var(--text-primary)] mb-4">
                  {reportA.location.city || reportA.location.address}{reportA.location.stateCode ? `, ${reportA.location.stateCode}` : ""}
                </p>
                <GradeDisplay grade={reportA.overallScore.grade} score={reportA.overallScore.score} />
                <p className="text-sm text-[var(--text-secondary)] mt-3">{reportA.overallScore.summary}</p>
                <a href={`/report/${reportA.location.zip}?address=${encodeURIComponent(reportA.location.address)}&lat=${reportA.location.lat}&lng=${reportA.location.lng}&county=${encodeURIComponent(reportA.location.county)}&state=${encodeURIComponent(reportA.location.state)}&stateCode=${reportA.location.stateCode}&city=${encodeURIComponent(reportA.location.city)}`}
                  className="inline-block mt-4 text-sm text-[var(--accent-gold)] hover:underline">
                  View full report →
                </a>
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                <h4 className="text-sm font-bold text-[var(--accent-gold)] mb-1">Location B</h4>
                <p className="text-lg font-bold text-[var(--text-primary)] mb-4">
                  {reportB.location.city || reportB.location.address}{reportB.location.stateCode ? `, ${reportB.location.stateCode}` : ""}
                </p>
                <GradeDisplay grade={reportB.overallScore.grade} score={reportB.overallScore.score} />
                <p className="text-sm text-[var(--text-secondary)] mt-3">{reportB.overallScore.summary}</p>
                <a href={`/report/${reportB.location.zip}?address=${encodeURIComponent(reportB.location.address)}&lat=${reportB.location.lat}&lng=${reportB.location.lng}&county=${encodeURIComponent(reportB.location.county)}&state=${encodeURIComponent(reportB.location.state)}&stateCode=${reportB.location.stateCode}&city=${encodeURIComponent(reportB.location.city)}`}
                  className="inline-block mt-4 text-sm text-[var(--accent-gold)] hover:underline">
                  View full report →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Single report loaded */}
        {(reportA && !reportB && !loadingB) && (
          <div className="text-center text-[var(--text-muted)] py-8">
            <p>👆 Enter a second location above to compare</p>
          </div>
        )}
        {(!reportA && reportB && !loadingA) && (
          <div className="text-center text-[var(--text-muted)] py-8">
            <p>👆 Enter the first location above to compare</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            EnviroHealth — Environmental health data aggregator.{" "}
            <a href="https://github.com/molt-ai/env-health" className="text-[var(--accent-gold-dim)] hover:text-[var(--accent-gold)]" target="_blank" rel="noopener">Open source</a>
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <a href="/privacy" className="hover:text-[var(--accent-gold)] transition">Privacy</a>
            <a href="https://github.com/molt-ai/env-health/issues" className="hover:text-[var(--accent-gold)] transition" target="_blank" rel="noopener">Feedback</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ComparisonSummary({ reportA, reportB }: { reportA: EnvironmentalReport; reportB: EnvironmentalReport }) {
  const scoreA = reportA.overallScore.score;
  const scoreB = reportB.overallScore.score;
  const diff = Math.abs(scoreA - scoreB);
  const winner = scoreA > scoreB + 5 ? "a" : scoreB > scoreA + 5 ? "b" : "tie";

  const nameA = reportA.location.city || reportA.location.address;
  const nameB = reportB.location.city || reportB.location.address;

  // Count category wins
  let winsA = 0, winsB = 0, ties = 0;
  for (const catA of reportA.overallScore.categoryScores) {
    const catB = reportB.overallScore.categoryScores.find(c => c.name === catA.name);
    if (!catB) continue;
    const d = catA.score - catB.score;
    if (d > 5) winsA++;
    else if (d < -5) winsB++;
    else ties++;
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center">
      <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-4 uppercase tracking-wider">Comparison Result</h3>
      
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <span className="text-3xl font-bold" style={{ color: winner === "a" ? "var(--accent-green)" : "var(--text-muted)" }}>
            {reportA.overallScore.grade}
          </span>
          <p className="text-xs text-[var(--text-muted)] mt-1">{nameA}</p>
        </div>
        <span className="text-2xl text-[var(--text-muted)]">vs</span>
        <div className="text-center">
          <span className="text-3xl font-bold" style={{ color: winner === "b" ? "var(--accent-green)" : "var(--text-muted)" }}>
            {reportB.overallScore.grade}
          </span>
          <p className="text-xs text-[var(--text-muted)] mt-1">{nameB}</p>
        </div>
      </div>

      <p className="text-[var(--text-primary)] text-lg font-semibold mb-2">
        {winner === "tie" 
          ? "These locations are roughly equivalent"
          : `${winner === "a" ? nameA : nameB} scores higher overall`}
      </p>
      <p className="text-sm text-[var(--text-secondary)]">
        {winner === "tie"
          ? `Both locations score within ${diff} points of each other (${scoreA} vs ${scoreB}).`
          : `${diff} point difference (${scoreA} vs ${scoreB}).`}
        {" "}Category breakdown: {winsA > 0 ? `${nameA} wins ${winsA}` : ""}{winsA > 0 && winsB > 0 ? ", " : ""}{winsB > 0 ? `${nameB} wins ${winsB}` : ""}{ties > 0 ? `, ${ties} tied` : ""}.
      </p>
    </div>
  );
}

function GradeDisplay({ grade, score }: { grade: string; score: number }) {
  const gradeColors: Record<string, string> = {
    A: "var(--accent-green)", "B+": "#5ab88e", B: "var(--accent-blue)",
    "C+": "var(--accent-yellow)", C: "var(--accent-orange)", D: "var(--accent-red)", F: "#c43a3a",
  };
  const color = gradeColors[grade] || "var(--text-secondary)";
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}>
        <span className="text-xl font-bold" style={{ color }}>{grade}</span>
      </div>
      <span className="text-sm text-[var(--text-muted)]">{score}/100</span>
    </div>
  );
}
