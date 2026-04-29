import * as Sentry from "@sentry/node";

export default function sentryHandler(err, req, res, next) {
  Sentry.captureException(err);
  next(err);
}
