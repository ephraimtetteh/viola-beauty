import mongoose from "mongoose";

const blockedDateSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  reason: { type: String, default: "Unavailable" },
  autoBlocked: { type: Boolean, default: false }, // true = blocked by booking
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("BlockedDate", blockedDateSchema);
