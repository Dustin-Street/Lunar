import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../schema/user.js";

const strategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return done(null, false, { message: 'Please enter a valid email address' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return done(null, false, { message: 'No account found with this email address' });
      }

      // Check if password is provided
      if (!password || password.trim().length === 0) {
        return done(null, false, { message: 'Password is required' });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect credentials' });
      }

      return done(null, user);
    } catch (err) {
      console.error("Authentication error:", err);
      return done(err);
    }
  }
);

passport.use(strategy);
