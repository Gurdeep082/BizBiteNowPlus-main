import React from "react";

const Skeleton = ({
  className = "",
  variant = "rect",
  animate = true,
}) => {
  const variants = {
    rect: "rounded-lg",
    rounded: "rounded-xl",
    circle: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div
      aria-hidden="true"
      className={`
        bg-gray-200
        ${variants[variant]}
        ${animate ? "animate-pulse" : ""}
        ${className}
      `}
    />
  );
};

export default Skeleton;