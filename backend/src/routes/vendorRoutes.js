import { Router } from "express";
import {
  createVendor,
  listVendors,
  updateVendor,
} from "../controllers/vendorController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", authorizePermissions(PERMISSIONS.VENDORS_READ), asyncHandler(listVendors));
router.post("/", authorizePermissions(PERMISSIONS.VENDORS_WRITE), asyncHandler(createVendor));
router.patch(
  "/:vendorId",
  authorizePermissions(PERMISSIONS.VENDORS_WRITE),
  asyncHandler(updateVendor)
);

export const vendorRoutes = router;
