import { motion } from "framer-motion";

import {
  Check,
  Circle,
  PackageCheck,
  ChefHat,
  Bike,
  Home,
} from "lucide-react";

const getIcon = (title = "") => {
  switch (title.toLowerCase()) {
    case "order placed":
      return PackageCheck;

    case "preparing":
    case "preparing food":
      return ChefHat;

    case "ready":
      return Check;

    case "on the way":
    case "out for delivery":
      return Bike;

    case "delivered":
      return Home;

    default:
      return Circle;
  }
};

const OrderTimeline = ({
  currentStep = "placed",
  timeline = [],
}) => {
  const steps = timeline || [];

  const currentIndex = Math.max(
    0,
    steps.findIndex(
      (step) => step.id === currentStep
    )
  );

const TRACK_OFFSET = 40;

const progressWidth = `calc(
  ((100% - ${TRACK_OFFSET * 2}px) * ${
    currentIndex / (steps.length - 1)
  })
)`;

  return (
    <div className="w-full py-4 md:py-6">
      <div
        className="
          relative
          mx-auto
          flex
          w-full
          items-start
          justify-between
          px-2
          md:px-4
        "
      >
        {/* Background Track */}

        <div
          className="
            absolute
            left-[40px]
right-[40px]
top-4
md:left-[94px]
md:right-[94px]
md:top-[24px]
            md:left-[94px]
            md:right-[94px]
            md:top-[24px]
            h-[3px]
            rounded-full
            bg-slate-200
            z-0
          "
        />

        {/* Active Track */}

        <motion.div
  initial={{ width: 0 }}
  animate={{
    width: currentIndex === 0 ? 0 : progressWidth,
  }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
  }}
          className="
            absolute
            left-[40px]
            top-4
            md:left-[94px]
            md:top-[24px]
            h-[3px]
            rounded-full
            bg-green-600
            z-0
          "
        />

        {steps.map((step, index) => {
          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          const Icon = getIcon(step.title);

          return (
            <div
              key={step.id}
              className="
                relative
                z-20
                flex
                flex-1
min-w-0
px-1
                flex-col
                items-center
                
              "
            >
              {/* Circle */}

              <div className="relative flex items-center justify-center">

                {/* Active Ring */}

                {active && (
                  <motion.div
                    initial={{
                      scale: 0.9,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="
                      absolute
                      h-10
w-10
md:h-[62px]
md:w-[62px]
                      rounded-full
                      border-[3px]
                      border-green-200
                    "
                  />
                )}

                {/* Icon Circle */}

                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="
                    relative
                    flex
                    h-8
w-8
md:h-12
md:w-12
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    bg-white
                    transition-all
                    duration-300
                  "
                  style={{
                    borderColor:
                      completed || active
                        ? "#18864b"
                        : "#d1d5db",

                    boxShadow: active
                      ? "0 4px 14px rgba(22,163,74,.18)"
                      : "0 2px 8px rgba(0,0,0,.06)",
                  }}
                >
                  <Icon
                    size={14}
                    className="md:h-5 md:w-5"
                    strokeWidth={2.3}
                    color={
                      completed || active
                        ? "#18864b"
                        : "#9ca3af"
                    }
                  />
                </motion.div>
              </div>
                            {/* Title */}

              <h4
                className="
                  mt-3
                  md:mt-5

                  px-1

                  text-center

                  text-[10px]
md:text-[14px]
leading-3

                  font-semibold

                  leading-4

                  text-slate-900
                "
              >
                {step.title}
              </h4>

              {/* Time */}

              <p
                className={`
                  mt-1

                  text-[9px]
md:text-xs

                  text-center

                  ${
                    completed || active
                      ? "text-slate-500"
                      : "text-slate-400"
                  }
                `}
              >
                {step.time || "Upcoming"}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default OrderTimeline;