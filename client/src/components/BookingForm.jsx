import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import AuthPrompt from "./auth/AuthPrompt";

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const CLIENT_TEMPLATE_ID = "template_booking_client";
const VIOLA_TEMPLATE_ID = "template_booking_viola";

const SERVICE_PACKAGES = {
  Bridal: {
    icon: "💍",
    description: "Wedding day glam, trials & consultation",
    packages: [
      "April Package — Bride Only",
      "April Package — Bride + 1",
      "April Package — Bride + 2",
      "September Package — Bride Only",
      "September Package — Bride + 1",
      "September Package — Bride + 2",
      "Half Day Package",
      "Full Day Package",
      "Trial & Consultation",
      "Civil Wedding — GHS 2,500",
      "Sunday Thanksgiving — GHS 2,000",
      "Mother of the Bride — GHS 1,000",
      "Bridesmaid Glam (per head)",
    ],
  },
  "Glam Sessions": {
    icon: "✨",
    description: "Everyday, soft & statement glam sessions",
    packages: [
      "Everyday Glam Session",
      "Soft Glam Session",
      "Statement Glam Session",
      "Studio Glam Session",
      "Portrait Glam Session",
      "Essentials Glam Session",
    ],
  },
  Classes: {
    icon: "🎓",
    description: "In-person and online makeup courses",
    packages: [
      "Personal Glam — In-Person 1 Day (GHS 1,500)",
      "Personal Glam — In-Person 2 Days (GHS 2,450)",
      "Personal Glam — In-Person 3 Days (GHS 3,250)",
      "Personal Glam — Online 1 Day (GHS 1,000)",
      "Personal Glam — Online 2 Days (GHS 1,800)",
      "Intermediate — 5 Days (GHS 4,500)",
      "Professional Internship — 4 Weeks (GHS 7,500)",
      "Group Course 2 Days (GHS 7,000–10,000)",
    ],
  },
};

const inputClass =
  "w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a] bg-white text-gray-700 placeholder-gray-400 transition";

const labelClass =
  "text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block";

// ── Reusable form component ──
export const BookingForm = ({ onSuccess, defaultCategory = "" }) => {
  const [step, setStep] = useState(defaultCategory ? 2 : 1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    location: "",
    numberOfPeople: "",
    notes: "",
    category: defaultCategory,
    package: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const selectCategory = (cat) => {
    update("category", cat);
    update("package", "");
    setStep(2);
  };

  const validate = () => {
    if (!form.firstName.trim()) return "Please enter your first name.";
    if (!form.lastName.trim()) return "Please enter your last name.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!form.date) return "Please select a preferred date.";
    if (!form.package) return "Please select a package.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);

    const templateData = {
      first_name: form.firstName,
      last_name: form.lastName,
      client_email: form.email,
      phone: form.phone,
      preferred_date: form.date,
      location: form.location || "Not specified",
      number_of_people: form.numberOfPeople || "Not specified",
      notes: form.notes || "None",
      service_category: form.category,
      package: form.package,
    };

    try {
      await Promise.allSettled([
        emailjs.send(
          "service_zlwibi9",
          "template_zm7hgsk",
          templateData,
          "7_X7BAG6U_84kyg5T",
        ),
        emailjs.send(
          EMAILJS_SERVICE_ID,
          VIOLA_TEMPLATE_ID,
          templateData,
          "7_X7BAG6U_84kyg5T",
        ),
      ]);
      setStep(3);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1 — Category ──
  if (step === 1) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-gray-500 mb-6">
          What experience are you interested in?
        </p>
        {Object.entries(SERVICE_PACKAGES).map(([cat, data]) => (
          <motion.button
            key={cat}
            onClick={() => selectCategory(cat)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-white border border-[#e8d9cc] hover:border-[#d4b86a] hover:shadow-md rounded-2xl p-5 text-left transition-all duration-300 group overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{data.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">{cat}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {data.description}
                  </p>
                </div>
              </div>
              <span className="text-[#d4b86a] group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  // ── Step 3 — Success ──
  if (step === 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-5 py-4"
      >
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">
          Thank you, {form.firstName}!
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your booking request has been received. We've sent a confirmation to{" "}
          <strong>{form.email}</strong> and our team will be in touch within 24
          hours.
        </p>

        {/* Summary */}
        <div className="bg-[#fdf6e3] border border-[#d4b86a]/30 rounded-2xl p-5 text-left space-y-2">
          <p className="text-xs font-semibold text-[#d4b86a] uppercase tracking-wider mb-3">
            Booking Summary
          </p>
          {[
            ["Service", form.category],
            ["Package", form.package],
            [
              "Date",
              new Date(form.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            ],
            ["Location", form.location || "To be confirmed"],
            ["Email", form.email],
            ["Phone", form.phone],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-[#1a1a1a] text-right max-w-[60%]">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#f0e6dd] pt-4">
          <p className="text-sm text-[#7c5546] italic leading-relaxed">
            "True beauty is on the inside. When wearing your makeup, remember to
            wear your personality and who you truly are."
          </p>
          <p className="text-xs text-[#d4b86a] mt-1">— Viola's Secrets</p>
        </div>
        <AuthPrompt from="/dashboard" />
      </motion.div>
    );
  }

  // ── Step 2 — Details form ──
  return (
    <div className="space-y-5">
      {/* Package selector */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-5">
          <label className={labelClass}>Select Package *</label>
          <div className="grid gap-2 mt-2">
            {SERVICE_PACKAGES[form.category].packages.map((pkg) => (
              <button
                key={pkg}
                onClick={() => update("package", pkg)}
                className={`text-left text-sm px-4 py-2.5 rounded-full border transition-all ${
                  form.package === pkg
                    ? "border-[#d4b86a] bg-[#fdf6e3] text-[#7c5546] font-medium"
                    : "border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a]"
                }`}
              >
                {form.package === pkg ? "✦ " : "○ "}
                {pkg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-5 space-y-4">
          <h3 className="font-semibold text-[#1a1a1a]">Personal Details</h3>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className={labelClass}>First Name *</label>
              <input
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="w-1/2">
              <label className={labelClass}>Last Name *</label>
              <input
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Phone Number *</label>
            <input
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Event details */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-5 space-y-4">
          <h3 className="font-semibold text-[#1a1a1a]">Event Details</h3>

          <div>
            <label className={labelClass}>Preferred Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Location / Venue</label>
            <input
              type="text"
              placeholder="e.g. East Legon, Accra or venue name"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass}
            />
          </div>

          {form.category === "Bridal" && (
            <div>
              <label className={labelClass}>Number of People</label>
              <input
                type="number"
                placeholder="e.g. 4 (bride + bridesmaids)"
                value={form.numberOfPeople}
                onChange={(e) => update("numberOfPeople", e.target.value)}
                min="1"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Special Requests / Notes</label>
            <textarea
              placeholder="Any specific requirements, skin concerns, or notes..."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className="w-full border border-[#e8d9cc] rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a] bg-white text-gray-700 placeholder-gray-400 transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* Booking summary */}
      <div className="bg-[#fdf6e3] border border-[#d4b86a]/30 rounded-2xl p-4">
        <p className="text-xs font-semibold text-[#d4b86a] uppercase tracking-wider mb-3">
          Booking Summary
        </p>
        <div className="space-y-1.5 text-sm">
          {[
            ["Service", form.category],
            ["Package", form.package || "Not selected"],
            [
              "Date",
              form.date
                ? new Date(form.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Not selected",
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-[#7c5546] text-right max-w-[60%]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setStep(1);
            setError("");
          }}
          className="w-1/3 px-4 py-3 rounded-full border border-gray-300 text-gray-500 text-sm hover:bg-gray-50 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-2/3 px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            "Submit Booking Request →"
          )}
        </button>
      </div>
    </div>
  );
};
