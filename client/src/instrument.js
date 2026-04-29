import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.SENTRY_ID,
  sendDefaultPii: false,
});
