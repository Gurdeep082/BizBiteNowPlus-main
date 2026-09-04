import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Crown,
} from "lucide-react";

const variants = {
  success: {
    bg: "var(--accent-color)",
    text: "var(--primary-color)",
    icon: CheckCircle2,
  },

  warning: {
    bg: "var(--secondary-color)",
    text: "var(--primary-color)",
    icon: AlertTriangle,
  },

  danger: {
    bg: "var(--secondary-color)",
    text: "var(--primary-color)",
    icon: XCircle,
  },

  info: {
    bg: "var(--secondary-color)",
    text: "var(--primary-color)",
    icon: Info,
  },

  premium: {
    bg: "var(--primary-color)",
    text: "var(--accent-color)",
    icon: Crown,
  },
};

const sizes = {
  sm: {
    wrapper: "px-2.5 py-1 text-xs gap-1",
    icon: 12,
  },

  md: {
    wrapper: "px-3 py-1.5 text-sm gap-2",
    icon: 14,
  },

  lg: {
    wrapper: "px-4 py-2 text-base gap-2",
    icon: 16,
  },
};

const Badge = ({
  children,
  variant = "info",
  size = "md",
  rounded = "full",
  icon = true,
  className = "",
}) => {
  const current =
    variants[variant] || variants.info;

  const Icon = current.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center

        font-semibold

        whitespace-nowrap

        ${rounded === "full"
          ? "rounded-full"
          : "rounded-xl"
        }

        ${sizes[size].wrapper}

        ${className}
      `}
      style={{
        background: current.bg,
        color: current.text,
      }}
    >
      {icon && (
        <Icon
          size={sizes[size].icon}
        />
      )}

      {children}
    </span>
  );
};

export default Badge;