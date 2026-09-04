import { motion } from "framer-motion";

const LoadingScreen = ({
  title = "Loading...",
  subtitle = "Preparing your experience",
}) => {
  return (
    <div
      className="
        fixed
        inset-0
        z-[999]

        flex
        items-center
        justify-center

        bg-white
      "
    >
      <div className="flex flex-col items-center">

        {/* Animated Logo */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.4,
            ease: "easeInOut",
          }}
          className="
            flex
            h-20
            w-20
            items-center
            justify-center

            rounded-[28px]

            text-2xl
            font-bold
            text-white

            shadow-xl
          "
          style={{
            background: "var(--primary)",
          }}
        >
        
        </motion.div>

        {/* Spinner */}

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="
            mt-8

            h-10
            w-10

            rounded-full

            border-[3px]
            border-slate-200
            border-t-transparent
          "
          style={{
            borderTopColor: "var(--primary)",
          }}
        />

        {/* Title */}

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="
            mt-8

            text-xl
            font-bold

            text-slate-900
          "
        >
          {title}
        </motion.h2>

        {/* Subtitle */}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="
            mt-2

            text-sm

            text-slate-500
          "
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;