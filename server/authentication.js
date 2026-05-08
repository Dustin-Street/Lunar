import passport from "passport";
import jwt from "jsonwebtoken";
import { buildJwtPayload } from "./authentication/jwtBuild.js";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const getToken = (user) => {
  const payload = buildJwtPayload(user);

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  });
};

export const getRefreshToken = (user) => {
  const payload = buildJwtPayload(user);

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });
};
