import express from "express";
import Rate from "../models/Rate.js";
import Activity from "../models/Activity.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public — get rates (used by frontend)
router.get("/:category", async (req, res) => {
  const rate = await Rate.findOne({ category: req.params.category });
  res.json(rate || { packages: [] });
});

// Admin — update rates
router.put("/:category", protect, async (req, res) => {
  const rate = await Rate.findOneAndUpdate(
    { category: req.params.category },
    { packages: req.body.packages, updatedAt: new Date() },
    { new: true, upsert: true },
  );

  await Activity.create({
    type: "rate_update",
    message: `${req.params.category} rates updated`,
    meta: { category: req.params.category },
  });

  res.json(rate);
});

export default router;
