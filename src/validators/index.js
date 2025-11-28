import { body } from "express-validator";
import { AvailableTaskStatus, AvailableUserRoles } from "../utils/constants.js";

const registerUserValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at-least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const loginUserValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("username").optional(),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const changePasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const resetPasswordValidator = () => {
  return [
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Project name is required")
      .isLength({ max: 20 })
      .withMessage("Project name cannot be longer than 20 characters"),
    body("description")
      .notEmpty()
      .withMessage("Project description is required")
      .isLength({ max: 600 })
      .withMessage("Project description cannot be longer than 600 characters"),
    body("members")
      .optional()
      .isArray()
      .withMessage("Members must be an array"),
    body("members.*")
      .optional()
      .isMongoId()
      .withMessage("Must be a valid MongoDB object id"),
  ];
};

const addMemberValidator = () => {
  return [
    body("memberId")
      .notEmpty()
      .withMessage("Member id is required")
      .isMongoId()
      .withMessage("Member id must be a valid MongoDB ObjectId"),
  ];
};

const updateProjectValidator = () => {
  return [
    body("newName")
      .trim()
      .notEmpty()
      .withMessage("New project name is required")
      .isLength({ max: 50 })
      .withMessage("Project name cannot be longer than 20 characters"),
    body("newDescription")
      .trim()
      .notEmpty()
      .withMessage("New project description is required")
      .isLength({ max: 1500 })
      .withMessage("Project description cannot be longer than 600 characters"),
    body("newMembers")
      .optional()
      .isArray()
      .withMessage("New members must be an array"),
    body("members.*")
      .optional()
      .isMongoId()
      .withMessage("Must be a valid MongoDB object id"),
  ];
};

const updateMemberRoleValidator = () => {
  return [
    body("newRole")
      .trim()
      .notEmpty()
      .withMessage("New member role is required")
      .isIn(AvailableUserRoles)
      .withMessage("Role must be one of : admin, project_admin or member"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3, max: 30 })
      .withMessage(
        "Title must be at-least 3 characters & maximum 30 characters long",
      ),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 40, max: 300 })
      .withMessage(
        "Description must be at-least 40 characters & maximum 300 characters long",
      ),
    body("assigneeId")
      .trim()
      .notEmpty()
      .withMessage("Assignee id is required")
      .isMongoId()
      .withMessage("Must be a valid mongodb id"),
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status is required")
      .isIn(AvailableTaskStatus)
      .withMessage("Task status must be from: todo,in_progress & done"),
  ];
};

const createNoteValidator = () => {
  return [
    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content must not be empty")
      .isLength({ max: 200, min: 30 })
      .withMessage(
        "Content length should be at-least 30 and maximum 200 characters long",
      ),
  ];
};

export {
  registerUserValidator,
  loginUserValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  createProjectValidator,
  addMemberValidator,
  updateProjectValidator,
  updateMemberRoleValidator,
  createTaskValidator,
  createNoteValidator,
};
