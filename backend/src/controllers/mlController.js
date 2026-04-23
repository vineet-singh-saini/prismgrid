import { z } from "zod";
import { runMlPrediction, runMlTraining, getMlStatus } from "../utils/mlEngine.js";

const predictionSchema = z.object({
  Vendor_Rating: z.coerce.number().min(1).max(5),
  Rainfall_Level: z.enum(["Low", "Medium", "High"]),
  Labor_Availability: z.enum(["Low", "Medium", "High"]),
  Material_Availability: z.enum(["Low", "Medium", "High"]),
  Project_Complexity: z.enum(["Low", "Medium", "High"]),
  Budget_Utilization: z.coerce.number().min(0).max(100),
  Schedule_Variance_Days: z.coerce.number().min(-30).max(90),
  Compliance_Issues: z.coerce.number().min(0).max(30),
  Team_Experience_Years: z.coerce.number().min(0).max(50),
  Change_Request_Count: z.coerce.number().min(0).max(100),
  Safety_Incidents: z.coerce.number().min(0).max(50),
});

export async function predictWithMl(request, response) {
  const payload = predictionSchema.parse(request.body);
  const prediction = await runMlPrediction(payload);

  response.json({
    input: payload,
    prediction,
  });
}

export async function trainMlModels(request, response) {
  const metrics = await runMlTraining();

  response.json({
    message: "ML models trained successfully.",
    metrics,
  });
}

export async function getMlEngineStatus(request, response) {
  const status = await getMlStatus();

  response.json({
    status,
  });
}
