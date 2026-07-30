import nodemailer from "nodemailer";

export const createEmailTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    console.warn("Email service not configured. Skipping verification email.");
    return null;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error("Email transporter error:", error);
    } else {
      console.log("✅ Email server ready to send messages");
    }
  });

  return transporter;
};
