import { z } from "zod";
import { Report } from "../models/Report.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { serializeReport } from "../utils/serializers.js";

const reportSchema = z.object({
  title: z.string().trim().min(4).max(180),
  subtitle: z.string().trim().min(10).max(500),
  status: z.enum(["Ready", "Draft", "Queued"]).default("Draft"),
  cadence: z.string().trim().min(2).max(80),
});

const reportUpdateSchema = reportSchema.partial();

export async function listReports(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const reports = await Report.find({ workspaceKey }).sort({
    updatedAt: -1,
  });

  response.json({
    reports: reports.map(serializeReport),
  });
}

export async function createReport(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = reportSchema.parse(request.body);

  const report = await Report.create({
    workspaceKey,
    ...data,
    generatedAt: new Date(),
  });

  response.status(201).json({
    message: "Report pack created successfully.",
    report: serializeReport(report),
  });
}

export async function updateReport(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = reportUpdateSchema.parse(request.body);
  const report = await Report.findOne({
    workspaceKey,
    _id: request.params.reportId,
  });

  if (!report) {
    return response.status(404).json({
      message: "Report not found.",
    });
  }

  Object.assign(report, data);

  if (data.status === "Ready") {
    report.generatedAt = new Date();
  }

  await report.save();

  response.json({
    message: "Report updated successfully.",
    report: serializeReport(report),
  });
}
