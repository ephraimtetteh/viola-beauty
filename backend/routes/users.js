import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import { protectUser } from "../middleware/userAuth.js";
import { sendWelcomeEmail, sendCourseEmail } from "../email/userTemplates.js";

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

// ── Get my profile — works for both admin and user ──
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
      return res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });

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

// ── Course purchase email (called from checkout) ──
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

export default router;
