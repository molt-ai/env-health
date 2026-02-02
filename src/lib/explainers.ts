// Plain-English explanations for all report sections

// ─── Air Quality ─────────────────────────────────────────────
export const AQI_EXPLAINER = `The **Air Quality Index (AQI)** is a daily measure of how clean or polluted the air is, and what health effects might concern you. It runs from 0 to 500 — the lower the number, the cleaner the air. AQI is calculated from five major pollutants: ground-level ozone, particulate matter (PM2.5 & PM10), carbon monoxide, sulfur dioxide, and nitrogen dioxide.`;

export const AQI_LEVELS: Record<string, { range: string; meaning: string; advice: string }> = {
  Good: {
    range: "0–50",
    meaning: "Air quality is satisfactory. Air pollution poses little or no risk.",
    advice: "Enjoy outdoor activities freely. A great day to be outside.",
  },
  Moderate: {
    range: "51–100",
    meaning: "Air quality is acceptable, but some pollutants may be a concern for a very small number of people who are unusually sensitive.",
    advice: "Most people can be active outdoors. People with respiratory conditions may want to limit prolonged outdoor exertion.",
  },
  "Unhealthy for Sensitive Groups": {
    range: "101–150",
    meaning: "Members of sensitive groups (children, older adults, people with lung disease, heart disease, or asthma) may experience health effects.",
    advice: "Sensitive individuals should reduce prolonged or heavy outdoor exertion. Everyone else can still be active outside.",
  },
  Unhealthy: {
    range: "151–200",
    meaning: "Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.",
    advice: "Everyone should reduce prolonged or heavy outdoor exertion. Move activities indoors or reschedule to early morning when air is usually cleaner.",
  },
  "Very Unhealthy": {
    range: "201–300",
    meaning: "Health alert: The risk of health effects is increased for everyone.",
    advice: "Avoid prolonged outdoor exertion. Consider moving all activities indoors. Run air purifiers if available.",
  },
  Hazardous: {
    range: "301–500",
    meaning: "Health warning of emergency conditions. The entire population is likely to be affected.",
    advice: "Stay indoors with windows closed. Run HEPA air purifiers. Avoid all physical activity outdoors.",
  },
};

export const POLLUTANT_INFO: Record<string, { fullName: string; description: string; sources: string; health: string }> = {
  "PM2.5": {
    fullName: "Fine Particulate Matter (PM2.5)",
    description: "Tiny particles less than 2.5 micrometers — about 30x smaller than a human hair. They can penetrate deep into your lungs and even enter your bloodstream.",
    sources: "Vehicle exhaust, power plants, wildfires, wood burning, construction dust, and industrial emissions.",
    health: "Long-term exposure increases risk of heart disease, stroke, lung cancer, and respiratory disease. Short-term exposure can aggravate asthma and trigger heart attacks in vulnerable people.",
  },
  "PM10": {
    fullName: "Coarse Particulate Matter (PM10)",
    description: "Particles between 2.5 and 10 micrometers. Larger than PM2.5 but still small enough to be inhaled into the lungs.",
    sources: "Dust from roads and construction, agriculture, wildfires, and some industrial processes.",
    health: "Can irritate the nose, throat, and airways. Worsens asthma and bronchitis. Less dangerous than PM2.5 since larger particles are filtered by the nose and throat.",
  },
  O3: {
    fullName: "Ground-Level Ozone (O3)",
    description: "A gas formed when pollutants from cars and industry react with sunlight. Not emitted directly — it's created by chemical reactions on hot, sunny days. Different from the protective ozone layer high in the atmosphere.",
    sources: "Formed from reactions between nitrogen oxides (NOx) and volatile organic compounds (VOCs) in sunlight. Worst on hot, still summer days.",
    health: "Triggers asthma attacks, reduces lung function, and causes chest pain and coughing. Long-term exposure may permanently scar lung tissue.",
  },
  NO2: {
    fullName: "Nitrogen Dioxide (NO2)",
    description: "A reddish-brown gas with a sharp, biting odor. Commonly found near busy roads and highways.",
    sources: "Motor vehicle exhaust (especially diesel), power plants, and industrial boilers. Highest near heavy traffic.",
    health: "Irritates airways, worsens asthma and respiratory infections. Children and people with asthma are most at risk. Long-term exposure linked to development of asthma in children.",
  },
  SO2: {
    fullName: "Sulfur Dioxide (SO2)",
    description: "A colorless gas with a sharp smell, produced mainly by burning fossil fuels containing sulfur.",
    sources: "Power plants burning coal or oil, refineries, smelters, and ships burning high-sulfur fuel.",
    health: "Can cause difficulty breathing within minutes of exposure. Triggers asthma attacks. Contributes to acid rain and particulate matter formation.",
  },
  CO: {
    fullName: "Carbon Monoxide (CO)",
    description: "A colorless, odorless gas produced by incomplete combustion.",
    sources: "Vehicle exhaust, gas stoves and heaters, wildfires, and industrial processes.",
    health: "Reduces oxygen delivery to the body's organs. At high levels causes confusion, dizziness, and death. Especially dangerous for people with heart disease.",
  },
};

// ─── Water Safety ────────────────────────────────────────────
export const WATER_EXPLAINER = `The EPA tracks drinking water violations through the **Safe Drinking Water Information System (SDWIS)**. Public water systems must meet federal standards for over 90 contaminants. Violations mean a water system failed to meet one of these standards — but not all violations are equal.`;

export const VIOLATION_TYPE_INFO: Record<string, { name: string; severity: string; meaning: string }> = {
  "Max Contaminant Level": {
    name: "Maximum Contaminant Level (MCL)",
    severity: "high",
    meaning: "The water system exceeded the legal limit for a specific contaminant. This is the most serious type of violation — it means the water contained more of a pollutant than federal law allows.",
  },
  MCL: {
    name: "Maximum Contaminant Level (MCL)",
    severity: "high",
    meaning: "The water system exceeded the legal limit for a specific contaminant. This is the most serious type of violation — it means the water contained more of a pollutant than federal law allows.",
  },
  "Treatment Technique": {
    name: "Treatment Technique",
    severity: "medium",
    meaning: "The water system didn't follow required treatment procedures (like filtration or disinfection). The water may still be safe, but the required processes weren't properly followed.",
  },
  TT: {
    name: "Treatment Technique",
    severity: "medium",
    meaning: "The water system didn't follow required treatment procedures (like filtration or disinfection). The water may still be safe, but the required processes weren't properly followed.",
  },
  "Monitoring & Reporting": {
    name: "Monitoring & Reporting",
    severity: "low",
    meaning: "The water system failed to test the water or report results on time. This doesn't necessarily mean the water is unsafe — but it means we don't have confirmation that it was tested properly.",
  },
  MR: {
    name: "Monitoring & Reporting",
    severity: "low",
    meaning: "The water system failed to test the water or report results on time. This doesn't necessarily mean the water is unsafe — but it means we don't have confirmation that it was tested properly.",
  },
  Monitoring: {
    name: "Monitoring",
    severity: "low",
    meaning: "The water system did not conduct required water quality tests. We can't confirm the water meets safety standards because it wasn't checked.",
  },
  MON: {
    name: "Monitoring",
    severity: "low",
    meaning: "The water system did not conduct required water quality tests. We can't confirm the water meets safety standards because it wasn't checked.",
  },
  Reporting: {
    name: "Reporting",
    severity: "low",
    meaning: "Results were not reported to the state on time. The testing may have happened, but the paperwork is missing.",
  },
  RPT: {
    name: "Reporting",
    severity: "low",
    meaning: "Results were not reported to the state on time. The testing may have happened, but the paperwork is missing.",
  },
};

export const CONTAMINANT_HEALTH: Record<string, string> = {
  Lead: "Even low levels of lead exposure can harm brain development in children, causing learning difficulties and behavioral problems. In adults, lead accumulates in bones and can damage kidneys and raise blood pressure.",
  Copper: "High copper levels cause nausea and stomach cramps short-term. Long-term exposure can damage the liver and kidneys. Usually caused by corrosion of household plumbing.",
  Nitrate: "Dangerous for infants under 6 months — can cause 'blue baby syndrome' by reducing the blood's ability to carry oxygen. For adults, very high levels may increase cancer risk.",
  "TTHM (Total Trihalomethanes)": "Disinfection byproducts formed when chlorine reacts with organic matter. Long-term exposure linked to increased risk of bladder cancer and potential reproductive effects.",
  "HAA5 (Haloacetic Acids)": "Another class of disinfection byproducts. Long-term exposure associated with increased cancer risk. Formed during the water treatment process itself.",
  "Coliform (TCR)": "Coliform bacteria indicate possible contamination from sewage or animal waste. While not always harmful themselves, they suggest disease-causing organisms may be present.",
  "E. coli": "A serious contamination indicator — E. coli in drinking water means fecal contamination. Can cause severe illness including bloody diarrhea, kidney failure, and even death in vulnerable populations.",
  Arsenic: "A known carcinogen. Long-term exposure increases risk of skin, bladder, and lung cancer. Also causes skin changes, cardiovascular problems, and diabetes.",
  Fluoride: "At recommended levels (0.7 mg/L), fluoride prevents tooth decay. At very high levels (above 4 mg/L), it can cause bone disease and mottled teeth.",
  Barium: "High levels can cause difficulty breathing, increased blood pressure, changes in heart rhythm, stomach irritation, muscle weakness, and kidney damage.",
  Mercury: "Damages the nervous system, kidneys, and developing fetuses. Even low levels can cause neurological effects. Particularly dangerous during pregnancy.",
  Uranium: "A radioactive element that can cause kidney damage and increase cancer risk with long-term exposure. Found naturally in some groundwater.",
  Turbidity: "Cloudiness in water caused by particles. High turbidity can harbor bacteria and viruses, making disinfection less effective. Not a contaminant itself but an indicator of potential problems.",
  Atrazine: "A widely used herbicide. Potential endocrine disruptor that may affect hormones. Long-term exposure linked to cardiovascular problems and reproductive effects.",
  "Radium-226": "A naturally occurring radioactive element. Long-term exposure increases cancer risk, particularly bone cancer. Found in some groundwater sources.",
  "Radium-228": "Similar to Radium-226, this radioactive element increases cancer risk with prolonged exposure.",
  Chromium: "Chromium-6 (hexavalent chromium) is a known carcinogen when inhaled and a potential carcinogen in drinking water. Linked to stomach cancer in long-term studies.",
  Selenium: "Essential trace mineral at low levels but toxic at high levels. Excess exposure causes hair loss, nail brittleness, and neurological problems.",
};

// ─── Toxic Sites ─────────────────────────────────────────────
export const TRI_EXPLAINER = `The **Toxics Release Inventory (TRI)** tracks facilities that release certain toxic chemicals into the air, water, or land. Facilities that manufacture, process, or use significant amounts of listed toxic chemicals must report annually to the EPA. Being on this list doesn't automatically mean a facility is a health hazard — it means they handle and release reportable amounts of toxic substances.`;

export const TRI_PROXIMITY_INFO = [
  { distance: "< 1 mile", risk: "Highest concern. You may be directly affected by air emissions, especially on windy days or during temperature inversions." },
  { distance: "1–3 miles", risk: "Moderate concern. Airborne chemicals can travel this far, especially fine particles. Ground-level concentrations are usually lower." },
  { distance: "3–10 miles", risk: "Lower direct exposure risk, but some pollutants travel far. Groundwater contamination can affect wider areas." },
  { distance: "> 10 miles", risk: "Minimal direct exposure from air emissions, but check if the facility is upstream of your water supply." },
];

export const INDUSTRY_CHEMICAL_INFO: Record<string, string> = {
  "Chemical Manufacturing": "May release volatile organic compounds (VOCs), acids, heavy metals, and various industrial solvents.",
  "Electric Utilities": "Primary concerns are mercury, sulfur dioxide, nitrogen oxides, and coal ash containing heavy metals.",
  "Metal Mining": "Can release heavy metals (lead, arsenic, mercury, cadmium), acid mine drainage, and dust particles.",
  "Petroleum": "May release benzene, toluene, xylene, hydrogen sulfide, and other hydrocarbons.",
  "Paper Manufacturing": "Common releases include chlorine compounds, dioxins, and various organic chemicals.",
  "Food Manufacturing": "Generally lower toxicity releases — mainly ammonia, nitrate compounds, and some cleaning chemicals.",
  "Hazardous Waste": "Handles a wide variety of toxic materials. Strict controls apply but proximity warrants awareness.",
  "Primary Metals": "Smelters and foundries may release heavy metals, particulate matter, and sulfur compounds.",
  "Plastics and Rubber": "May release styrene, vinyl chloride, plasticizers (phthalates), and various volatile compounds.",
};

// ─── Health Outcomes ─────────────────────────────────────────
export const HEALTH_EXPLAINER = `The **CDC PLACES** dataset provides local health data for every ZIP code in the U.S. These are model-based estimates using data from the Behavioral Risk Factor Surveillance System (BRFSS). Each measure shows the estimated percentage of adults affected, compared to the national average. "Above average" means the local rate is higher than typical — which for diseases and risk factors means the community faces a greater burden.`;

export const MEASURE_DESCRIPTIONS: Record<string, string> = {
  Arthritis: "Joint inflammation causing pain and stiffness. Affects quality of life and mobility. Higher rates may reflect an older population, occupational exposures, or obesity prevalence.",
  "High Blood Pressure": "Consistently elevated blood pressure (above 130/80). A leading cause of heart attacks, strokes, and kidney disease. Often called the 'silent killer' because it usually has no symptoms.",
  "Cancer (excl. skin)": "Percentage of adults who have ever been told they have cancer (excluding skin cancer). Higher rates may reflect environmental exposures, demographic factors, or screening access.",
  "Current Asthma": "Percentage of adults currently having asthma. Air quality, housing conditions, and proximity to pollution sources can worsen asthma. Higher rates suggest respiratory environmental stressors.",
  "Coronary Heart Disease": "Narrowing of heart arteries, leading to chest pain and heart attacks. Linked to air pollution exposure, smoking, diet, and physical inactivity.",
  COPD: "Chronic Obstructive Pulmonary Disease — progressive lung disease making it hard to breathe. Strongly linked to smoking and air pollution. Higher rates suggest environmental or behavioral risk factors.",
  "Current Smoking": "Percentage of adults who currently smoke. A key risk behavior driving heart disease, cancer, and respiratory disease. Higher rates correlate with many other health problems.",
  Depression: "Percentage of adults ever diagnosed with depression. Mental health is influenced by economic stress, social isolation, access to care, and environmental factors.",
  Diabetes: "Percentage of adults with diagnosed diabetes. Linked to obesity, diet, physical inactivity, and socioeconomic factors. Higher rates increase community healthcare burden.",
  "High Cholesterol": "Elevated blood cholesterol levels. A major risk factor for heart disease and stroke. Diet, genetics, and physical activity all play roles.",
  "Chronic Kidney Disease": "Gradual loss of kidney function. Often caused by diabetes and high blood pressure. Environmental toxins (heavy metals, certain chemicals) can also contribute.",
  Obesity: "BMI of 30 or higher. A risk factor for heart disease, diabetes, and some cancers. Influenced by food access, built environment, and socioeconomic factors.",
  "Sleeping <7 Hours": "Insufficient sleep is linked to obesity, heart disease, diabetes, and poor mental health. Environmental noise, shift work, and stress all contribute.",
  Stroke: "Percentage of adults who have had a stroke. Caused by blocked or burst blood vessels in the brain. Air pollution and cardiovascular risk factors increase stroke risk.",
  "All Teeth Lost (65+)": "An indicator of oral health access and overall health. Higher rates suggest barriers to dental care and correlate with poverty and poor nutrition.",
  "Binge Drinking": "Consuming 4+ drinks (women) or 5+ drinks (men) on one occasion. A risk behavior linked to accidents, liver disease, and violence.",
  "Physical Inactivity": "No leisure-time physical activity. Increases risk for virtually every chronic disease. Often reflects lack of safe walking areas and recreational facilities.",
  "Lack of Health Insurance": "No health insurance coverage. A barrier to preventive care, early diagnosis, and chronic disease management. Higher rates mean less access to healthcare.",
  "Poor Mental Health (14+ days)": "Frequent mental distress — 14+ days of poor mental health in the past month. Higher rates indicate significant community mental health burden.",
  "Poor Physical Health (14+ days)": "Frequent physical distress — 14+ days of poor physical health in the past month. Reflects chronic pain, disability, and disease burden.",
  "Poor General Health": "Self-reported fair or poor general health. A strong predictor of mortality and healthcare utilization.",
  "Annual Checkup": "Percentage getting a routine checkup in the past year. Higher rates indicate better preventive care access.",
  "Mammography Use": "Percentage of women 50-74 getting mammograms. Higher rates indicate better breast cancer screening.",
  "Cervical Cancer Screening": "Percentage of women 21-65 screened for cervical cancer. Higher rates mean better preventive care.",
  "Colorectal Cancer Screening": "Percentage of adults 50-75 screened for colorectal cancer. Higher screening rates can catch cancer early.",
  "BP Medication Adherence": "Percentage of adults with high blood pressure taking their medication. Higher is better — means better chronic disease management.",
  "Dental Visit": "Annual dental visit. Indicator of oral health care access.",
  "Cholesterol Screening": "Getting cholesterol checked. Helps catch heart disease risk early.",
};

// ─── Natural Hazards ─────────────────────────────────────────
export const HAZARD_EXPLAINER = `The **FEMA National Risk Index** assesses natural hazard risk for every county in the U.S. It combines the expected annual frequency, historical losses, social vulnerability, and community resilience for 18 natural hazard types. Risk ratings are relative — "Very High" means this county faces more risk than most U.S. counties, not that a disaster is imminent.`;

export const HAZARD_DETAILS: Record<string, { meaning: string; preparedness: string[] }> = {
  Earthquake: {
    meaning: "Risk of ground shaking from seismic activity. Even moderate earthquakes can damage buildings and infrastructure, particularly older structures not built to modern codes.",
    preparedness: [
      "Secure heavy furniture and water heaters to walls",
      "Keep emergency supplies: water, food, flashlight, first aid kit",
      "Know how to 'Drop, Cover, and Hold On'",
      "Check if your home needs seismic retrofitting",
    ],
  },
  "Riverine Flooding": {
    meaning: "Risk of rivers and streams overflowing their banks. The most common and costly natural disaster in the U.S. Even a few inches of floodwater can cause extensive damage.",
    preparedness: [
      "Check if you're in a FEMA flood zone (floodsmart.gov)",
      "Consider flood insurance — standard homeowners policies don't cover floods",
      "Keep important documents in waterproof containers above ground floor",
      "Know your evacuation routes",
    ],
  },
  "Inland Flooding": {
    meaning: "Flooding from heavy rainfall overwhelming drainage systems, not necessarily near rivers. Increasingly common as development creates more impervious surfaces.",
    preparedness: [
      "Don't drive through flooded roads — 'Turn Around, Don't Drown'",
      "Clear storm drains near your property",
      "Consider a sump pump with battery backup",
      "Keep valuables off basement/ground floors",
    ],
  },
  Hurricane: {
    meaning: "Risk from tropical cyclones bringing extreme wind, heavy rain, storm surge, and flooding. Hurricanes can impact areas hundreds of miles inland.",
    preparedness: [
      "Have a hurricane plan with evacuation route identified",
      "Stock 3-7 days of water, food, and medications",
      "Install storm shutters or keep plywood for windows",
      "Know your evacuation zone (A, B, C)",
    ],
  },
  Tornado: {
    meaning: "Risk of violent rotating columns of air. Tornadoes can strike with little warning and cause catastrophic damage in a narrow path. Most common in spring and early summer.",
    preparedness: [
      "Identify a safe room — interior room on the lowest floor, away from windows",
      "Get a NOAA Weather Radio for alerts",
      "Practice tornado drills with your family",
      "Know the difference between a Watch (conditions favorable) and Warning (tornado spotted)",
    ],
  },
  Wildfire: {
    meaning: "Risk of uncontrolled fire in wildland areas. Wildfires can spread rapidly, destroy homes, and create dangerous smoke conditions for hundreds of miles.",
    preparedness: [
      "Create defensible space: clear vegetation 30+ feet from your home",
      "Use fire-resistant roofing and siding materials",
      "Have a 'go bag' ready with essentials for quick evacuation",
      "Sign up for local emergency alerts",
    ],
  },
  "Winter Weather": {
    meaning: "Risk from ice storms, heavy snow, extreme cold, and blizzards. Can cause power outages, dangerous road conditions, and hypothermia risk.",
    preparedness: [
      "Winterize your home: insulate pipes, check heating system",
      "Keep emergency supplies including blankets, flashlights, and extra water",
      "Maintain at least a half-tank of gas in your vehicle in winter",
      "Know signs of hypothermia and frostbite",
    ],
  },
  Hail: {
    meaning: "Risk of large ice stones falling during severe thunderstorms. Large hail can damage roofs, vehicles, crops, and injure people caught outside.",
    preparedness: [
      "Move vehicles under cover when severe storms approach",
      "Consider impact-resistant roofing materials",
      "Seek shelter indoors during hailstorms — stay away from windows",
    ],
  },
  "Heat Wave": {
    meaning: "Risk of prolonged extreme heat. Heat is the #1 weather-related killer in the U.S. Dangerous for elderly, young children, outdoor workers, and those without air conditioning.",
    preparedness: [
      "Stay hydrated — drink water before you feel thirsty",
      "Never leave children or pets in parked cars",
      "Know where cooling centers are located in your community",
      "Check on elderly neighbors during extreme heat",
    ],
  },
  "Strong Wind": {
    meaning: "Risk of damaging straight-line winds (not tornado-related). Can down trees and power lines, damage roofs, and create dangerous flying debris.",
    preparedness: [
      "Secure outdoor furniture, trampolines, and loose items",
      "Trim trees near your home, especially dead branches",
      "Consider a backup power source for extended outages",
    ],
  },
  Lightning: {
    meaning: "Risk of lightning strikes. Lightning kills about 20 people per year in the U.S. and injures hundreds. It can also start fires and damage electronics.",
    preparedness: [
      "When Thunder Roars, Go Indoors — seek shelter immediately",
      "Use surge protectors for electronics",
      "Avoid open fields, hilltops, and tall isolated trees during storms",
    ],
  },
  Drought: {
    meaning: "Risk of extended dry periods. Drought affects water supply, agriculture, and increases wildfire risk. Can lead to water restrictions and higher food prices.",
    preparedness: [
      "Practice water conservation habits",
      "Consider drought-resistant landscaping",
      "Maintain awareness of local water restrictions",
    ],
  },
  "Coastal Flooding": {
    meaning: "Risk of ocean water flooding coastal areas, driven by storms, high tides, and sea level rise. This risk is increasing with climate change.",
    preparedness: [
      "Know your flood zone and get flood insurance",
      "Elevate utilities and HVAC above expected flood levels",
      "Have an evacuation plan for storm surge events",
      "Monitor tidal forecasts during storm season",
    ],
  },
};

// ─── Recommendations Generator ───────────────────────────────
export interface Recommendation {
  category: string;
  icon: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actions: string[];
}

export function generateRecommendations(
  airQuality: import("./types").AirQualityData | null,
  waterSafety: import("./types").WaterSafetyData | null,
  toxicSites: import("./types").ToxicSitesData | null,
  healthOutcomes: import("./types").HealthOutcomesData | null,
  naturalHazards: import("./types").NaturalHazardsData | null
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Air Quality Recommendations
  if (airQuality?.aqi !== null && airQuality?.aqi !== undefined) {
    if (airQuality.aqi > 100) {
      recs.push({
        category: "Air Quality",
        icon: "💨",
        title: "Protect Yourself from Poor Air Quality",
        description: `With an AQI of ${airQuality.aqi}, the air quality needs attention. ${airQuality.aqi > 150 ? "This level poses health risks for everyone, not just sensitive groups." : "Sensitive groups including children, elderly, and those with respiratory conditions should take extra care."}`,
        priority: airQuality.aqi > 150 ? "high" : "medium",
        actions: [
          "Use a HEPA air purifier indoors — especially in bedrooms",
          "Check AirNow.gov daily before outdoor activities",
          "Exercise outdoors in the early morning when AQI tends to be lower",
          "Keep windows closed on high-AQI days",
          airQuality.aqi > 150 ? "Consider an N95 mask for outdoor activities" : "Limit prolonged outdoor exertion during peak hours (midday–evening)",
        ],
      });
    } else if (airQuality.aqi > 50) {
      recs.push({
        category: "Air Quality",
        icon: "💨",
        title: "Monitor Air Quality",
        description: "Air quality is generally acceptable but occasionally reaches moderate levels. Stay informed to protect yourself on bad days.",
        priority: "low",
        actions: [
          "Bookmark AirNow.gov for your ZIP code",
          "If you have asthma or heart disease, keep medication accessible",
          "On moderate days, exercise early morning when ozone is typically lower",
        ],
      });
    }

    // Specific pollutant recommendations
    const highPollutants = airQuality.pollutants.filter(p => p.aqi > 50);
    for (const p of highPollutants) {
      if (p.name === "O3" || p.name.includes("Ozone")) {
        recs.push({
          category: "Air Quality",
          icon: "☀️",
          title: "Ozone Alert",
          description: "Ground-level ozone is elevated. Ozone levels peak on hot, sunny afternoons.",
          priority: p.aqi > 100 ? "medium" : "low",
          actions: [
            "Schedule outdoor exercise for early morning (before 10 AM)",
            "Ozone levels drop significantly in the evening and overnight",
            "Children should avoid heavy outdoor play during afternoon hours",
          ],
        });
        break;
      }
    }
  }

  // Water Safety Recommendations
  if (waterSafety && waterSafety.totalViolations > 0) {
    const hasHealthBased = waterSafety.violations.some(v => v.enforcementAction === "Health-based violation");
    const hasMCL = waterSafety.violations.some(v => v.violationType === "Max Contaminant Level" || v.violationType === "MCL");
    const contaminants = [...new Set(waterSafety.violations.map(v => v.contaminantName).filter(n => !n.includes("No contaminant")))];
    
    const hasLead = contaminants.some(c => c.toLowerCase().includes("lead"));
    const hasTTHM = contaminants.some(c => c.includes("TTHM") || c.includes("Trihalomethane"));
    const hasColiform = contaminants.some(c => c.includes("Coliform") || c.includes("E. coli"));
    const hasNitrate = contaminants.some(c => c.toLowerCase().includes("nitrate"));

    const filterRecs: string[] = [];
    if (hasLead) {
      filterRecs.push("Install an NSF-certified lead-reduction filter (look for NSF/ANSI 53 certification)");
      filterRecs.push("Run cold water for 30 seconds before drinking if pipes have been idle — lead dissolves from pipes into standing water");
    }
    if (hasTTHM) {
      filterRecs.push("A carbon block filter (like Brita or PUR) effectively reduces disinfection byproducts like TTHMs");
    }
    if (hasColiform) {
      filterRecs.push("Consider a UV water purifier or boil water advisories from your utility");
    }
    if (hasNitrate) {
      filterRecs.push("Use reverse osmosis filtration for nitrate removal — standard carbon filters don't remove nitrates");
      filterRecs.push("Do NOT boil water to remove nitrates — boiling concentrates them");
    }
    if (filterRecs.length === 0) {
      filterRecs.push("Consider a multi-stage water filter (reverse osmosis or carbon block) for extra protection");
    }

    filterRecs.push("Request your water utility's annual Consumer Confidence Report (CCR) for detailed water quality info");
    filterRecs.push("Consider getting a home water test kit for $20-50 to check your specific tap water");

    recs.push({
      category: "Water Safety",
      icon: "💧",
      title: hasHealthBased ? "Address Water Quality Concerns" : "Monitor Your Water Quality",
      description: `${waterSafety.totalViolations} violation(s) found${contaminants.length > 0 ? ` involving ${contaminants.slice(0, 3).join(", ")}` : ""}. ${hasMCL ? "Some exceed maximum contaminant levels, which means action is recommended." : "Most are monitoring/reporting issues, but staying informed is wise."}`,
      priority: hasHealthBased || hasMCL ? "high" : "medium",
      actions: filterRecs,
    });
  }

  // Toxic Sites Recommendations
  if (toxicSites && toxicSites.totalFacilities > 0) {
    const actions: string[] = [];
    if (toxicSites.totalFacilities >= 5) {
      actions.push("Check EPA's TRI Explorer (epa.gov/triexplorer) for specific chemicals released by each facility");
      actions.push("Consider a home air quality monitor to track indoor air quality");
      actions.push("If you notice unusual odors, report them to your state environmental agency");
    }
    actions.push("Review EPA's Envirofacts (envirofacts.epa.gov) for detailed facility information");
    actions.push("Attend any public comment periods for facility permits in your area");
    if (toxicSites.totalFacilities > 2) {
      actions.push("Consider getting soil tested if you grow food in your yard");
    }

    recs.push({
      category: "Toxic Sites",
      icon: "☢️",
      title: `${toxicSites.totalFacilities} TRI Facilities Nearby`,
      description: `There are ${toxicSites.totalFacilities} facilities reporting toxic chemical releases in your ZIP code. The actual health impact depends on what chemicals they release, in what quantities, and how close you are.`,
      priority: toxicSites.totalFacilities >= 5 ? "medium" : "low",
      actions,
    });
  }

  // Health Outcomes Recommendations
  if (healthOutcomes && healthOutcomes.measures.length > 0) {
    const aboveMeasures = healthOutcomes.measures.filter(m => m.comparison === "above");
    
    if (aboveMeasures.length > 0) {
      const screeningRecs: string[] = [];
      
      const hasCardio = aboveMeasures.some(m => m.category === "Cardiovascular");
      const hasRespiratory = aboveMeasures.some(m => m.category === "Respiratory");
      const hasMental = aboveMeasures.some(m => m.category === "Mental Health");
      const hasDiabetes = aboveMeasures.some(m => m.measureName.includes("Diabetes"));
      const hasCancer = aboveMeasures.some(m => m.measureName.includes("Cancer"));
      
      if (hasCardio) {
        screeningRecs.push("Get regular blood pressure and cholesterol screenings — this area has elevated cardiovascular risk");
        screeningRecs.push("Heart-healthy diet: more fruits, vegetables, whole grains; less sodium and processed food");
      }
      if (hasRespiratory) {
        screeningRecs.push("If you experience breathing difficulties, seek evaluation — local asthma/COPD rates are elevated");
        screeningRecs.push("Ask about pulmonary function testing, especially if you're a current or former smoker");
      }
      if (hasMental) {
        screeningRecs.push("Mental health screenings are important — depression rates are above average in this area");
        screeningRecs.push("SAMHSA helpline: 1-800-662-4357 (free, confidential, 24/7)");
      }
      if (hasDiabetes) {
        screeningRecs.push("Get regular blood glucose testing — local diabetes rates are elevated");
        screeningRecs.push("Physical activity (even 30 min/day walking) significantly reduces diabetes risk");
      }
      if (hasCancer) {
        screeningRecs.push("Stay up to date on cancer screenings (colonoscopy, mammogram, etc.)");
      }
      
      if (screeningRecs.length === 0) {
        screeningRecs.push("Schedule annual wellness checkups with your primary care provider");
        screeningRecs.push("Stay up to date on recommended screenings for your age group");
      }

      recs.push({
        category: "Health",
        icon: "🏥",
        title: "Health Screening Recommendations",
        description: `${aboveMeasures.length} health measure(s) are above the national average in this area. This doesn't mean you'll be affected, but being proactive about screenings is smart.`,
        priority: aboveMeasures.length > 5 ? "medium" : "low",
        actions: screeningRecs,
      });
    }
  }

  // Natural Hazards Recommendations
  if (naturalHazards && naturalHazards.hazards.length > 0) {
    const highRiskHazards = naturalHazards.hazards.filter(
      h => h.riskRating === "Very High" || h.riskRating === "Relatively High"
    );

    if (highRiskHazards.length > 0) {
      const prepActions: string[] = [];
      prepActions.push("Build an emergency kit: 3 days of water (1 gallon/person/day), non-perishable food, medications, flashlight, batteries");
      prepActions.push("Sign up for local emergency alerts (FEMA app, local emergency management)");
      
      for (const h of highRiskHazards.slice(0, 3)) {
        const details = HAZARD_DETAILS[h.name];
        if (details && details.preparedness.length > 0) {
          prepActions.push(`**${h.name}**: ${details.preparedness[0]}`);
        }
      }
      
      prepActions.push("Review your insurance coverage — standard policies often don't cover floods or earthquakes");
      prepActions.push("Make a family communication plan for emergencies");

      recs.push({
        category: "Natural Hazards",
        icon: "🌪️",
        title: "Emergency Preparedness",
        description: `This area has elevated risk for ${highRiskHazards.map(h => h.name.toLowerCase()).join(", ")}. Being prepared can make a major difference.`,
        priority: highRiskHazards.length >= 3 ? "high" : "medium",
        actions: prepActions,
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recs;
}
