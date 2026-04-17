const StatPill = ({ label, value }) => (
  <div
    className="flex justify-between items-center py-2.5
    border-b border-[#f0e6dd] last:border-0"
  >
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xs font-semibold text-[#1a1a1a]">{value}</span>
  </div>
);

export default StatPill;
