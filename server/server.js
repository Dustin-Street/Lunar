//server.js
import express from "express";
const app = express();

//database
import "./database/connection.js";

//passport
import passport from "passport";

//strategies
import "./authentication/jwtStrategy.js";
import "./authentication/localStrategy.js";

//session-cookies
import cookieParser from "cookie-parser";

//cors
import cors from "cors";

//body parser
import bodyParser from "body-parser";

//mongoose
import mongoose from "mongoose";

//import routes
import journalRoutes from "./routes/journals.js";
import quotesRoute from "./routes/quotes.js";
import userRoute from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import ErrorLog from "./schema/errorLog.js";
import User from "./schema/user.js";

//env variables
const PORT = process.env.PORT || 5050;

//mongoose connection

//CORS setup
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//cookie parser and body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//passport config

app.use(passport.initialize());

//logger to debug front-end to backend routing
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

//route handling
app.use("/journals", journalRoutes);
app.use("/quotes", quotesRoute);
app.use("/account", userRoute);
app.use("/admin", adminRoutes);

//error handling middleware

//error logging that is attached to user accounts - accessable via admin accounts / planned Dashboard for Support requests tools and data / also need highest level account to manage admin permissions

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(async (err, req, res, next) => {
  const errorRecord = {
    user: req.userId || null,
    route: req.originalUrl,
    method: req.method,
    status: err.status || 500,
    message: err.message || "Internal server error",
    stack: req.app.get("env") === "production" ? undefined : err.stack,
    context: {
      query: req.query,
      body: req.body,
    },
  };

  try {
    const savedError = await ErrorLog.create(errorRecord);
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $push: { accountErrors: savedError._id },
      });
    }
  } catch (e) {
    console.error("Error logging failure:", e);
  }

  console.error(err);
  if (res.headersSent) return;
  res.status(errorRecord.status).json({ message: errorRecord.message });
});
