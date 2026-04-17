const Badge = ({ status }) => {
  const styles = {
    pending: "text-amber-700  bg-amber-50  border-amber-200",
    confirmed: "text-green-700  bg-green-50  border-green-200",
    declined: "text-red-600    bg-red-50    border-red-200",
    registered: "text-amber-700  bg-amber-50  border-amber-200",
    cancelled: "text-red-600    bg-red-50    border-red-200",
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

export default Badge;
