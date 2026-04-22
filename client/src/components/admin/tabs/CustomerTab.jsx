import { useState, useEffect } from "react";
import Card from "../ui/Card";

const API = import.meta.env.VITE_API_URL;

const useApi = () => {
  const token = localStorage.getItem("viola_token");
  return {
    token,
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
  };
};

const inputCls = "w-full border border-[#e8d9cc] rounded-full px-4 py-2.5 " +
                 "text-sm focus:outline-none focus:border-[#d4b86a] bg-white";

const labelCls = "text-xs font-semibold text-[#7c5546] uppercase " +
                 "tracking-wider mb-1.5 block";

// ── Sub-tabs ──
const VIEWS = [
  { id: "clients",   label: "All Clients"       },
  { id: "courses",   label: "Course Purchases"  },
  { id: "email",     label: "Send Email"        },
];

// ── Clients list ──
const ClientsView = ({ headers, token }) => {
  const [clients,  setClients]  = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/users/admin/clients`, { headers })
      .then(r => r.json())
      .then(data => setClients(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (
      c.email?.toLowerCase().includes(q) ||
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <input
          type="text"
          placeholder="Search name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputCls} w-64`}
        />
        <div className="flex gap-2">
          <a
            href={`${API}/api/users/admin/clients/export?token=${token}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full bg-black text-white text-sm
              hover:bg-gray-800 transition"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0e6dd]">
                  {["Client", "Email", "Phone", "Type", "Courses", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs
                      font-semibold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr
                    key={c.email}
                    className={`border-b border-[#f0e6dd] last:border-0
                      hover:bg-[#fdf6e3] transition
                      ${i % 2 ? "bg-[#fdf6e3]/30" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#1a1a1a]">
                        {c.firstName} {c.lastName}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{c.email}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {c.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          c.isUser
                            ? "text-green-700 bg-green-50 border-green-200"
                            : "text-gray-500 bg-gray-50 border-gray-200"
                        }`}
                      >
                        {c.isUser ? "Registered" : "Booking only"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {c.hasCourses ? (
                        <span
                          className="text-xs text-[#7c5546]
                          font-medium"
                        >
                          Has purchases
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-xs text-[#7c5546] hover:text-[#d4b86a]
                          font-medium transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="text-center py-12 text-sm text-gray-400">
                No clients found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Client detail modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50
          flex items-center justify-center px-4"
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm
            border border-[#e8d9cc]"
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selected.isUser
                      ? "Registered user"
                      : "Booking client only"}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-300 hover:text-gray-500 text-xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2.5 text-sm">
                {[
                  ["Email", selected.email],
                  ["Phone", selected.phone || "—"],
                  [
                    "Courses",
                    selected.hasCourses ? "Has course purchases" : "None",
                  ],
                  [
                    "Since",
                    selected.joinedAt
                      ? new Date(selected.joinedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "—",
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4
                    border-b border-[#f0e6dd] pb-2.5 last:border-0"
                  >
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="text-[#1a1a1a] font-medium text-right">
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 py-2.5 rounded-full border border-[#e8d9cc]
                    text-gray-600 text-sm text-center hover:border-[#d4b86a]
                    hover:text-[#7c5546] transition"
                >
                  Email
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex-1 py-2.5 rounded-full border border-[#e8d9cc]
                      text-gray-600 text-sm text-center hover:border-[#d4b86a]
                      hover:text-[#7c5546] transition"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Course purchases list ──
const CoursesView = ({ headers }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    fetch(`${API}/api/users/admin/courses`, { headers })
      .then(r => r.json())
      .then(data => setPurchases(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = purchases.filter(p => {
    const q = search.toLowerCase();
    return (
      p.email?.toLowerCase().includes(q) ||
      p.courseName?.toLowerCase().includes(q) ||
      p.reference?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search email, course or reference..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={`${inputCls} w-64`}
      />

      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0e6dd]">
                  {["Client","Course","Level","Reference","Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs
                      font-semibold text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id}
                    className={`border-b border-[#f0e6dd] last:border-0
                      hover:bg-[#fdf6e3] transition
                      ${i % 2 ? "bg-[#fdf6e3]/30" : ""}`}>
                    <td className="px-5 py-3.5 text-gray-500">{p.email}</td>
                    <td className="px-5 py-3.5 font-medium text-[#1a1a1a]">
                      {p.courseName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {p.courseLevel || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">
                      {p.reference}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p className="text-center py-12 text-sm text-gray-400">
                No purchases found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Bulk email composer ──
const EmailView = ({ headers }) => {
  const [clients,    setClients]    = useState([]);
  const [selected,   setSelected]   = useState(new Set());
  const [filter,     setFilter]     = useState("all");
  const [subject,    setSubject]    = useState("");
  const [body,       setBody]       = useState("");
  const [sending,    setSending]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [loadingC,   setLoadingC]   = useState(true);

  useEffect(() => {
    fetch(`${API}/api/users/admin/clients`, { headers })
      .then(r => r.json())
      .then(data => {
        setClients(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoadingC(false));
  }, []);

  // Filter clients by segment
  const filtered = clients.filter(c => {
    if (filter === "registered") return c.isUser;
    if (filter === "booking")    return !c.isUser;
    if (filter === "courses")    return c.hasCourses;
    return true; // all
  });

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.email)));
    }
  };

  const toggle = (email) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  };

  const send = async () => {
    if (!selected.size) return;
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res  = await fetch(`${API}/api/users/admin/bulk-email`, {
        method:  "POST",
        headers,
        body:    JSON.stringify({
          emails:  Array.from(selected),
          subject: subject.trim(),
          body:    body.trim(),
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        setSubject("");
        setBody("");
        setSelected(new Set());
      }
    } catch (err) {
      console.error(err);
      setResult({ success: false, error: "Send failed" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Compose */}
      <Card>
        <p className="text-xs font-semibold text-gray-400 uppercase
          tracking-wider mb-4">
          Compose Email
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Subject *</label>
            <input
              type="text"
              placeholder="Email subject line"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Message *</label>
            <textarea
              rows={6}
              placeholder="Write your message here. Line breaks are preserved."
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full border border-[#e8d9cc] rounded-2xl px-5 py-3
                text-sm focus:outline-none focus:border-[#d4b86a] bg-white
                resize-none transition"
            />
          </div>
        </div>
      </Card>

      {/* Recipient selector */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase
            tracking-wider">
            Recipients — {selected.size} selected
          </p>

          {/* Segment filter */}
          <div className="flex gap-1.5">
            {[
              { id: "all",        label: "All"        },
              { id: "registered", label: "Registered" },
              { id: "booking",    label: "Booking"    },
              { id: "courses",    label: "Courses"    },
            ].map(f => (
              <button key={f.id} onClick={() => {
                setFilter(f.id);
                setSelected(new Set());
              }}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  filter === f.id
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "border-[#e8d9cc] text-gray-500 hover:border-[#d4b86a]"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loadingC ? (
          <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
        ) : (
          <>
            {/* Select all */}
            <div className="flex items-center gap-3 pb-3 mb-3
              border-b border-[#f0e6dd]">
              <input
                type="checkbox"
                checked={selected.size === filtered.length && filtered.length > 0}
                onChange={selectAll}
                className="accent-[#d4b86a]"
              />
              <span className="text-sm text-gray-500">
                Select all {filtered.length} in this segment
              </span>
            </div>

            {/* Client list */}
            <div className="space-y-0 max-h-64 overflow-y-auto">
              {filtered.map(c => (
                <label key={c.email}
                  className="flex items-center gap-3 py-2.5 border-b
                    border-[#f0e6dd] last:border-0 cursor-pointer
                    hover:bg-[#fdf6e3] -mx-5 px-5 transition">
                  <input
                    type="checkbox"
                    checked={selected.has(c.email)}
                    onChange={() => toggle(c.email)}
                    className="accent-[#d4b86a] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#1a1a1a] font-medium truncate">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                  {c.isUser && (
                    <span className="text-[10px] text-green-600 border
                      border-green-200 bg-green-50 px-2 py-0.5 rounded-full
                      flex-shrink-0">
                      Registered
                    </span>
                  )}
                </label>
              ))}
              {!filtered.length && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No clients in this segment
                </p>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl px-5 py-4 border text-sm ${
          result.success
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-600"
        }`}>
          {result.success
            ? `Sent to ${result.sent} recipient${result.sent !== 1 ? "s" : ""}${
                result.failed > 0 ? ` · ${result.failed} failed` : ""
              }`
            : result.error || "Something went wrong"}
        </div>
      )}

      {/* Send button */}
      <button
        onClick={send}
        disabled={sending || !selected.size || !subject.trim() || !body.trim()}
        className="w-full py-3 rounded-full bg-black text-white text-sm
          font-medium hover:bg-gray-800 transition disabled:opacity-40
          disabled:cursor-not-allowed"
      >
        {sending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white
              rounded-full animate-spin" />
            Sending...
          </span>
        ) : `Send to ${selected.size} recipient${selected.size !== 1 ? "s" : ""}`}
      </button>
    </div>
  );
};

// ── Main CustomersTab ──
export default function CustomersTab() {
  const { headers, token } = useApi();
  const [view, setView]    = useState("clients");

  return (
    <div className="space-y-5">
      {/* View switcher */}
      <div className="flex gap-2 flex-wrap">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              view === v.id
                ? "bg-[#1a1a1a] text-white"
                : "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a]"
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === "clients" && <ClientsView headers={headers} token={token} />}
      {view === "courses" && <CoursesView headers={headers} />}
      {view === "email"   && <EmailView   headers={headers} />}
    </div>
  );
}