import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    workspaceKey: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    nameSlug: {
      type: String,
      required: true,
      trim: true,
    },
    reliability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    delayedDeliveries: {
      type: Number,
      default: 0,
      min: 0,
    },
    complianceIssues: {
      type: Number,
      default: 0,
      min: 0,
    },
    costDeviation: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["Preferred", "Stable", "Monitored", "Watchlist"],
      default: "Stable",
    },
    note: {
      type: String,
      trim: true,
      maxlength: 400,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

vendorSchema.index({ workspaceKey: 1, nameSlug: 1 }, { unique: true });

export const Vendor = mongoose.model("Vendor", vendorSchema);
