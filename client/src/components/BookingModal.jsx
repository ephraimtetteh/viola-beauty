import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingForm } from "./BookingForm";

const BookingModal = ({ isOpen, onClose, defaultCategory = "" }) => {
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#fff8f5] z-[101] shadow-2xl flex flex-col"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8d9cc] bg-white">
              <div>
                <p className="text-xs tracking-[3px] uppercase text-[#d4b86a] font-medium">
                  Viola Beauty
                </p>
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                  Book Your Experience
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full border border-[#e8d9cc] flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Scrollable form */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <BookingForm
                defaultCategory={defaultCategory}
                onSuccess={() => {}} // success is shown inline in the form
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
