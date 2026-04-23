import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
      maxlength: 160,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    assignee: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    recommendation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

alertSchema.index({ workspaceKey: 1, severity: 1, status: 1, createdAt: -1 });

export const Alert = mongoose.model("Alert", alertSchema);
