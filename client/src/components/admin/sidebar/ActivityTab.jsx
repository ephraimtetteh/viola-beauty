const TYPE_LABEL = {
  booking: "Booking",
  rate_update: "Rate update",
  email_sent: "Email sent",
  auth: "Auth",
  reminder: "Reminder",
  user: "User",
  class_registration: "Class",
  settings: "Settings",
  admin: "Admin",
};

const ActivityTab = ({ activity }) => (
  <div className="space-y-0">
    {activity?.length > 0 ? (
      activity.map((a) => (
        <div
          key={a._id}
          className="flex items-start gap-3 py-3 border-b
            border-[#f0e6dd] last:border-0"
        >
          <span
            className="text-[10px] text-[#d4b86a] font-medium
            flex-shrink-0 mt-0.5 w-16"
          >
            {TYPE_LABEL[a.type] || a.type}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-[#1a1a1a] leading-relaxed">
              {a.message}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {new Date(a.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
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
