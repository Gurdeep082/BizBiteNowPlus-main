import React from "react";

const variants = {
  success: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  primary: "bg-[#1A4D2E]/10 text-[#1A4D2E] border-[#1A4D2E]/20",
  secondary: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusMap = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
  delivered: "success",
  processing: "info",
  shipped: "primary",
  cancelled: "danger",
  rejected: "danger",
  completed: "success",
  draft: "secondary",
  featured: "primary",
  bestseller: "warning",
  "out of stock": "danger",
  "low stock": "warning",
  "in stock": "success",
};

const Badge = ({
  children,
  status,
  variant,
  rounded = "full",
  size = "md",
  className = "",
}) => {
  const badgeVariant =
    variant ||
    (status ? statusMap[status.toLowerCase()] : "secondary") ||
    "secondary";

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        font-medium
        border
        whitespace-nowrap
        rounded-${rounded}
        ${variants[badgeVariant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children || status}
    </span>
  );
};

export default Badge;