import { motion } from "framer-motion";
import {
  Stamp,
  Gift,
  TicketPercent,
  CheckCircle2,
} from "lucide-react";

const EVENT_ICONS = {
  stamp: Stamp,
  reward: Gift,
  coupon: TicketPercent,
};

const EVENT_COLORS = {
  stamp: {
    bg: "var(--primary-light)",
    color: "var(--primary-color)",
  },

  reward: {
    bg: "var(--secondary-light)",
    color: "var(--secondary-color)",
  },

  coupon: {
    bg: "var(--accent-light)",
    color: "var(--primary-color)",
  },
};

const ActivityTimelineItem = ({ activity }) => {
  if (!activity) return null;

  const { type, title, subtitle, amount, stamps, reward, date } = activity;

  const Icon = EVENT_ICONS[type] || Stamp;
  const style = EVENT_COLORS[type] || EVENT_COLORS.stamp;

  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
      className="relative flex gap-3 sm:gap-5"
    >

      {/* Timeline */}

      <div className="flex flex-col items-center">

        <div
          className="
            flex
            h-9
            w-9
            sm:h-12
            sm:w-12
            shrink-0
            items-center
            justify-center
            rounded-full
          "
          style={{
            background: style.bg,
          }}
        >
          <Icon
            size={18}
            className="sm:hidden"
            style={{
              color: style.color,
            }}
          />

          <Icon
            size={22}
            className="hidden sm:block"
            style={{
              color: style.color,
            }}
          />
        </div>


        <div
          className="mt-2 h-full w-[2px]"
          style={{
            backgroundColor: "var(--secondary-light)",
          }}
        />

      </div>


      {/* Card */}

      <div
        className="
          flex-1
          rounded-2xl
          sm:rounded-3xl
          border
          bg-white
          p-3
          sm:p-5
          shadow-sm
        "
        style={{
          borderColor: "var(--secondary-light)",
        }}
      >

        <div className="flex items-start justify-between gap-2">

          <div className="min-w-0">

            <h3 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
              {title}
            </h3>

            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 line-clamp-1 sm:line-clamp-none">
              {subtitle}
            </p>

          </div>


          <span className="shrink-0 text-[11px] sm:text-xs text-slate-400">
            {date}
          </span>

        </div>


        {type === "stamp" && (
          <div className="mt-3 sm:mt-5 flex flex-wrap gap-2 sm:gap-3">

            <div
              className="
                rounded-full
                px-2.5
                py-1
                sm:px-3
                sm:py-2
                text-xs
                sm:text-sm
              "
              style={{
                background: "var(--secondary-light)",
                color: "var(--secondary-color)",
              }}
            >
              ₹{amount}
            </div>


            <div
              className="
                rounded-full
                px-2.5
                py-1
                sm:px-3
                sm:py-2
                text-xs
                sm:text-sm
                font-semibold
              "
              style={{
                background: "var(--primary-color)",
                color: "var(--accent-color)",
              }}
            >
              +{stamps} Stamp{stamps > 1 ? "s" : ""}
            </div>

          </div>
        )}


        {type === "reward" && (
          <div
            className="
              mt-3
              sm:mt-5
              rounded-xl
              sm:rounded-2xl
              p-2.5
              sm:p-4
            "
            style={{
              background: "var(--primary-light)",
            }}
          >

            <div className="flex items-center gap-2 sm:gap-3">

              <Gift
                size={18}
                className="shrink-0"
                style={{
                  color: "var(--primary-color)",
                }}
              />


              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-slate-500">
                  Reward Unlocked
                </p>

                <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                  {reward}
                </h4>

              </div>

            </div>

          </div>
        )}


        {type === "coupon" && (
          <div
            className="
              mt-3
              sm:mt-5
              flex
              items-center
              gap-2
              sm:gap-3
              text-sm
              sm:text-base
            "
            style={{
              color: "var(--secondary-color)",
            }}
          >

            <CheckCircle2
              size={18}
              className="shrink-0"
            />

            Coupon Successfully Redeemed

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ActivityTimelineItem;