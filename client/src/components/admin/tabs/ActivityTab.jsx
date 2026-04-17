import { useState, useEffect } from "react";
import StatCard from "../ui/StatsCard";
import Card from "../ui/Card";

const API = import.meta.env.VITE_API_URL;

const useApi = () => {
  const token = localStorage.getItem("viola_token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

const TYPE_LABEL = {
  booking: "Booking",
  rate_update: "Rate update",
  email_sent: "Email sent",
  auth: "Auth",
  reminder: "Reminder",
  user: "User",
  class_registration: "Class registration",
  class: "Class",
  settings: "Settings",
  admin: "Admin",
};

export default function ActivityTab() {
  const { headers } = useApi();
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/activity`, { headers }).then((r) => r.json()),
      fetch(`${API}/api/activity/stats`, { headers }).then((r) => r.json()),
    ])
      .then(([a, s]) => {
        setActivity(Array.isArray(a) ? a : []);
        setStats(s);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Confirmed" value={stats.confirmed} />
          <StatCard label="Declined" value={stats.declined} />
        </div>
      )}

      {stats?.byCategory?.length > 0 && (
        <Card>
          <p
            className="text-xs font-semibold text-gray-400 uppercase
            tracking-wider mb-4"
          >
            Bookings by Category
          </p>
          <div className="space-y-3">
            {stats.byCategory.map(({ _id, count }) => (
              <div key={_id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{_id}</span>
                  <span className="font-semibold text-[#1a1a1a]">{count}</span>
                </div>
                <div className="h-1.5 bg-[#f0e6dd] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4b86a] rounded-full transition-all duration-500"
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p
          className="text-xs font-semibold text-gray-400 uppercase
          tracking-wider mb-4"
        >
          Activity Feed
        </p>
        <div className="space-y-0">
          {activity.map((a) => (
            <div
              key={a._id}
              className="flex items-start gap-4 py-3 border-b
                border-[#f0e6dd] last:border-0"
            >
              <span
                className="text-xs text-[#d4b86a] font-medium mt-0.5
                flex-shrink-0 w-28"
              >
                {TYPE_LABEL[a.type] || a.type}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-[#1a1a1a] leading-relaxed">
                  {a.message}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(a.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {!activity.length && (
            <p className="text-sm text-gray-400 text-center py-8">
              No activity yet
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
