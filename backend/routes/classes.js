import express from "express";
import UpcomingClass from "../models/UpcomingClass.js";
import ClassRegistration from "../models/ClassRegistration.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";
import { sendClassRegistrationEmail } from "../email/classTemplates.js";

const router = express.Router();

// ── Public — get active upcoming classes ──
router.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const classes = await UpcomingClass.find({
      isActive: true,
      date: { $gte: today },
    }).sort({ date: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// ── Public — get single class ──
router.get("/:id", async (req, res) => {
  try {
    const cls = await UpcomingClass.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: "Class not found" });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch class" });
  }
});

// ── Public — get registration count for a class ──
router.get("/:id/spots", async (req, res) => {
  try {
    const cls = await UpcomingClass.findById(req.params.id);
    const taken = await ClassRegistration.countDocuments({
      classId: req.params.id,
      status: { $ne: "cancelled" },
    });
    res.json({
      total: cls.maxStudents,
      taken,
      available: Math.max(0, cls.maxStudents - taken),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spots" });
  }
});

// ── Public — register for a class (after Paystack payment) ──
router.post("/:id/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      experience,
      goals,
      depositPaid,
      reference,
    } = req.body;

    const cls = await UpcomingClass.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: "Class not found" });

    // Check spots
    const taken = await ClassRegistration.countDocuments({
      classId: req.params.id,
      status: { $ne: "cancelled" },
    });
    if (taken >= cls.maxStudents)
      return res.status(409).json({ error: "Class is fully booked" });

    // Check duplicate
    const existing = await ClassRegistration.findOne({
      classId: req.params.id,
      email: email.toLowerCase(),
      status: { $ne: "cancelled" },
    });
    if (existing)
      return res
        .status(409)
        .json({ error: "You are already registered for this class" });

    const reg = await ClassRegistration.create({
      classId: req.params.id,
      className: cls.title,
      classDate: cls.date,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      experience,
      goals,
      depositPaid,
      reference,
    });

    await Activity.create({
      type: "class_registration",
      message: `${firstName} ${lastName} registered for ${cls.title} on ${cls.date}`,
      meta: { registrationId: reg._id, classId: cls._id },
    });

    sendClassRegistrationEmail(reg, cls).catch(console.error);

    res.status(201).json({ success: true, registration: reg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ── Admin — get all classes including past ──
router.get("/admin/all", protect, async (req, res) => {
  try {
    const classes = await UpcomingClass.find().sort({ date: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ── Admin — create class ──
router.post("/", protect, async (req, res) => {
  try {
    const cls = await UpcomingClass.create(req.body);
    await Activity.create({
      type: "class",
      message: `New class created: ${cls.title} on ${cls.date}`,
    });
    res.status(201).json(cls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create class" });
  }
});

// ── Admin — update class ──
router.put("/:id", protect, async (req, res) => {
  try {
    const cls = await UpcomingClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

// ── Admin — delete class ──
router.delete("/:id", protect, async (req, res) => {
  try {
    await UpcomingClass.findByIdAndDelete(req.params.id);
    await ClassRegistration.deleteMany({ classId: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ── Admin — get registrations for a class ──
router.get("/:id/registrations", protect, async (req, res) => {
  try {
    const regs = await ClassRegistration.find({ classId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// ── Admin — get all registrations ──
router.get("/admin/registrations", protect, async (req, res) => {
  try {
    const regs = await ClassRegistration.find()
      .populate("classId", "title date time location")
      .sort({ createdAt: -1 });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ── Admin — export registrations as CSV ──
router.get("/:id/registrations/export", protect, async (req, res) => {
  try {
    const cls = await UpcomingClass.findById(req.params.id);
    const regs = await ClassRegistration.find({ classId: req.params.id }).sort({
      createdAt: -1,
    });

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Experience",
      "Goals",
      "Deposit Paid",
      "Reference",
      "Status",
      "Registered",
    ];
    const rows = regs.map((r) =>
      [
        `${r.firstName} ${r.lastName}`,
        r.email,
        r.phone,
        r.experience || "",
        r.goals || "",
        `GH₵ ${(r.depositPaid / 100).toFixed(2)}`,
        r.reference,
        r.status,
        new Date(r.createdAt).toLocaleDateString(),
      ]
        .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
        .join(","),
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${cls.title.replace(/\s+/g, "-")}-registrations.csv`,
    );
    res.send([headers.join(","), ...rows].join("\n"));
  } catch (err) {
    res.status(500).json({ error: "Export failed" });
  }
});

export default router;
