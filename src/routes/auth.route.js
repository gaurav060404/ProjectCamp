import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/index.js";

const router = Router();

router.route("/register").post(registerUserValidator(), validate, registerUser);
router.route("/login").post(loginUserValidator(), validate, loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/current-user").get(authMiddleware, getCurrentUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/resend-email-verification").get(authMiddleware, resendEmailVerification);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/forgot-password").get(forgotPassword);
router.route("/reset-password/:resetToken").get(resetPassword);
router.route("/change-password").get(authMiddleware,changePassword);

export default router;
