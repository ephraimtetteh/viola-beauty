import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

const API = import.meta.env.VITE_API_URL;

const INITIAL = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.user, data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-1">
        Create Account
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Join the Viola Beauty family today ✨
      </p>

      <div className="space-y-4">
        {/* Name row */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <AuthInput
              label="First Name"
              placeholder="First name"
              value={form.firstName}
              onChange={set("firstName")}
              error={errors.firstName}
            />
          </div>
          <div className="w-1/2">
            <AuthInput
              label="Last Name"
              placeholder="Last name"
              value={form.lastName}
              onChange={set("lastName")}
              error={errors.lastName}
            />
          </div>
        </div>

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <AuthInput
          label="Phone Number"
          type="tel"
          placeholder="+233 XX XXX XXXX"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="Min 8 characters"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />
        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />

        {apiError && (
          <div className="bg-red-50 border border-red-100 rounded-full px-4 py-2.5 text-center">
            <p className="text-red-500 text-sm">{apiError}</p>
          </div>
        )}

        <AuthButton onClick={handleSubmit} loading={loading}>
          Create Account →
        </AuthButton>

        <p className="text-center text-sm text-gray-400 pt-1">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="text-[#7c5546] font-medium hover:text-[#d4b86a] transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
