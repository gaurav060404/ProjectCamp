import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/vaildator.middleware.js";
import {
  createNote,
  deleteNote,
  getNoteDetails,
  getNotes,
  updateNote,
} from "../controllers/note.controller.js";
import { createNoteValidator } from "../validators/index.js";

const router = Router();

router
  .route("/:projectId")
  .post(
    authMiddleware,
    adminMiddleware,
    createNoteValidator(),
    validate,
    createNote,
  );
router.route("/:projectId").get(authMiddleware, getNotes);
router.route("/:projectId/n/:noteId").get(authMiddleware, getNoteDetails);
router
  .route("/:projectId/n/:noteId")
  .put(
    authMiddleware,
    adminMiddleware,
    createNoteValidator(),
    validate,
    updateNote,
  );
router
  .route("/:projectId/n/:noteId")
  .delete(authMiddleware, adminMiddleware, deleteNote);

export default router;
