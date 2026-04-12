import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Both fields are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      login(data.user, data.token);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        const redirectTo = location.state?.from || "/dashboard";
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">
        Welcome Back
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Sign in to your Viola Beauty account
      </p>

      <div className="space-y-4">
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set("email")}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Your password"
          value={form.password}
          onChange={set("password")}
        />

        {error && (
          <div
            className="bg-red-50 border border-red-100 rounded-full
            px-4 py-2.5 text-center"
          >
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <AuthButton onClick={handleSubmit} loading={loading}>
          Sign In →
        </AuthButton>

        <p className="text-center text-sm text-gray-400 pt-1">
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            className="text-[#7c5546] font-medium hover:text-[#d4b86a] transition"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
