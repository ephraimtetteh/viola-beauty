const STATUS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-50  text-green-700  border-green-200",
  declined: "bg-red-50    text-red-600    border-red-200",
};

const BookingCard = ({ booking }) => (
  <div
    className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden
                  hover:border-[#d4b86a] hover:shadow-sm transition-all duration-300"
  >
    <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
    <div className="p-5">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[#1a1a1a] text-sm truncate">
            {booking.package}
          </h3>
          <p className="text-xs text-[#d4b86a] mt-0.5">{booking.category}</p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full border font-medium
          flex-shrink-0 ${STATUS[booking.status]}`}
        >
          {booking.status}
        </span>
      </div>
      <div className="space-y-1 text-xs text-gray-500">
        <p>📅 {booking.date}</p>
        {booking.location !== "Not specified" && <p>📍 {booking.location}</p>}
        <p className="text-[10px] text-gray-300 pt-1">
          Submitted{" "}
          {new Date(booking.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  </div>
);

export default BookingCard;
