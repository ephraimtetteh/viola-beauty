import React from 'react'

const UpcomingCard = ({ booking, onSendReminder, sending }) => {
  const days  = booking.daysUntil;
  const label = days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `${days}d`;

  const urgencyColor =
    days === 0 ? "#ef4444" :
    days <= 3  ? "#f59e0b" : "#10b981";

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
          <p className="text-[10px] text-[#d4b86a] mt-0.5">📅 {booking.date}</p>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full
            text-white flex-shrink-0"
          style={{ background: urgencyColor }}
        >
          {label}
        </span>
      </div>

      <div className="flex gap-2">
        <a  href={`tel:${booking.phone}`}
          className="flex-1 text-center text-[10px] py-1.5 rounded-full
            border border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] transition">
         
          📞 Call
        </a>
        <a   href={`mailto:${booking.email}`}
          className="flex-1 text-center text-[10px] py-1.5 rounded-full
            border border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] transition">✉️ Email</a>
         
          
        <button
          onClick={() => onSendReminder(booking._id)}
          disabled={sending === booking._id}
          className="flex-1 text-[10px] py-1.5 rounded-full bg-[#1a1a1a]
            text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {sending === booking._id ? "..." : "🔔 Remind"}
        </button>
      </div>
    </div>
  );
};


export default UpcomingCard