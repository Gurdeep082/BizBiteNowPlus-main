import React, { useEffect } from "react";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
    >
      <div
        className={`
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          ${sizeClasses[size]}
          animate-scaleIn
          overflow-hidden
        `}
        role="dialog"
        aria-modal="true"
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-semibold text-[#1A4D2E]">
              {title}
            </h2>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <div className="border-t bg-gray-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;