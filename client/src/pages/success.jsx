import { useLocation, useNavigate } from "react-router-dom";
import AuthPrompt from "../components/auth/AuthPrompt";

const SuccessPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { course, firstName } = state || {};

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-5xl">🎉</div>
        <h2 className="text-3xl font-semibold text-[#7c5546]">
          You're enrolled{firstName ? `, ${firstName}` : ""}!
        </h2>
        <p className="text-gray-600">
          Thank you for purchasing <strong>{course?.name}</strong>. Check your
          email for next steps to access your course.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
        >
          Back to Home
        </button>

        <AuthPrompt from="/dashboard" />
      </div>
    </div>
  );
};

export default SuccessPage;
