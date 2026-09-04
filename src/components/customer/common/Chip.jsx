import { X } from "lucide-react";

const variants = {
  filled: {
    bg: "var(--primary-color)",
    color: "var(--accent-color)",
    border: "transparent",
  },

  outlined: {
    bg: "transparent",
    color: "var(--primary-color)",
    border: "var(--primary-color)",
  },

  soft: {
    bg: "var(--primary-light)",
    color: "var(--primary-color)",
    border: "var(--primary-color)",
  },

  gray: {
    bg: "var(--secondary-light)",
    color: "var(--secondary-color)",
    border: "var(--secondary-color)",
  },
};

const sizes = {
  sm: {
    wrapper: "h-7 px-2.5 text-[11px] gap-1 lg:h-8 lg:px-3 lg:text-xs",
    close: 12,
    closeLg: 14,
  },

  md: {
    wrapper: "h-8 px-3 text-xs gap-1.5 lg:h-10 lg:px-4 lg:text-sm lg:gap-2",
    close: 14,
    closeLg: 16,
  },

  lg: {
    wrapper: "h-9 px-4 text-sm gap-1.5 lg:h-12 lg:px-5 lg:text-base lg:gap-2",
    close: 16,
    closeLg: 18,
  },
};

const Chip = ({
  label,
  selected = false,
  removable = false,
  disabled = false,
  variant = "soft",
  size = "md",
  onClick,
  onRemove,
  className = "",
}) => {
  const style = selected
    ? variants.filled
    : variants[variant] || variants.soft;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        font-medium
        whitespace-nowrap
        transition-all
        duration-200

        ${disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:scale-105 active:scale-95"
        }

        ${sizes[size].wrapper}

        ${className}
      `}
      style={{
        background: style.bg,
        color: style.color,
        borderColor: style.border,
      }}
    >
      <span>{label}</span>

      {removable && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="
            flex
            items-center
            justify-center
            rounded-full
            transition
          "
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--primary-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              "transparent";
          }}
        >
          <X size={sizes[size].close} className="lg:hidden" />
          <X size={sizes[size].closeLg} className="hidden lg:block" />
        </span>
      )}
    </button>
  );
};

export default Chip;