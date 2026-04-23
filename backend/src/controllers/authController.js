import { z } from "zod";
import { ROLES } from "../constants/roles.js";
import { User } from "../models/User.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { signToken } from "../utils/auth.js";
import { serializeUser } from "../utils/serializers.js";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
    role: z
      .enum([ROLES.PROJECT_MANAGER, ROLES.ANALYST, ROLES.EXECUTIVE_REVIEWER])
      .default(ROLES.PROJECT_MANAGER),
    title: z.string().trim().min(2).max(120).optional(),
    organization: z.string().trim().min(2).max(120).optional(),
    region: z.string().trim().min(2).max(120).optional(),
    shift: z.string().trim().min(2).max(60).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(72),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export async function register(request, response) {
  const data = registerSchema.parse(request.body);
  const normalizedEmail = data.email.toLowerCase();

  const user = await User.create({
    fullName: data.fullName,
    email: normalizedEmail,
    password: data.password,
    role: data.role,
    title: data.title,
    organization: data.organization,
    region: data.region,
    shift: data.shift,
  });
  await ensureWorkspaceInitialized(user);

  const token = signToken(user._id.toString());

  response.status(201).json({
    message: "Account created successfully.",
    token,
    user: serializeUser(user),
  });
}

export async function login(request, response) {
  const data = loginSchema.parse(request.body);
  const normalizedEmail = data.email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return response.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const isPasswordValid = await user.comparePassword(data.password);

  if (!isPasswordValid) {
    return response.status(401).json({
      message: "Invalid email or password.",
    });
  }

  user.lastLoginAt = new Date();
  await user.save();
  await ensureWorkspaceInitialized(user);

  const token = signToken(user._id.toString());

  response.json({
    message: "Logged in successfully.",
    token,
    user: serializeUser(user),
  });
}

export async function me(request, response) {
  response.json({
    user: serializeUser(request.user),
  });
}

export async function logout(request, response) {
  response.json({
    message: "Logged out successfully.",
  });
}

export async function changePassword(request, response) {
  const data = changePasswordSchema.parse(request.body);
  const user = await User.findById(request.user._id).select("+password");

  const isPasswordValid = await user.comparePassword(data.currentPassword);

  if (!isPasswordValid) {
    return response.status(400).json({
      message: "Current password is incorrect.",
    });
  }

  user.password = data.newPassword;
  await user.save();

  response.json({
    message: "Password updated successfully.",
  });
}
