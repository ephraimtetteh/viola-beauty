import { useState } from "react";

// ── Settings Tab — add alongside BookingsTab, RatesTab, ActivityTab ──
const SettingsTab = () => {
  const { authHeaders } = useApi();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setMsg("");
    setError("");
    if (form.newPassword !== form.confirm) {
      setError("New passwords don't match.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Password updated successfully ✅");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-5">
      <Card>
        <h3 className="font-semibold text-[#1a1a1a] mb-4">Change Password</h3>
        <div className="space-y-3">
          {[
            {
              key: "currentPassword",
              label: "Current Password",
              placeholder: "Enter current password",
            },
            {
              key: "newPassword",
              label: "New Password",
              placeholder: "Min 8 characters",
            },
            {
              key: "confirm",
              label: "Confirm New Password",
              placeholder: "Repeat new password",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block">
                {label}
              </label>
              <input
                type="password"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#d4b86a]"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {msg && <p className="text-green-600 text-xs">{msg}</p>}

          <button
            onClick={handleChange}
            disabled={loading}
            className="w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab
