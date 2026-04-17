const ActionButton = ({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
  className = "",
}) => {
  const base =
    "rounded-full text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 px-6 py-2.5",
    secondary:
      "border border-[#e8d9cc] text-gray-600 hover:border-[#d4b86a] hover:text-[#7c5546] px-5 py-2",
    ghost: "text-[#7c5546] hover:text-[#d4b86a] px-3 py-1.5 text-xs",
    danger: "border border-red-200 text-red-400 hover:bg-red-50 px-5 py-2",
    gold: "border border-[#d4b86a] text-[#7c5546] hover:bg-[#fdf6e3] px-5 py-2",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span
            className="w-3.5 h-3.5 border-2 border-current/30
            border-t-current rounded-full animate-spin"
          />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default ActionButton;
