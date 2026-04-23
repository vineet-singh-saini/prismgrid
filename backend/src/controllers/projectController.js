import { z } from "zod";
import { Project } from "../models/Project.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { serializeProject } from "../utils/serializers.js";
import { slugify } from "../utils/workspace.js";

const milestoneSchema = z.object({
  label: z.string().trim().min(2).max(160),
  status: z.string().trim().min(2).max(80),
});

const projectSchema = z.object({
  code: z.string().trim().min(2).max(40),
  name: z.string().trim().min(2).max(160),
  region: z.string().trim().min(2).max(120),
  sector: z.string().trim().min(2).max(120),
  status: z.enum(["Stable", "Managed watch", "Critical watch"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  riskScore: z.coerce.number().min(0).max(100),
  progress: z.coerce.number().min(0).max(100),
  confidence: z.coerce.number().min(0).max(100),
  delayProbability: z.coerce.number().min(0).max(100),
  costVarianceCr: z.coerce.number().min(0),
  budgetCr: z.coerce.number().min(0),
  spentCr: z.coerce.number().min(0),
  manager: z.string().trim().min(2).max(120),
  nextMilestone: z.string().trim().min(2).max(160),
  deadlineAt: z.coerce.date(),
  summary: z.string().trim().min(10).max(600),
  drivers: z.array(z.string().trim().min(2).max(180)).min(1).max(6),
  interventions: z.array(z.string().trim().min(2).max(180)).min(1).max(6),
  milestones: z.array(milestoneSchema).min(1).max(8),
  decisionLog: z.array(z.string().trim().min(2).max(180)).max(8).default([]),
  vendorNotes: z.array(z.string().trim().min(2).max(180)).max(8).default([]),
});

const projectUpdateSchema = projectSchema.partial();

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function buildProjectSlug(workspaceKey, name, code) {
  const baseSlug = slugify(name) || slugify(code) || "project";
  let candidate = baseSlug;
  let counter = 1;

  // Keep slugs stable and unique inside a workspace.
  while (await Project.exists({ workspaceKey, slug: candidate })) {
    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return candidate;
}

export async function listProjects(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const search = String(request.query.search ?? "").trim();
  const risk = String(request.query.risk ?? "all").trim();
  const status = String(request.query.status ?? "all").trim();
  const query = { workspaceKey };

  if (search) {
    const expression = new RegExp(escapeRegExp(search), "i");
    query.$or = [
      { name: expression },
      { region: expression },
      { manager: expression },
      { code: expression },
    ];
  }

  if (risk !== "all") {
    query.riskLevel = risk;
  }

  if (status !== "all") {
    query.status = new RegExp(escapeRegExp(status), "i");
  }

  const projects = await Project.find(query).sort({
    riskScore: -1,
    deadlineAt: 1,
  });

  response.json({
    projects: projects.map(serializeProject),
  });
}

export async function getProject(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const project = await Project.findOne({
    workspaceKey,
    slug: request.params.projectId,
  });

  if (!project) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }

  response.json({
    project: serializeProject(project),
  });
}

export async function createProject(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = projectSchema.parse(request.body);
  const slug = await buildProjectSlug(workspaceKey, data.name, data.code);

  const project = await Project.create({
    workspaceKey,
    slug,
    ...data,
  });

  response.status(201).json({
    message: "Project workspace created successfully.",
    project: serializeProject(project),
  });
}

export async function updateProject(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = projectUpdateSchema.parse(request.body);
  const project = await Project.findOne({
    workspaceKey,
    slug: request.params.projectId,
  });

  if (!project) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }

  Object.assign(project, data);
  await project.save();

  response.json({
    message: "Project updated successfully.",
    project: serializeProject(project),
  });
}
