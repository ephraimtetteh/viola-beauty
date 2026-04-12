import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthPrompt = ({ from = "/dashboard" }) => {
  const { user } = useAuth();
  if (user) return null;

  return (
    <div className="bg-[#fdf6e3] border border-[#d4b86a]/30 rounded-2xl p-5 text-center space-y-3">
      <p className="text-sm font-medium text-[#7c5546]">Want to track this?</p>
      <p className="text-xs text-gray-400 leading-relaxed">
        Create a free account to view your booking history, track your
        purchases, and manage your profile.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/register"
          state={{ from }}
          className="px-5 py-2 rounded-full bg-black text-white text-xs
            font-medium hover:bg-gray-800 transition"
        >
          Create Account →
        </Link>
        <Link
          to="/login"
          state={{ from }}
          className="px-5 py-2 rounded-full border border-[#e8d9cc] text-gray-600
            text-xs font-medium hover:border-[#d4b86a] transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default AuthPrompt;
