import passport from "passport"
import jwt from 'jsonwebtoken'

export const COOKIE_OPTIONS = {
  httpOnly: true,
  
  secure: process.env.NODE_ENV === "production",
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: 'lax' //prevents CSRF attacks
}

export const getToken = user => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  })
}

export const getRefreshToken = user => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  })
  return refreshToken
}

