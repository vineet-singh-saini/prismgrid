import { getPermissionsForRole } from "../constants/roles.js";

function formatCurrencyCr(value) {
  return `INR ${Number(value ?? 0).toFixed(1)}Cr`;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatRelativeTime(value) {
  if (!value) {
    return "Just now";
  }

  const now = Date.now();
  const time = new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.round((now - time) / 60000));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
}

export function serializeUser(user) {
  return {
    id: user._id.toString(),
    workspaceKey: user.workspaceKey,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    permissions: getPermissionsForRole(user.role),
    title: user.title,
    organization: user.organization,
    region: user.region,
    shift: user.shift,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function serializeVendor(vendor) {
  return {
    id: vendor._id.toString(),
    name: vendor.name,
    reliability: vendor.reliability,
    delayedDeliveries: vendor.delayedDeliveries,
    complianceIssues: vendor.complianceIssues,
    costDeviation: vendor.costDeviation,
    riskLevel: vendor.riskLevel,
    status: vendor.status,
    note: vendor.note,
    updatedAt: vendor.updatedAt,
  };
}

export function serializeProject(project) {
  return {
    id: project.slug,
    databaseId: project._id.toString(),
    code: project.code,
    name: project.name,
    region: project.region,
    sector: project.sector,
    status: project.status,
    riskLevel: project.riskLevel,
    riskScore: project.riskScore,
    progress: project.progress,
    confidence: project.confidence,
    delayProbability: project.delayProbability,
    costVarianceCr: project.costVarianceCr,
    costVariance: formatCurrencyCr(project.costVarianceCr),
    budgetCr: project.budgetCr,
    budget: formatCurrencyCr(project.budgetCr),
    spentCr: project.spentCr,
    spent: formatCurrencyCr(project.spentCr),
    manager: project.manager,
    nextMilestone: project.nextMilestone,
    deadlineAt: project.deadlineAt,
    deadline: formatDate(project.deadlineAt),
    summary: project.summary,
    drivers: project.drivers,
    interventions: project.interventions,
    milestones: project.milestones,
    decisionLog: project.decisionLog,
    vendorNotes: project.vendorNotes,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export function serializeAlert(alert) {
  return {
    id: alert._id.toString(),
    severity: alert.severity,
    title: alert.title,
    projectId: alert.projectSlug,
    project: alert.projectName,
    owner: alert.owner,
    assignee: alert.assignee,
    status: alert.status,
    time: formatRelativeTime(alert.createdAt),
    reason: alert.reason,
    recommendation: alert.recommendation,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt,
  };
}

export function serializeReport(report) {
  return {
    id: report._id.toString(),
    title: report.title,
    subtitle: report.subtitle,
    status: report.status,
    cadence: report.cadence,
    generatedAt: report.generatedAt,
    generatedAtLabel: formatDate(report.generatedAt),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

export function serializeSimulationRun(simulationRun) {
  return {
    id: simulationRun._id.toString(),
    projectId: simulationRun.projectSlug,
    projectName: simulationRun.projectName,
    name: simulationRun.name,
    budget: simulationRun.budget,
    vendor: simulationRun.vendor,
    manpower: simulationRun.manpower,
    timeline: simulationRun.timeline,
    simulatedRisk: simulationRun.simulatedRisk,
    delayProbability: simulationRun.delayProbability,
    costOverrunCr: simulationRun.costOverrunCr,
    costOverrun: formatCurrencyCr(simulationRun.costOverrunCr),
    predictedCostOverrunPct: simulationRun.predictedCostOverrunPct,
    riskLevel: simulationRun.riskLevel,
    confidence: simulationRun.confidence,
    recommendations: simulationRun.recommendations,
    summary: simulationRun.summary,
    createdAt: simulationRun.createdAt,
    createdAtLabel: formatDate(simulationRun.createdAt),
  };
}
