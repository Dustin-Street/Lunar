import { getTransporter } from "./transporter.js";
import User from "../schema/user.js";

/**
 * Sends a password reset verification email to a user.
 *
 * @param {string} userEmailAddress - The email address of the user requesting a password reset.
 * @param {string} userId - The MongoDB ObjectId of the user.
 * @returns {Promise<void>}
 */
const forgotPasswordChange = async function (userEmailAddress, userId) {
  try {
    // 1. Find the user
    const foundUser = await User.findById(userId);
    if (!foundUser) throw new Error("User not found");

    // 2. Generate a raw token + store hashed version in DB for 20 minutes
    const resetCode = foundUser.createVerificationCode();
    await foundUser.save();

    // 3. Build the magic link URL
    const resetURL = `http://localhost:5050/forgot-password-form?token=${resetCode}`;

    // 4. Get the email transporter (dev or prod)
    const transporter = await getTransporter();

    // 5. Send the email
    const info = await transporter.sendMail({
      from: '"Lunar Journaling" <no-reply@lunar.dev>',
      to: userEmailAddress,
      subject: "Your password reset link",
      html: `
        <div style="space-between; font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007BFF;">Password Reset Request</h2>
          <p>Hi ${foundUser.username},</p>
          <p>You have requested to reset your password. Please click the link below to proceed:</p>
          <a href="${resetURL}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Change My Password</a>
          <p>If you did not request this, please ignore this email and send a report to our support team.</p> <a href="mailto:support@lunar.dev">Contact Support</a>q
        </div>

      `,
    });

    console.log("Password reset email sent:", info.messageId);
  } catch (error) {
    console.log(`Password authentication mailing error -> ${error}`);
  }
};

export default forgotPasswordChange;
