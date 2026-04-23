import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    workspaceKey: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    region: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: ["Stable", "Managed watch", "Critical watch"],
      default: "Stable",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidence: {
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
    costVarianceCr: {
      type: Number,
      required: true,
      min: 0,
    },
    budgetCr: {
      type: Number,
      required: true,
      min: 0,
    },
    spentCr: {
      type: Number,
      required: true,
      min: 0,
    },
    manager: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    nextMilestone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    deadlineAt: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    drivers: {
      type: [String],
      default: [],
    },
    interventions: {
      type: [String],
      default: [],
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
    decisionLog: {
      type: [String],
      default: [],
    },
    vendorNotes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.index({ workspaceKey: 1, slug: 1 }, { unique: true });

export const Project = mongoose.model("Project", projectSchema);
