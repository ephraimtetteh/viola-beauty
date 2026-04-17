import { useState } from "react";
import Card from "../ui/Card";
import InputField from "../ui/InputField";
import ActionButton from "../ui/ActionButton";

const API = import.meta.env.VITE_API_URL;

const useApi = () => {
  const token = localStorage.getItem("viola_token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function SettingsTab() {
  const { headers } = useApi();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleChange = async () => {
    setMsg("");
    setError("");
    if (form.newPassword !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.newPassword.length < 8) {
      setError("Min 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Password updated.");
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
        <h3 className="font-semibold text-[#1a1a1a] mb-5">Change Password</h3>
        <div className="space-y-4">
          <InputField
            label="Current Password"
            type="password"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={set("currentPassword")}
          />
          <InputField
            label="New Password"
            type="password"
            placeholder="Min 8 characters"
            value={form.newPassword}
            onChange={set("newPassword")}
          />
          <InputField
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={form.confirm}
            onChange={set("confirm")}
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {msg && <p className="text-[#7c5546] text-xs">{msg}</p>}

          <ActionButton
            onClick={handleChange}
            loading={loading}
            className="w-full py-3 mt-1"
          >
            Update Password
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}
