const MiniBar = ({ label, count, total, color = "#d4b86a" }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-[#7c5546]">{count}</span>
    </div>
    <div className="h-1.5 bg-[#f0e6dd] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${total ? (count / total) * 100 : 0}%`,
          background: color,
        }}
      />
    </div>
  </div>
);

export default MiniBar;
