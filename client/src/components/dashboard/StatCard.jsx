const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
    <div className="p-5 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
        {sub && <p className="text-xs text-[#d4b86a] mt-0.5">{sub}</p>}
      </div>
    </div>
  </div>
);

export default StatCard;
