import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

const BottomSheet = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  height = "auto",
  closeOnBackdrop = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() =>
            closeOnBackdrop && onClose?.()
          }
          className="
            fixed
            inset-0
            z-[999]

            bg-black/50

            backdrop-blur-sm
          "
        >

          <motion.div
            drag="y"
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                onClose?.();
              }
            }}
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 260,
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className={`
              absolute
              bottom-0
              left-0
              right-0

              mx-auto

              flex
              flex-col

              rounded-t-[34px]

              bg-white

              shadow-2xl

              ${
                height === "full"
                  ? "h-[92vh]"
                  : height === "lg"
                  ? "h-[75vh]"
                  : height === "md"
                  ? "h-[60vh]"
                  : "max-h-[80vh]"
              }
            `}
          >

            {/* Drag Handle */}

            <div className="flex justify-center py-3">

              <div
                className="
                  h-1.5
                  w-14

                  rounded-full

                  bg-slate-300
                "
              />

            </div>

            {/* Header */}

            {(title || showCloseButton) && (

              <div
                className="
                  flex
                  items-start
                  justify-between

                  border-b
                  border-slate-200

                  px-6
                  pb-5
                "
              >

                <div>

                  {title && (
                    <h2 className="text-2xl font-bold text-slate-900">
                      {title}
                    </h2>
                  )}

                  {subtitle && (
                    <p className="mt-2 text-slate-500">
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

                      hover:bg-slate-100
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
                  border-slate-200

                  p-5
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

export default BottomSheet;