const StatCard = ({ label, value }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl p-5">
    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-4xl font-semibold text-[#1a1a1a] mt-1">{value}</p>
  </div>
);

export default StatCard;
