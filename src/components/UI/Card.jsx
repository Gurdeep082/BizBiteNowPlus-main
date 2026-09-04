import React from "react";

const Card = ({
  title,
  subtitle,
  action,
  footer,
  children,
  className = "",
  padding = "p-6",
  hover = false,
  bordered = true,
  shadow = "shadow-sm",
  onClick,
}) => {
  const clickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-2xl
        ${padding}
        ${shadow}
        ${bordered ? "border border-gray-200" : ""}
        ${
          hover
            ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            : ""
        }
        ${clickable ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-[#1A4D2E]">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className="ml-4">
              {action}
            </div>
          )}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;