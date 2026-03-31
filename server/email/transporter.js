import nodemailer from "nodemailer";

let transporter;

export async function getTransporter() {
  if (transporter) return transporter;

  // DEVELOPMENT: Ethereal Email
  if (process.env.NODE_ENV !== "production") {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return transporter;
  }

  // PRODUCTION: real provider (example: Mailgun)
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  return transporter;
}