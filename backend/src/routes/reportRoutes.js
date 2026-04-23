import { Router } from "express";
import {
  createReport,
  listReports,
  updateReport,
} from "../controllers/reportController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", authorizePermissions(PERMISSIONS.REPORTS_READ), asyncHandler(listReports));
router.post("/", authorizePermissions(PERMISSIONS.REPORTS_WRITE), asyncHandler(createReport));
router.patch(
  "/:reportId",
  authorizePermissions(PERMISSIONS.REPORTS_WRITE),
  asyncHandler(updateReport)
);

export const reportRoutes = router;
