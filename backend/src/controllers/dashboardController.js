import { Alert } from "../models/Alert.js";
import { Project } from "../models/Project.js";
import { Report } from "../models/Report.js";
import { SimulationRun } from "../models/SimulationRun.js";
import { Vendor } from "../models/Vendor.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import {
  serializeAlert,
  serializeProject,
  serializeReport,
  serializeSimulationRun,
  serializeVendor,
} from "../utils/serializers.js";

function buildMonthLabels() {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
}

export async function getDashboardSummary(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);

  const [projects, alerts, vendors, reports, simulationRuns] = await Promise.all([
    Project.find({ workspaceKey }).sort({ riskScore: -1 }),
    Alert.find({ workspaceKey }).sort({ createdAt: -1 }).limit(6),
    Vendor.find({ workspaceKey }).sort({ reliability: -1 }),
    Report.find({ workspaceKey }).sort({ updatedAt: -1 }).limit(4),
    SimulationRun.find({ workspaceKey }).sort({ createdAt: -1 }).limit(4),
  ]);

  const totalProjects = projects.length;
  const averageDelay =
    totalProjects === 0
      ? 0
      : Math.round(
          projects.reduce((sum, project) => sum + project.delayProbability, 0) / totalProjects
        );
  const totalCostDrift = projects.reduce(
    (sum, project) => sum + Number(project.costVarianceCr ?? 0),
    0
  );
  const activeMitigations = projects.reduce(
    (sum, project) => sum + (project.riskLevel === "low" ? 0 : 1),
    0
  );
  const averageRisk =
    totalProjects === 0
      ? 0
      : Math.round(projects.reduce((sum, project) => sum + project.riskScore, 0) / totalProjects);
  const averageConfidence =
    totalProjects === 0
      ? 0
      : Math.round(
          projects.reduce((sum, project) => sum + project.confidence, 0) / totalProjects
        );

  const dashboardMetrics = [
    {
      title: "Projects Under Active Surveillance",
      value: String(totalProjects),
      change: `${projects.filter((project) => project.riskLevel === "high").length} on critical watch`,
      tone: "neutral",
    },
    {
      title: "Portfolio Delay Exposure",
      value: `${averageDelay}%`,
      change: `${alerts.filter((alert) => alert.status !== "resolved").length} active signals in triage`,
      tone: "warning",
    },
    {
      title: "Predicted Cost Drift",
      value: `INR ${totalCostDrift.toFixed(1)}Cr`,
      change: "Aggregated from current program variance",
      tone: "danger",
    },
    {
      title: "Mitigations In Motion",
      value: String(activeMitigations),
      change: `${reports.filter((report) => report.status !== "Draft").length} report packs refreshed`,
      tone: "success",
    },
  ];

  const monthLabels = buildMonthLabels();
  const portfolioTrend = monthLabels.map((month, index) => {
    const progression = index / Math.max(1, monthLabels.length - 1);

    return {
      month,
      risk: Math.max(28, Math.round(averageRisk - 12 + progression * 12)),
      delay: Math.max(22, Math.round(averageDelay - 10 + progression * 10)),
      cost: Math.max(18, Math.round(totalCostDrift * 8 - 6 + progression * 6)),
      confidence: Math.min(96, Math.round(averageConfidence - 8 + progression * 8)),
    };
  });

  const portfolioMix = [
    {
      name: "Stable",
      value: projects.filter((project) => project.riskLevel === "low").length,
    },
    {
      name: "Watch",
      value: projects.filter((project) => project.riskLevel === "medium").length,
    },
    {
      name: "Critical",
      value: projects.filter((project) => project.riskLevel === "high").length,
    },
  ];

  const interventionImpact = projects.slice(0, 4).map((project) => ({
    name: project.name,
    baseline: project.riskScore,
    mitigated: Math.max(20, project.riskScore - Math.max(8, project.interventions.length * 4)),
  }));

  const assistantSuggestions = projects.slice(0, 3).map((project) => ({
    title: project.interventions[0] ?? `Review ${project.nextMilestone}`,
    body: project.summary,
    confidence: `${project.confidence}% confidence`,
  }));

  const complianceItems = alerts.slice(0, 3).map((alert) => ({
    title: alert.title,
    owner: alert.owner,
    status:
      alert.status === "resolved"
        ? "Resolved"
        : alert.status === "in-progress"
          ? "Attention required"
          : "Open for triage",
    severity: alert.severity,
  }));

  const operationsFeed = [
    ...alerts.slice(0, 2).map((alert) => ({
      title: alert.title,
      meta: `${alert.projectName} | ${alert.owner}`,
      detail: alert.recommendation,
    })),
    ...simulationRuns.slice(0, 1).map((simulationRun) => ({
      title: `Scenario saved: ${simulationRun.name}`,
      meta: `${simulationRun.projectName || "Portfolio"} | Scenario Lab`,
      detail: simulationRun.summary || "What-if model captured for later review.",
    })),
    ...reports.slice(0, 1).map((report) => ({
      title: `${report.title} refreshed`,
      meta: `${report.cadence} | Reporting layer`,
      detail: report.subtitle,
    })),
  ].slice(0, 4);

  response.json({
    summary: {
      dashboardMetrics,
      portfolioTrend,
      portfolioMix,
      interventionImpact,
      assistantSuggestions,
      complianceItems,
      operationsFeed,
      topProjects: projects.slice(0, 3).map(serializeProject),
      projectsTable: projects.map(serializeProject),
      alerts: alerts.map(serializeAlert),
      vendors: vendors.map(serializeVendor),
      reports: reports.map(serializeReport),
      simulations: simulationRuns.map(serializeSimulationRun),
    },
  });
}
