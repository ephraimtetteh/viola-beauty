import { motion } from "framer-motion";
import { BookingForm } from "../components/BookingForm";

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-3">
            Viola Beauty
          </p>
          <h1 className="text-4xl font-semibold text-[#1a1a1a]">
            Book Your Experience
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3 mb-4">
            <div className="h-px w-10 bg-[#d4b86a]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4b86a]"></div>
            <div className="h-px w-10 bg-[#d4b86a]"></div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Choose your service, tell us about your occasion, and we'll take
            care of the rest. We can't wait to glam you up! ✨
          </p>
        </motion.div>

        <BookingForm />
      </div>
    </div>
  );
}
