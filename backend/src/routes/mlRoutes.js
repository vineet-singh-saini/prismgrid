import { Router } from "express";
import {
  getMlEngineStatus,
  predictWithMl,
  trainMlModels,
} from "../controllers/mlController.js";
import { PERMISSIONS } from "../constants/roles.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizePermissions } from "../middleware/authorize.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.get(
  "/status",
  authorizePermissions(PERMISSIONS.ML_PREDICT),
  asyncHandler(getMlEngineStatus)
);
router.post(
  "/predict",
  authorizePermissions(PERMISSIONS.ML_PREDICT),
  asyncHandler(predictWithMl)
);
router.post(
  "/train",
  authorizePermissions(PERMISSIONS.ML_TRAIN),
  asyncHandler(trainMlModels)
);

export const mlRoutes = router;
