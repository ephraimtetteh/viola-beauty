import express from "express";
import Booking from "../models/Booking.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      declinedBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      totalUsers,
      newUsersThisMonth,
      byCategory,
      byStatus,
      recentActivity,
      monthlyTrend,
      upcomingThisWeek,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "declined" }),
      Booking.countDocuments({ createdAt: { $gte: today } }),
      Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),

      // Bookings by category
      Booking.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Bookings by status
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      // Recent activity feed
      Activity.find().sort({ createdAt: -1 }).limit(20),

      // Monthly bookings trend (last 6 months)
      Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      // Upcoming confirmed bookings this week
      Booking.find({
        status: "confirmed",
        date: {
          $gte: today.toISOString().split("T")[0],
          $lte: endOfWeek.toISOString().split("T")[0],
        },
      }).sort({ date: 1 }),
    ]);

    res.json({
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        declined: declinedBookings,
        today: todayBookings,
        thisWeek: weekBookings,
        thisMonth: monthBookings,
        byCategory,
        byStatus,
      },
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      trends: {
        monthly: monthlyTrend,
      },
      upcomingThisWeek,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics failed" });
  }
});

export default router;
