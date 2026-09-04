import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";
import { useEffect } from "react";

const variants = {
  success: {
    icon: CheckCircle2,
    color: "#16A34A",
    bg: "#DCFCE7",
  },

  error: {
    icon: XCircle,
    color: "#DC2626",
    bg: "#FEE2E2",
  },

  warning: {
    icon: AlertTriangle,
    color: "#D97706",
    bg: "#FEF3C7",
  },

  info: {
    icon: Info,
    color: "#2563EB",
    bg: "#DBEAFE",
  },

  primary: {
    icon: CheckCircle2,
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
};

const Toast = ({
  open,
  type = "success",
  title,
  message,
  duration = 4000,
  onClose,
  position = "top-right",
}) => {
  const current =
    variants[type] || variants.success;

  const Icon = current.icon;

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  const positions = {
    "top-right":
      "top-5 right-5",

    "top-left":
      "top-5 left-5",

    "bottom-right":
      "bottom-5 right-5",

    "bottom-left":
      "bottom-5 left-5",

    "top-center":
      "top-5 left-1/2 -translate-x-1/2",

    "bottom-center":
      "bottom-5 left-1/2 -translate-x-1/2",
  };

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.95,
          }}
          transition={{
            duration: 0.25,
          }}
          className={`
            fixed

            z-[9999]

            w-[92vw]
            max-w-md

            ${positions[position]}
          `}
        >

          <div
            className="
              overflow-hidden

              rounded-2xl

              border
              border-slate-200

              bg-white

              shadow-2xl
            "
          >

            {/* Content */}

            <div className="flex items-start gap-4 p-5">

              <div
                className="
                  flex
                  h-12
                  w-12

                  shrink-0

                  items-center
                  justify-center

                  rounded-xl
                "
                style={{
                  background: current.bg,
                }}
              >
                <Icon
                  size={22}
                  style={{
                    color: current.color,
                  }}
                />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-900">
                  {title}
                </h3>

                {message && (
                  <p className="mt-1 text-sm text-slate-500">
                    {message}
                  </p>
                )}

              </div>

              <button
                onClick={onClose}
                className="
                  rounded-lg

                  p-1.5

                  transition

                  hover:bg-slate-100
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* Progress */}

            <motion.div
              initial={{
                width: "100%",
              }}
              animate={{
                width: "0%",
              }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
              className="h-1"
              style={{
                background: current.color,
              }}
            />

          </div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

export default Toast;