import { Router } from "express";
import {
  adminOrProjectAdmin,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { createTaskValidator } from "../validators/index.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import {
  createSubTask,
  createTask,
  deleteTask,
  getTaskDetails,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/:projectId")
  .post(
    authMiddleware,
    adminOrProjectAdmin,
    upload.any(),
    createTaskValidator(),
    validate,
    createTask,
  );
router.route("/:projectId").get(authMiddleware, getTasks);
router.route("/:projectId/t/:taskId").get(authMiddleware, getTaskDetails);
router
  .route("/:projectId/t/:taskId")
  .delete(authMiddleware, adminOrProjectAdmin, deleteTask);
router
  .route("/:projectId/t/:taskId")
  .put(
    authMiddleware,
    adminOrProjectAdmin,
    upload.any(),
    createTaskValidator(),
    validate,
    updateTask,
  );
router
  .route("/:projectId/t/:taskId/subtask")
  .post(
    authMiddleware,
    adminOrProjectAdmin,
    upload.any(),
    createTaskValidator(),
    validate,
    createSubTask,
  );
router
  .route("/:projectId/st/:subTaskId")
  .delete(authMiddleware, adminOrProjectAdmin, deleteTask);

router
  .route("/:projectId/st/:subTaskId")
  .put(
    authMiddleware,
    upload.any(),
    createTaskValidator(),
    validate,
    updateSubTask,
  );

export default router;
