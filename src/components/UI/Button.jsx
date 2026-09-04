const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const variants = {
    primary:
      "bg-[#1A4D2E] hover:bg-[#245C39] text-white",

    secondary:
      "bg-[#F4A300] hover:bg-[#DA9200] text-black",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    outline:
      "border border-[#1A4D2E] text-[#1A4D2E] hover:bg-[#1A4D2E]/10 hover:text-[#1A4D2E]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        h-11
        px-5
        rounded-xl
        text-[15px]
        font-medium
        transition-all duration-300 ease-in-out
        active:scale-[0.98]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#F4A300]/40
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;