import { seedAlerts, seedProjects, seedReports, seedVendors } from "../data/seedData.js";
import { Alert } from "../models/Alert.js";
import { Project } from "../models/Project.js";
import { Report } from "../models/Report.js";
import { SimulationRun } from "../models/SimulationRun.js";
import { Vendor } from "../models/Vendor.js";
import { computeScenarioOutcome } from "../utils/scenario.js";
import { slugify, getWorkspaceKeyFromOrganization } from "../utils/workspace.js";

const legacySampleProjectSlugs = new Set([
  "metro-phase-2",
  "western-solar-grid",
  "riverfront-bridge-link",
  "smart-highway-corridor",
  "eastern-water-network",
]);
const legacySampleVendorNames = [
  "Axis Infra Supply",
  "BuildCore Logistics",
  "Nova Steel Partners",
  "TerraGrid Systems",
];
const legacySampleReportTitles = [
  "Executive Risk Command Brief",
  "Vendor Reliability & Compliance Pack",
  "Scenario Decision Review",
];

const currentSampleProjectSlugs = new Set(seedProjects.map((project) => project.slug));
const demoProjectSlugs = new Set([...legacySampleProjectSlugs, ...currentSampleProjectSlugs]);

function buildAlertKey(alert) {
  return `${alert.projectSlug}::${alert.title}`;
}

async function resetLegacyDemoWorkspace(workspaceKey) {
  const projects = await Project.find({ workspaceKey }).select("slug");

  if (!projects.length) {
    return;
  }

  const legacyProjectSlugs = projects
    .filter((project) => legacySampleProjectSlugs.has(project.slug))
    .map((project) => project.slug);

  if (!legacyProjectSlugs.length) {
    return;
  }

  await Promise.all([
    Alert.deleteMany({
      workspaceKey,
      projectSlug: { $in: legacyProjectSlugs },
    }),
    Report.deleteMany({
      workspaceKey,
      title: { $in: legacySampleReportTitles },
    }),
    SimulationRun.deleteMany({
      workspaceKey,
      projectSlug: { $in: legacyProjectSlugs },
    }),
    Project.deleteMany({
      workspaceKey,
      slug: { $in: legacyProjectSlugs },
    }),
    Vendor.deleteMany({
      workspaceKey,
      name: { $in: legacySampleVendorNames },
    }),
  ]);
}

async function seedDemoWorkspace(workspaceKey) {
  const seedVendorNames = seedVendors.map((vendor) => vendor.name);
  const seedProjectIds = seedProjects.map((project) => project.slug);
  const seedReportTitles = seedReports.map((report) => report.title);

  const existingVendors = await Vendor.find({
    workspaceKey,
    name: { $in: seedVendorNames },
  }).select("name");
  const existingVendorNames = new Set(existingVendors.map((vendor) => vendor.name));

  const vendorsToInsert = seedVendors
    .filter((vendor) => !existingVendorNames.has(vendor.name))
    .map((vendor) => ({
      workspaceKey,
      ...vendor,
      nameSlug: slugify(vendor.name),
    }));

  if (vendorsToInsert.length) {
    await Vendor.insertMany(vendorsToInsert);
  }

  const existingProjects = await Project.find({
    workspaceKey,
    slug: { $in: seedProjectIds },
  }).select("slug");
  const existingProjectSlugs = new Set(existingProjects.map((project) => project.slug));

  const projectsToInsert = seedProjects
    .filter((project) => !existingProjectSlugs.has(project.slug))
    .map((project) => ({
      workspaceKey,
      ...project,
      deadlineAt: new Date(project.deadlineAt),
    }));

  if (projectsToInsert.length) {
    await Project.insertMany(projectsToInsert);
  }

  const seededProjects = await Project.find({
    workspaceKey,
    slug: { $in: seedProjectIds },
  }).select("_id slug name");
  const projectMap = new Map(seededProjects.map((project) => [project.slug, project]));

  const existingAlerts = await Alert.find({
    workspaceKey,
    $or: seedAlerts.map((alert) => ({
      projectSlug: alert.projectSlug,
      title: alert.title,
    })),
  }).select("projectSlug title");
  const existingAlertKeys = new Set(existingAlerts.map((alert) => buildAlertKey(alert)));

  const alertsToInsert = seedAlerts
    .filter((alert) => !existingAlertKeys.has(buildAlertKey(alert)))
    .map((alert) => ({
      workspaceKey,
      ...alert,
      projectId: projectMap.get(alert.projectSlug)?._id ?? null,
    }));

  if (alertsToInsert.length) {
    await Alert.insertMany(alertsToInsert);
  }

  const existingReports = await Report.find({
    workspaceKey,
    title: { $in: seedReportTitles },
  }).select("title");
  const existingReportTitles = new Set(existingReports.map((report) => report.title));

  const reportsToInsert = seedReports
    .filter((report) => !existingReportTitles.has(report.title))
    .map((report, index) => ({
      workspaceKey,
      ...report,
      generatedAt: new Date(Date.now() - index * 86400000),
    }));

  if (reportsToInsert.length) {
    await Report.insertMany(reportsToInsert);
  }

  const baselineProject = projectMap.get("ward-12-road-drain-upgrade");
  const hasBaselineScenario = await SimulationRun.exists({
    workspaceKey,
    name: "Monsoon Buffer Plan",
    projectSlug: baselineProject?.slug ?? "ward-12-road-drain-upgrade",
  });

  if (!hasBaselineScenario) {
    const scenario = computeScenarioOutcome({
      budget: 12,
      vendor: 68,
      manpower: 66,
      timeline: 12,
    });

    await SimulationRun.create({
      workspaceKey,
      projectId: baselineProject?._id ?? null,
      projectSlug: baselineProject?.slug ?? "",
      projectName: baselineProject?.name ?? "Ward 12 Road and Drain Upgrade",
      name: "Monsoon Buffer Plan",
      budget: 12,
      vendor: 68,
      manpower: 66,
      timeline: 12,
      ...scenario,
      summary: "Adds basic monsoon buffer while keeping current work sequence simple.",
    });
  }
}

export async function ensureUserWorkspaceKey(user) {
  if (!user.workspaceKey) {
    user.workspaceKey = getWorkspaceKeyFromOrganization(user.organization);
    await user.save();
  }

  return user.workspaceKey;
}

export async function ensureWorkspaceInitialized(user) {
  const workspaceKey = await ensureUserWorkspaceKey(user);

  await resetLegacyDemoWorkspace(workspaceKey);

  const currentProjects = await Project.find({ workspaceKey }).select("slug");
  const isDemoWorkspace =
    currentProjects.length === 0 ||
    currentProjects.every((project) => demoProjectSlugs.has(project.slug));

  if (!isDemoWorkspace) {
    return workspaceKey;
  }

  try {
    await seedDemoWorkspace(workspaceKey);
  } catch (error) {
    const duplicateError =
      error?.code === 11000 ||
      error?.writeErrors?.some((item) => item.code === 11000);

    if (!duplicateError) {
      throw error;
    }
  }

  return workspaceKey;
}
