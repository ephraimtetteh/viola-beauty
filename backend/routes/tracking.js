import express from "express";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── Log a page view (called from frontend) ──
router.post("/pageview", async (req, res) => {
  try {
    const { page, referrer } = req.body;
    await Activity.create({
      type: "page_view",
      message: `Page visited: ${page}`,
      meta: { page, referrer },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Recent page views for admin ──
router.get("/pageviews", protect, async (req, res) => {
  try {
    const views = await Activity.find({ type: "page_view" })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(views);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
