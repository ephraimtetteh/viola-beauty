import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

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

import { startReminderCron } from "./services/reminders.js"; 

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

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


app.get("/", (req, res) => res.json({ status: "Viola API ✅" }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 4000, () => {
      console.log(`✅ Server on port ${process.env.PORT || 4000}`);
      startReminderCron(); // ✅ start daily cron
    });
  })
  .catch(console.error);
