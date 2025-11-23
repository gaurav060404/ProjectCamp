import { body } from "express-validator";

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

export {
  registerUserValidator,
  loginUserValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
