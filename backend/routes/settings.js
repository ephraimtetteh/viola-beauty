import express from "express";
import SiteSettings from "../models/SiteSettings.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Default settings
const DEFAULTS = {
  fonts: {
    heading: "Georgia",
    body: "Inter",
    accent: "Georgia",
  },
  rates: {
    bridal: [
      { name: "April Package — Bride Only", price: "GHS 2,000" },
      { name: "April Package — Bride + 1", price: "GHS 3,000" },
      { name: "April Package — Bride + 2", price: "GHS 4,000" },
      { name: "September Package — Bride Only", price: "GHS 2,500" },
      { name: "September Package — Bride + 1", price: "GHS 3,500" },
      { name: "September Package — Bride + 2", price: "GHS 4,500" },
      { name: "Half Day Package", price: "GHS 1,500" },
      { name: "Full Day Package", price: "GHS 3,000" },
      { name: "Trial & Consultation", price: "GHS 500" },
      { name: "Civil Wedding", price: "GHS 2,500" },
      { name: "Sunday Thanksgiving", price: "GHS 2,000" },
      { name: "Mother of the Bride", price: "GHS 1,000" },
      { name: "Bridesmaid Glam (per head)", price: "GHS 800" },
    ],
    glam: [
      { name: "Everyday Glam Session", price: "GHS 400" },
      { name: "Soft Glam Session", price: "GHS 500" },
      { name: "Statement Glam Session", price: "GHS 600" },
      { name: "Studio Glam Session", price: "GHS 700" },
      { name: "Portrait Glam Session", price: "GHS 650" },
      { name: "Essentials Glam Session", price: "GHS 350" },
    ],
    courses: [
      { name: "Personal Glam — In-Person 1 Day", price: "GHS 1,500" },
      { name: "Personal Glam — In-Person 2 Days", price: "GHS 2,450" },
      { name: "Personal Glam — In-Person 3 Days", price: "GHS 3,250" },
      { name: "Personal Glam — Online 1 Day", price: "GHS 1,000" },
      { name: "Personal Glam — Online 2 Days", price: "GHS 1,800" },
      { name: "Intermediate — 5 Days", price: "GHS 4,500" },
      { name: "Professional Internship — 4 Weeks", price: "GHS 7,500" },
      { name: "Group Course 2 Days", price: "GHS 7,000–10,000" },
    ],
  },
};

// ── Public — get settings ──
router.get("/:key", async (req, res) => {
  try {
    const setting = await SiteSettings.findOne({ key: req.params.key });
    res.json(setting?.value ?? DEFAULTS[req.params.key] ?? null);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch setting" });
  }
});

// ── Admin — update setting ──
router.put("/:key", protect, async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined)
      return res.status(400).json({ error: "Value required" });

    const setting = await SiteSettings.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedAt: new Date() },
      { new: true, upsert: true },
    );

    await Activity.create({
      type: "settings",
      message: `Site setting updated: ${req.params.key}`,
    });

    res.json(setting);
  } catch (err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
});

// ── Admin — reset to defaults ──
router.post("/:key/reset", protect, async (req, res) => {
  try {
    await SiteSettings.findOneAndDelete({ key: req.params.key });
    res.json({ success: true, value: DEFAULTS[req.params.key] });
  } catch (err) {
    res.status(500).json({ error: "Reset failed" });
  }
});

export default router;
