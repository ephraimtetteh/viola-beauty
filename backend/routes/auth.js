import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// ── Unified login — checks admin first, then user ──
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    // Check if admin first
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) {
      const valid = await bcrypt.compare(password, admin.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );

      await Activity.create({
        type: "auth",
        message: `Admin logged in: ${admin.email}`,
      });

      return res.json({
        token,
        user: {
          id: admin._id,
          email: admin.email,
          firstName: "Admin",
          lastName: "",
          role: "admin",
        },
      });
    }

    // Check user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: "user",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});



// ── First-time admin setup ──
// ── Allowed admin emails ──
const ALLOWED_ADMIN_EMAILS = [
  "hello@violabeautymua.com",
  "tettehephraim.64@gmail.com",
];

// ── First-time admin setup ──
router.post("/setup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    // ✅ Only allow whitelisted emails
    if (!ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase()))
      return res.status(403).json({ error: "This email is not authorised for admin access" });

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(403).json({ error: "Admin account already exists for this email" });

    const hash  = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      email:        email.toLowerCase(),
      passwordHash: hash,
    });

    res.status(201).json({ success: true, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ── Change admin password ──
router.post("/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Not an admin" });

    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid)
      return res.status(401).json({ error: "Current password incorrect" });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    await Activity.create({ type: "auth", message: "Admin password changed" });
    res.json({ success: true });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
