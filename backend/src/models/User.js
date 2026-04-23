import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ROLE_LIST, ROLES } from "../constants/roles.js";
import { getWorkspaceKeyFromOrganization } from "../utils/workspace.js";

const notificationPreferencesSchema = new mongoose.Schema(
  {
    highSeverityRiskAlerts: { type: Boolean, default: true },
    vendorComplianceEscalations: { type: Boolean, default: true },
    weeklyExecutiveDigest: { type: Boolean, default: true },
    scenarioReviewReminders: { type: Boolean, default: false },
  },
  { _id: false }
);

const workspaceModesSchema = new mongoose.Schema(
  {
    calmDashboardDensity: { type: Boolean, default: true },
    focusModeOnCommandCenter: { type: Boolean, default: true },
    experimentalAICopilots: { type: Boolean, default: false },
  },
  { _id: false }
);

const preferencesSchema = new mongoose.Schema(
  {
    notifications: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    workspaceModes: {
      type: workspaceModesSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ROLE_LIST,
      default: ROLES.PROJECT_MANAGER,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Portfolio Control Lead",
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "National Infra PMO",
    },
    region: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "India West + North",
    },
    shift: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "Morning sync",
    },
    preferences: {
      type: preferencesSchema,
      default: () => ({}),
    },
    workspaceKey: {
      type: String,
      trim: true,
      immutable: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("validate", function ensureWorkspaceKey(next) {
  if (!this.workspaceKey) {
    this.workspaceKey = getWorkspaceKeyFromOrganization(this.organization);
  }

  next();
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
