const StatPill = ({ label, value, color = "#d4b86a" }) => (
  <div
    className="flex justify-between items-center py-2.5
    border-b border-[#f0e6dd] last:border-0"
  >
    <span className="text-xs text-gray-500">{label}</span>
    <span
      className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
      style={{ background: color }}
    >
      {value}
    </span>
  </div>
);

export default StatPill;
