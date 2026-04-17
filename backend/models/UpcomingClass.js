import mongoose from "mongoose";

const upcomingClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ["beginner", "intermediate", "professional", "group"],
    required: true,
  },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true }, // in pesewas
  deposit: { type: Number, required: true }, // in pesewas
  maxStudents: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UpcomingClass", upcomingClassSchema);
