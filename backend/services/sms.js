import AfricasTalking from "africastalking";
import dotenv from "dotenv";
dotenv.config();

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});
const sms = at.SMS;

const ADMIN_PHONES = [
  process.env.ADMIN_PHONE_1,
  process.env.ADMIN_PHONE_2,
].filter(Boolean);

export const sendAdminSMS = async (message) => {
  try {
    await sms.send({
      to: ADMIN_PHONES,
      from: process.env.AT_SENDER_ID || "ViolaBeauty",
      message,
    });
    console.log("✅ SMS sent to admins");
  } catch (err) {
    console.error("❌ SMS failed:", err.message);
  }
};

export const sendClientSMS = async (phone, message) => {
  try {
    await sms.send({
      to: [phone],
      from: process.env.AT_SENDER_ID || "ViolaBeauty",
      message,
    });
    console.log(`✅ SMS sent to ${phone}`);
  } catch (err) {
    console.error("❌ SMS failed:", err.message);
  }
};
