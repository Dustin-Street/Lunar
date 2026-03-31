import { getTransporter } from "./transporter.js";
import User from "../schema/user.js";

/**
 * Sends a password reset verification email to a user.
 *
 * @param {string} userEmailAddress - The email address of the user requesting a password reset.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {Promise<void>}
 */
const authenticatePasswordChange = async function (userEmailAddress, userId) {
  try {
    // 1. Find the user
    const foundUser = await User.findById(userId);
    if (!foundUser) throw new Error("User not found");

    // 2. Generate a raw token + store hashed version in DB
    const resetCode = foundUser.createVerificationCode();
    await foundUser.save();

    // 3. Build the magic link URL
    const resetURL = `http://localhost:5050/change-password?token=${resetCode}`;

    // 4. Get the email transporter (dev or prod)
    const transporter = await getTransporter();

    // 5. Send the email
    const info = await transporter.sendMail({
      from: '"Lunar - Journaling Experience" <no-reply@lunar.dev>',
      to: userEmailAddress,
      subject: "Your password reset link",
      html: `
        <p>Click the link below to confirm your password change:</p>
        <a href="${resetURL}">Change My Password</a>
        <p>If you did not request this, click "Not Me" in the app.</p>
      `,
    });

    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.log(`Password authentication mailing error -> ${error}`);
  }
};

export default authenticatePasswordChange;