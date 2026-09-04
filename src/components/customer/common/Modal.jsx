import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw] h-[95vh]",
};

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={() =>
            closeOnBackdrop && onClose?.()
          }
          className="
            fixed
            inset-0

            z-[999]

            flex
            items-center
            justify-center

            bg-black/50

            p-4

            backdrop-blur-sm
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className={`
              flex
              w-full
              flex-col

              overflow-hidden

              rounded-[32px]

              bg-white dark:bg-[#181A1B]

              shadow-2xl

              ${sizes[size]}
            `}
          >

            {/* Header */}

            {(title || showCloseButton) && (

              <div
                className="
                  flex
                  items-start
                  justify-between

                  border-b
                  border-slate-200 dark:border-[#A9BDCF]/30

                  p-6
                "
              >

                <div>

                  {title && (

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {title}
                    </h2>

                  )}

                  {subtitle && (

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      {subtitle}
                    </p>

                  )}

                </div>

                {showCloseButton && (

                  <button
                    onClick={onClose}
                    className="
                      flex
                      h-11
                      w-11

                      items-center
                      justify-center

                      rounded-xl

                      transition

                      text-slate-700 dark:text-slate-300

                      hover:bg-slate-100 dark:hover:bg-white/10
                    "
                  >
                    <X size={22} />
                  </button>

                )}

              </div>

            )}

            {/* Body */}

            <div
              className="
                max-h-[70vh]

                flex-1

                overflow-y-auto

                p-6

                scrollbar-hide
              "
            >
              {children}
            </div>

            {/* Footer */}

            {footer && (

              <div
                className="
                  border-t
                  border-slate-200 dark:border-[#A9BDCF]/30

                  p-6
                "
              >
                {footer}
              </div>

            )}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

export default Modal;