import express from 'express'
import User from '../schema/user.js'
import authenticateToken from '../authentication/authenticateToken.js'

const router = express.Router();

//authentication 
import passport from 'passport';
import { getToken, COOKIE_OPTIONS, getRefreshToken } from "../authentication.js"


router.get('/user', (req, res) => {

})

router.post("/createUser", async (req, res) => {
  try {
    const { password, username } = req.body;
    const email = req.body.email.toLowerCase();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "A user with the given email is already registered"
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      email,
      username,
      password
    });

    await user.save();

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
        username: user.username
      }
    });

  } catch (err) {
    console.error("createUser error:", err);
    return res.status(400).json({
      message: err.message || "Registration failed"
    });
  }
});



import jwt from "jsonwebtoken"

//create refreshToken route

router.post("/refreshToken", async (req, res, next) => {
  const { signedCookies = {} } = req
  const { refreshToken } = signedCookies

  if (!refreshToken) {
    return res.status(401).send("Unauthorized")
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const userId = payload._id

    const user = await User.findOne({ _id: userId })

    if (!user) {
      return res.status(401).send("Unauthorized")
    }

    // Find the refresh token against the user record in database
    const tokenIndex = user.refreshToken.findIndex(
      item => item.refreshToken === refreshToken
    )

    if (tokenIndex === -1) {
      return res.status(401).send("Unauthorized")
    }

    const token = getToken({ _id: userId })
    // If the refresh token exists, then create new one and replace it.
    const newRefreshToken = getRefreshToken({ _id: userId })
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }

    await user.save()

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
    res.send({ success: true, token, expiresIn: 900 })
  } catch (err) {
    console.error("RefreshToken error:", err)
    res.status(401).send("Unauthorized")
  }
})

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "_id email username journals dateCreated"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found are you sure you have an account?" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        journals: user.journals,
        dateCreated: user.dateCreated
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch user"
    });
  }
});






router.post("/login", (req, res, next) => {
  // Normalize email to lowercase to match registration
  req.body.email = req.body.email.toLowerCase();

  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) {
      console.error("Passport error:", err);
      return res.status(500).json({ message: "Server error try again later" });
    }

    if (!user) {
      return res.status(401).json({
        message: info?.message || "Invalid credentials"
      });
    }

    try {
      // Generate tokens
      const token = getToken({ _id: user._id });
      const refreshToken = getRefreshToken({ _id: user._id });

      // Save refresh token to user
      if (user.refreshToken.length >= 5) {
        user.refreshToken.shift(refreshToken);
        await user.save();
      } else {
        user.refreshToken.push({ refreshToken });
        await user.save();
      }

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
          dateCreated: user.dateCreated
        }
      });
    } catch (err) {
      console.error("Error saving refresh token:", err);
      return res.status(500).json({ message: "Server error" });
    }
  })(req, res, next);
});

export default router;