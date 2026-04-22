import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import CoursePurchase from "../models/CoursePurchase.js";
import { protectUser } from "../middleware/userAuth.js";
import { protect } from "../middleware/auth.js";
import { sendWelcomeEmail, sendCourseEmail } from "../email/userTemplates.js";
import transporter from "../email/transporter.js";
import { wrap } from "../email/base.js";

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (u) => ({
  id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  role: "user",
});

// ── Register ──
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(409)
        .json({ error: "An account with this email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hash,
    });

    await Activity.create({
      type: "user",
      message: `New user registered: ${user.firstName} ${user.lastName}`,
    });

    sendWelcomeEmail(user).catch(console.error);
    res.status(201).json({ token: signToken(user._id), user: safeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ── Login ──
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    res.json({ token: signToken(user._id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ── Get my profile ──
router.get("/me", protectUser, async (req, res) => {
  if (req.user.role === "admin") {
    return res.json({
      id: req.user._id,
      email: req.user.email,
      firstName: "Admin",
      lastName: "",
      role: "admin",
    });
  }
  res.json(safeUser(req.user));
});

// ── Update profile ──
router.put("/me", protectUser, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true },
    );
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// ── Change password ──
router.post("/change-password", protectUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ error: "Min 8 characters" });

    const user = await User.findById(req.user._id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(401).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Password change failed" });
  }
});

// ── Get my bookings ──
router.get("/bookings", protectUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// ── Get my course purchases ──
router.get("/courses", protectUser, async (req, res) => {
  try {
    const purchases = await CoursePurchase.find({
      email: req.user.email.toLowerCase(),
    }).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ── Course purchase email ──
router.post("/course-email", async (req, res) => {
  try {
    const { email, firstName, lastName, courseName, courseLevel, reference } =
      req.body;
    if (!email || !courseName)
      return res.status(400).json({ error: "Missing fields" });
    await sendCourseEmail({
      email,
      firstName,
      lastName,
      courseName,
      courseLevel,
      reference,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send course email" });
  }
});

// ══════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════

// ── Admin — get all registered users ──
router.get("/admin/all", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ── Admin — get all course purchases ──
router.get("/admin/courses", protect, async (req, res) => {
  try {
    const purchases = await CoursePurchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course purchases" });
  }
});

// ── Admin — get all unique client emails (bookings + users + purchases) ──
router.get("/admin/clients", protect, async (req, res) => {
  try {
    const [bookingEmails, userDocs, purchaseEmails] = await Promise.all([
      Booking.distinct("email"),
      User.find().select("firstName lastName email phone createdAt"),
      CoursePurchase.distinct("email"),
    ]);

    // Build a merged client map keyed by email
    const clientMap = new Map();

    // Seed from users (have full name + phone)
    for (const u of userDocs) {
      clientMap.set(u.email.toLowerCase(), {
        email: u.email.toLowerCase(),
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        isUser: true,
        joinedAt: u.createdAt,
      });
    }

    // Add booking-only clients (may not have registered)
    const bookings = await Booking.find(
      {},
      "firstName lastName email phone createdAt",
    ).sort({ createdAt: -1 });

    for (const b of bookings) {
      const key = b.email.toLowerCase();
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          email: key,
          firstName: b.firstName,
          lastName: b.lastName,
          phone: b.phone,
          isUser: false,
          joinedAt: b.createdAt,
        });
      }
    }

    // Tag clients who have course purchases
    const purchaseSet = new Set(purchaseEmails.map((e) => e.toLowerCase()));

    const clients = Array.from(clientMap.values()).map((c) => ({
      ...c,
      hasCourses: purchaseSet.has(c.email),
    }));

    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// ── Admin — send bulk email ──
router.post("/admin/bulk-email", protect, async (req, res) => {
  try {
    const { emails, subject, body } = req.body;

    if (!emails?.length || !subject || !body)
      return res
        .status(400)
        .json({ error: "emails, subject and body are required" });

    // Send in small batches to avoid SMTP limits
    const BATCH = 10;
    let sent = 0;
    const failed = [];

    for (let i = 0; i < emails.length; i += BATCH) {
      const batch = emails.slice(i, i + BATCH);
      await Promise.allSettled(
        batch.map((email) =>
          transporter
            .sendMail({
              from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
              to: email,
              replyTo: process.env.NODEMAILER_USER,
              subject,
              html: wrap(
                subject,
                `
              <div style="color:#555;font-size:14px;line-height:1.9;">
                ${body.replace(/\n/g, "<br/>")}
              </div>
            `,
              ),
            })
            .then(() => {
              sent++;
            })
            .catch(() => {
              failed.push(email);
            }),
        ),
      );
    }

    await Activity.create({
      type: "bulk_email",
      message: `Bulk email sent to ${sent} clients — "${subject}"`,
      meta: { sent, failed: failed.length },
    });

    res.json({ success: true, sent, failed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bulk email failed" });
  }
});

// ── Admin — export clients CSV ──
router.get("/admin/clients/export", protect, async (req, res) => {
  try {

    
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin")
        return res.status(403).json({ error: "Admin only" });
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    const [userDocs, bookings, purchases] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }),
      Booking.find({}, "firstName lastName email phone createdAt").sort({
        createdAt: -1,
      }),
      CoursePurchase.find().sort({ createdAt: -1 }),
    ]);

    const purchaseMap = new Map();
    for (const p of purchases) {
      const key = p.email.toLowerCase();
      if (!purchaseMap.has(key)) purchaseMap.set(key, []);
      purchaseMap.get(key).push(p.courseName);
    }

    const clientMap = new Map();

    for (const u of userDocs) {
      clientMap.set(u.email.toLowerCase(), {
        name: `${u.firstName} ${u.lastName}`,
        email: u.email.toLowerCase(),
        phone: u.phone || "",
        type: "Registered User",
        courses: (purchaseMap.get(u.email.toLowerCase()) || []).join("; "),
        joinedAt: new Date(u.createdAt).toLocaleDateString(),
      });
    }

    for (const b of bookings) {
      const key = b.email.toLowerCase();
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: `${b.firstName} ${b.lastName}`,
          email: key,
          phone: b.phone || "",
          type: "Booking Client",
          courses: (purchaseMap.get(key) || []).join("; "),
          joinedAt: new Date(b.createdAt).toLocaleDateString(),
        });
      }
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Type",
      "Courses Purchased",
      "First Seen",
    ];
    const rows = Array.from(clientMap.values()).map((c) =>
      [c.name, c.email, c.phone, c.type, c.courses, c.joinedAt]
        .map((v) => `"${String(v || "").replace(/"/g, '""')}"`)
        .join(","),
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=viola-clients.csv",
    );
    res.send([headers.join(","), ...rows].join("\n"));
  } catch (err) {
    res.status(500).json({ error: "Export failed" });
  }
});

export default router;
