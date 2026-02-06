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
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      
      return done(null, user);
    } catch (err) {
      console.error("Authentication error:", err);
      return done(err);
    }
  }
);

passport.use(strategy);
