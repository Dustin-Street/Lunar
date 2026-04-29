import ErrorLog from "../schema/errorLog.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler = async (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  console.error(err);
  if (res.headersSent) return next(err);

  res.status(status).json({ message: message, success: false });
};
