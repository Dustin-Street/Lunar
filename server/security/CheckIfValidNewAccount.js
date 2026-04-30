import createHttpError from "http-errors";
import User from "../schema/user.js";

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
  console.log(`username ${username} password: ${password} email: ${email}`);

  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  const normalizedUsername = username?.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Please enter a valid email address");
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long");
  }

  if (!normalizedUsername) {
    throw createHttpError(400, "Username is required");
  }

  if (normalizedUsername.length < 2) {
    throw createHttpError(400, "Username must be at least 2 characters long");
  }

  let existingEmail;
  try {
    existingEmail = await User.findOne({ email });
  } catch (err) {
    console.error("Database error during email check:", err);
    throw createHttpError(500, "Error during registration process, try again.");
  }

  if (existingEmail) {
    throw createHttpError(400, "That email is already registered");
  }

  let usernameCount;
  try {
    usernameCount = await User.countDocuments({ username: normalizedUsername });
  } catch (err) {
    console.error("Database error during username check:", err);
    throw createHttpError(500, "Server error during registration. Try again.");
  }

  if (usernameCount > 0) {
    throw createHttpError(409, "That username is already taken");
  }
};
