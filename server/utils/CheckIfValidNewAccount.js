import createHttpError from "http-errors";
import User from "../schema/user.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * Checks if the provided email, username, and password are valid for creating a new account.
 * Validations include:
 * - Email and password must be provided.
 * - Email must be in a valid format.
 * - Password must be at least 6 characters long.
 * - Username must be provided and at least 2 characters long.
 * - Email must not already be registered.
 * - Username must not already be taken.
 * @param {string} email - The email address to validate.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @throws Will throw an error in a try block for safe error handling if any validation fails.
 */

export const CheckIfValidNewAccount = async (username, email, password) => {
  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));

    const normalizedUsername = username.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createHttpError(400, "Please enter a valid email address"));
    }

    if (password.length < 6) {
      return next(
        createHttpError(400, "Password must be at least 6 characters long"),
      );
    }

    if (!username || username.trim().length === 0) {
      return next(createHttpError(400, "username is required"));
    }

    if (username.length < 2) {
      return next(
        createHttpError(400, "username must be at least 2 characters long"),
      );
    }

    let existingEmail;
    try {
      existingEmail = await User.findOne({ email });
    } catch (dbError) {
      console.error("Database error during email check:", dbError);
      return next(
        createHttpError(500, "Error during registration process, try again."),
      );
    }

    if (existingEmail) {
      return next(
        createHttpError(
          400,
          "that email is taken by another user, try another",
        ),
      );
    }

    let usernameCount;
    try {
      usernameCount = await User.countDocuments({
        username: normalizedUsername,
      });
    } catch (dbError) {
      console.error("Database error during username check:", dbError);
      return next(
        createHttpError(
          500,
          "Server error during registration. Please try again",
        ),
      );
    }

    if (usernameCount > 0) {
      return next(
        createHttpError(
          409,
          "That username is already taken. Please choose a different one",
        ),
      );
    }
  }
};
