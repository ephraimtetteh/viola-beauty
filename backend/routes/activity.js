import express from "express";
import Activity from "../models/Activity.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Activity feed
router.get("/", protect, async (req, res) => {
  const items = await Activity.find().sort({ createdAt: -1 }).limit(50);
  res.json(items);
});

// Stats
router.get("/stats", protect, async (req, res) => {
  const [total, pending, confirmed, declined, byCategory, recent] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "declined" }),
      Booking.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({ total, pending, confirmed, declined, byCategory, recent });
});

export default router;
