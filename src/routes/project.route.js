import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import {
  createProject,
  getMembers,
  getProjectDetails,
  getProjects,
} from "../controllers/project.controller.js";
import { createProjectValidator } from "../validators/index.js";

const router = Router();

router
  .route("/")
  .post(authMiddleware, createProjectValidator(), validate, createProject);
router.route("/").get(authMiddleware, getProjects);
router.route("/:projectId/members").get(authMiddleware, getMembers);
router.route("/:projectId").get(authMiddleware, getProjectDetails);

export default router;
