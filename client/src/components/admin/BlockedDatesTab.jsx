import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const GoldBar = () => (
  <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
);

const Card = ({ children, title }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
    {/* <GoldBar /> */}
    <div className="p-5">
      {title && (
        <p
          className="text-xs font-semibold text-[#d4b86a] uppercase
          tracking-wider mb-4"
        >
          {title}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default function BlockedDatesTab() {
  const { token } = useAuth();
  const [blockedDates, setBlockedDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const today = new Date().toISOString().split("T")[0];

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/blocked-dates/admin`, { headers });
      setBlockedDates(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const blockDate = async () => {
    if (!newDate) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/blocked-dates`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          date: newDate,
          reason: newReason || "Unavailable",
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setMsg(`${d.error}`);
      } else {
        setNewDate("");
        setNewReason("");
        setMsg("Date blocked");
        load();
      }
    } catch (err) {
      setMsg("Failed");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const unblock = async (date) => {
    if (!confirm(`Unblock ${date}?`)) return;
    try {
      await fetch(`${API}/api/blocked-dates/${date}`, {
        method: "DELETE",
        headers,
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const manual = blockedDates.filter((d) => !d.autoBlocked);
  const auto = blockedDates.filter((d) => d.autoBlocked);

  const inputCls =
    "w-full border border-[#e8d9cc] rounded-full px-4 py-2.5 text-sm " +
    "focus:outline-none focus:border-[#d4b86a] bg-white";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Block a new date */}
      <Card title="Block a Date">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                className="text-xs font-semibold text-[#7c5546] uppercase
                tracking-wider mb-1.5 block"
              >
                Date *
              </label>
              <input
                type="date"
                value={newDate}
                min={today}
                onChange={(e) => setNewDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label
                className="text-xs font-semibold text-[#7c5546] uppercase
                tracking-wider mb-1.5 block"
              >
                Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Holiday, Personal, Fully booked"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {msg && (
            <p
              className={`text-sm font-medium ${
                msg.startsWith("") ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>
          )}

          <button
            onClick={blockDate}
            disabled={saving || !newDate}
            className="px-6 py-2.5 rounded-full bg-[#1a1a1a] text-white text-sm
              font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {saving ? "Blocking..." : "Block This Date"}
          </button>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <>
          {/* Auto-blocked dates */}
          {auto.length > 0 && (
            <Card title={`Auto-Blocked by Bookings (${auto.length})`}>
              <p className="text-xs text-gray-400 mb-3">
                These dates were automatically blocked when a booking was made.
                Delete the booking to unblock.
              </p>
              <div className="space-y-2">
                {auto.map((d) => (
                  <div
                    key={d.date}
                    className="flex items-center justify-between py-2.5 px-3
                      bg-[#fdf6e3] rounded-xl border border-[#e8d9cc]"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        {new Date(d.date + "T12:00:00").toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{d.reason}</p>
                    </div>
                    <span
                      className="text-[10px] bg-amber-100 text-amber-700
                      border border-amber-200 px-2 py-0.5 rounded-full font-medium"
                    >
                      Auto
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Manually blocked dates */}
          <Card title={`Manually Blocked (${manual.length})`}>
            {manual.length > 0 ? (
              <div className="space-y-2">
                {manual.map((d) => (
                  <div
                    key={d.date}
                    className="flex items-center justify-between py-2.5 px-3
                      bg-white rounded-xl border border-[#e8d9cc]
                      hover:border-[#d4b86a] transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        {new Date(d.date + "T12:00:00").toLocaleDateString(
                          "en-GB",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{d.reason}</p>
                    </div>
                    <button
                      onClick={() => unblock(d.date)}
                      className="text-xs text-red-500 hover:text-red-700
                        border border-red-200 hover:border-red-400 px-3 py-1
                        rounded-full transition"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No manually blocked dates
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
