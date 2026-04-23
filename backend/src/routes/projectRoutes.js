import { Router } from "express";
import {
  createProject,
  getProject,
  listProjects,
  updateProject,
} from "../controllers/projectController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get("/", authorizePermissions(PERMISSIONS.PROJECTS_READ), asyncHandler(listProjects));
router.get(
  "/:projectId",
  authorizePermissions(PERMISSIONS.PROJECTS_READ),
  asyncHandler(getProject)
);
router.post(
  "/",
  authorizePermissions(PERMISSIONS.PROJECTS_WRITE),
  asyncHandler(createProject)
);
router.patch(
  "/:projectId",
  authorizePermissions(PERMISSIONS.PROJECTS_WRITE),
  asyncHandler(updateProject)
);

export const projectRoutes = router;
