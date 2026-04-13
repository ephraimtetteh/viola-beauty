const SidebarCard = ({ title, children }) => (
  <div className="bg-white border border-[#e8d9cc] rounded-2xl overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-[#d4b86a] to-[#7c5546]" />
    <div className="p-4">
      {title && (
        <p
          className="text-xs font-semibold text-[#d4b86a] uppercase
          tracking-wider mb-3"
        >
          {title}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default SidebarCard;
