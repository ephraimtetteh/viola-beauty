import cron from "node-cron";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import { sendReminderEmail } from "../email/bookingTemplates.js";
import { sendAdminSMS, sendClientSMS } from "./sms.js";

const getDaysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  return Math.round((eventDate - today) / (1000 * 60 * 60 * 24));
};

export const processReminders = async () => {
  console.log("⏰ Running reminder check...");

  const bookings = await Booking.find({ status: "confirmed" });
  let sent = 0;

  for (const booking of bookings) {
    const days = getDaysUntil(booking.date);

    if (![7, 3, 1].includes(days)) continue;

    const label = days === 1 ? "tomorrow" : `in ${days} days`;

    // Email reminder to client
    await sendReminderEmail(booking, days).catch(console.error);

    // SMS to client
    await sendClientSMS(
      booking.phone,
      `Hi ${booking.firstName}! Your Viola Beauty ${booking.package} appointment is ${label} on ${booking.date}. Reply to this message or call us if you have any questions. See you soon! 💄`,
    ).catch(console.error);

    // SMS to admins
    await sendAdminSMS(
      `📅 REMINDER: ${booking.firstName} ${booking.lastName} - ${booking.package} is ${label} (${booking.date}). Phone: ${booking.phone}`,
    ).catch(console.error);

    await Activity.create({
      type: "reminder",
      message: `${days}-day reminder sent to ${booking.firstName} ${booking.lastName} for ${booking.date}`,
      meta: { bookingId: booking._id, days },
    });

    sent++;
  }

  console.log(`✅ Reminders processed: ${sent} sent`);
  return sent;
};

// ── Run every day at 8:00 AM ──
export const startReminderCron = () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      console.log("🕗 Daily reminder cron running...");
      await processReminders();
    },
    { timezone: "Africa/Accra" },
  );

  console.log("✅ Reminder cron scheduled (daily 8am Accra time)");
};
