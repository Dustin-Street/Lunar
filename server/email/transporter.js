import nodemailer from "nodemailer";
let transporter;
export async function getTransporter() {
  if (transporter) return transporter;

  // DEVELOPMENT: Ethereal Email
  if (process.env.NODE_ENV !== "production") {
    const localTransporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: { user: "resend", pass: `${process.env.RESEND_KEY}` },
    });

    return localTransporter;
  }

  // PRODUCTION: real provider (example: Mailgun)
  transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: { user: "resend", pass: `${process.env.RESEND_KEY}` },
  });

  return transporter;
}
