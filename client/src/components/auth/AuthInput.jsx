const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
}) => (
  <div>
    <label className="text-xs font-semibold text-[#7c5546] uppercase tracking-wider mb-1.5 block">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-full px-5 py-3 text-sm
        focus:outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed
        ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-[#e8d9cc] focus:border-[#d4b86a]"
        }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 pl-3">{error}</p>}
  </div>
);

export default AuthInput;
