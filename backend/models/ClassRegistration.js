import mongoose from "mongoose";

const classRegistrationSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UpcomingClass",
    required: true,
  },
  className: { type: String, required: true },
  classDate: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, default: "" },
  goals: { type: String, default: "" },
  depositPaid: { type: Number, required: true },
  reference: { type: String, required: true },
  status: {
    type: String,
    enum: ["registered", "confirmed", "cancelled"],
    default: "registered",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ClassRegistration", classRegistrationSchema);
