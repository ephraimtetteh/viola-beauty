import { useState, useEffect } from "react";
import Card         from "../ui/Card";
import Badge        from "../ui/Badge";
import ActionButton from "../ui/ActionButton";

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

export default function BookingsTab() {
  const { headers } = useApi();
  const [bookings, setBookings] = useState([]);
  const [filter,   setFilter]   = useState({ status: "", category: "", search: "" });
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const p   = new URLSearchParams(
        Object.fromEntries(Object.entries(filter).filter(([, v]) => v))
      );
      const res  = await fetch(`${API}/api/bookings?${p}`, { headers });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/api/bookings/${id}/status`, {
        method: "PATCH", headers,
        body:   JSON.stringify({ status }),
      });
      setSelected(null);
      fetch_();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await fetch(`${API}/api/bookings/${id}`, { method: "DELETE", headers });
      setSelected(null);
      fetch_();
    } catch (err) {
      console.error(err);
    }
  };

  const inputCls = "border border-[#e8d9cc] rounded-full px-4 py-2 text-sm " +
                   "focus:outline-none focus:border-[#d4b86a] bg-white";

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search name or email..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            className={`${inputCls} w-52`}
          />
          {[
            { key: "status",   opts: ["pending","confirmed","declined"],   label: "All Status"     },
            { key: "category", opts: ["Bridal","Glam Sessions","Classes"], label: "All Categories" },
          ].map(({ key, opts, label }) => (
            <select key={key} value={filter[key]}
              onChange={e => setFilter({ ...filter, [key]: e.target.value })}
              className={inputCls}>
              <option value="">{label}</option>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <a  href={`${API}/api/bookings/export?token=${localStorage.getItem("viola_token")}`}
          target="_blank" rel="noreferrer"
          className="px-5 py-2 rounded-full bg-black text-white text-sm
            hover:bg-gray-800 transition">Export CSV</a>
         
       
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
        {loading ? (
          <p className="text-center py-16 text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0e6dd]">
                  {["Client","Category","Package","Date","Status",""].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold
                      text-gray-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id}
                    className={`border-b border-[#f0e6dd] last:border-0
                      hover:bg-[#fdf6e3] transition
                      ${i % 2 ? "bg-[#fdf6e3]/30" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#1a1a1a]">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{b.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{b.category}</td>
                    <td className="px-5 py-3.5 text-gray-500 max-w-[160px] truncate">
                      {b.package}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                      {b.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={b.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(b)}
                        className="text-xs text-[#7c5546] hover:text-[#d4b86a]
                          font-medium transition">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!bookings.length && (
              <p className="text-center py-12 text-sm text-gray-400">
                No bookings found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50
          flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md
            max-h-[90vh] overflow-y-auto border border-[#e8d9cc]">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] text-lg">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {selected.email} · {selected.phone}
                  </p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-gray-300 hover:text-gray-500 text-xl transition">
                  ×
                </button>
              </div>

              <Badge status={selected.status} />

              <div className="space-y-2.5 text-sm">
                {[
                  ["Category",  selected.category],
                  ["Package",   selected.package],
                  ["Date",      selected.date],
                  ["Location",  selected.location],
                  ["People",    selected.numberOfPeople],
                  ["Notes",     selected.notes],
                  ["Submitted", new Date(selected.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4
                    border-b border-[#f0e6dd] pb-2.5 last:border-0">
                    <span className="text-gray-400 flex-shrink-0">{k}</span>
                    <span className="text-[#1a1a1a] text-right font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(selected._id, "confirmed")}
                    className="flex-1 py-2.5 rounded-full bg-black text-white
                      text-sm font-medium hover:bg-gray-800 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(selected._id, "declined")}
                    className="flex-1 py-2.5 rounded-full border border-red-200
                      text-red-500 text-sm hover:bg-red-50 transition"
                  >
                    Decline
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <a href={`mailto:${selected.email}`}
                  className="flex-1 py-2.5 rounded-full border border-[#e8d9cc]
                    text-gray-600 text-sm text-center hover:border-[#d4b86a]
                    hover:text-[#7c5546] transition">
                  Email
                </a>
                <a href={`tel:${selected.phone}`}
                  className="flex-1 py-2.5 rounded-full border border-[#e8d9cc]
                    text-gray-600 text-sm text-center hover:border-[#d4b86a]
                    hover:text-[#7c5546] transition">
                  Call
                </a>
              </div>

              <button onClick={() => remove(selected._id)}
                className="w-full py-2.5 rounded-full border border-red-100
                  text-red-400 text-sm hover:bg-red-50 transition">
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}