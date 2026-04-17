import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/admin/Sidebar";
import BookingsTab from "../../components/admin/tabs/BookingsTab";
import ActivityTab from "../../components/admin/tabs/ActivityTab";
import SettingsTab from "../../components/admin/tabs/SettingsTab";
import BlockedDatesTab from "../../components/admin/BlockedDatesTab";
import RatesTab from "../../components/admin/RatesTab";
import FontsTab from "../../components/admin/FontsTab";
import ClassesTab from "../../components/admin/tabs/ClassesTab";

const TABS = [
  { id: "bookings", label: "Bookings" },
  { id: "classes", label: "Classes" },
  { id: "blocked-dates", label: "Blocked Dates" },
  { id: "rates", label: "Rates" },
  { id: "fonts", label: "Fonts" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("bookings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { token, user, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user && !isAdmin) {
      navigate("/dashboard");
      return;
    }
  }, [token, user, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fff8f5]">
      {/* Top bar */}
      <div
        className="bg-white border-b border-[#e8d9cc] px-6 py-4
        flex items-center justify-between sticky top-0 z-40"
      >
        <div>
          <p
            className="text-xs tracking-[4px] uppercase text-[#d4b86a]
            font-medium"
          >
            Viola Beauty
          </p>
          <h1 className="text-lg font-semibold text-[#1a1a1a] leading-tight">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-xs text-gray-500 hover:text-[#7c5546]
              border border-[#e8d9cc] hover:border-[#d4b86a]
              px-4 py-2 rounded-full transition"
          >
            Analytics
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600
              border border-[#e8d9cc] hover:border-gray-300
              px-4 py-2 rounded-full transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab bar */}
        <div
          className="flex gap-1 mb-8 bg-white border border-[#e8d9cc]
          rounded-full p-1 w-fit overflow-x-auto"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium
                transition whitespace-nowrap ${
                  tab === t.id
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsTab />}
        {tab === "classes" && <ClassesTab />}
        {tab === "blocked-dates" && <BlockedDatesTab />}
        {tab === "rates" && <RatesTab />}
        {tab === "fonts" && <FontsTab />}
        {tab === "activity" && <ActivityTab />}
        {tab === "settings" && <SettingsTab />}
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
