import express from "express";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";
import { sendBookingEmails } from "./email.js";

const router = express.Router();

// Public — submit booking from site
router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    await Activity.create({
      type: "booking",
      message: `New ${booking.category} booking from ${booking.firstName} ${booking.lastName}`,
      meta: { bookingId: booking._id, category: booking.category },
    });

    await sendBookingEmails(booking);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Admin — get all bookings
router.get("/", protect, async (req, res) => {
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
});

// Admin — update status
router.patch("/:id/status", protect, async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );

  await Activity.create({
    type: "booking",
    message: `Booking ${status} — ${booking.firstName} ${booking.lastName} (${booking.category})`,
    meta: { bookingId: booking._id, status },
  });

  // Send status email to client
  await sendStatusEmail(booking, status);
  res.json(booking);
});

// Admin — export CSV
router.get("/export", protect, async (req, res) => {
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
      .map((v) => `"${v}"`)
      .join(","),
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=viola-bookings.csv",
  );
  res.send([headers.join(","), ...rows].join("\n"));
});

// Admin — delete
router.delete("/:id", protect, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
