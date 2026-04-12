import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import BookingCard from "../components/dashboard/BookingCard";
import ProfileForm from "../components/dashboard/ProfileForm";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "bookings", label: "Bookings" },
  { id: "profile", label: "Profile" },
];

export default function UserDashboard() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/users/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setBookings)
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [token]);

  if (authLoading || !user) return null;

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const declined = bookings.filter((b) => b.status === "declined").length;

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[4px] uppercase text-[#d4b86a] font-medium mb-1">
              My Account
            </p>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">
              Hey, {user.firstName}! 👋
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-xs text-gray-400 hover:text-gray-600 border border-[#e8d9cc]
              px-4 py-2 rounded-full transition hover:border-gray-300"
          >
            Sign Out
          </button>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 bg-white border border-[#e8d9cc] rounded-full p-1
          w-fit mb-8"
        >
          {TABS.map((t) => (
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

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="📋" label="Total" value={bookings.length} />
              <StatCard icon="⏳" label="Pending" value={pending} />
              <StatCard icon="✅" label="Confirmed" value={confirmed} />
              <StatCard icon="❌" label="Declined" value={declined} />
            </div>

            {!fetching && bookings.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-semibold text-[#d4b86a] uppercase tracking-wider">
                    Recent Bookings
                  </p>
                  {bookings.length > 4 && (
                    <button
                      onClick={() => setTab("bookings")}
                      className="text-xs text-[#7c5546] hover:text-[#d4b86a] transition"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {bookings.slice(0, 4).map((b) => (
                    <BookingCard key={b._id} booking={b} />
                  ))}
                </div>
              </div>
            )}

            {!fetching && bookings.length === 0 && (
              <div
                className="bg-white border border-[#e8d9cc] rounded-2xl p-12
                text-center space-y-4"
              >
                <p className="text-5xl">✨</p>
                <p className="text-gray-400 text-sm">No bookings yet</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    to="/book-us"
                    className="px-6 py-2.5 rounded-full bg-black text-white text-sm
                      hover:bg-gray-800 transition"
                  >
                    Book a Service →
                  </Link>
                  <Link
                    to="/courses"
                    className="px-6 py-2.5 rounded-full border border-[#e8d9cc]
                      text-gray-600 text-sm hover:border-[#d4b86a] transition"
                  >
                    Explore Courses →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === "bookings" && (
          <div>
            {fetching ? (
              <p className="text-center text-gray-400 py-12 text-sm">
                Loading bookings...
              </p>
            ) : bookings.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e8d9cc] rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-sm mb-4">No bookings found</p>
                <Link
                  to="/book-us"
                  className="px-6 py-2.5 rounded-full bg-black text-white text-sm
                    hover:bg-gray-800 transition"
                >
                  Book a Service →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Profile ── */}
        {tab === "profile" && <ProfileForm />}
      </div>
    </div>
  );
}
