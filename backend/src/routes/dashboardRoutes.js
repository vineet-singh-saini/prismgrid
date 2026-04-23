import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get(
  "/summary",
  authorizePermissions(PERMISSIONS.DASHBOARD_READ),
  asyncHandler(getDashboardSummary)
);

export const dashboardRoutes = router;
