import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  packages: { type: mongoose.Schema.Types.Mixed, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

const rateModel = mongoose.models.Rate || mongoose.model("Rate", rateSchema);
export default rateModel
