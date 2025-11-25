import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getMembers,
  getProjectDetails,
  getProjects,
  removeMember,
  updateMemberRole,
  updateProject,
} from "../controllers/project.controller.js";
import {
  addMemberValidator,
  createProjectValidator,
  updateMemberRoleValidator,
  updateProjectValidator,
} from "../validators/index.js";

const router = Router();

router
  .route("/")
  .post(authMiddleware, createProjectValidator(), validate, createProject);
router.route("/").get(authMiddleware, getProjects);
router.route("/:projectId/members").get(authMiddleware, getMembers);
router.route("/:projectId").get(authMiddleware, getProjectDetails);
router
  .route("/:projectId")
  .delete(authMiddleware, adminMiddleware, deleteProject);
router
  .route("/:projectId/members/:userId")
  .delete(authMiddleware, adminMiddleware, removeMember);
router
  .route("/:projectId/members")
  .post(
    authMiddleware,
    adminMiddleware,
    addMemberValidator(),
    validate,
    addProjectMember,
  );
router
  .route("/:projectId")
  .put(
    authMiddleware,
    adminMiddleware,
    updateProjectValidator(),
    validate,
    updateProject,
  );
router
  .route("/:projectId/members/:userId")
  .put(
    authMiddleware,
    adminMiddleware,
    updateMemberRoleValidator(),
    validate,
    updateMemberRole,
  );

export default router;
