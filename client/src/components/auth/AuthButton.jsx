const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  secondary:
    "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a] hover:text-[#7c5546]",
  gold: "bg-[#d4b86a] text-white hover:bg-[#c4a55a]",
};

const AuthButton = ({
  onClick,
  loading,
  children,
  variant = "primary",
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading}
    className={`w-full py-3 rounded-full text-sm font-medium transition
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]}`}
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        Please wait...
      </span>
    ) : (
      children
    )}
  </button>
);

export default AuthButton;
