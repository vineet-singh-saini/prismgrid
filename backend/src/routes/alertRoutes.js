import { Router } from "express";
import {
  createAlert,
  listAlerts,
  updateAlert,
} from "../controllers/alertController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", authorizePermissions(PERMISSIONS.ALERTS_READ), asyncHandler(listAlerts));
router.post("/", authorizePermissions(PERMISSIONS.ALERTS_WRITE), asyncHandler(createAlert));
router.patch(
  "/:alertId",
  authorizePermissions(PERMISSIONS.ALERTS_WRITE),
  asyncHandler(updateAlert)
);

export const alertRoutes = router;
