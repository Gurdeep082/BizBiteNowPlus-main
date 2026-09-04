import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Loader = ({
  variant = "spinner",
  size = "md",
  text = "",
  fullScreen = false,
  className = "",
}) => {
  const sizes = {
    sm: 18,
    md: 28,
    lg: 40,
    xl: 54,
  };

  const Spinner = () => (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    >
      <Loader2
        size={sizes[size]}
        style={{
          color: "var(--primary)",
        }}
      />
    </motion.div>
  );

  const Dots = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-3 w-3 rounded-full"
          style={{
            background: "var(--primary)",
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            delay: dot * 0.15,
          }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <motion.div
      className="rounded-full"
      style={{
        width: sizes[size],
        height: sizes[size],
        background: "var(--primary)",
      }}
      animate={{
        scale: [1, 1.35, 1],
        opacity: [1, 0.4, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.2,
      }}
    />
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <Dots />;

      case "pulse":
        return <Pulse />;

      case "button":
        return (
          <Loader2
            size={18}
            className="animate-spin"
          />
        );

      case "spinner":
      default:
        return <Spinner />;
    }
  };

  const content = (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-4

        ${className}
      `}
    >
      {renderLoader()}

      {text && (
        <p className="text-sm text-slate-500">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen || variant === "page") {
    return (
      <div
        className="
          fixed
          inset-0
          z-[9999]

          flex
          items-center
          justify-center

          bg-white/90

          backdrop-blur-sm
        "
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;