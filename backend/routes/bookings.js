import express from "express";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";
import {
  sendBookingEmails,
  sendStatusEmail,
} from "../email/bookingTemplates.js";
import BlockedDate from "../models/BlockedDate.js";

const router = express.Router();

// ── Public — submit booking ──
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // ✅ Auto-block the booked date
    await BlockedDate.findOneAndUpdate(
      { date: booking.date },
      {
        date: booking.date,
        reason: `Booked — ${booking.firstName} ${booking.lastName} (${booking.category})`,
        autoBlocked: true,
      },
      { upsert: true },
    ).catch(console.error);

    await Activity.create({
      type: "booking",
      message: `New ${booking.category} booking from ${booking.firstName} ${booking.lastName}`,
      meta: { bookingId: booking._id },
    });

    sendBookingEmails(booking).catch(console.error);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});




// ── Admin — get all with filters ──
router.get("/", protect, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search)
      filter.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});




// ── Admin — update status + send email ──
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await Activity.create({
      type: "booking",
      message: `Booking ${status} — ${booking.firstName} ${booking.lastName}`,
      meta: { bookingId: booking._id, status },
    });

    sendStatusEmail(booking, status).catch(console.error);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});





// ── Admin — export CSV ──
router.get("/export", protect, async (req, res) => {
  // Accept token from header OR query param (for direct link downloads)
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Admin only" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Category",
      "Package",
      "Date",
      "Location",
      "People",
      "Notes",
      "Status",
      "Created",
    ];
    const rows = bookings.map((b) =>
      [
        `${b.firstName} ${b.lastName}`,
        b.email,
        b.phone,
        b.category,
        b.package,
        b.date,
        b.location,
        b.numberOfPeople,
        b.notes,
        b.status,
        new Date(b.createdAt).toLocaleDateString(),
      ]
        .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
        .join(","),
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=viola-bookings.csv",
    );
    res.send([headers.join(","), ...rows].join("\n"));
  } catch (err) {
    res.status(500).json({ error: "Failed to export" });
  }
});






// ── Admin — delete ──
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    // ✅ Unblock date if no other confirmed bookings on that day
    if (booking) {
      const otherBookings = await Booking.countDocuments({
        date: booking.date,
        _id: { $ne: booking._id },
        status: { $ne: "declined" },
      });
      if (!otherBookings) {
        await BlockedDate.findOneAndDelete({
          date: booking.date,
          autoBlocked: true,
        });
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
