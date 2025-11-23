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
  changePasswordValidator,
  forgotPasswordValidator,
  loginUserValidator,
  registerUserValidator,
  resetPasswordValidator,
} from "../validators/index.js";

const router = Router();

// unsecured routes
router.route("/register").post(registerUserValidator(), validate, registerUser);
router.route("/login").post(loginUserValidator(), validate, loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(forgotPasswordValidator(), validate, forgotPassword);
router
  .route("/reset-password/:resetToken")
  .post(resetPasswordValidator(), validate, resetPassword);

//secure routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/current-user").get(authMiddleware, getCurrentUser);
router
  .route("/resend-email-verification")
  .post(authMiddleware, resendEmailVerification);
router
  .route("/change-password")
  .post(authMiddleware, changePasswordValidator(), validate, changePassword);

export default router;
