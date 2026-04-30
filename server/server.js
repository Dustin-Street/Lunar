//sentry - cloud storage for logs file contain include and setup logic
import "./instrument.js";
import * as Sentry from "@sentry/node";
import sentryHandler from "./middleware/sentryHandler.js";
//server.js
import express from "express";
const app = express();

//security
import { query, validationResult } from "express-validator";

import helmet from "helmet";
import crypto from "crypto";

import { limiter } from "./middleware/limiterHandler.js";

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

import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

//passport config

app.use(passport.initialize());

//helmet
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(32).toString("base64");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.cspNonce}'`,
          process.env.FRONTEND_URL,
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // or use nonces for styles too
        ],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL, process.env.API_URL],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
    xssFilter: true,
    hsts: {
      maxAge: 60 * 60 * 24 * 365,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

app.set("trust proxy", 1);
//limit to 100 request per IP
app.use(limiter)

//logger to debug front-end to backend routing
app.use((req, res, next) => {
  next();
});

//route handling
app.use("/journals", journalRoutes);
app.use("/quotes", quotesRoute);
app.use("/account", userRoute);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);

Sentry.setupExpressErrorHandler(app);
app.use(sentryHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
