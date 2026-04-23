import mongoose from "mongoose";

const simulationRunSchema = new mongoose.Schema(
  {
    workspaceKey: {
      type: String,
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    projectSlug: {
      type: String,
      trim: true,
      default: "",
    },
    projectName: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
    },
    vendor: {
      type: Number,
      required: true,
      min: 20,
      max: 100,
    },
    manpower: {
      type: Number,
      required: true,
      min: 20,
      max: 100,
    },
    timeline: {
      type: Number,
      required: true,
      min: 0,
      max: 30,
    },
    simulatedRisk: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    delayProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    costOverrunCr: {
      type: Number,
      required: true,
      min: 0,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    predictedCostOverrunPct: {
      type: Number,
      min: 0,
      default: 0,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

simulationRunSchema.index({ workspaceKey: 1, createdAt: -1 });

export const SimulationRun = mongoose.model("SimulationRun", simulationRunSchema);
