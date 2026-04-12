import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthInput from "../auth/AuthInput";
import AuthButton from "../auth/AuthButton";
import AuthDivider from "../auth/AuthDivider";

const API = import.meta.env.VITE_API_URL;

export default function ProfileForm() {
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [msg, setMsg] = useState({ profile: "", password: "" });
  const [err, setErr] = useState({ profile: "", password: "" });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const saveProfile = async () => {
    setSaving(true);
    setMsg((p) => ({ ...p, profile: "" }));
    setErr((p) => ({ ...p, profile: "" }));
    try {
      const res = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      updateUser(data);
      setMsg((p) => ({ ...p, profile: "Profile updated ✅" }));
    } catch (e) {
      setErr((p) => ({ ...p, profile: e.message }));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setMsg((p) => ({ ...p, password: "" }));
    setErr((p) => ({ ...p, password: "" }));
    if (pwForm.newPassword !== pwForm.confirm) {
      setErr((p) => ({ ...p, password: "Passwords don't match" }));
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setErr((p) => ({ ...p, password: "Min 8 characters" }));
      return;
    }
    setChanging(true);
    try {
      const res = await fetch(`${API}/api/users/change-password`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg((p) => ({ ...p, password: "Password updated ✅" }));
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      setErr((p) => ({ ...p, password: e.message }));
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="space-y-5 max-w-lg">
      {/* Profile details */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-[#1a1a1a]">Personal Details</h3>

          <div className="flex gap-3">
            <div className="w-1/2">
              <AuthInput
                label="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </div>
            <div className="w-1/2">
              <AuthInput
                label="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <AuthInput label="Email" value={user?.email || ""} disabled />
            <p className="text-xs text-gray-400 mt-1 pl-3">
              Email cannot be changed
            </p>
          </div>

          <AuthInput
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />

          {err.profile && <p className="text-red-500 text-xs">{err.profile}</p>}
          {msg.profile && (
            <p className="text-green-600 text-xs">{msg.profile}</p>
          )}

          <AuthButton onClick={saveProfile} loading={saving}>
            Save Changes
          </AuthButton>
        </div>
      </div>

      <AuthDivider text="security" />

      {/* Change password */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
        <div className="p-6 space-y-4">
          <h3 className="font-semibold text-[#1a1a1a]">Change Password</h3>

          <AuthInput
            label="Current Password"
            type="password"
            placeholder="Current password"
            value={pwForm.currentPassword}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, currentPassword: e.target.value }))
            }
          />
          <AuthInput
            label="New Password"
            type="password"
            placeholder="Min 8 characters"
            value={pwForm.newPassword}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, newPassword: e.target.value }))
            }
          />
          <AuthInput
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={pwForm.confirm}
            onChange={(e) =>
              setPwForm((p) => ({ ...p, confirm: e.target.value }))
            }
          />

          {err.password && (
            <p className="text-red-500 text-xs">{err.password}</p>
          )}
          {msg.password && (
            <p className="text-green-600 text-xs">{msg.password}</p>
          )}

          <AuthButton
            onClick={changePassword}
            loading={changing}
            variant="secondary"
          >
            Update Password
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
