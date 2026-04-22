import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileForm from "../components/dashboard/ProfileForm";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "bookings", label: "Bookings" },
  { id: "courses", label: "Courses" },
  { id: "profile", label: "Profile" },
];

// ── Status badge ──
const Badge = ({ status }) => {
  const styles = {
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    confirmed: "text-green-700 bg-green-50 border-green-200",
    declined: "text-red-600   bg-red-50   border-red-200",
  };
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full border font-medium
      ${styles[status] || "text-gray-500 bg-gray-50 border-gray-200"}`}
    >
      {status}
    </span>
  );
};

// ── Stat card ──
const StatCard = ({ label, value }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5">
    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-semibold text-[#1a1a1a] mt-1">{value}</p>
  </div>
);

// ── Booking card ──
const BookingCard = ({ booking: b }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5 space-y-3">
    <div className="flex justify-between items-start gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-[#1a1a1a] truncate">{b.package}</p>
        <p className="text-xs text-gray-400 mt-0.5">{b.category}</p>
      </div>
      <Badge status={b.status} />
    </div>
    <div className="space-y-1.5 text-sm">
      {[
        ["Date", b.date],
        ["Location", b.location],
      ].map(
        ([k, v]) =>
          v && (
            <div key={k} className="flex justify-between">
              <span className="text-gray-400">{k}</span>
              <span className="text-[#1a1a1a] font-medium">{v}</span>
            </div>
          ),
      )}
    </div>
    <p className="text-xs text-gray-300">
      Submitted{" "}
      {new Date(b.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  </div>
);

// ── Course purchase card ──
const CourseCard = ({ purchase: p }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5 space-y-3">
    <div className="flex justify-between items-start gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-[#1a1a1a] truncate">{p.courseName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{p.courseLevel}</p>
      </div>
      <span
        className="text-xs px-3 py-1 rounded-full border font-medium
        text-green-700 bg-green-50 border-green-200 flex-shrink-0"
      >
        Purchased
      </span>
    </div>
    <div className="space-y-1.5 text-sm">
      {[
        ["Reference", p.reference],
        [
          "Purchased",
          new Date(p.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        ],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between">
          <span className="text-gray-400">{k}</span>
          <span className="text-[#1a1a1a] font-medium text-right max-w-[60%] truncate">
            {v}
          </span>
        </div>
      ))}
    </div>
    <a
      href="https://violabeauty.thinkific.com"
      target="_blank"
      rel="noreferrer"
      className="block text-center text-xs py-2 rounded-full border
        border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] transition"
    >
      Access Course
    </a>
  </div>
);

export default function UserDashboard() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch(`${API}/api/users/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),

      fetch(`${API}/api/users/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([b, c]) => {
        setBookings(Array.isArray(b) ? b : []);
        setCourses(Array.isArray(c) ? c : []);
      })
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
            <p
              className="text-xs tracking-[4px] uppercase text-[#d4b86a]
              font-medium mb-1"
            >
              My Account
            </p>
            <h1 className="text-3xl font-semibold text-[#1a1a1a]">
              {user.firstName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Back to site */}
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-[#7c5546]
                border border-[#e8d9cc] hover:border-[#d4b86a]
                px-4 py-2 rounded-full transition"
            >
              Back to Site
            </Link>

            {/* Sign out */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-xs text-gray-400 hover:text-gray-600
                border border-[#e8d9cc] hover:border-gray-300
                px-4 py-2 rounded-full transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-1 bg-white border border-[#e8d9cc]
          rounded-full p-1 w-fit mb-8"
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
              <StatCard label="Total Bookings" value={bookings.length} />
              <StatCard label="Pending" value={pending} />
              <StatCard label="Confirmed" value={confirmed} />
              <StatCard label="Courses" value={courses.length} />
            </div>

            {/* Recent bookings */}
            {!fetching && bookings.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p
                    className="text-xs font-semibold text-gray-400 uppercase
                    tracking-wider"
                  >
                    Recent Bookings
                  </p>
                  {bookings.length > 4 && (
                    <button
                      onClick={() => setTab("bookings")}
                      className="text-xs text-[#7c5546] hover:text-[#d4b86a] transition"
                    >
                      View all
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

            {/* Recent courses */}
            {!fetching && courses.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p
                    className="text-xs font-semibold text-gray-400 uppercase
                    tracking-wider"
                  >
                    My Courses
                  </p>
                  {courses.length > 2 && (
                    <button
                      onClick={() => setTab("courses")}
                      className="text-xs text-[#7c5546] hover:text-[#d4b86a] transition"
                    >
                      View all
                    </button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.slice(0, 2).map((c, i) => (
                    <CourseCard key={i} purchase={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!fetching && bookings.length === 0 && courses.length === 0 && (
              <div
                className="bg-white border border-[#e8d9cc] rounded-2xl
                p-12 text-center space-y-4"
              >
                <p className="text-gray-400 text-sm">
                  Nothing here yet. Start by booking a service or exploring a
                  course.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link
                    to="/book-us"
                    className="px-6 py-2.5 rounded-full bg-black text-white
                      text-sm hover:bg-gray-800 transition"
                  >
                    Book a Service
                  </Link>
                  <Link
                    to="/courses"
                    className="px-6 py-2.5 rounded-full border border-[#e8d9cc]
                      text-gray-600 text-sm hover:border-[#d4b86a] transition"
                  >
                    Explore Courses
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
                Loading...
              </p>
            ) : bookings.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            ) : (
              <div
                className="bg-white border border-[#e8d9cc] rounded-2xl
                p-12 text-center space-y-4"
              >
                <p className="text-gray-400 text-sm">No bookings yet.</p>
                <Link
                  to="/book-us"
                  className="inline-block px-6 py-2.5 rounded-full bg-black
                    text-white text-sm hover:bg-gray-800 transition"
                >
                  Book a Service
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Courses ── */}
        {tab === "courses" && (
          <div>
            {fetching ? (
              <p className="text-center text-gray-400 py-12 text-sm">
                Loading...
              </p>
            ) : courses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((c, i) => (
                  <CourseCard key={i} purchase={c} />
                ))}
              </div>
            ) : (
              <div
                className="bg-white border border-[#e8d9cc] rounded-2xl
                p-12 text-center space-y-4"
              >
                <p className="text-gray-400 text-sm">
                  No course purchases yet.
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-2.5 rounded-full bg-black
                    text-white text-sm hover:bg-gray-800 transition"
                >
                  Explore Courses
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
