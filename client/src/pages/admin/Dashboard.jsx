import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── API helper ──
// ── Replace the existing useApi hook with this ──
const API = import.meta.env.VITE_API_URL; // ✅ full backend URL

const useApi = () => {
  const token = localStorage.getItem("viola_token");
  return {
    token,
    authHeaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// ── Shared UI ──
const GoldBar = () => (
  <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden ${className}`}>
    <GoldBar />
    <div className="p-5">{children}</div>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
    <div className="h-1" style={{ background: color }} />
    <div className="p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-bold mt-1" style={{ color }}>{value}</p>
    </div>
  </div>
);

const Badge = ({ status }) => {
  const s = {
    pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50  text-green-700  border-green-200",
    declined:  "bg-red-50    text-red-600    border-red-200",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${s[status]}`}>
      {status}
    </span>
  );
};

const inputCls =
  "border border-[#e8d9cc] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#d4b86a] w-full bg-white";

// ── Bookings Tab ──
const BookingsTab = () => {
  const { authHeaders } = useApi();
  const [bookings,  setBookings]  = useState([]);
  const [filter,    setFilter]    = useState({ status: "", category: "", search: "" });
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const p = new URLSearchParams(
      Object.fromEntries(Object.entries(filter).filter(([, v]) => v)),
    );
    const res = await fetch(`${API}/api/bookings?${p}`, {
      headers: authHeaders,
    });
    setBookings(await res.json());
    setLoading(false);
  };

  // ✅ Re-fetch when filter changes
  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ status }),
    });
    setSelected(null);
    fetchBookings(); // ✅ was fetch_()
  };

  const remove = async (id) => {
    if (!confirm("Delete this booking?")) return;
    await fetch(`${API}/api/bookings/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    setSelected(null);
    fetchBookings(); // ✅ was fetch_()
  };
  

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="border border-[#e8d9cc] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#d4b86a] w-52"
          />
          {[
            {
              key: "status",
              opts: ["pending", "confirmed", "declined"],
              label: "All Status",
            },
            {
              key: "category",
              opts: ["Bridal", "Glam Sessions", "Classes"],
              label: "All Categories",
            },
          ].map(({ key, opts, label }) => (
            <select
              key={key}
              value={filter[key]}
              onChange={(e) => setFilter({ ...filter, [key]: e.target.value })}
              className="border border-[#e8d9cc] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#d4b86a]"
            >
              <option value="">{label}</option>
              {opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ))}
        </div>
        <a
          href={`${API}/api/bookings/export?token=${localStorage.getItem("viola_token")}`}
          target="_blank"
          className="px-5 py-2 rounded-full bg-[#1a1a1a] text-white text-sm hover:bg-gray-800 transition"
        >
          Export CSV ↓
        </a>
      </div>

      {/* Table */}
      <Card className="!p-0">
        <GoldBar />
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fdf6e3] border-b border-[#f0e6dd]">
                  {["Client", "Category", "Package", "Date", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-[#7c5546] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b._id}
                    className={`border-b border-[#f0e6dd] hover:bg-[#fdf6e3] transition ${i % 2 ? "bg-gray-50/30" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1a1a1a]">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{b.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.category}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                      {b.package}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {b.date}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(b)}
                        className="text-[#d4b86a] hover:text-[#7c5546] text-xs font-medium"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!bookings.length && (
              <p className="text-center py-12 text-gray-400 text-sm">
                No bookings found
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <GoldBar />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selected.email} · {selected.phone}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <Badge status={selected.status} />

              <div className="bg-[#fdf6e3] rounded-xl p-4 space-y-2.5 text-sm">
                {[
                  ["Category", selected.category],
                  ["Package", selected.package],
                  ["Date", selected.date],
                  ["Location", selected.location],
                  ["People", selected.numberOfPeople],
                  ["Notes", selected.notes],
                  [
                    "Submitted",
                    new Date(selected.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="font-medium text-[#1a1a1a] text-right">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selected._id, "confirmed")}
                    className="flex-1 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                  >
                    ✓ Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(selected._id, "declined")}
                    className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                  >
                    ✕ Decline
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 py-2.5 rounded-full border border-[#d4b86a] text-[#7c5546] text-sm text-center font-medium hover:bg-[#fdf6e3] transition"
                >
                  Email Client
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="flex-1 py-2.5 rounded-full border border-[#d4b86a] text-[#7c5546] text-sm text-center font-medium hover:bg-[#fdf6e3] transition"
                >
                  Call Client
                </a>
              </div>

              <button
                onClick={() => remove(selected._id)}
                className="w-full py-2.5 rounded-full border border-red-200 text-red-500 text-sm hover:bg-red-50 transition"
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Rates Tab ──
const RatesTab = () => {
  const { authHeaders } = useApi();
  const [category, setCategory] = useState("bridal");
  const [packages, setPackages] = useState([]);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    fetch(`/api/rates/${category}`)
      .then(r => r.json())
      .then(d => setPackages(d?.packages || []));
  }, [category]);

  const add    = ()      => setPackages([...packages, { name: "", price: "" }]);
  const remove = (i)     => setPackages(packages.filter((_, idx) => idx !== i));
  const update = (i, f, v) =>
    setPackages(packages.map((p, idx) => idx === i ? { ...p, [f]: v } : p));

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/rates/${category}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ packages }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "bridal",   label: "💍 Bridal"       },
          { id: "glam",     label: "✨ Glam Sessions" },
          { id: "courses",  label: "🎓 Courses"       },
        ].map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              category === c.id
                ? "bg-[#1a1a1a] text-white"
                : "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-[#1a1a1a] capitalize">
            {category} Packages
          </h3>
          <button onClick={add}
            className="text-sm px-4 py-1.5 rounded-full border border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] transition">
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {packages.map((pkg, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input value={pkg.name}
                onChange={e => update(i, "name", e.target.value)}
                placeholder="Package name"
                className={`${inputCls} flex-1`}
              />
              <input value={pkg.price}
                onChange={e => update(i, "price", e.target.value)}
                placeholder="GHS price"
                className={`${inputCls} w-36`}
              />
              <button onClick={() => remove(i)}
                className="text-red-400 hover:text-red-600 text-xl flex-shrink-0">
                ×
              </button>
            </div>
          ))}

          {!packages.length && (
            <p className="text-sm text-gray-400 text-center py-4">
              No packages yet — click "+ Add" to start
            </p>
          )}
        </div>

        <button onClick={save} disabled={saving}
          className="w-full mt-5 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </Card>
    </div>
  );
};

// ── Activity Tab ──
const ActivityTab = () => {
  const { authHeaders } = useApi();
  const [activity, setActivity] = useState([]);
  const [stats,    setStats]    = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("${API}/api/activity", { headers: authHeaders }).then((r) =>
        r.json(),
      ),
      fetch("${API}/api/activity/stats", { headers: authHeaders }).then((r) =>
        r.json(),
      ),
    ]).then(([a, s]) => {
      setActivity(a);
      setStats(s);
    });
  }, []);

  const icons = { booking: "📋", rate_update: "✏️", email_sent: "📧", auth: "🔐" };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total"     value={stats.total}     color="#d4b86a" />
          <StatCard label="Pending"   value={stats.pending}   color="#f59e0b" />
          <StatCard label="Confirmed" value={stats.confirmed} color="#10b981" />
          <StatCard label="Declined"  value={stats.declined}  color="#ef4444" />
        </div>
      )}

      {stats?.byCategory?.length > 0 && (
        <Card>
          <p className="text-xs font-semibold text-[#d4b86a] uppercase tracking-wider mb-4">
            Bookings by Category
          </p>
          <div className="space-y-3">
            {stats.byCategory.map(({ _id, count }) => (
              <div key={_id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{_id}</span>
                  <span className="font-semibold text-[#7c5546]">{count}</span>
                </div>
                <div className="h-2 bg-[#f0e6dd] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4b86a] to-[#7c5546] rounded-full transition-all duration-500"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p className="text-xs font-semibold text-[#d4b86a] uppercase tracking-wider mb-4">
          Activity Feed
        </p>
        <div className="space-y-1">
          {activity.map(a => (
            <div key={a._id}
              className="flex items-start gap-3 py-2.5 border-b border-[#f0e6dd] last:border-0">
              <span className="text-lg flex-shrink-0 mt-0.5">{icons[a.type] || "•"}</span>
              <div>
                <p className="text-sm text-[#1a1a1a]">{a.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(a.createdAt).toLocaleDateString("en-GB", {
                    day:"numeric",month:"short",year:"numeric",
                    hour:"2-digit",minute:"2-digit"
                  })}
                </p>
              </div>
            </div>
          ))}
          {!activity.length && (
            <p className="text-sm text-gray-400 text-center py-6">No activity yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

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

// ── Main Dashboard ──
export default function Dashboard() {
  const [tab, setTab] = useState("bookings");
  const navigate      = useNavigate();
  const { token, user, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user && !isAdmin) {
      navigate("/dashboard");
    } // redirect regular users
  }, [token, user, isAdmin]);

  const handleLogout = () => {
    logout(); // ✅ use unified logout
    navigate("/login");
  };

 

  const tabs = [
    { id: "bookings", label: "📋 Bookings" },
    { id: "rates", label: "💰 Rates" },
    { id: "activity", label: "📊 Activity" },
    { id: "settings", label: "⚙️ Settings" }, // ✅ add this
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5]">
      {/* Top nav */}
      <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <p className="text-[#d4b86a] text-xs tracking-[3px] uppercase">
            Viola Beauty
          </p>
          <h1 className="text-white font-semibold text-lg leading-tight">
            Admin Dashboard
          </h1>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-full transition"
        >
          Sign Out
        </button>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 mb-8 bg-white border border-[#e8d9cc] rounded-full p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                tab === t.id
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsTab />}
        {tab === "rates" && <RatesTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}