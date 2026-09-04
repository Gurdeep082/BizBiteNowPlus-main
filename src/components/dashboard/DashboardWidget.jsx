import React, { memo } from "react";

function DashboardWidget({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
        
        transition-shadow
        duration-300
        hover:shadow-lg
        ${className}
      `}
    >
      <div className="flex items-start max-h-400 overflow-y-auto justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-[#1A4D2E]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

export default memo(DashboardWidget);