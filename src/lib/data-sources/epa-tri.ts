import { ToxicSitesData, ToxicFacility } from "../types";

export async function fetchToxicReleases(zip: string): Promise<ToxicSitesData | null> {
  try {
    // EPA Envirofacts TRI - Toxic Release Inventory facilities by ZIP
    const url = `https://data.epa.gov/efservice/TRI_FACILITY/ZIP_CODE/${zip}/JSON`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`EPA TRI API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return {
        totalFacilities: 0,
        facilities: [],
        summary: "No toxic release inventory facilities found in this ZIP code.",
      };
    }

    // Deduplicate facilities by name (they may appear multiple times for different chemicals)
    const seen = new Set<string>();
    const facilities: ToxicFacility[] = [];

    for (const row of data) {
      const name = row.facility_name || row.FACILITY_NAME || "Unknown facility";
      if (seen.has(name)) continue;
      seen.add(name);

      facilities.push({
        facilityName: name,
        streetAddress: row.street_address || row.STREET_ADDRESS || "",
        city: row.city_name || row.CITY_NAME || "",
        state: row.state_abbr || row.STATE_ABBR || "",
        zip: row.zip_code || row.ZIP_CODE || zip,
        industry: row.industry_sector || row.INDUSTRY_SECTOR || "Unknown",
        latitude: parseFloat(row.pref_latitude || row.PREF_LATITUDE || "0") || null,
        longitude: parseFloat(row.pref_longitude || row.PREF_LONGITUDE || "0") || null,
      });
    }

    // Sort by name
    facilities.sort((a, b) => a.facilityName.localeCompare(b.facilityName));

    const summary =
      facilities.length === 0
        ? "No TRI facilities found."
        : `Found ${facilities.length} facilit${facilities.length === 1 ? "y" : "ies"} reporting toxic releases in this ZIP code.`;

    return {
      totalFacilities: facilities.length,
      facilities: facilities.slice(0, 25), // Top 25
      summary,
    };
  } catch (error) {
    console.error("EPA TRI fetch error:", error);
    return null;
  }
}
