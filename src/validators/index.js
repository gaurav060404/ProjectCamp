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
      .isEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at-least 3 characters long"),
    body("password").trim().isEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

export { registerUserValidator };
