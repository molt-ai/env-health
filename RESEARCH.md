# Environmental Health by ZIP Code — Research

## The Concept
Enter a ZIP code → get a comprehensive environmental health profile.
Air quality, water safety, toxic sites, disease rates, pollen, radon, soil contamination — all in one report.

Think of it like the genome project but for your **environment**: "What are the health risks of living HERE?"

---

## Free Databases & APIs Available

### 🌬️ AIR QUALITY

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **EPA AQS API** | Historical air quality monitoring data (PM2.5, ozone, NO2, SO2, CO, lead) | Free REST API (email signup) | Monitor/county/state |
| **AirNow API** | Real-time & forecast AQI, pollutant levels | Free API key (instant) | ZIP code, lat/lng |
| **EPA AirData** | Pre-extracted annual/daily/hourly air quality files | Free download | County/monitor |
| **EPA Air Toxics** | Cancer risk from air toxics by county | Free (via MyEnvironment) | County |

**AirNow API** is the easiest — real-time AQI by ZIP code with one call.
**AQS API** has the deepest historical data going back decades.

### 💧 WATER QUALITY

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **SDWIS (Safe Drinking Water Info System)** | Drinking water violations, contaminants, enforcement actions | Free REST API (Envirofacts) | Water system / ZIP code |
| **Water Quality Portal** | Water quality monitoring data (EPA + USGS + states) | Free REST API | Station/lat-lng |
| **ECHO (Enforcement & Compliance)** | Facility violations, inspections, penalties | Free download/API | Facility / ZIP |
| **EWG Tap Water Database** | Consumer-friendly tap water quality by ZIP | Scrape (no API) | ZIP code |

**SDWIS** has a ZIP-code summary table (`SDW_CONTAM_VIOL_ZIP`) — perfect for this project.
**Water Quality Portal** (waterqualitydata.us) is a joint EPA/USGS portal with station-level data.

### ☢️ TOXIC SITES & CONTAMINATION

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **TRI (Toxics Release Inventory)** | Industrial toxic chemical releases & waste | Free REST API + bulk download | Facility (lat/lng) |
| **Superfund/NPL Sites** | Hazardous waste cleanup sites | Free (Envirofacts API) | Site (lat/lng) |
| **Brownfields** | Contaminated properties being cleaned up | Free (Envirofacts) | Site |
| **RCRA (Hazardous Waste)** | Hazardous waste handlers, violations | Free REST API | Facility |
| **Lead Paint Risk** | Housing age as proxy for lead paint risk | Census (ACS) | Census tract |

**TRI** has an EnviroFacts REST API — query toxic releases near any location.
**Superfund sites** searchable by location through EPA SEMS database.

### 🏥 HEALTH OUTCOMES

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **CDC PLACES** | 36 chronic disease measures (asthma, cancer, diabetes, heart disease, etc.) | Free API (data.cdc.gov) | **ZIP code (ZCTA)**, census tract, county |
| **CDC WONDER** | Mortality data, birth defects, cancer incidence | Free (query tool) | County |
| **Cancer Statistics (USCS)** | Cancer incidence & mortality rates | Free download | State/county |
| **County Health Rankings** | Health factors & outcomes rankings | Free download | County |

**CDC PLACES is the goldmine** — 36 health measures at ZIP code level, free API on data.cdc.gov.
Measures include: asthma, COPD, cancer, diabetes, heart disease, kidney disease, depression, obesity, smoking, physical inactivity, sleep, insurance coverage, preventive care.

### 🌿 POLLEN & ALLERGENS

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **Google Pollen API** | Daily pollen forecast, 3 plant types, 15 species | Free tier (Maps Platform) | 1km grid |
| **Pollen.com** | Allergy forecast, pollen count | Scrape (no public API) | ZIP code |
| **AAAAI Pollen Stations** | Pollen counts from certified stations | Limited access | Station |

**Google Pollen API** gives 5-day forecasts at 1km resolution — free tier available.

### 🏠 RADON & INDOOR HAZARDS

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **EPA Radon Zone Map** | Radon risk zones (1=high, 2=moderate, 3=low) | Free download/GIS | County |
| **State Radon Data** | Actual radon test results | Varies by state | ZIP/county |

### 🌡️ CLIMATE & WEATHER RISKS

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **FEMA National Risk Index** | Natural hazard risk scores (flood, wildfire, earthquake, etc.) | Free download/API | County/census tract |
| **NOAA Climate Data** | Historical weather, extreme events | Free API | Station/county |
| **First Street Foundation** | Flood, fire, wind, heat risk scores | API (limited free) | Property/ZIP |

**FEMA Risk Index** is incredible — composite risk scores for 18 natural hazards at census tract level.

### 🌳 ENVIRONMENTAL JUSTICE (Composite)

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **EJScreen** (archived) | Combined environmental + demographic indicators | Harvard archive / PEDP mirror | Block group |
| **CEJST (Climate & Economic Justice)** | Disadvantaged community designations | Free download | Census tract |
| **CalEnviroScreen** (CA only) | California environmental health scores | Free download | Census tract |

**EJScreen was removed from EPA** in Feb 2025 but data is preserved at Harvard Dataverse and PEDP mirror sites. The raw data is still downloadable.

### 📊 DEMOGRAPHICS & SOCIOECONOMIC

| Source | What It Provides | Access | Granularity |
|--------|-----------------|--------|-------------|
| **Census ACS** | Income, education, housing age, race, insurance | Free API | Block group/tract/ZIP |
| **HUD Lead-Based Paint** | Lead paint risk by housing age | Free | Census tract |
| **Social Vulnerability Index (CDC)** | Composite vulnerability score | Free download | Census tract |

---

## Architecture: How to Build It

### Similar to the Genome Project
The genome project works like this:
1. **Input**: Your raw genome file (23andMe)
2. **Databases**: ClinVar, PharmGKB (pre-downloaded)
3. **Scripts**: Cross-reference your SNPs against databases
4. **Output**: Markdown reports with findings + actionable protocols

Environmental health version:
1. **Input**: ZIP code (or address)
2. **Databases**: EPA, CDC, FEMA, etc. (mix of APIs + pre-downloaded)
3. **Scripts**: Query each source, aggregate, score, contextualize
4. **Output**: Comprehensive environmental health report

### Data Strategy

**Pre-downloaded (bulk, rarely changes):**
- CDC PLACES (annual release, ~5MB CSV)
- FEMA Risk Index (annual, downloadable)
- EPA Radon Zones (static)
- EJScreen archived data
- Superfund site locations
- TRI facility locations + releases
- Census ACS demographics

**Live API calls (per-query):**
- AirNow (real-time AQI)
- Google Pollen API (daily forecast)
- SDWIS water violations
- Water Quality Portal

### Output Reports (like the genome project)

1. **ENVIRONMENTAL_HEALTH_REPORT.md** — Full profile
   - Air quality score & pollutant breakdown
   - Water quality & violations history
   - Nearby toxic sites (TRI, Superfund, brownfields)
   - Health outcomes for the area (CDC PLACES)
   - Natural hazard risks (FEMA)
   - Pollen/allergen forecast
   - Radon risk zone
   - Environmental justice indicators

2. **RISK_SUMMARY.md** — Key risks ranked
   - Top 5 environmental health risks for this ZIP
   - Comparison to state/national averages
   - Trend analysis (getting better or worse?)

3. **ACTIONABLE_PROTOCOL.md** — What to do about it
   - Air: HEPA filter recommendations, outdoor activity timing
   - Water: Filter recommendations based on specific contaminants
   - Home: Radon testing, lead paint assessment
   - Health: Screening recommendations based on local risk factors
   - Allergens: Peak pollen management

### Tech Stack
- **Python** (scripts, like the genome project)
- **Pre-downloaded CSVs/TSVs** in `data/` folder
- **Requests** for live API calls
- **Markdown** output reports
- Optional: Simple web UI later (enter ZIP, get report)

---

## MVP Scope (Phase 1)

Focus on the 5 highest-value, easiest-to-access data sources:

1. **CDC PLACES** — Health outcomes by ZIP (CSV download, dead simple)
2. **AirNow API** — Real-time air quality by ZIP (free API key)
3. **SDWIS** — Drinking water violations by ZIP (Envirofacts API)
4. **TRI** — Toxic releases near ZIP (Envirofacts API)
5. **FEMA Risk Index** — Natural hazard risk (CSV download)

That alone gives you: health stats + air + water + toxics + natural disasters.

### Phase 2 Additions
- Superfund sites proximity
- Pollen API
- Radon zones
- EJScreen indicators
- Census demographics
- Historical trend analysis

### Phase 3
- Web UI (Next.js or similar)
- Compare ZIP codes
- Gene-environment interactions (link to genome project!)
- "Move here?" score comparing current vs prospective ZIP

---

## Key URLs

- EPA Envirofacts API: https://www.epa.gov/enviro/envirofacts-data-service-api
- AirNow API: https://docs.airnowapi.org/
- CDC PLACES: https://data.cdc.gov (Socrata API)
- Water Quality Portal: https://www.waterqualitydata.us/
- FEMA Risk Index: https://hazards.fema.gov/nri/data-resources
- TRI Data: https://www.epa.gov/toxics-release-inventory-tri-program
- EJScreen Archive: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/RLR5AX
- Google Pollen API: https://developers.google.com/maps/documentation/pollen/overview

---

*Research compiled: 2026-02-01*
