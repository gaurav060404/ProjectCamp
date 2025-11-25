import { Router } from "express";
import {
  adminOrProjectAdmin,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { createTaskValidator } from "../validators/index.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import { createTask, getTasks } from "../controllers/task.controller.js";

const router = Router();

router
  .route("/:projectId")
  .post(
    authMiddleware,
    adminOrProjectAdmin,
    createTaskValidator(),
    validate,
    createTask,
  );
router.route("/:projectId").get(authMiddleware, getTasks);

export default router;
