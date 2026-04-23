import { Router } from "express";
import {
  createSimulationRun,
  listSimulationRuns,
} from "../controllers/simulationController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get(
  "/",
  authorizePermissions(PERMISSIONS.SIMULATIONS_READ),
  asyncHandler(listSimulationRuns)
);
router.post(
  "/",
  authorizePermissions(PERMISSIONS.SIMULATIONS_WRITE),
  asyncHandler(createSimulationRun)
);

export const simulationRoutes = router;
