import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthPrompt from "../components/auth/AuthPrompt";

const API = import.meta.env.VITE_API_URL;

const inputCls =
  "w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm " +
  "focus:outline-none focus:border-[#d4b86a] bg-white placeholder-gray-400 transition";
const labelCls =
  "text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block";

// ── Paystack hook ──
const usePaystack = ({
  email,
  firstName,
  lastName,
  amount,
  publicKey,
  currency,
  reference,
  metadata,
  onSuccess,
  onClose,
}) => {
  return () => {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      currency,
      ref: reference,
      firstname: firstName,
      lastname: lastName,
      metadata,
      callback: (t) => {
        onSuccess(t);
      },
      onClose,
    });
    handler.openIframe();
  };
};

export default function ClassRegistration() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cls } = state || {};

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    goals: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [spots, setSpots] = useState(null);

  const reference = useRef(`viola_class_${cls?._id}_${Date.now()}`);

  useEffect(() => {
    if (!cls) {
      navigate("/courses");
      return;
    }
    fetch(`${API}/api/classes/${cls._id}/spots`)
      .then((r) => r.json())
      .then(setSpots)
      .catch(console.error);
  }, [cls]);

  if (!cls) return null;

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    return e;
  };

  const handleSuccess = async (transaction) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/classes/${cls._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          depositPaid: cls.deposit,
          reference: transaction.reference,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = usePaystack({
    email: form.email,
    firstName: form.firstName,
    lastName: form.lastName,
    amount: cls.deposit,
    publicKey: "pk_live_53d3cf9af7f266671480f5f4ee22538e8d268aca",
    currency: "GHS",
    reference: reference.current,
    metadata: {
      custom_fields: [
        {
          display_name: "Class",
          variable_name: "class_name",
          value: cls.title,
        },
        {
          display_name: "Student",
          variable_name: "student_name",
          value: `${form.firstName} ${form.lastName}`,
        },
      ],
    },
    onSuccess: handleSuccess,
    onClose: () => console.log("Payment closed"),
  });

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    initializePayment();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
            {/* <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" /> */}
            <div className="p-8 space-y-4">
              <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                You're registered, {form.firstName}!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your deposit for <strong>{cls.title}</strong> on{" "}
                <strong>{cls.date}</strong> has been received. Check your email
                for confirmation and further details.
              </p>
              <div className="bg-[#fdf6e3] rounded-xl p-4 text-left space-y-2 text-sm">
                {[
                  ["Class", cls.title],
                  ["Date", cls.date],
                  ["Time", cls.time],
                  ["Location", cls.location],
                  ["Deposit", `GH₵ ${(cls.deposit / 100).toFixed(2)}`],
                  [
                    "Balance",
                    `GH₵ ${((cls.price - cls.deposit) / 100).toFixed(2)}`,
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-medium text-[#1a1a1a]">{v}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#f0e6dd] pt-4">
                <p className="text-sm text-[#7c5546] italic">
                  "True beauty is on the inside. When wearing your makeup,
                  remember to wear your personality and who you truly are."
                </p>
                <p className="text-xs text-[#d4b86a] mt-1">— Viola's Secrets</p>
              </div>
            </div>
          </div>
          <AuthPrompt from="/dashboard" />
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-3 rounded-full bg-black text-white text-sm
              hover:bg-gray-800 transition"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-2">
            Class Registration
          </p>
          <h1 className="text-3xl font-semibold text-[#1a1a1a]">{cls.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {cls.date} · {cls.time}
          </p>
        </div>

        {/* Class summary */}
        <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
          {/* <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" /> */}
          <div className="p-5 space-y-2 text-sm">
            {[
              ["Date", cls.date],
              ["Time", cls.time],
              ["Location", cls.location],
              ["Duration", cls.duration],
              ["Full Price", `GH₵ ${(cls.price / 100).toFixed(2)}`],
              ["Deposit Due", `GH₵ ${(cls.deposit / 100).toFixed(2)}`],
              [
                "Spots Left",
                spots ? `${spots.available} of ${spots.total}` : "Loading...",
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400">{k}</span>
                <span className="font-medium text-[#1a1a1a]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {spots?.available === 0 ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
            <p className="text-red-600 font-medium text-sm">
              This class is fully booked.
            </p>
          </div>
        ) : (
          <>
            {/* Personal details */}
            <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
              {/* <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" /> */}
              <div className="p-5 space-y-4">
                <h3 className="font-semibold text-[#1a1a1a]">Your Details</h3>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className={labelCls}>First Name *</label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={set("firstName")}
                      className={`${inputCls} ${errors.firstName ? "border-red-300" : ""}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 pl-2">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <label className={labelCls}>Last Name *</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={set("lastName")}
                      className={`${inputCls} ${errors.lastName ? "border-red-300" : ""}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 pl-2">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={set("email")}
                    className={`${inputCls} ${errors.email ? "border-red-300" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 pl-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={form.phone}
                    onChange={set("phone")}
                    className={`${inputCls} ${errors.phone ? "border-red-300" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 pl-2">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
              {/* <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" /> */}
              <div className="p-5 space-y-4">
                <h3 className="font-semibold text-[#1a1a1a]">Background</h3>
                <div>
                  <label className={labelCls}>Current Experience Level</label>
                  <select
                    value={form.experience}
                    onChange={set("experience")}
                    className={inputCls}
                  >
                    <option value="">Select your level</option>
                    <option value="Complete beginner">Complete beginner</option>
                    <option value="Some experience">Some experience</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>What do you hope to learn?</label>
                  <textarea
                    placeholder="Tell us your makeup goals..."
                    value={form.goals}
                    onChange={set("goals")}
                    rows={3}
                    className="w-full border border-[#e8d9cc] rounded-2xl px-5 py-3 text-sm
                      focus:outline-none focus:border-[#d4b86a] bg-white placeholder-gray-400
                      transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className="bg-[#fdf6e3] border border-[#d4b86a]/30 rounded-2xl p-4">
              <p className="text-xs text-[#7c5546] leading-relaxed">
                <span className="font-semibold">Deposit required:</span> A
                deposit of <strong>GH₵ {(cls.deposit / 100).toFixed(2)}</strong>{" "}
                is required to secure your spot. The balance of{" "}
                <strong>
                  GH₵ {((cls.price - cls.deposit) / 100).toFixed(2)}
                </strong>{" "}
                is due on the day of the class.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-black text-white text-sm
                font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white
                    rounded-full animate-spin"
                  />
                  Processing...
                </span>
              ) : (
                `Pay Deposit — GH₵ ${(cls.deposit / 100).toFixed(2)}`
              )}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 rounded-full border border-gray-200
                text-gray-400 text-sm hover:border-gray-300 transition"
            >
              Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
