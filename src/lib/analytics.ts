import posthog from "posthog-js";

/**
 * Safe analytics capture — gracefully degrades when PostHog isn't configured.
 */
function capture(event: string, properties?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture(event, properties);
    }
  } catch {
    // Analytics should never break the app
  }
}

// --- Event Tracking Functions ---

export function trackReportGenerated(zip: string, city: string, state: string) {
  capture("report_generated", { zip, city, state });
}

export function trackReportShared(zip: string, method: "native_share" | "clipboard") {
  capture("report_shared", { zip, method });
}

export function trackReportExportedPDF(zip: string) {
  capture("report_exported_pdf", { zip });
}

export function trackCompareStarted() {
  capture("compare_started");
}

export function trackCompareCompleted(zipA: string, zipB: string) {
  capture("compare_completed", { zip_a: zipA, zip_b: zipB });
}

export function trackAddressSearched(query: string) {
  // Only track the search intent, not the full address for privacy
  capture("address_searched", {
    query_length: query.length,
    query_type: /^\d{5}$/.test(query.trim()) ? "zip" : "address",
  });
}

export function trackSectionExpanded(section: string) {
  capture("section_expanded", { section });
}

export function trackRecommendationViewed(count: number) {
  capture("recommendation_viewed", { recommendation_count: count });
}

export function trackCompareFromReport(zip: string) {
  capture("compare_from_report", { zip });
}
