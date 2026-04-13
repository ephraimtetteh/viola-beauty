import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.NODEMAILER_PORT) || 465;
const secure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port,
  secure,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP Error:", err.message);
  else console.log("✅ SMTP ready");
});

export default transporter;
