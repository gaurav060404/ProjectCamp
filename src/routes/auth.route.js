import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import { registerUserValidator } from "../validators/index.js";

const router = Router();

router.route("/register").post(registerUserValidator(), validate, registerUser);

export default router;
