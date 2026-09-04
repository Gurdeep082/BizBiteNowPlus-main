import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const SecondaryButton = ({
  children,
  icon: Icon,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  size = "default",
  className = "",
}) => {
  const sizes = {
    sm: "h-10 px-4 text-sm rounded-xl",

    default: "h-12 px-6 text-base rounded-2xl",

    lg: "h-14 px-8 text-lg rounded-2xl",
  };

  return (
    <motion.button
      whileHover={
        !disabled && !loading
          ? {
            scale: 1.02,
          }
          : {}
      }
      whileTap={
        !disabled && !loading
          ? {
            scale: 0.97,
          }
          : {}
      }
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-3

        border-2

        bg-transparent
        dark:bg-[#232627]!

        font-semibold

        transition-all
        duration-200

        ${fullWidth
          ? "w-full"
          : ""
        }

        ${disabled || loading
          ? "cursor-not-allowed opacity-60"
          : ""
        }

        ${sizes[size]}
        ${className}
      `}
      style={{
        borderColor: "var(--primary-color)",
        color: "var(--primary-color)",
        background: "var(--accent-color)",
      }}
    >
      {loading ? (
        <>
          <Loader2
            size={18}
            className="animate-spin"
            style={{
              color: "var(--primary-color)",
            }}
          />

          Loading...
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              size={18}
              style={{
                color: "var(--primary-color)",
              }}
            />
          )}

          {children}
        </>
      )}
    </motion.button>
  );
};

export default SecondaryButton;