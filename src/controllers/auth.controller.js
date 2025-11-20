import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, verifyEmailTemplate } from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access & refresh tokens.",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  // Validations
  const user = await User.findOne({
    $or: [{username}, {email}],
  });
  if (user) {
    throw new ApiError(
      409,
      "User with this email or username already exists.",
      [],
    );
  }
  const newUser = await User.create({ username, email, password });
  const { unHashedToken, hashedToken, tokenExpiry } =
    newUser.generateTemporaryToken();
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(newUser);

  newUser.emailVerificationToken = hashedToken;
  newUser.emailVerificationExpiry = tokenExpiry;
  await newUser.save({ validateBeforeSave: false });

  await sendEmail({
    email: newUser?.email,
    subject: "Please verify your email",
    mailGenContent: verifyEmailTemplate(
      newUser.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: createdUser }, "User created successfully"),
    );
});

export { registerUser };
