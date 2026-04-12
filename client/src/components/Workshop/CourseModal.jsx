import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CourseModal = ({ course, onClose }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleProceed = () => {
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    onClose();
    navigate("/checkout", { state: { course, email, firstName, lastName } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-4 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* Course info */}
        <img
          src={course.image}
          className="w-full h-48 object-cover rounded-xl"
        />
        <h3 className="text-2xl font-semibold">{course.name}</h3>
        <p className="text-sm text-gray-500">{course.level}</p>
        <p className="text-gray-600 text-sm">{course.description}</p>
        <p className="text-lg font-bold text-[#7c5540] line-through">
          GH₵ {(course.percentPrice / 100).toFixed(2)}
        </p>
        <p className="text-lg font-bold text-[#7c5546]">
          GH₵ {(course.price / 100).toFixed(2)}
        </p>

        {/* First & Last name */}
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

        {/* Error */}
        {error && <p className="text-red-500 text-xs">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleProceed}
          className="w-full px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};


export default CourseModal