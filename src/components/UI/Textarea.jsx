import React from "react";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Enter text...",
  rows = 5,
  error,
  disabled = false,
  required = false,
  maxLength,
  showCount = false,
  className = "",
}) => {
  const count = value?.length || 0;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {showCount && maxLength && (
            <span className="text-xs text-gray-500">
              {count}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          resize-none
          outline-none
          transition-all
          duration-200
          text-gray-800
          placeholder:text-gray-400

          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-green-100"
          }

          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:border-[#1A4D2E]"
          }
        `}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;