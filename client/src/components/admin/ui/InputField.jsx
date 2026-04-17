import { useState } from "react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div>
      {label && (
        <label
          className="text-xs font-semibold text-[#7c5546] uppercase
          tracking-wider mb-1.5 block"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border border-[#e8d9cc] rounded-full px-5 py-3 text-sm
            focus:outline-none focus:border-[#d4b86a] bg-white pr-12
            disabled:bg-gray-50 disabled:cursor-not-allowed transition"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600 text-xs transition select-none"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
