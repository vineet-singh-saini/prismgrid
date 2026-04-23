function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function levelFromValue(value, lowThreshold, highThreshold) {
  if (value >= highThreshold) {
    return "High";
  }
  if (value >= lowThreshold) {
    return "Medium";
  }
  return "Low";
}

export function mapScenarioToMlPayload(scenario) {
  const vendorRating = clamp(Math.round(scenario.vendor / 20), 1, 5);
  const rainfallLevel = levelFromValue(scenario.timeline, 8, 18);
  const laborAvailability = scenario.manpower >= 78 ? "High" : scenario.manpower >= 52 ? "Medium" : "Low";
  const materialAvailability = scenario.budget >= 20 ? "High" : scenario.budget >= 10 ? "Medium" : "Low";
  const projectComplexity = levelFromValue(scenario.timeline + (100 - scenario.manpower) / 8, 8, 16);
  const budgetUtilization = clamp(100 - scenario.budget * 1.8, 35, 100);
  const scheduleVarianceDays = clamp(scenario.timeline, -10, 60);
  const complianceIssues = clamp(Math.round((100 - scenario.vendor) / 22 + scenario.timeline / 10), 0, 8);
  const teamExperienceYears = clamp(Number((4 + scenario.manpower / 10).toFixed(1)), 1, 20);
  const changeRequestCount = clamp(Math.round((100 - scenario.vendor) / 7 + scenario.timeline / 5), 0, 25);
  const safetyIncidents = clamp(Math.round((scenario.timeline + (100 - scenario.manpower) / 5) / 12), 0, 6);

  return {
    Vendor_Rating: vendorRating,
    Rainfall_Level: rainfallLevel,
    Labor_Availability: laborAvailability,
    Material_Availability: materialAvailability,
    Project_Complexity: projectComplexity,
    Budget_Utilization: Number(budgetUtilization.toFixed(2)),
    Schedule_Variance_Days: Number(scheduleVarianceDays.toFixed(2)),
    Compliance_Issues: complianceIssues,
    Team_Experience_Years: teamExperienceYears,
    Change_Request_Count: changeRequestCount,
    Safety_Incidents: safetyIncidents,
  };
}

export function mapMlPredictionToScenarioOutcome(prediction, linkedProject) {
  const delayProbabilityPct = clamp(
    Math.round(Number(prediction.delay_probability ?? 0) * 100),
    0,
    100
  );
  const predictedCostOverrunPct = clamp(
    Number(prediction.predicted_cost_overrun_pct ?? 0),
    0,
    100
  );
  const projectedBudgetCr = Number(linkedProject?.budgetCr ?? 0);
  const costOverrunCr =
    projectedBudgetCr > 0
      ? Number(((projectedBudgetCr * predictedCostOverrunPct) / 100).toFixed(2))
      : Number((predictedCostOverrunPct / 10).toFixed(2));
  const simulatedRisk = clamp(
    Math.round(delayProbabilityPct * 0.68 + predictedCostOverrunPct * 0.95),
    0,
    100
  );

  return {
    simulatedRisk,
    delayProbability: delayProbabilityPct,
    costOverrunCr: Math.max(0.2, costOverrunCr),
    riskLevel: prediction.risk_level ?? "Medium",
    confidence: Number(prediction.confidence ?? 0),
    recommendations: Array.isArray(prediction.recommendations)
      ? prediction.recommendations
      : [],
    predictedCostOverrunPct,
  };
}
