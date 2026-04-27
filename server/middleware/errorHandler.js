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

  res.end(res.sentry + "\n");
};
