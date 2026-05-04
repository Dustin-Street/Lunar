import express from "express";
import authenticateToken from "../authentication/authenticateToken.js";
import User from "../schema/user.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

export default router;
