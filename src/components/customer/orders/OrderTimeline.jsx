
import { motion } from "framer-motion";

import {
  Check,
  Circle,
  PackageCheck,
  ChefHat,
  Bike,
  Home,
  CheckCircle2,
} from "lucide-react"; 
const defaultSteps = [
  {
    id: "placed",
    title: "Order Placed",
    time: "",
  },
  {
    id: "preparing",
    title: "Preparing",
    time: "",
  },
  {
    id: "ready",
    title: "Ready",
    time: "",
  },
  {
    id: "delivery",
    title: "Out for Delivery",
    time: "",
  },
  {
    id: "delivered",
    title: "Delivered",
    time: "",
  },
];
const getIcon = (title) => {
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
  const steps =
    timeline.length > 0
      ? timeline
      : defaultSteps;
console.log("timeline", timeline);
console.log("currentStep", currentStep);
  const currentIndex = Math.max(
    0,
    steps.findIndex(
      (step) => step.id === currentStep
    )
  );

const progress =
  steps.length > 1
    ? (currentIndex / (steps.length - 0.5)) * 100
    : 0;
  return (
    <div className="w-full overflow-x-auto py-6">

      <div
        className="
          relative
          mx-auto
          flex
          min-w-[760px]
          items-start
          justify-between
          px-2
        "
      >
                {/* Background Track */}

<div
  className="
    absolute
    left-[94px]
    right-[94px]
    top-[24px]
    h-[3px]
    rounded-full
    bg-slate-200
    z-0
  "
/>


<motion.div
  initial={{ width: 0 }}
  animate={{
    width:
      currentIndex === 0
        ? "0px"
        : `calc(${progress}% - 2px)`,
  }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
  }}
  className="
    absolute
    left-[94px]
    top-[24px]
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

                w-[155px]

                flex-col

                items-center
              "
            >
                            {/* Circle */}

              <div className="relative flex items-center justify-center">

                {/* Active Outer Ring */}

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

                      h-[62px]
                      w-[62px]

                      rounded-full

                      border-[3px]

                      border-green-200
                    "
                  />
                )}

                {/* Circle */}

                <motion.div
                  whileHover={{
                    scale: 1.04,
                  }}
                  className="
                    relative

                    flex

                    h-[48px]
                    w-[48px]

                    items-center
                    justify-center
                    gap-10
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
                    size={20}
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
                  mt-5

                  text-center

                  text-[14px]

                  font-semibold

                  text-slate-900
                "
              >
                {step.title}
              </h4>

              {/* Time */}

              <p
                className={`
                  mt-1

                  text-xs

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

      {/* Mobile Scroll Hint */}

      <div className="mt-5 flex justify-center lg:hidden">
        <div
          className="
            rounded-full
            bg-slate-100
            px-3
            py-1
            text-[11px]
            font-medium
            text-slate-500
          "
        >
          ← Swipe →
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;