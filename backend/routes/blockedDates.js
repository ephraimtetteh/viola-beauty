import express from "express";
import BlockedDate from "../models/BlockedDate.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── Public — get all blocked dates (used by booking form) ──
router.get("/", async (req, res) => {
  try {
    const dates = await BlockedDate.find().sort({ date: 1 });
    res.json(dates.map((d) => d.date));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blocked dates" });
  }
});

// ── Public — check if a specific date is blocked ──
router.get("/check/:date", async (req, res) => {
  try {
    const blocked = await BlockedDate.findOne({ date: req.params.date });
    res.json({ blocked: !!blocked, reason: blocked?.reason });
  } catch (err) {
    res.status(500).json({ error: "Check failed" });
  }
});

// ── Admin — get all with full details ──
router.get("/admin", protect, async (req, res) => {
  try {
    const dates = await BlockedDate.find().sort({ date: 1 });
    res.json(dates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ── Admin — block a date manually ──
router.post("/", protect, async (req, res) => {
  try {
    const { date, reason = "Unavailable" } = req.body;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const existing = await BlockedDate.findOne({ date });
    if (existing)
      return res.status(409).json({ error: "Date already blocked" });

    const blocked = await BlockedDate.create({
      date,
      reason,
      autoBlocked: false,
    });

    await Activity.create({
      type: "admin",
      message: `Date blocked manually: ${date} — ${reason}`,
    });

    res.status(201).json(blocked);
  } catch (err) {
    res.status(500).json({ error: "Failed to block date" });
  }
});

// ── Admin — unblock a date ──
router.delete("/:date", protect, async (req, res) => {
  try {
    await BlockedDate.findOneAndDelete({ date: req.params.date });
    await Activity.create({
      type: "admin",
      message: `Date unblocked: ${req.params.date}`,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to unblock date" });
  }
});

// ── Admin — bulk block dates ──
router.post("/bulk", protect, async (req, res) => {
  try {
    const { dates, reason = "Unavailable" } = req.body;
    if (!dates?.length)
      return res.status(400).json({ error: "Dates required" });

    const results = await Promise.allSettled(
      dates.map((date) =>
        BlockedDate.findOneAndUpdate(
          { date },
          { date, reason, autoBlocked: false },
          { upsert: true, new: true },
        ),
      ),
    );

    await Activity.create({
      type: "admin",
      message: `Bulk blocked ${dates.length} dates`,
    });

    res.json({ success: true, count: results.length });
  } catch (err) {
    res.status(500).json({ error: "Bulk block failed" });
  }
});

export default router;
