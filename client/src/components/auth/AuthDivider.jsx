const AuthDivider = ({ text = "or" }) => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-[#f0e6dd]" />
    <span className="text-xs text-gray-400">{text}</span>
    <div className="flex-1 h-px bg-[#f0e6dd]" />
  </div>
);

export default AuthDivider;
