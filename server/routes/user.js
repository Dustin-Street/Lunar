import express from "express";
import User from "../schema/user.js";
import authenticateToken from "../authentication/authenticateToken.js";
import forgotPasswordChange from "../email/forgotPasswordChange.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createHttpError } from "../utils/httpError.js";
import { upload } from "../middleware/upload.js";
import { buildJwtPayload } from "../authentication/jwtBuild.js";
import { CheckIfValidNewAccount } from "../utils/CheckIfValidNewAccount.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

//authentication
import passport from "passport";
import {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
} from "../authentication.js";

// NOTE: In a future security pass, consider adding `select: false` to the
// password field in the User schema. This will hide the hashed password
// by default and require explicit `.select("+password")` in login and
// password-change logic. Making this change will require small refactors
// in those routes, so saving it for a focused update is ideal.

router.get(
  "/requestSettings",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.json(user);
  }),
);

router.post(
  "/createUser",
  asyncHandler(async (req, res) => {
    const { password, username } = req.body;
    const email = req.body.email?.toLowerCase?.();

    await CheckIfValidNewAccount(username, email, password);

    const user = new User({ email, username: normalizedUsername, password });

    try {
      await user.save();
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      if (saveError.code === 11000) {
        if (saveError.keyPattern?.username) {
          throw createHttpError(
            409,
            "That username is already taken. Please choose a different one",
          );
        }
        if (saveError.keyPattern?.email) {
          throw createHttpError(
            409,
            "That email is already registered with an account",
          );
        }
        throw createHttpError(
          409,
          "This information is already registered. Please try different details",
        );
      }

      throw saveError;
    }

    const payload = buildJwtPayload(user);

    const token = getToken(payload);
    const refreshToken = getRefreshToken(payload);

    user.refreshToken.push({ refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: `Successfully created account. Welcome ${username || email}!`,
      token,
      expiresIn: 900,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  }),
);

import jwt from "jsonwebtoken";

//create refreshToken route

router.post(
  "/refreshToken",
  asyncHandler(async (req, res) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if (!refreshToken) {
      throw createHttpError(
        401,
        "No refresh token found. Please log in again.",
      );
    }

    try {
      // Verify refresh token
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const userId = payload._id;

      // Load user
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw createHttpError(
          401,
          "Invalid refresh token. Please log in again.",
        );
      }

      // Ensure refresh token exists in DB
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken,
      );

      if (tokenIndex === -1) {
        throw createHttpError(
          401,
          "Refresh token has expired. Please log in again.",
        );
      }

      // Build consistent JWT payload
      const jwtPayload = buildJwtPayload(user);

      // Generate new tokens
      const token = getToken(jwtPayload);
      const newRefreshToken = getRefreshToken(jwtPayload);

      // Update stored refresh token
      user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
      await user.save();

      // Send new refresh token cookie
      res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

      console.log("Refresh token successful! Sending back new token");

      res.send({ success: true, token, expiresIn: 900 });
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        throw createHttpError(
          401,
          "Invalid refresh token. Please log in again.",
        );
      }
      if (err.name === "TokenExpiredError") {
        throw createHttpError(
          401,
          "Refresh token has expired. Please log in again.",
        );
      }
      throw err;
    }
  }),
);

router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select(
      "_id email username journals dateCreated profile",
    );

    if (!user) {
      throw createHttpError(
        404,
        "User account not found. Please try logging in again.",
      );
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        journals: user.journals,
        profile: user.profile,
        dateCreated: user.dateCreated,
      },
    });
  }),
);

router.post(
  "/login",
  asyncHandler((req, res, next) => {
    if (!req.body.email || !req.body.password) {
      throw createHttpError(400, "Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      throw createHttpError(400, "Please enter a valid email address");
    }

    req.body.email = req.body.email.toLowerCase();

    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          const emailExists = await User.findOne({ email: req.body.email });
          if (!emailExists) {
            return next(
              createHttpError(
                401,
                "No account found with this email address. Please check your email or sign up for a new account.",
              ),
            );
          }
          return next(
            createHttpError(
              401,
              "Incorrect password. Please try again or reset your password if you've forgotten it.",
            ),
          );
        }

        try {
          // Build consistent JWT payload
          const payload = buildJwtPayload(user);

          // Generate tokens
          const token = getToken(payload);
          const refreshToken = getRefreshToken(payload);

          // Manage refresh token rotation
          if (user.refreshToken.length >= 5) {
            user.refreshToken.shift();
          }
          user.refreshToken.push({ refreshToken });
          await user.save();

          // Send refresh token cookie
          res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

          console.log(
            `Login successful! Sending back token and user info - User: ${user.username}, Email: ${user.email}, ID: ${user._id}, Journals: ${user.journals.length} journals, }`,
          );
          console.log("User profile info:", user.profile);

          // Send access token + user info
          return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            expiresIn: 900,
            user: {
              _id: user._id,
              email: user.email,
              username: user.username,
              profile: user.profile,
              journals: user.journals,
              dateCreated: user.dateCreated,
            },
          });
        } catch (saveErr) {
          return next(saveErr);
        }
      },
    )(req, res, next);
  }),
);

router.post(
  "/logout",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Clear the user's refresh tokens
    user.refreshToken = [];
    await user.save();

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }),
);

router.post(
  "/password-reset-request",
  asyncHandler(async (req, res) => {
    console.log("inside of password-reset-request call");

    const { userEmail } = req.body;

    if (!userEmail) {
      throw createHttpError(
        400,
        "You must enter a valid email to receive password reset instructions.",
      );
    }

    // Look up user by email
    const user = await User.findOne({ email: userEmail });

    // Always send the same response to avoid account enumeration
    if (!user) {
      return res.json({
        message:
          "If that email is associated with an account, password reset instructions have been sent.",
      });
    }

    // If user exists, send the reset email
    await forgotPasswordChange(user.email, user._id);

    return res.json({
      message:
        "If that email is associated with an account, password reset instructions have been sent.",
    });
  }),
);

//this route will verify token from email link and then allowing th euser to be directly logged in and taken to the change password form, where they can enter a new password without needing to enter their old
//  password since they have verified ownership of the email through the reset link. does not give to much information and only send the request if the email was valid and associated with an account, otherwis
// just send no email as to not give away which emails are associated with accounts

router.get("/forgot-password-form", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Invalid or missing token try again or contact support",
    });
  }
  await User.findOne({ verificationCode: token })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message:
            "Invalid or expired token. Please try again or contact support.",
        });
      }
    })
    .catch((err) => {
      console.error("Error during token verification:", err);
      return res.status(500).json({
        message:
          "Server error during token verification. Please try again later.",
      });
    });
  return res.status(200).json({
    message: "Token verified. Redirecting to Password Reset.",
    success: true,
  });
});

//chnage password in user access through user settings while logged in
router.patch(
  "/change-password",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw createHttpError(400, "Missing fields");
    }

    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw createHttpError(401, "Old password incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  }),
);

router.patch(
  "/change-email",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail) {
      throw createHttpError(400, "Missing fields");
    }

    const normalizedOldEmail = oldEmail.toLowerCase().trim();
    const normalizedNewEmail = newEmail.toLowerCase().trim();

    const user = await User.findById(req.userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (normalizedOldEmail !== user.email.toLowerCase().trim()) {
      throw createHttpError(401, "Current email is incorrect");
    }

    if (normalizedOldEmail === normalizedNewEmail) {
      throw createHttpError(
        400,
        "New email must be different from current email",
      );
    }

    const existingEmailAccount = await User.findOne({
      email: normalizedNewEmail,
    });
    if (
      existingEmailAccount &&
      existingEmailAccount._id.toString() !== req.userId
    ) {
      throw createHttpError(
        409,
        "That email is already registered with an account",
      );
    }

    user.email = normalizedNewEmail;
    await user.save();

    res.json({ success: true, message: "Email updated successfully" });
  }),
);

import { profileImageValidation } from "../utils/profileImageValidation.js";
import { uploadToR2 } from "../utils/uploadTor2.js";
import { r2 } from "../utils/r2Client.js";

router.post(
  "/profileImageUpload",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const userId = req.user.id;

    if (req.file) {
      const validationError = profileImageValidation(req.file);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      const user = await User.findById(userId);
      if (!user) {
        throw createHttpError(404, "User not found");
      }

      console.log("Received file for upload:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        fileBuffer: req.file.buffer,
      });

      try {
        const imageUrl = await uploadToR2(
          req.file.buffer,
          req.file.mimetype,
          userId,
        );

        // If the user already has a profile image, delete the old one from R2
        if (imageUrl) {
          const oldImageUrl = user.profile?.profileImage;
          if (oldImageUrl) {
            const oldKey = oldImageUrl.split("/").slice(-2).join("/"); // Extract the key from the URL
            await r2.send(
              new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: oldKey,
              }),
            );
          }
        }

        // Update user's profile image URL after deleting old image if it exists

        user.profile.profileImage = imageUrl;
      } catch (error) {
        console.error("Error uploading image to R2:", error);
        throw createHttpError(500, "Error uploading image");
      }

      await user.save();
      res.json({
        message: "Successfully uploaded Profile image",
        success: true,
      });
    }
  },
);

// delete account route and remember to delete all journals associated with the user as well as tokens and cookies

router.delete("/requestDelete", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    //also delete all jornals and images in r2 associated with the user here as well
    user.journals.forEach(async (journalId) => {
      //delete journal
      await Journal.findByIdAndDelete(journalId);
    });

    try {
      r2.listObjectsV2({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: `${userId}/`,
      }).then(async (data) => {
        const objects = data.Contents || [];
        for (const obj of objects) {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET_NAME,
              Key: obj.Key,
            }),
          );
        }
      });
    } catch (error) {
      throw createHttpError(500, "Internal Server error:" + error.message);
    }

    await User.findByIdAndDelete(userId);

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    throw createHttpError(500, "Server error while deleting account");
  }
});
export default router;
