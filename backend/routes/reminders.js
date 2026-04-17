import express from "express";
import { protect } from "../middleware/auth.js";
import { processReminders } from "../services/reminders.js";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import { sendReminderEmail } from "../email/bookingTemplates.js";
import { sendAdminSMS, sendClientSMS } from "../services/sms.js";

const router = express.Router();

// ── Manual trigger — run all reminders now ──
router.post("/run", protect, async (req, res) => {
  try {
    const sent = await processReminders();
    res.json({ success: true, sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Send reminder for specific booking ──
router.post("/booking/:id", protect, async (req, res) => {
  try {
    const { days = 1 } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await sendReminderEmail(booking, days);

    await sendClientSMS(
      booking.phone,
      `Hi ${booking.firstName}! Reminder from Viola Beauty: your ${booking.package} appointment is on ${booking.date}. Contact us if you need to reschedule. 💄`,
    );

    await sendAdminSMS(
      `📅 Manual reminder sent for ${booking.firstName} ${booking.lastName} - ${booking.package} on ${booking.date}`,
    );

    await Activity.create({
      type: "reminder",
      message: `Manual reminder sent to ${booking.firstName} ${booking.lastName}`,
      meta: { bookingId: booking._id, days },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get upcoming bookings (for sidebar) ──
router.get("/upcoming", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ status: "confirmed" }).sort({
      date: 1,
    });

    const upcoming = bookings
      .map((b) => {
        const eventDate = new Date(b.date);
        eventDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.round(
          (eventDate - today) / (1000 * 60 * 60 * 24),
        );
        return { ...b.toObject(), daysUntil }; // ✅ daysUntil added here
      })
      .filter((b) => b.daysUntil >= 0)
      .slice(0, 20);

    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
