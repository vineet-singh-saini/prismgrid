import { z } from "zod";
import { serializeUser } from "../utils/serializers.js";

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(120),
  region: z.string().trim().min(2).max(120),
  shift: z.string().trim().min(2).max(60),
});

const updatePreferencesSchema = z.object({
  notifications: z.object({
    highSeverityRiskAlerts: z.boolean(),
    vendorComplianceEscalations: z.boolean(),
    weeklyExecutiveDigest: z.boolean(),
    scenarioReviewReminders: z.boolean(),
  }),
  workspaceModes: z.object({
    calmDashboardDensity: z.boolean(),
    focusModeOnCommandCenter: z.boolean(),
    experimentalAICopilots: z.boolean(),
  }),
});

export async function updateProfile(request, response) {
  const data = updateProfileSchema.parse(request.body);

  request.user.fullName = data.fullName;
  request.user.title = data.title;
  request.user.organization = data.organization;
  request.user.region = data.region;
  request.user.shift = data.shift;

  await request.user.save();

  response.json({
    message: "Profile updated successfully.",
    user: serializeUser(request.user),
  });
}

export async function updatePreferences(request, response) {
  const data = updatePreferencesSchema.parse(request.body);

  request.user.preferences = data;
  await request.user.save();

  response.json({
    message: "Preferences updated successfully.",
    preferences: request.user.preferences,
  });
}
