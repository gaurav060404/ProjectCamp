import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
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

export default router;
