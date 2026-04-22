import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import rateRoutes from "./routes/rates.js";
import activityRoutes from "./routes/activity.js";
import userRoutes from "./routes/users.js";
import reminderRoutes from "./routes/reminders.js";
import analyticsRoutes from "./routes/analytics.js";
import blockedDateRoutes from "./routes/blockedDates.js";
import settingsRoutes from "./routes/settings.js";
import classRoutes from "./routes/classes.js";
import trackingRoutes from "./routes/tracking.js";

import { startReminderCron } from "./services/reminders.js";

dotenv.config();

const app = express();
const server = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

// ── Socket.io ──
export const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// Track active visitors: { socketId -> { page, timestamp } }
const activeVisitors = new Map();

io.on("connection", (socket) => {
  activeVisitors.set(socket.id, { page: "/", timestamp: Date.now() });

  // Broadcast updated count to all admin listeners
  io.emit("visitor_count", activeVisitors.size);

  socket.on("page_view", ({ page }) => {
    activeVisitors.set(socket.id, { page, timestamp: Date.now() });
    // Broadcast to admins
    io.emit("live_activity", {
      type: "page_view",
      page,
      visitors: activeVisitors.size,
      timestamp: Date.now(),
    });
  });

  socket.on("booking_event", ({ event, category }) => {
    io.emit("live_activity", {
      type: "booking_event",
      event, // "open" | "submit" | "abandon"
      category,
      visitors: activeVisitors.size,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    activeVisitors.delete(socket.id);
    io.emit("visitor_count", activeVisitors.size);
  });
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/blocked-dates", blockedDateRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/tracking", trackingRoutes);

app.get("/", (req, res) => res.json({ status: "Viola API" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT || 4000, () => {
      console.log(`Server on port ${process.env.PORT || 4000}`);
      startReminderCron();
    });
  })
  .catch(console.error);
