import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: process.env.NODEMAILER_PORT === "465", // true for 465, false for 587
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false, // helps with some hosting providers
  },
});

// Verify connection on startup
transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP Error:", err.message);
  else console.log("✅ SMTP ready");
});

export default transporter;
