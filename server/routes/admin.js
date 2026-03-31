import express from "express";
import authenticateToken from "../authentication/authenticateToken.js";
import User from "../schema/user.js";
import ErrorLog from "../schema/errorLog.js";

const router = express.Router();

// Admin: list error logs (admin-only)
router.get("/errors", authenticateToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    if (!currentUser || !currentUser.isAdmin) {
      return res.status(403).json({ message: "Insufficient permissions" });
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
  } catch (error) {
    console.error("Admin /errors error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch errors" });
  }
});

// User: get own errors
router.get("/my-errors", authenticateToken, async (req, res) => {
  try {
    const errors = await ErrorLog.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, errors });
  } catch (error) {
    console.error("Admin /my-errors error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch errors" });
  }
});

export default router;
