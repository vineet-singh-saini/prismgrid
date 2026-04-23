import { z } from "zod";
import { Vendor } from "../models/Vendor.js";
import { ensureWorkspaceInitialized } from "../services/workspaceService.js";
import { serializeVendor } from "../utils/serializers.js";
import { slugify } from "../utils/workspace.js";

const vendorSchema = z.object({
  name: z.string().trim().min(2).max(120),
  reliability: z.coerce.number().min(0).max(100),
  delayedDeliveries: z.coerce.number().int().min(0),
  complianceIssues: z.coerce.number().int().min(0),
  costDeviation: z.enum(["Low", "Medium", "High"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  status: z.enum(["Preferred", "Stable", "Monitored", "Watchlist"]),
  note: z.string().trim().min(4).max(400),
});

const vendorUpdateSchema = vendorSchema.partial();

export async function listVendors(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const vendors = await Vendor.find({ workspaceKey }).sort({
    reliability: -1,
    updatedAt: -1,
  });

  response.json({
    vendors: vendors.map(serializeVendor),
  });
}

export async function createVendor(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = vendorSchema.parse(request.body);

  const vendor = await Vendor.create({
    workspaceKey,
    ...data,
    nameSlug: slugify(data.name),
  });

  response.status(201).json({
    message: "Vendor created successfully.",
    vendor: serializeVendor(vendor),
  });
}

export async function updateVendor(request, response) {
  const workspaceKey = await ensureWorkspaceInitialized(request.user);
  const data = vendorUpdateSchema.parse(request.body);
  const vendor = await Vendor.findOne({
    workspaceKey,
    _id: request.params.vendorId,
  });

  if (!vendor) {
    return response.status(404).json({
      message: "Vendor not found.",
    });
  }

  Object.assign(vendor, data);

  if (data.name) {
    vendor.nameSlug = slugify(data.name);
  }

  await vendor.save();

  response.json({
    message: "Vendor updated successfully.",
    vendor: serializeVendor(vendor),
  });
}
