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

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
