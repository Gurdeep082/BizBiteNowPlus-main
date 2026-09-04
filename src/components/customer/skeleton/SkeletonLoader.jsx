import React from "react";

const SkeletonLoader = ({
  className = "",
  rounded = "rounded-xl",
}) => {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-slate-200
        ${rounded}
        ${className}
      `}
    >
      <div
        className="
          absolute
          inset-0
          -translate-x-full
          animate-[shimmer_1.6s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/70
          to-transparent
        "
      />
    </div>
  );
};

export default SkeletonLoader;