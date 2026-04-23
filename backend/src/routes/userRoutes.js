import { Router } from "express";
import {
  updatePreferences,
  updateProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(authenticate);
router.patch("/me", asyncHandler(updateProfile));
router.patch("/me/preferences", asyncHandler(updatePreferences));

export const userRoutes = router;
