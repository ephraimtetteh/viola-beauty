import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthPrompt from "./auth/AuthPrompt";
import { useTracking } from "../hooks/useTracking";

const API = import.meta.env.VITE_API_URL;

const SERVICE_PACKAGES = {
  Bridal: {
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
      "Civil Wedding",
      "Sunday Thanksgiving",
      "Mother of the Bride",
      "Bridesmaid Glam (per head)",
    ],
  },
  "Glam Sessions": {
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
    description: "In-person and online makeup courses",
    packages: [
      "Personal Glam — In-Person 1 Day",
      "Personal Glam — In-Person 2 Days",
      "Personal Glam — In-Person 3 Days",
      "Personal Glam — Online 1 Day",
      "Personal Glam — Online 2 Days",
      "Intermediate — 5 Days",
      "Professional Internship — 4 Weeks",
      "Group Course 2 Days",
    ],
  },
};

const inputClass =
  "w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm " +
  "focus:outline-none focus:border-[#d4b86a] bg-white text-gray-700 " +
  "placeholder-gray-400 transition";

const labelClass =
  "text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block";

export const BookingForm = ({ onSuccess, defaultCategory = "" }) => {
  const [step, setStep] = useState(defaultCategory ? 2 : 1);
  const [blockedDates, setBlockedDates] = useState([]);
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

  const { trackBooking } = useTracking();

  useEffect(() => {
    fetch(`${API}/api/blocked-dates`)
      .then((r) => r.json())
      .then(setBlockedDates)
      .catch(console.error);
  }, []);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const selectCategory = (cat) => {
    update("category", cat);
    update("package", "");
    trackBooking("open", cat);
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
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          date: form.date,
          location: form.location || "Not specified",
          numberOfPeople: form.numberOfPeople || "Not specified",
          notes: form.notes || "None",
          category: form.category,
          package: form.package,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      trackBooking("submit", form.category);
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
            className="w-full bg-white border border-[#e8d9cc] hover:border-[#d4b86a]
              hover:shadow-sm rounded-2xl p-5 text-left transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#1a1a1a]">{cat}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {data.description}
                </p>
              </div>
              <span
                className="text-[#d4b86a] group-hover:translate-x-1
                transition-transform"
              >
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
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">
          Thank you, {form.firstName}!
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your booking request has been received. We've sent a confirmation to{" "}
          <strong>{form.email}</strong> and our team will be in touch within 24
          hours.
        </p>

        <div
          className="bg-[#fdf6e3] border border-[#d4b86a]/30 rounded-2xl
          p-5 text-left space-y-2"
        >
          <p
            className="text-xs font-semibold text-[#d4b86a] uppercase
            tracking-wider mb-3"
          >
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

  // ── Step 2 — Details ──
  return (
    <div className="space-y-5">
      {/* Package selector */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5">
        <label className={labelClass}>Select Package *</label>
        <div className="grid gap-2 mt-2">
          {SERVICE_PACKAGES[form.category]?.packages.map((pkg) => (
            <button
              key={pkg}
              onClick={() => update("package", pkg)}
              className={`text-left text-sm px-4 py-2.5 rounded-full border
                transition-all ${
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

      {/* Personal details */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5 space-y-4">
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

      {/* Event details */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-[#1a1a1a]">Event Details</h3>
        <div>
          <label className={labelClass}>Preferred Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => {
              const selected = e.target.value;
              if (blockedDates.includes(selected)) {
                update("date", "");
                setError(
                  "This date is unavailable. Please choose another date.",
                );
              } else {
                update("date", selected);
              }
            }}
            min={new Date().toISOString().split("T")[0]}
            className={`${inputClass} ${
              blockedDates.includes(form.date) ? "border-red-300" : ""
            }`}
          />
          {blockedDates.includes(form.date) && (
            <p className="text-red-500 text-xs mt-1 pl-3">
              This date is unavailable. Please choose another date.
            </p>
          )}
          {blockedDates.length > 0 && (
            <p className="text-xs text-gray-400 mt-1 pl-3">
              Some dates may be unavailable due to existing bookings.
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Location / Venue</label>
          <input
            type="text"
            placeholder="e.g. East Legon, Accra"
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
              min="1"
              onChange={(e) => update("numberOfPeople", e.target.value)}
              className={inputClass}
            />
          </div>
        )}
        <div>
          <label className={labelClass}>Special Requests / Notes</label>
          <textarea
            placeholder="Any specific requirements or notes..."
            value={form.notes}
            rows={3}
            onChange={(e) => update("notes", e.target.value)}
            className="w-full border border-[#e8d9cc] rounded-2xl px-5 py-3
              text-sm focus:outline-none focus:border-[#d4b86a] bg-white
              placeholder-gray-400 transition resize-none"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="border border-[#d4b86a]/30 rounded-2xl p-4">
        <p
          className="text-xs font-semibold text-[#d4b86a] uppercase
          tracking-wider mb-3"
        >
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

      <div className="flex gap-3">
        <button
          onClick={() => {
            setStep(1);
            setError("");
            trackBooking("abandon", form.category);
          }}
          className="w-1/3 px-4 py-3 rounded-full border border-gray-200
            text-gray-500 text-sm hover:border-gray-300 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-2/3 px-6 py-3 rounded-full bg-black text-white
            font-medium hover:bg-gray-800 transition disabled:opacity-50 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white
                rounded-full animate-spin"
              />
              Sending...
            </span>
          ) : (
            "Submit Booking Request"
          )}
        </button>
      </div>
    </div>
  );
};
