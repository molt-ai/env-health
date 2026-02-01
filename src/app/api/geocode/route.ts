import { NextRequest, NextResponse } from "next/server";

const STATE_CODES: Record<string, string> = {
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

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    postcode?: string;
    county?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    hamlet?: string;
  };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&format=json&addressdetails=1&countrycodes=us&limit=5`,
      {
        headers: {
          "User-Agent": "EnviroHealth/1.0 (github.com/molt-ai/env-health)",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data: NominatimResult[] = await res.json();

    const suggestions = data.map((r) => ({
      properties: {
        formatted: r.display_name,
        postcode: r.address?.postcode || "",
        lat: parseFloat(r.lat),
        lon: parseFloat(r.lon),
        county: (r.address?.county || "").replace(" County", "").replace(" Parish", ""),
        state: r.address?.state || "",
        state_code: STATE_CODES[r.address?.state || ""] || "",
        city: r.address?.city || r.address?.town || r.address?.village || r.address?.hamlet || "",
      },
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Nominatim geocode error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
