import { motion } from "framer-motion";

const shimmer = {
  initial: {
    x: "-100%",
  },
  animate: {
    x: "100%",
  },
};

const SkeletonBlock = ({
  className = "",
}) => (
  <div
    className={`
      relative
      overflow-hidden

      rounded-xl

      bg-slate-200

      ${className}
    `}
  >
    <motion.div
      variants={shimmer}
      initial="initial"
      animate="animate"
      transition={{
        repeat: Infinity,
        duration: 1.2,
        ease: "linear",
      }}
      className="
        absolute
        inset-0

        bg-gradient-to-r

        from-transparent
        via-white/60
        to-transparent
      "
    />
  </div>
);

const Skeleton = ({
  variant = "card",
  count = 1,
}) => {
  const renderVariant = () => {
    switch (variant) {
      case "avatar":
        return (
          <SkeletonBlock className="h-16 w-16 rounded-full" />
        );

      case "text":
        return (
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-4/5" />
            <SkeletonBlock className="h-4 w-2/3" />
          </div>
        );

      case "image":
        return (
          <SkeletonBlock className="h-52 w-full rounded-3xl" />
        );

      case "list":
        return (
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-16 w-16 rounded-2xl" />

            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-4 w-2/3" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          </div>
        );

      case "product":
        return (
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white p-4">
            <SkeletonBlock className="h-44 w-full rounded-2xl" />

            <div className="mt-5 space-y-3">
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />

              <SkeletonBlock className="mt-4 h-12 w-full rounded-xl" />
            </div>
          </div>
        );

      case "card":
      default:
        return (
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">

              <SkeletonBlock className="h-16 w-16 rounded-2xl" />

              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-5 w-2/5" />
                <SkeletonBlock className="h-4 w-3/4" />
              </div>

            </div>

            <div className="mt-6 space-y-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>

            <SkeletonBlock className="mt-6 h-12 w-full rounded-2xl" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-5">
      {Array.from({
        length: count,
      }).map((_, index) => (
        <div key={index}>
          {renderVariant()}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;