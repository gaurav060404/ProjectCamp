import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const encodedToken =
    req.cookies?.accessToken || req.header("Authorization").split(" ")[1];
  if (!encodedToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.decode(
      encodedToken,
      process.env.ACCESS_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(401, "Unauthorized access : Admin only");
  }
  next();
});

export const projectAdminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "project_admin") {
    throw new ApiError(401, "Unauthorized access : Project Admin only");
  }
  next();
});
