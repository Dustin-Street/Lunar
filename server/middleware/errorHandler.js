import ErrorLog from "../schema/errorLog.js";
import User from "../schema/user.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = async (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  const errorRecord = {
    user: req.userId || null,
    route: req.originalUrl,
    method: req.method,
    status,
    message,
    stack: req.app.get("env") === "production" ? undefined : err.stack,
    context: {
      query: req.query,
      body: req.body,
    },
  };

  try {
    const savedError = await ErrorLog.create(errorRecord);
    if (req.userId || req.user) {
      await User.findByIdAndUpdate(req.userId || req.user._id, {
        $push: { accountErrors: savedError._id },
      });
    }
  } catch (saveErr) {
    console.error("Error logging failure:", saveErr);
  }

  console.error(err);
  if (res.headersSent) return next(err);

  res.status(status).json({ success: false, message });
};
