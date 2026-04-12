import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses } from "../../constants/data";

const USD_RATE = 11.75;

const PriceDisplay = ({ price, percentPrice, size = "normal" }) => {
  const hasDiscount = percentPrice && Number(percentPrice) > 0;
  const ghsPrice    = (price / 100).toFixed(2);
  const usdPrice    = Math.round(price / 100 / USD_RATE);
  const ghsOriginal = hasDiscount ? (percentPrice / 100).toFixed(2) : null;
  const usdOriginal = hasDiscount ? Math.round(percentPrice / 100 / USD_RATE) : null;

  return (
    <div className="space-y-1">
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <p className={`text-gray-400 line-through ${size === "large" ? "text-base" : "text-sm"}`}>
            GH₵ {ghsOriginal}
          </p>
          <span className="text-gray-300">|</span>
          <p className="text-sm text-gray-400 line-through">${usdOriginal}</p>
          <span className="text-xs bg-[#7c5546] text-white px-2 py-0.5 rounded-full">
            {Math.round((1 - price / percentPrice) * 100)}% OFF
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <p className={`font-bold text-[#7c5546] ${size === "large" ? "text-xl" : "text-lg"}`}>
          GH₵ {ghsPrice}
        </p>
        <span className="text-gray-300">|</span>
        <p className={`font-bold text-gray-600 ${size === "large" ? "text-base" : "text-sm"}`}>
          ${usdPrice}
        </p>
      </div>
    </div>
  );
};

const CourseModal = ({ course, onClose }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [error, setError]         = useState("");

  const handleProceed = () => {
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!lastName.trim())  { setError("Please enter your last name.");  return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email."); return; }
    setError("");
    onClose();
    navigate("/checkout", { state: { course, email, firstName, lastName } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        <img
          src={course.image}
          className="w-full h-48 object-cover rounded-xl"
        />
        <h3 className="text-2xl font-semibold">{course.name}</h3>
        <p className="text-sm text-gray-500">{course.level}</p>
        <p className="text-gray-600 text-sm">{course.description}</p>

        <PriceDisplay
          price={course.price}
          percentPrice={course.percentPrice}
          size="large"
        />

        {/* ── GHS Section ── */}
        <div className="border border-[#e8d9cc] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-[#fdf6e3] text-[#7c5546] border border-[#d4b86a] px-2 py-0.5 rounded-full font-medium">
              🇬🇭 Local Payments <strong> ONLY</strong> — GHS
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pay in Ghana Cedis using <strong>MTN MoMo</strong>,
            <strong> Vodafone Cash</strong>, <strong>AirtelTigo Money</strong>,
            local bank cards, or direct bank transfer.
          </p>

          {/* Name fields */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError("");
              }}
              className="w-1/2 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#7c5546]"
            />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError("");
              }}
              className="w-1/2 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#7c5546]"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#7c5546]"
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            onClick={handleProceed}
            className="w-full px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition text-sm"
          >
            Pay in GHS — GH₵ {(course.price / 100).toFixed(2)} →
          </button>
        </div>

        {/* ── USD Section ── */}
        <div className="border border-[#e8d9cc] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-[#f0f4ff] text-[#3b5bdb] border border-[#3b5bdb]/20 px-2 py-0.5 rounded-full font-medium">
              🌍 International Payments — USD
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Pay in US Dollars using an <strong>international Visa</strong>,
            <strong> Mastercard</strong>, <strong> Apple Pay </strong> or{" "}
            <strong> Cash App</strong>. 
          </p>

          <a
            href={course.usdUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-center w-full px-6 py-3 rounded-full border border-black text-black font-medium hover:bg-gray-50 transition text-sm"
          >
            Pay in USD — ${Math.round(course.price / 100 / USD_RATE)} →
          </a>
        </div>
      </div>
    </div>
  );
};

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col text-center items-center justify-center mb-16">
        <h2 className="text-4xl font-semibold capitalize">Three Levels of Glam</h2>
        <div className="w-24 h-0.75 mt-2 rounded-full bg-linear-to-r from-[#fff8f5] to-[#7c5546]"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id} className="rounded-xl overflow-hidden shadow-lg">
            <img src={course.image} className="h-80 w-full object-cover" />
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl hover:scale-105 transition">
              <h3 className="text-xl font-semibold">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.level}</p>
              <p className="mt-3 text-gray-600 text-sm">{course.description}</p>

              <div className="mt-4">
                <PriceDisplay
                  price={course.price}
                  percentPrice={course.percentPrice}
                />
              </div>

              {/* Payment method tags on card */}
              {/* <div className="flex gap-2 mt-3 flex-wrap">
                <span className="text-[10px] bg-[#fdf6e3] text-[#7c5546] border border-[#d4b86a]/40 px-2 py-0.5 rounded-full">
                  MoMo
                </span>
                <span className="text-[10px] bg-[#fdf6e3] text-[#7c5546] border border-[#d4b86a]/40 px-2 py-0.5 rounded-full">
                  Bank Transfer
                </span>
                <span className="text-[10px] bg-[#f0f4ff] text-[#3b5bdb] border border-[#3b5bdb]/20 px-2 py-0.5 rounded-full">
                  USD Card
                </span>
              </div> */}

              <button
                onClick={() => setSelectedCourse(course)}
                className="mt-6 px-4 py-2 rounded-full bg-black text-white text-sm"
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </section>
  );
};

export default Courses;