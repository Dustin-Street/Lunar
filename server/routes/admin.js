import express from "express";
import authenticateToken from "../authentication/authenticateToken.js";
import User from "../schema/user.js";
import ErrorLog from "../schema/errorLog.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { createHttpError } from "../utils/httpError.js";

const router = express.Router();

// Admin: list error logs (admin-only)
router.get("/errors", authenticateToken, asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.userId);
  if (!currentUser || !currentUser.isAdmin) {
    throw createHttpError(403, "Insufficient permissions");
  }

  const { userId, route, method, limit = 100 } = req.query;
  const filter = {};
  if (userId) filter.user = userId;
  if (route) filter.route = route;
  if (method) filter.method = method;

  const errors = await ErrorLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(parseInt(limit, 10) || 100, 1000))
    .populate("user", "_id email username");

  res.json({ success: true, errors });
}));

// User: get own errors
router.get("/my-errors", authenticateToken, asyncHandler(async (req, res) => {
  const errors = await ErrorLog.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, errors });
}));

export default router;
