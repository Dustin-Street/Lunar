/**
 * Creates a structured log entry and optionally prints it in development.
 *
 * @param {"error" | "warning" | "danger" | "info"} level
 *   The severity level of the log entry.
 *
 * @param {string} message
 *   A human-readable description of the event being logged.
 *
 * @param {object} [meta={}]
 *   Optional contextual data (e.g., userId, route, payload).
 *
 * @returns {{
 *   level: string,
 *   message: string,
 *   meta: object,
 *   timestamp: string
 * }}
 *   A structured log object.
 */
export default function logger(level, message, meta = {}) {
  const levels = ["error", "warning", "danger", "info"];

  if (!levels.includes(level)) {
    throw new Error(`Invalid log level: ${level}. levels are "error", "warning", "danger" and "info"`);
  }

  const log = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  };

  if (import.meta.env.NODE_ENV !== "production") {
    console.log(`[${log.level.toUpperCase()}]`, log);
    
  }

  return log;
}