import SidebarCard from "./SidebarCard";

const ICONS = {
  booking: "📋",
  rate_update: "✏️",
  email_sent: "📧",
  auth: "🔐",
  reminder: "🔔",
  user: "👤",
};

const ActivityTab = ({ activity }) => (
  <div className="space-y-2">
    {activity?.length > 0 ? (
      activity.map((a) => (
        <div
          key={a._id}
          className="flex items-start gap-3 bg-white border border-[#e8d9cc]
            rounded-xl p-3"
        >
          <span className="text-sm flex-shrink-0 mt-0.5">
            {ICONS[a.type] || "•"}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-[#1a1a1a] leading-relaxed">
              {a.message}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
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
      ))
    ) : (
      <p className="text-xs text-gray-400 text-center py-8">No activity yet</p>
    )}
  </div>
);

export default ActivityTab;
