import React from "react";

export default function Typography({
    variant = "p",
    children,
    className = "",
    weight,
    color,
    align = "text-left",
}) {
    const baseStyles = "m-0 font-sans tracking-normal";

    const variants = {
        h1: "text-4xl md:text-5xl font-extrabold text-slate-900",
        h2: "text-3xl md:text-4xl font-bold text-slate-900",
        h3: "text-2xl md:text-3xl font-semibold text-[#1A4D2E]",
        h4: "text-xl md:text-2xl font-semibold text-slate-800",
        h5: "text-lg md:text-xl font-medium text-slate-800",
        h6: "text-base md:text-lg font-medium text-slate-800",
        p: "text-sm md:text-base text-slate-600 leading-relaxed",
        small: "text-xs md:text-sm text-slate-500",
        span: "text-inherit inline-block",
    };

    const Component = variant.includes("h") ? variant : variant === "small" ? "small" : variant === "span" ? "span" : "p";

    return (
        <Component
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${align}
        ${weight ? `font-${weight}` : ""}
        ${color ? color : ""}
        ${className}
      `}
        >
            {children}
        </Component>
    );
}