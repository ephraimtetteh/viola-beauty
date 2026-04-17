import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import StatsTab from "./StatsTab";
import UpcomingTab from "./sidebar/UpcomingCard";
import ActivityTab from "./sidebar/ActivityTab";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "stats", label: "Stats" },
  { id: "upcoming", label: "Upcoming" },
  { id: "activity", label: "Activity" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [tab, setTab] = useState("stats");
  const [analytics, setAnalytics] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, uRes] = await Promise.all([
        fetch(`${API}/api/analytics`, { headers }),
        fetch(`${API}/api/reminders/upcoming`, { headers }),
      ]);
      if (aRes.ok) setAnalytics(await aRes.json());
      if (uRes.ok) setUpcoming(await uRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45] lg:hidden"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#fff8f5]
        border-l border-[#e8d9cc] z-[46] flex flex-col shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div
          className="bg-[#1a1a1a] px-5 py-4 flex items-center
          justify-between flex-shrink-0"
        >
          <div>
            <p className="text-[#d4b86a] text-[10px] tracking-[3px] uppercase">
              Viola Beauty
            </p>
            <h2 className="text-white font-semibold text-sm">
              Analytics & Reminders
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              title="Refresh"
              className="text-gray-400 hover:text-white text-sm transition p-1"
            >
              ↻
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg transition"
            >
              ✕
            </button>
          </div>
        </div>
        <div
          className="h-0.5 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]
          flex-shrink-0"
        />

        {/* Tabs */}
        <div className="flex border-b border-[#e8d9cc] flex-shrink-0 bg-white">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-[10px] font-medium transition ${
                tab === t.id
                  ? "text-[#7c5546] border-b-2 border-[#d4b86a] bg-[#fdf6e3]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              {/* <div
                className="w-6 h-6 border-2 border-[#d4b86a]/30
                border-t-[#d4b86a] rounded-full animate-spin"
              /> */}
              <p className="text-xs text-gray-400">Loading analytics...</p>
            </div>
          ) : (
            <>
              {tab === "stats" && <StatsTab analytics={analytics} />}
              {tab === "upcoming" && (
                <UpcomingTab
                  analytics={analytics}
                  upcoming={upcoming}
                  token={token}
                  onRefresh={load}
                />
              )}
              {tab === "activity" && (
                <ActivityTab activity={analytics?.recentActivity} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
