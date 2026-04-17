const SidebarCard = ({ title, children }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl p-4">
    {title && (
      <p
        className="text-xs font-semibold text-gray-400 uppercase
        tracking-wider mb-3"
      >
        {title}
      </p>
    )}
    {children}
  </div>
);

export default SidebarCard;
