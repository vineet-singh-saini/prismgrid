import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    workspaceKey: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Ready", "Draft", "Queued"],
      default: "Draft",
    },
    cadence: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reportSchema.index({ workspaceKey: 1, updatedAt: -1 });

export const Report = mongoose.model("Report", reportSchema);
