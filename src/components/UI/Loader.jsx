import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({
  size = "md",
  text,
  fullScreen = false,
  className = "",
}) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <Loader2
        className={`${sizes[size]} animate-spin text-[#1A4D2E]`}
      />

      {text && (
        <p className="text-sm font-medium text-gray-500">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;