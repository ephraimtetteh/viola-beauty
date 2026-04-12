import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AdminSetup() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async () => {
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-2">
            Viola Beauty
          </p>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Admin Setup</h1>
          <p className="text-sm text-gray-400 mt-2">
            Create your admin account — this can only be done once.
          </p>
        </div>

        <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
          <div className="p-8 space-y-4">
            {success ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-2xl">🎉</p>
                <p className="text-green-600 font-medium text-sm">
                  Admin created! Redirecting to login...
                </p>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Admin email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a]"
                />
                <input
                  type="password"
                  placeholder="Password (min 8 characters)"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a]"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSetup()}
                  className="w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a]"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  onClick={handleSetup}
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Admin Account →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
