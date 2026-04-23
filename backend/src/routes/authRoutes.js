import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  me,
  register,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", authenticate, asyncHandler(logout));
router.post("/change-password", authenticate, asyncHandler(changePassword));
router.get("/me", authenticate, asyncHandler(me));

export const authRoutes = router;
