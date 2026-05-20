import { getTransporter } from "./transporter.js";
import { createHttpError } from "../utils/httpError.js";
import User from "../schema/user.js";

/**
 * Sends a password reset verification email to a user.
 *
 * @param {string} userEmailAddress - The email address of the user requesting a password reset.
 * @param {string} userId - The MongoDB ObjectId of the user.
 */
const forgotPasswordChange = async function (userEmailAddress, userId) {
  try {
    if (!userEmailAddress) {
      throw createHttpError(400, "Email is required");
    }

    const normalizedEmail = userEmailAddress.trim().toLowerCase();

    // 1. Find the user
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      // Prevent account enumeration
      console.log("Password reset requested for non-existent user");
      return;
    }

    // 2. Generate a raw token + store hashed version in DB
    const resetCode = foundUser.createVerificationCode();
    await foundUser.save();

    // 3. Build the magic link URL
    const resetURL = `${process.env.FRONTEND_URL}/resetPassword?token=${resetCode}`;

    // 4. Get the email transporter
    const transporter = await getTransporter();
    // 5. Send the email
    const info = await transporter.sendMail({
      from: '"Lunar Journaling" <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: "Your password reset link",
      html: `
    <div style="font-family: Arial, sans-serif; background-color:#374151; color:#fef3c7; padding:20px;">
      <h2 style="color:#bfdbfe; margin-bottom:16px;">Password Reset Request</h2>

      <p>Hi ${foundUser.username},</p>
      <p>You requested to reset your password. Click the button below:</p>

      <a href="${resetURL}"
         style="
           background-color:#bfdbfe;
           color:#1e3a8a;
           padding:10px 20px;
           text-decoration:none;
           border-radius:5px;
           display:inline-block;
           margin:16px 0;
           font-weight:bold;
         ">
        Change My Password
      </a>

      <p>If you did not request this, you can safely ignore this email.</p>
      <p>Need help? <a href="mailto:support@lunarjournaling.net" style="color:#bfdbfe;">Contact Support</a></p>
    </div>
  `,
    });
  } catch (error) {
    throw createHttpError(500, "error sending reset email try again");
    console.log(`Password authentication mailing error -> ${error}`);
  }
};

export default forgotPasswordChange;
