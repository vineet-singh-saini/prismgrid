import { z } from "zod";
import { Alert } from "../models/Alert.js";
import { Project } from "../models/Project.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { serializeAlert } from "../utils/serializers.js";

const alertSchema = z.object({
  title: z.string().trim().min(4).max(240),
  severity: z.enum(["low", "medium", "high"]),
  projectId: z.string().trim().min(1).optional(),
  owner: z.string().trim().min(2).max(120),
  assignee: z.string().trim().min(2).max(120).optional().or(z.literal("")),
  reason: z.string().trim().min(10).max(600),
  recommendation: z.string().trim().min(10).max(600),
  status: z.enum(["open", "in-progress", "resolved"]).default("open"),
});

const alertUpdateSchema = alertSchema.partial();

export async function listAlerts(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const severity = String(request.query.severity ?? "all").trim();
  const status = String(request.query.status ?? "all").trim();
  const query = { workspaceKey };

  if (severity !== "all") {
    query.severity = severity;
  }

  if (status !== "all") {
    query.status = status;
  }

  const alerts = await Alert.find(query).sort({
    createdAt: -1,
  });

  response.json({
    alerts: alerts.map(serializeAlert),
  });
}

export async function createAlert(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = alertSchema.parse(request.body);
  let linkedProject = null;

  if (data.projectId) {
    linkedProject = await Project.findOne({
      workspaceKey,
      slug: data.projectId,
    });
  }

  const alert = await Alert.create({
    workspaceKey,
    title: data.title,
    severity: data.severity,
    owner: data.owner,
    assignee: data.assignee ?? "",
    status: data.status,
    reason: data.reason,
    recommendation: data.recommendation,
    projectId: linkedProject?._id ?? null,
    projectSlug: linkedProject?.slug ?? "",
    projectName: linkedProject?.name ?? "Portfolio-wide",
  });

  response.status(201).json({
    message: "Alert created successfully.",
    alert: serializeAlert(alert),
  });
}

export async function updateAlert(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = alertUpdateSchema.parse(request.body);
  const alert = await Alert.findOne({
    workspaceKey,
    _id: request.params.alertId,
  });

  if (!alert) {
    return response.status(404).json({
      message: "Alert not found.",
    });
  }

  if (data.projectId) {
    const linkedProject = await Project.findOne({
      workspaceKey,
      slug: data.projectId,
    });

    alert.projectId = linkedProject?._id ?? null;
    alert.projectSlug = linkedProject?.slug ?? "";
    alert.projectName = linkedProject?.name ?? "Portfolio-wide";
  }

  Object.assign(alert, {
    ...data,
    projectId: alert.projectId,
    projectSlug: alert.projectSlug,
    projectName: alert.projectName,
  });
  await alert.save();

  response.json({
    message: "Alert updated successfully.",
    alert: serializeAlert(alert),
  });
}
