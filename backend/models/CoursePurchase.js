import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseName: { type: String, required: true },
  courseLevel: { type: String, default: "" },
  reference: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CoursePurchase", coursePurchaseSchema);
