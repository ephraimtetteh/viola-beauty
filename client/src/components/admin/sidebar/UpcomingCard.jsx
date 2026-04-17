const urgencyLabel = (days) => {
  if (days === 0)
    return { text: "Today", cls: "text-red-600   bg-red-50   border-red-200" };
  if (days <= 3)
    return {
      text: `${days}d`,
      cls: "text-amber-600 bg-amber-50 border-amber-200",
    };
  return {
    text: `${days}d`,
    cls: "text-gray-500  bg-gray-50  border-gray-200",
  };
};

const UpcomingCard = ({ booking, onSendReminder, sending }) => {
  // ✅ Guard — if booking is undefined or missing daysUntil, render nothing
  if (!booking) return null;

  const days = booking.daysUntil ?? 0;
  const { text, cls } = urgencyLabel(days);

  return (
    <div className="bg-white border border-[#e8d9cc] rounded-xl p-3 space-y-2.5">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#1a1a1a] truncate">
            {booking.firstName} {booking.lastName}
          </p>
          <p className="text-[10px] text-gray-400 truncate mt-0.5">
            {booking.package}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{booking.date}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full
          border flex-shrink-0 ${cls}`}
        >
          {text}
        </span>
      </div>

      <div className="flex gap-2">
        <a
          href={`tel:${booking.phone}`}
          className="flex-1 text-center text-[10px] py-1.5 rounded-full
            border border-[#e8d9cc] text-gray-500 hover:border-[#d4b86a]
            hover:text-[#7c5546] transition"
        >
          Call
        </a>
        <a
          href={`mailto:${booking.email}`}
          className="flex-1 text-center text-[10px] py-1.5 rounded-full
            border border-[#e8d9cc] text-gray-500 hover:border-[#d4b86a]
            hover:text-[#7c5546] transition"
        >
          Email
        </a>
        <button
          onClick={() => onSendReminder(booking._id)}
          disabled={sending === booking._id}
          className="flex-1 text-[10px] py-1.5 rounded-full bg-[#1a1a1a]
            text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {sending === booking._id ? "..." : "Remind"}
        </button>
      </div>
    </div>
  );
};

export default UpcomingCard;
