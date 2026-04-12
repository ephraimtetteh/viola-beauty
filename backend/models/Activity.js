import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: { type: String },
  message: { type: String },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);
