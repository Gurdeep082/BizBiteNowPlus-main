import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
} from "lucide-react";

const ScheduleOrderCard = ({
  scheduled = false,
  scheduledDate = "",
  scheduledTime = "",
  onClick,
}) => {
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        rounded-2xl
        sm:rounded-[24px]

        border
        border-slate-200
        dark:border-[#A9BDCF]/30

        bg-white
        dark:bg-[#181A1B]

        p-3
        sm:p-5
      "
    >
      <button
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          justify-between

          rounded-2xl

          transition-all
          duration-200

          hover:opacity-90
          active:scale-[0.99]
        "
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          {/* Icon */}

          <div
            className="
              flex

              h-10
              w-10

              shrink-0

              items-center
              justify-center

              rounded-xl

              sm:h-12
              sm:w-12
            "
            style={{
              background: "var(--primary-light)",
            }}
          >
            <CalendarDays
              size={18}
              className="sm:h-[22px] sm:w-[22px]"
              color="var(--primary)"
            />
          </div>

          {/* Content */}

          <div className="min-w-0 text-left">

            <h2
              className="
                text-sm
                font-bold

                text-slate-900
                dark:text-white

                sm:text-lg
              "
            >
              Schedule Order
            </h2>

            {!scheduled ? (
              <p
                className="
                  mt-0.5

                  text-xs

                  text-slate-500
                  dark:text-slate-400

                  sm:mt-1
                  sm:text-sm
                "
              >
                Deliver as soon as possible
              </p>
            ) : (
              <div
                className="
                  mt-1.5

                  flex
                  flex-wrap

                  items-center

                  gap-1.5

                  sm:mt-2
                  sm:gap-2
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1

                    rounded-full

                    bg-[var(--primary-light)]

                    px-2
                    py-0.5

                    text-[10px]
                    font-semibold

                    sm:px-3
                    sm:py-1
                    sm:text-xs
                  "
                  style={{
                    color: "var(--primary)",
                  }}
                >
                  <CalendarDays size={12} />
                  {scheduledDate}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1

                    rounded-full

                    bg-slate-100
                    dark:bg-white/10

                    px-2
                    py-0.5

                    text-[10px]
                    font-semibold

                    text-slate-700
                    dark:text-slate-300

                    sm:px-3
                    sm:py-1
                    sm:text-xs
                  "
                >
                  <Clock3 size={12} />
                  {scheduledTime}
                </span>

              </div>
            )}

          </div>

        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {scheduled && (
            <span
              className="
                hidden

                rounded-full

                bg-green-100

                px-3
                py-1

                text-xs
                font-semibold

                text-green-700

                lg:block
              "
            >
              Scheduled
            </span>
          )}

          <ChevronRight
            size={18}
            className="
              text-slate-400

              sm:h-5
              sm:w-5
            "
          />

        </div>

      </button>
    </motion.section>
  );
};

export default ScheduleOrderCard;