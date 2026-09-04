import React from "react";

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          className={`
            w-full
            rounded-xl
            border
            bg-white
            px-4
            py-3
            text-sm
            text-slate-900
            placeholder:text-slate-400
            outline-none
            transition-all
            duration-200

            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
            }

            ${leftIcon ? "pl-12" : ""}
            ${rightIcon ? "pr-12" : ""}

            ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}