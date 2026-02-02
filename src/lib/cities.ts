/**
 * Top ~100 US cities with representative ZIP codes for programmatic SEO.
 * Each entry provides city name, state, and a central/well-known ZIP code.
 */
export interface CityEntry {
  city: string;
  state: string;
  stateCode: string;
  zip: string;
  county: string;
  lat: number;
  lng: number;
}

export const TOP_CITIES: CityEntry[] = [
  // Top 100 US cities by population
  { city: "New York", state: "New York", stateCode: "NY", zip: "10001", county: "New York", lat: 40.7484, lng: -73.9967 },
  { city: "Los Angeles", state: "California", stateCode: "CA", zip: "90012", county: "Los Angeles", lat: 34.0622, lng: -118.2437 },
  { city: "Chicago", state: "Illinois", stateCode: "IL", zip: "60601", county: "Cook", lat: 41.8819, lng: -87.6278 },
  { city: "Houston", state: "Texas", stateCode: "TX", zip: "77002", county: "Harris", lat: 29.7545, lng: -95.3583 },
  { city: "Phoenix", state: "Arizona", stateCode: "AZ", zip: "85004", county: "Maricopa", lat: 33.4484, lng: -112.0740 },
  { city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zip: "19102", county: "Philadelphia", lat: 39.9526, lng: -75.1652 },
  { city: "San Antonio", state: "Texas", stateCode: "TX", zip: "78205", county: "Bexar", lat: 29.4241, lng: -98.4936 },
  { city: "San Diego", state: "California", stateCode: "CA", zip: "92101", county: "San Diego", lat: 32.7157, lng: -117.1611 },
  { city: "Dallas", state: "Texas", stateCode: "TX", zip: "75201", county: "Dallas", lat: 32.7767, lng: -96.7970 },
  { city: "San Jose", state: "California", stateCode: "CA", zip: "95113", county: "Santa Clara", lat: 37.3382, lng: -121.8863 },
  { city: "Austin", state: "Texas", stateCode: "TX", zip: "78701", county: "Travis", lat: 30.2672, lng: -97.7431 },
  { city: "Jacksonville", state: "Florida", stateCode: "FL", zip: "32202", county: "Duval", lat: 30.3322, lng: -81.6557 },
  { city: "Fort Worth", state: "Texas", stateCode: "TX", zip: "76102", county: "Tarrant", lat: 32.7555, lng: -97.3308 },
  { city: "Columbus", state: "Ohio", stateCode: "OH", zip: "43215", county: "Franklin", lat: 39.9612, lng: -82.9988 },
  { city: "Indianapolis", state: "Indiana", stateCode: "IN", zip: "46204", county: "Marion", lat: 39.7684, lng: -86.1581 },
  { city: "Charlotte", state: "North Carolina", stateCode: "NC", zip: "28202", county: "Mecklenburg", lat: 35.2271, lng: -80.8431 },
  { city: "San Francisco", state: "California", stateCode: "CA", zip: "94102", county: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { city: "Seattle", state: "Washington", stateCode: "WA", zip: "98101", county: "King", lat: 47.6062, lng: -122.3321 },
  { city: "Denver", state: "Colorado", stateCode: "CO", zip: "80202", county: "Denver", lat: 39.7392, lng: -104.9903 },
  { city: "Washington", state: "District of Columbia", stateCode: "DC", zip: "20001", county: "District of Columbia", lat: 38.9072, lng: -77.0369 },
  { city: "Nashville", state: "Tennessee", stateCode: "TN", zip: "37203", county: "Davidson", lat: 36.1627, lng: -86.7816 },
  { city: "Oklahoma City", state: "Oklahoma", stateCode: "OK", zip: "73102", county: "Oklahoma", lat: 35.4676, lng: -97.5164 },
  { city: "El Paso", state: "Texas", stateCode: "TX", zip: "79901", county: "El Paso", lat: 31.7619, lng: -106.4850 },
  { city: "Boston", state: "Massachusetts", stateCode: "MA", zip: "02108", county: "Suffolk", lat: 42.3601, lng: -71.0589 },
  { city: "Portland", state: "Oregon", stateCode: "OR", zip: "97201", county: "Multnomah", lat: 45.5152, lng: -122.6784 },
  { city: "Las Vegas", state: "Nevada", stateCode: "NV", zip: "89101", county: "Clark", lat: 36.1699, lng: -115.1398 },
  { city: "Memphis", state: "Tennessee", stateCode: "TN", zip: "38103", county: "Shelby", lat: 35.1495, lng: -90.0490 },
  { city: "Louisville", state: "Kentucky", stateCode: "KY", zip: "40202", county: "Jefferson", lat: 38.2527, lng: -85.7585 },
  { city: "Baltimore", state: "Maryland", stateCode: "MD", zip: "21201", county: "Baltimore City", lat: 39.2904, lng: -76.6122 },
  { city: "Milwaukee", state: "Wisconsin", stateCode: "WI", zip: "53202", county: "Milwaukee", lat: 43.0389, lng: -87.9065 },
  { city: "Albuquerque", state: "New Mexico", stateCode: "NM", zip: "87102", county: "Bernalillo", lat: 35.0844, lng: -106.6504 },
  { city: "Tucson", state: "Arizona", stateCode: "AZ", zip: "85701", county: "Pima", lat: 32.2226, lng: -110.9747 },
  { city: "Fresno", state: "California", stateCode: "CA", zip: "93721", county: "Fresno", lat: 36.7378, lng: -119.7871 },
  { city: "Sacramento", state: "California", stateCode: "CA", zip: "95814", county: "Sacramento", lat: 38.5816, lng: -121.4944 },
  { city: "Mesa", state: "Arizona", stateCode: "AZ", zip: "85201", county: "Maricopa", lat: 33.4152, lng: -111.8315 },
  { city: "Kansas City", state: "Missouri", stateCode: "MO", zip: "64106", county: "Jackson", lat: 39.0997, lng: -94.5786 },
  { city: "Atlanta", state: "Georgia", stateCode: "GA", zip: "30303", county: "Fulton", lat: 33.7490, lng: -84.3880 },
  { city: "Omaha", state: "Nebraska", stateCode: "NE", zip: "68102", county: "Douglas", lat: 41.2565, lng: -95.9345 },
  { city: "Colorado Springs", state: "Colorado", stateCode: "CO", zip: "80903", county: "El Paso", lat: 38.8339, lng: -104.8214 },
  { city: "Raleigh", state: "North Carolina", stateCode: "NC", zip: "27601", county: "Wake", lat: 35.7796, lng: -78.6382 },
  { city: "Long Beach", state: "California", stateCode: "CA", zip: "90802", county: "Los Angeles", lat: 33.7701, lng: -118.1937 },
  { city: "Virginia Beach", state: "Virginia", stateCode: "VA", zip: "23451", county: "Virginia Beach", lat: 36.8529, lng: -75.9780 },
  { city: "Miami", state: "Florida", stateCode: "FL", zip: "33130", county: "Miami-Dade", lat: 25.7617, lng: -80.1918 },
  { city: "Oakland", state: "California", stateCode: "CA", zip: "94612", county: "Alameda", lat: 37.8044, lng: -122.2712 },
  { city: "Minneapolis", state: "Minnesota", stateCode: "MN", zip: "55401", county: "Hennepin", lat: 44.9778, lng: -93.2650 },
  { city: "Tulsa", state: "Oklahoma", stateCode: "OK", zip: "74103", county: "Tulsa", lat: 36.1540, lng: -95.9928 },
  { city: "Tampa", state: "Florida", stateCode: "FL", zip: "33602", county: "Hillsborough", lat: 27.9506, lng: -82.4572 },
  { city: "Arlington", state: "Texas", stateCode: "TX", zip: "76010", county: "Tarrant", lat: 32.7357, lng: -97.1081 },
  { city: "New Orleans", state: "Louisiana", stateCode: "LA", zip: "70112", county: "Orleans", lat: 29.9511, lng: -90.0715 },
  { city: "Wichita", state: "Kansas", stateCode: "KS", zip: "67202", county: "Sedgwick", lat: 37.6872, lng: -97.3301 },
  { city: "Cleveland", state: "Ohio", stateCode: "OH", zip: "44113", county: "Cuyahoga", lat: 41.4993, lng: -81.6944 },
  { city: "Bakersfield", state: "California", stateCode: "CA", zip: "93301", county: "Kern", lat: 35.3733, lng: -119.0187 },
  { city: "Aurora", state: "Colorado", stateCode: "CO", zip: "80012", county: "Arapahoe", lat: 39.7294, lng: -104.8319 },
  { city: "Anaheim", state: "California", stateCode: "CA", zip: "92805", county: "Orange", lat: 33.8366, lng: -117.9143 },
  { city: "Honolulu", state: "Hawaii", stateCode: "HI", zip: "96813", county: "Honolulu", lat: 21.3069, lng: -157.8583 },
  { city: "Santa Ana", state: "California", stateCode: "CA", zip: "92701", county: "Orange", lat: 33.7455, lng: -117.8677 },
  { city: "Riverside", state: "California", stateCode: "CA", zip: "92501", county: "Riverside", lat: 33.9806, lng: -117.3755 },
  { city: "Corpus Christi", state: "Texas", stateCode: "TX", zip: "78401", county: "Nueces", lat: 27.8006, lng: -97.3964 },
  { city: "Lexington", state: "Kentucky", stateCode: "KY", zip: "40507", county: "Fayette", lat: 38.0406, lng: -84.5037 },
  { city: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", zip: "15222", county: "Allegheny", lat: 40.4406, lng: -79.9959 },
  { city: "Anchorage", state: "Alaska", stateCode: "AK", zip: "99501", county: "Anchorage", lat: 61.2181, lng: -149.9003 },
  { city: "Stockton", state: "California", stateCode: "CA", zip: "95202", county: "San Joaquin", lat: 37.9577, lng: -121.2908 },
  { city: "Cincinnati", state: "Ohio", stateCode: "OH", zip: "45202", county: "Hamilton", lat: 39.1031, lng: -84.5120 },
  { city: "Saint Paul", state: "Minnesota", stateCode: "MN", zip: "55101", county: "Ramsey", lat: 44.9537, lng: -93.0900 },
  { city: "Greensboro", state: "North Carolina", stateCode: "NC", zip: "27401", county: "Guilford", lat: 36.0726, lng: -79.7920 },
  { city: "Newark", state: "New Jersey", stateCode: "NJ", zip: "07102", county: "Essex", lat: 40.7357, lng: -74.1724 },
  { city: "Plano", state: "Texas", stateCode: "TX", zip: "75074", county: "Collin", lat: 33.0198, lng: -96.6989 },
  { city: "Henderson", state: "Nevada", stateCode: "NV", zip: "89015", county: "Clark", lat: 36.0395, lng: -114.9817 },
  { city: "Lincoln", state: "Nebraska", stateCode: "NE", zip: "68508", county: "Lancaster", lat: 40.8136, lng: -96.7026 },
  { city: "Buffalo", state: "New York", stateCode: "NY", zip: "14202", county: "Erie", lat: 42.8864, lng: -78.8784 },
  { city: "Chandler", state: "Arizona", stateCode: "AZ", zip: "85225", county: "Maricopa", lat: 33.3062, lng: -111.8413 },
  { city: "St. Louis", state: "Missouri", stateCode: "MO", zip: "63101", county: "St. Louis City", lat: 38.6270, lng: -90.1994 },
  { city: "Chula Vista", state: "California", stateCode: "CA", zip: "91910", county: "San Diego", lat: 32.6401, lng: -117.0842 },
  { city: "Orlando", state: "Florida", stateCode: "FL", zip: "32801", county: "Orange", lat: 28.5383, lng: -81.3792 },
  { city: "Irvine", state: "California", stateCode: "CA", zip: "92618", county: "Orange", lat: 33.6846, lng: -117.8265 },
  { city: "Norfolk", state: "Virginia", stateCode: "VA", zip: "23510", county: "Norfolk", lat: 36.8508, lng: -76.2859 },
  { city: "Richmond", state: "Virginia", stateCode: "VA", zip: "23219", county: "Richmond City", lat: 37.5407, lng: -77.4360 },
  { city: "Winston-Salem", state: "North Carolina", stateCode: "NC", zip: "27101", county: "Forsyth", lat: 36.0999, lng: -80.2442 },
  { city: "Boise", state: "Idaho", stateCode: "ID", zip: "83702", county: "Ada", lat: 43.6150, lng: -116.2023 },
  { city: "Durham", state: "North Carolina", stateCode: "NC", zip: "27701", county: "Durham", lat: 35.9940, lng: -78.8986 },
  { city: "Scottsdale", state: "Arizona", stateCode: "AZ", zip: "85251", county: "Maricopa", lat: 33.4942, lng: -111.9261 },
  { city: "Baton Rouge", state: "Louisiana", stateCode: "LA", zip: "70801", county: "East Baton Rouge", lat: 30.4515, lng: -91.1871 },
  { city: "Reno", state: "Nevada", stateCode: "NV", zip: "89501", county: "Washoe", lat: 39.5296, lng: -119.8138 },
  { city: "Birmingham", state: "Alabama", stateCode: "AL", zip: "35203", county: "Jefferson", lat: 33.5207, lng: -86.8025 },
  { city: "Spokane", state: "Washington", stateCode: "WA", zip: "99201", county: "Spokane", lat: 47.6588, lng: -117.4260 },
  { city: "Rochester", state: "New York", stateCode: "NY", zip: "14604", county: "Monroe", lat: 43.1566, lng: -77.6088 },
  { city: "Des Moines", state: "Iowa", stateCode: "IA", zip: "50309", county: "Polk", lat: 41.5868, lng: -93.6250 },
  { city: "Salt Lake City", state: "Utah", stateCode: "UT", zip: "84101", county: "Salt Lake", lat: 40.7608, lng: -111.8910 },
  { city: "Providence", state: "Rhode Island", stateCode: "RI", zip: "02903", county: "Providence", lat: 41.8240, lng: -71.4128 },
  { city: "Charleston", state: "South Carolina", stateCode: "SC", zip: "29401", county: "Charleston", lat: 32.7765, lng: -79.9311 },
  { city: "Savannah", state: "Georgia", stateCode: "GA", zip: "31401", county: "Chatham", lat: 32.0809, lng: -81.0912 },
  { city: "Detroit", state: "Michigan", stateCode: "MI", zip: "48226", county: "Wayne", lat: 42.3314, lng: -83.0458 },
  { city: "Beverly Hills", state: "California", stateCode: "CA", zip: "90210", county: "Los Angeles", lat: 34.0736, lng: -118.4004 },
  // Additional high-interest ZIP codes
  { city: "Manhattan", state: "New York", stateCode: "NY", zip: "10016", county: "New York", lat: 40.7459, lng: -73.9778 },
  { city: "Brooklyn", state: "New York", stateCode: "NY", zip: "11201", county: "Kings", lat: 40.6943, lng: -73.9900 },
  { city: "Queens", state: "New York", stateCode: "NY", zip: "11101", county: "Queens", lat: 40.7433, lng: -73.9234 },
  { city: "The Bronx", state: "New York", stateCode: "NY", zip: "10451", county: "Bronx", lat: 40.8200, lng: -73.9237 },
  { city: "Staten Island", state: "New York", stateCode: "NY", zip: "10301", county: "Richmond", lat: 40.6433, lng: -74.0769 },
  { city: "Alexandria", state: "Virginia", stateCode: "VA", zip: "22314", county: "Alexandria City", lat: 38.8048, lng: -77.0469 },
  { city: "Asheville", state: "North Carolina", stateCode: "NC", zip: "28801", county: "Buncombe", lat: 35.5951, lng: -82.5515 },
];

/**
 * Look up a city entry by ZIP code.
 */
export function getCityByZip(zip: string): CityEntry | undefined {
  return TOP_CITIES.find((c) => c.zip === zip);
}

/**
 * Get all ZIP codes for sitemap generation.
 */
export function getAllCityZips(): string[] {
  return TOP_CITIES.map((c) => c.zip);
}
