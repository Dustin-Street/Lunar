import createHttpError from "http-errors";
import User from "../schema/user.js";

export async function CheckIfValidNewAccount(username, email, password) {
  if (!email || !password) {
    throw createHttpError(400, "Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createHttpError(400, "Please enter a valid email address");
  }

  if (password.length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long");
  }

  if (!username || username.trim().length === 0) {
    throw createHttpError(400, "Username is required");
  }

  if (username.length < 2) {
    throw createHttpError(400, "Username must be at least 2 characters long");
  }

  const normalizedUsername = username.trim();

  let existingEmail;
  try {
    existingEmail = await User.findOne({ email });
  } catch (dbError) {
    console.error("Database error during email check:", dbError);
    throw createHttpError(
      500,
      "Server error during registration. Please try again.",
    );
  }

  if (existingEmail) {
    throw createHttpError(
      409,
      "That email is already registered with an account",
    );
  }

  let usernameCount;
  try {
    usernameCount = await User.countDocuments({
      username: normalizedUsername,
    });
  } catch (dbError) {
    console.error("Database error during username check:", dbError);
    throw createHttpError(
      500,
      "Server error during registration. Please try again.",
    );
  }

  if (usernameCount > 0) {
    throw createHttpError(
      409,
      "That username is already taken. Please choose a different one",
    );
  }
}
