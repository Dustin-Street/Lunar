import express from "express";
import User from "../schema/user.js";
import authenticateToken from "../authentication/authenticateToken.js";
import authenticatePasswordChange from "../email/authenticatePasswordChange.js";

const router = express.Router();

//authentication
import passport from "passport";
import {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
} from "../authentication.js";

router.get("/user", (req, res) => {});

router.post("/createUser", async (req, res) => {
  try {
    const { password, username } = req.body;
    const email = req.body.email.toLowerCase();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Validate username
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    if (username.length < 2) {
      return res.status(400).json({
        message: "Username must be at least 2 characters long",
      });
    }

    // Normalize username (trim whitespace)
    const normalizedUsername = username.trim();
    console.log("Checking username:", normalizedUsername);

    // Check if user already exists by email
    console.log("Checking email:", email);
    let existingEmail;
    try {
      existingEmail = await User.findOne({ email });
    } catch (dbError) {
      console.error("Database error during email check:", dbError);
      return res.status(500).json({
        message: "Server error during registration. Please try again.",
      });
    }
    console.log("Email check result:", existingEmail ? "EXISTS" : "AVAILABLE");
    if (existingEmail) {
      return res.status(409).json({
        message: "That email is already registered with an account",
      });
    }

    // Check if username is already taken
    console.log("Checking username:", normalizedUsername);
    let usernameCount;
    try {
      usernameCount = await User.countDocuments({
        username: normalizedUsername,
      });
    } catch (dbError) {
      console.error("Database error during username check:", dbError);
      return res.status(500).json({
        message: "Server error during registration. Please try again.",
      });
    }
    console.log("Username count:", usernameCount);
    if (usernameCount > 0) {
      console.log("Username already exists, returning error");
      return res.status(409).json({
        message:
          "That username is already taken. Please choose a different one",
      });
    }

    console.log("Creating user with username:", normalizedUsername);

    console.log("Creating user with username:", normalizedUsername);

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      email,
      username: normalizedUsername,
      password,
    });

    console.log("Saving user...");
    try {
      await user.save();
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      // Handle duplicate key errors that might slip through
      if (saveError.code === 11000) {
        if (saveError.keyPattern?.username) {
          return res.status(409).json({
            message:
              "That username is already taken. Please choose a different one",
          });
        }
        if (saveError.keyPattern?.email) {
          return res.status(409).json({
            message: "That email is already registered with an account",
          });
        }
      }
      throw saveError; // Re-throw for main catch block
    }
    console.log("User saved successfully");

    // Generate tokens
    const token = getToken({ _id: user._id });
    const refreshToken = getRefreshToken({ _id: user._id });

    user.refreshToken.push({ refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
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
  } catch (err) {
    console.error("createUser error:", err);

    // Handle specific database errors
    if (err.code === 11000) {
      // Duplicate key error
      if (err.keyPattern?.email) {
        return res.status(409).json({
          message: "That email is already registered with an account",
        });
      }
      if (err.keyPattern?.username) {
        return res.status(409).json({
          message:
            "That username is already taken. Please choose a different one",
        });
      }
      // Generic duplicate key error
      return res.status(409).json({
        message:
          "This information is already registered. Please try different details",
      });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: `Invalid input: ${errors.join(", ")}`,
      });
    }

    return res.status(400).json({
      message: err.message || "Registration failed. Please try again.",
    });
  }
});

import jwt from "jsonwebtoken";

//create refreshToken route

router.post("/refreshToken", async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token found. Please log in again.",
    });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload._id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token. Please log in again.",
      });
    }

    // Find the refresh token against the user record in database
    const tokenIndex = user.refreshToken.findIndex(
      (item) => item.refreshToken === refreshToken,
    );

    if (tokenIndex === -1) {
      return res.status(401).json({
        message: "Refresh token has expired. Please log in again.",
      });
    }

    const token = getToken({ _id: userId });
    // If the refresh token exists, then create new one and replace it.
    const newRefreshToken = getRefreshToken({ _id: userId });
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

    await user.save();

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    console.log("Refresh token successful! Sending back new token");
    res.send({ success: true, token, expiresIn: 900 });
  } catch (err) {
    console.error("RefreshToken error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid refresh token. Please log in again.",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Refresh token has expired. Please log in again.",
      });
    }
    res.status(500).json({
      message: "Server error during token refresh. Please try again.",
    });
  }
});

router.get(
  "/password-reset-request/:userId",
  authenticateToken,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found. Please check your account details.",
        });
      }

      // Here you would typically send an email with reset instructions
      // For now, we'll just return a success message
      return res.status(200).json({
        message:
          "Password reset instructions have been sent to your email address. Please check your inbox and follow the link to reset your password.",
      });
    } catch (err) {
      console.error("Password reset request error:", err);
      return res.status(500).json({
        message:
          "Failed to process password reset request. Please try again later.",
      });
    }
  },
);

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "_id email username journals dateCreated",
    );

    if (!user) {
      return res.status(404).json({
        message: "User account not found. Please try logging in again.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        journals: user.journals,
        dateCreated: user.dateCreated,
      },
    });
  } catch (err) {
    console.error("Error in /me:", err);
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
});

router.post("/login", (req, res, next) => {
  // Validate input
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  // Normalize email to lowercase to match registration for smoother login experience
  req.body.email = req.body.email.toLowerCase();

  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        console.error("Passport error:", err);
        return res
          .status(500)
          .json({ message: "Server error, please try again later" });
      }

      if (!user) {
        // Provide more specific feedback based on what was wrong
        const emailExists = await User.findOne({ email: req.body.email });
        if (!emailExists) {
          return res.status(401).json({
            message:
              "No account found with this email address. Please check your email or sign up for a new account.",
          });
        } else {
          return res.status(401).json({
            message:
              "Incorrect password. Please try again or reset your password if you've forgotten it.",
          });
        }
      }

      try {
        // Generate tokens
        const token = getToken({ _id: user._id });
        const refreshToken = getRefreshToken({ _id: user._id });

        // Save refresh token to user
        if (user.refreshToken.length >= 5) {
          user.refreshToken.shift();
          await user.save();
        }
        user.refreshToken.push({ refreshToken });
        await user.save();

        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

        // Return success response with token
        return res.status(200).json({
          success: true,
          message: "Login successful",
          token,
          expiresIn: 900,
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            dateCreated: user.dateCreated,
          },
        });
      } catch (err) {
        console.error("Error saving refresh token:", err);
        return res.status(500).json({
          message:
            "Login successful but there was an issue setting up your session. Please try logging in again.",
        });
      }
    },
  )(req, res, next);
});

//change password route ->

router.get("/password-reset-request/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({
        message: "Missing user ID. Please provide a valid user ID.",
      });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        message:
          "User not found. Please check your account details and try again.",
      });
    }

    await authenticatePasswordChange(user.email, user._id);

    res.json({
      message:
        "Password reset email sent successfully. Please check your inbox (and spam folder) for instructions on how to reset your password.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Failed to send password reset email. Please try again later or contact support if the problem persists.",
    });
  }
});

router.get("/change-password", async (req, res) => {});

router.get("/change-password", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationCode: hashedToken,
      verificationExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Token is valid — now allow password change
    // You can redirect to frontend or return JSON
    res.json({ message: "Token valid. Proceed to password reset." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// delete account route and remember to delete all journals associated with the user as well as tokens and cookies

export default router;
