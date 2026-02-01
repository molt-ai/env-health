import { WaterSafetyData, WaterViolation } from "../types";

interface WaterSystem {
  pwsid: string;
  pws_name: string;
  population_served_count: number;
  pws_activity_code: string;
}

interface ViolationRecord {
  pwsid: string;
  contaminant_code: string;
  violation_code: string;
  violation_category_code: string;
  is_health_based_ind: string;
  compl_per_begin_date: string;
  rule_code: string;
  rule_family_code: string;
  compliance_status_code: string;
}

// Map contaminant codes to names
const CONTAMINANT_NAMES: Record<string, string> = {
  "1005": "Barium", "1010": "Cadmium", "1015": "Chromium",
  "1020": "Fluoride", "1024": "Cyanide", "1025": "Mercury",
  "1030": "Nitrate", "1035": "Selenium", "1036": "Nickel",
  "1038": "Uranium", "1040": "Lead", "1041": "Copper",
  "1074": "Antimony", "1075": "Beryllium", "1085": "Thallium",
  "2039": "Atrazine", "2050": "Lindane", "2065": "Simazine",
  "2105": "2,4-D", "2378": "Glyphosate",
  "2950": "TTHM (Total Trihalomethanes)", "2456": "HAA5 (Haloacetic Acids)",
  "3000": "Coliform (TCR)", "3014": "E. coli", "3100": "Turbidity",
  "4000": "Gross Alpha", "4006": "Uranium", "4010": "Radium-226",
  "4020": "Radium-228", "4100": "Gross Beta",
  "5000": "No contaminant (reporting violation)",
};

// Map violation categories  
const VIOLATION_TYPES: Record<string, string> = {
  MCL: "Max Contaminant Level",
  MR: "Monitoring & Reporting",
  TT: "Treatment Technique",
  MON: "Monitoring",
  RPT: "Reporting",
  Other: "Other",
};

export async function fetchWaterViolations(zip: string): Promise<WaterSafetyData | null> {
  try {
    // Step 1: Get water systems serving this ZIP
    const systemsUrl = `https://data.epa.gov/efservice/WATER_SYSTEM/ZIP_CODE/${zip}/JSON`;
    const systemsRes = await fetch(systemsUrl, {
      signal: AbortSignal.timeout(15000),
    });

    if (!systemsRes.ok) {
      console.error(`EPA Water Systems API error: ${systemsRes.status}`);
      return null;
    }

    const systems: WaterSystem[] = await systemsRes.json();

    if (!systems || systems.length === 0) {
      return {
        totalViolations: 0,
        violations: [],
        summary: "No public water systems found for this ZIP code.",
      };
    }

    // Step 2: Get violations for the active/largest water systems
    const activeSystems = systems
      .filter((s) => s.pws_activity_code === "A" || s.pws_activity_code === "N")
      .sort((a, b) => (b.population_served_count || 0) - (a.population_served_count || 0))
      .slice(0, 5); // Check top 5 by population served

    if (activeSystems.length === 0) {
      return {
        totalViolations: 0,
        violations: [],
        summary: `Found ${systems.length} water system(s) but none currently active. No violations to report.`,
      };
    }

    const allViolations: WaterViolation[] = [];
    let totalViolationCount = 0;

    // Fetch violations for each system in parallel
    const violationPromises = activeSystems.map(async (sys) => {
      try {
        const violUrl = `https://data.epa.gov/efservice/VIOLATION/PWSID/${sys.pwsid}/JSON`;
        const violRes = await fetch(violUrl, {
          signal: AbortSignal.timeout(10000),
        });
        if (!violRes.ok) return [];
        const violations: ViolationRecord[] = await violRes.json();
        return violations.map((v) => ({
          ...v,
          pws_name: sys.pws_name,
        }));
      } catch {
        return [];
      }
    });

    const violationResults = await Promise.all(violationPromises);

    for (const violations of violationResults) {
      totalViolationCount += violations.length;

      for (const v of violations) {
        const contaminantName =
          CONTAMINANT_NAMES[v.contaminant_code] || `Contaminant ${v.contaminant_code}`;
        const violationType =
          VIOLATION_TYPES[v.violation_category_code] || v.violation_category_code || "Unknown";

        allViolations.push({
          contaminantName,
          violationType,
          compliancePeriod: v.compl_per_begin_date
            ? new Date(v.compl_per_begin_date).toLocaleDateString()
            : "N/A",
          pwsName: (v as ViolationRecord & { pws_name: string }).pws_name || "Unknown",
          enforcementAction:
            v.is_health_based_ind === "Y" ? "Health-based violation" : null,
        });
      }
    }

    // Sort by date (newest first) and deduplicate
    allViolations.sort((a, b) => {
      if (a.compliancePeriod === "N/A") return 1;
      if (b.compliancePeriod === "N/A") return -1;
      return new Date(b.compliancePeriod).getTime() - new Date(a.compliancePeriod).getTime();
    });

    // Count by contaminant
    const contaminantCounts: Record<string, number> = {};
    for (const v of allViolations) {
      if (v.contaminantName.includes("No contaminant")) continue;
      contaminantCounts[v.contaminantName] = (contaminantCounts[v.contaminantName] || 0) + 1;
    }

    const healthBased = allViolations.filter(
      (v) => v.enforcementAction === "Health-based violation"
    ).length;

    const topContaminants = Object.entries(contaminantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name} (${count})`);

    let summary: string;
    if (totalViolationCount === 0) {
      summary = `Found ${activeSystems.length} water system(s) with no violations on record. This is a positive indicator.`;
    } else {
      summary = `Found ${totalViolationCount} violation(s) across ${activeSystems.length} water system(s).`;
      if (healthBased > 0) summary += ` ${healthBased} are health-based.`;
      if (topContaminants.length > 0) summary += ` Top issues: ${topContaminants.join(", ")}.`;
    }

    return {
      totalViolations: totalViolationCount,
      violations: allViolations.slice(0, 20),
      summary,
    };
  } catch (error) {
    console.error("EPA Water fetch error:", error);
    return null;
  }
}
