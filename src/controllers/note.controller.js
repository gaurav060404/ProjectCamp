import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.model.js";
import { Note } from "../models/note.model.js";
import mongoose from "mongoose";

const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  const note = await Note.create({ content });
  if (!note) {
    throw new ApiError(400, "Error occured while creating the note");
  }

  project.notes.push(new mongoose.Types.ObjectId(note._id));
  await project.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }

  const project = await Project.findById(projectId).populate("notes");
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let notes = project.notes || [];
  if (req.user.role === "member") {
    notes = notes.map((note) => {
      return {
        content: note.content,
      };
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fecthed successfully"));
});

const getNoteDetails = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }
  if (!noteId) {
    throw new ApiError(400, "Note id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note doesn't exists");
  }

  if (req.user.role === "member") {
    note = {
      content: note.content,
      createdAt: note.createdAt,
    };
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note details fetched successfully"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { content } = req.body;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }
  if (!noteId) {
    throw new ApiError(400, "Note id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note doesn't exists");
  }

  note.content = content;
  await note.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { note }, "Note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  if (!projectId) {
    throw new ApiError(400, "Project id is required");
  }
  if (!noteId) {
    throw new ApiError(400, "Note id is required");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exists");
  }

  let note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note doesn't exists");
  }

  await note.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

export { createNote, getNotes, getNoteDetails, updateNote, deleteNote };
