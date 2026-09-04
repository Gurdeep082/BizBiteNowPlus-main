import React from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  error,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          bg-white
          text-gray-800
          transition-all
          duration-200
          outline-none

          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-green-100"
          }

          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "hover:border-[#1A4D2E]"
          }
        `}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;