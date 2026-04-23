import { z } from "zod";
import { Project } from "../models/Project.js";
import { SimulationRun } from "../models/SimulationRun.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { runMlPrediction } from "../utils/mlEngine.js";
import {
  mapMlPredictionToScenarioOutcome,
  mapScenarioToMlPayload,
} from "../utils/mlPayloadMapping.js";
import { serializeSimulationRun } from "../utils/serializers.js";
import { computeScenarioOutcome } from "../utils/scenario.js";

const simulationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  projectId: z.string().trim().min(1).optional().or(z.literal("")),
  budget: z.coerce.number().min(0).max(30),
  vendor: z.coerce.number().min(20).max(100),
  manpower: z.coerce.number().min(20).max(100),
  timeline: z.coerce.number().min(0).max(30),
  summary: z.string().trim().max(500).optional(),
});

export async function listSimulationRuns(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const simulationRuns = await SimulationRun.find({ workspaceKey })
    .sort({ createdAt: -1 })
    .limit(10);

  response.json({
    simulationRuns: simulationRuns.map(serializeSimulationRun),
  });
}

export async function createSimulationRun(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = simulationSchema.parse(request.body);
  let linkedProject = null;

  if (data.projectId) {
    linkedProject = await Project.findOne({
      workspaceKey,
      slug: data.projectId,
    });
  }

  let outcome = computeScenarioOutcome(data);
  let riskLevel = "Medium";
  let confidence = 0;
  let predictedCostOverrunPct = 0;
  let recommendations = [];

  try {
    const mlPayload = mapScenarioToMlPayload(data);
    const prediction = await runMlPrediction(mlPayload);
    const mappedOutcome = mapMlPredictionToScenarioOutcome(prediction, linkedProject);

    outcome = {
      simulatedRisk: mappedOutcome.simulatedRisk,
      delayProbability: mappedOutcome.delayProbability,
      costOverrunCr: mappedOutcome.costOverrunCr,
    };
    riskLevel = mappedOutcome.riskLevel;
    confidence = mappedOutcome.confidence;
    predictedCostOverrunPct = mappedOutcome.predictedCostOverrunPct;
    recommendations = mappedOutcome.recommendations;
  } catch {
    // Keep scenario saving resilient by falling back to deterministic math
    // when Python dependencies or model artifacts are unavailable.
  }

  const summary =
    data.summary?.trim() ||
    (recommendations.length
      ? recommendations[0]
      : "Scenario analyzed with baseline recovery heuristics.");

  const simulationRun = await SimulationRun.create({
    workspaceKey,
    projectId: linkedProject?._id ?? null,
    projectSlug: linkedProject?.slug ?? "",
    projectName: linkedProject?.name ?? "",
    name: data.name,
    budget: data.budget,
    vendor: data.vendor,
    manpower: data.manpower,
    timeline: data.timeline,
    summary,
    riskLevel,
    confidence,
    predictedCostOverrunPct,
    recommendations,
    ...outcome,
  });

  response.status(201).json({
    message: "Scenario saved successfully.",
    simulationRun: serializeSimulationRun(simulationRun),
  });
}
