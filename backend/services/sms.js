import dotenv from "dotenv";
dotenv.config();

let sms = null;

// Only initialize if credentials are present
if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
  const AfricasTalking = (await import("africastalking")).default;
  const at = AfricasTalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME,
  });
  sms = at.SMS;
}

const ADMIN_PHONES = [
  process.env.ADMIN_PHONE_1,
  process.env.ADMIN_PHONE_2,
].filter(Boolean);

export const sendAdminSMS = async (message) => {
  if (!sms) {
    console.log("SMS skipped — no AT credentials");
    return;
  }
  try {
    await sms.send({
      to: ADMIN_PHONES,
      from: process.env.AT_SENDER_ID || "ViolaBeauty",
      message,
    });
  } catch (err) {
    console.error("SMS failed:", err.message);
  }
};

export const sendClientSMS = async (phone, message) => {
  if (!sms) {
    console.log("SMS skipped — no AT credentials");
    return;
  }
  try {
    await sms.send({
      to: [phone],
      from: process.env.AT_SENDER_ID || "ViolaBeauty",
      message,
    });
  } catch (err) {
    console.error("SMS failed:", err.message);
  }
};
