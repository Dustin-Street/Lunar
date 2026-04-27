import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://270f89d575c3a8f6e076836c23f32854@o4511288692310016.ingest.us.sentry.io/4511288697356288",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: false,
});