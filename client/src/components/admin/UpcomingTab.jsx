import { useState } from "react";
import SidebarCard from "./SidebarCard";
import UpcomingCard from "./UpcomingCard";

const API = import.meta.env.VITE_API_URL;

const UpcomingTab = ({ analytics, upcoming, token, onRefresh }) => {
  const [sending, setSending] = useState(null);
  const [runningAll, setRunningAll] = useState(false);
  const [msg, setMsg] = useState("");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const sendReminder = async (id) => {
    setSending(id);
    setMsg("");
    try {
      await fetch(`${API}/api/reminders/booking/${id}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ days: 1 }),
      });
      setMsg("✅ Reminder email sent!");
    } catch {
      setMsg("❌ Failed to send reminder");
    } finally {
      setSending(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const runAll = async () => {
    setRunningAll(true);
    setMsg("");
    try {
      const res = await fetch(`${API}/api/reminders/run`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      setMsg(`✅ ${data.sent} reminder${data.sent !== 1 ? "s" : ""} sent`);
    } catch {
      setMsg("❌ Failed");
    } finally {
      setRunningAll(false);
      setTimeout(() => setMsg(""), 4000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Run all */}
      <div className="space-y-2">
        <button
          onClick={runAll}
          disabled={runningAll}
          className="w-full py-2.5 rounded-full bg-[#1a1a1a] text-white text-xs
            font-medium hover:bg-gray-800 transition disabled:opacity-50 flex
            items-center justify-center gap-2"
        >
          {runningAll ? (
            <>
              <span
                className="w-3 h-3 border-2 border-white/30 border-t-white
                rounded-full animate-spin"
              />
              Running...
            </>
          ) : (
            "🔔 Run All Reminders (7 / 3 / 1 day)"
          )}
        </button>
        <p className="text-[10px] text-gray-400 text-center">
          Auto-runs daily at 8am · Email only
        </p>
        {msg && (
          <p
            className={`text-xs text-center font-medium ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {msg}
          </p>
        )}
      </div>

      {/* This week */}
      {analytics?.upcomingThisWeek?.length > 0 && (
        <SidebarCard title="This Week">
          {analytics.upcomingThisWeek.map((b) => (
            <div
              key={b._id}
              className="flex justify-between items-center py-2
                border-b border-[#f0e6dd] last:border-0"
            >
              <div>
                <p className="text-xs font-semibold text-[#1a1a1a]">
                  {b.firstName} {b.lastName}
                </p>
                <p className="text-[10px] text-gray-400">{b.package}</p>
              </div>
              <span className="text-[10px] text-[#d4b86a] font-medium">
                {b.date}
              </span>
            </div>
          ))}
        </SidebarCard>
      )}

      {/* All upcoming with reminder buttons */}
      {/* All upcoming with reminder buttons */}
      {upcoming.filter((b) => b && b.daysUntil !== undefined).length > 0 ? (
        <div>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
      tracking-wider mb-2 mt-4"
          >
            All Upcoming
          </p>
          <div className="space-y-2">
            {upcoming
              .filter((b) => b && b.daysUntil !== undefined)
              .map((b) => (
                <UpcomingCard
                  key={b._id}
                  booking={b}
                  onSendReminder={sendReminder}
                  sending={sending}
                />
              ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-6">
          No upcoming confirmed bookings
        </p>
      )}
    </div>
  );
};

export default UpcomingTab;
