import { motion } from "framer-motion";
import {
  Stamp,
  Gift,
  Percent,
  Bike,
  Trophy,
  ChevronRight,
  PauseCircle,
} from "lucide-react";

const REWARD_ICONS = {
  item: Gift,
  discount: Percent,
  delivery: Bike,
};

const REWARD_LABELS = {
  item: "Free item",
  discount: "Discount",
  delivery: "Free delivery",
};

/**
 * data: { active, threshold, stampsCollected, rewardType, rewardDetail }
 * — same shape as api/customer/loyalty.js's getCustomerLoyaltyStatus().
 *
 * Same visual scaffolding as the original points/tier version (gradient
 * hero, decorative circles, motion, var(--primary) theming) — only the
 * data-bound content changed.
 *
 * Sizing is smaller by default (mobile) and steps back up to the original
 * scale at lg: — desktop/tablet visuals are unchanged.
 */
const LoyaltyCard = ({ data, onViewBenefits, onRedeem }) => {
  const {
    active = true,
    threshold = 5,
    stampsCollected = 0,
    rewardType = "item",
    rewardDetail = "a reward",
  } = data || {};

  const remaining = Math.max(0, threshold - stampsCollected);
  const rewardReady = stampsCollected >= threshold;
  const progress = Math.min(
    100,
    Math.round((stampsCollected / threshold) * 100),
  );
  const RewardIcon = REWARD_ICONS[rewardType] || Gift;

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        hidden
        lg:block

        relative
        overflow-hidden

        rounded-[22px]
        lg:rounded-[32px]

        shadow-xl

        text-white
      "
      style={{
        background: "linear-gradient(135deg,var(--primary-color),var(--secondary-color))",
      }}
    >
      {/* Background */}

      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 lg:-right-14 lg:-top-14 lg:h-56 lg:w-56" />

      <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-white/5 lg:-bottom-16 lg:-left-12 lg:h-48 lg:w-48" />

      <div className="relative p-4 lg:p-7">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70 lg:text-sm">Loyalty Progress</p>

            <h2 className="mt-1 text-3xl font-bold lg:mt-2 lg:text-5xl">
              {stampsCollected}
              <span className="text-lg text-white/50 lg:text-2xl">/{threshold}</span>
            </h2>

            <p className="mt-1 text-sm text-white/70 lg:mt-2 lg:text-base">Stamps collected</p>
          </div>

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-full

              bg-white/15

              backdrop-blur

              lg:h-20
              lg:w-20
            "
          >
            <Stamp size={20} className="lg:hidden" />
            <Stamp size={34} className="hidden lg:block" />
          </div>
        </div>

        {/* Reward */}

        <div
          className="
            mt-4

            rounded-2xl

            bg-white/10

            p-3

            backdrop-blur

            lg:mt-8
            lg:rounded-3xl
            lg:p-5
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <RewardIcon size={18} className="lg:hidden" />
              <RewardIcon size={24} className="hidden lg:block" />

              <div>
                <h3 className="text-base font-bold lg:text-xl">{rewardDetail}</h3>

                <p className="text-xs text-white/70 lg:text-sm">
                  {REWARD_LABELS[rewardType] || "Reward"} on card completion
                </p>
              </div>
            </div>

            <Trophy size={20} className="lg:hidden" />
            <Trophy size={28} className="hidden lg:block" />
          </div>

          {/* Progress */}

          <div className="mt-4 lg:mt-6">
            <div className="mb-2 flex justify-between text-xs lg:mb-3 lg:text-sm">
              <span>0</span>

              <span>{threshold} stamps</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/20 lg:h-3">
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className="h-full rounded-full bg-white"
              />
            </div>

            <p className="mt-2 text-xs text-white/70 lg:mt-3 lg:text-sm">
              {rewardReady
                ? "Reward unlocked — applied automatically at your next checkout."
                : `${remaining} more order${remaining === 1 ? "" : "s"} for your ${REWARD_LABELS[rewardType]?.toLowerCase() || "reward"}.`}
            </p>
          </div>
        </div>

        {/* Paused notice */}

        {!active && (
          <div
            className="
              mt-4

              rounded-xl

              bg-white/10

              p-3

              lg:mt-6
              lg:rounded-2xl
              lg:p-4
            "
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <PauseCircle size={18} className="lg:hidden" />
              <PauseCircle size={20} className="hidden lg:block" />

              <div>
                <h4 className="text-sm font-semibold lg:text-base">Loyalty programme paused</h4>

                <p className="text-xs text-white/70 lg:text-sm">
                  This store has paused new stamps for now.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}


        {/* Buttons */}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:mt-8 lg:gap-3">
          <button
            onClick={onRedeem}
            disabled={!rewardReady}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-white

              px-4
              py-3

              text-sm
              font-semibold

              text-slate-900

              transition

              hover:scale-[1.02]

              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:scale-100

              lg:gap-3
              lg:rounded-2xl
              lg:px-6
              lg:py-4
              lg:text-base
            "
          >
            <Gift size={16} className="lg:hidden" />
            <Gift size={20} className="hidden lg:block" />

            {rewardReady ? "Reward ready!" : "Keep ordering to unlock"}
          </button>

          <button
            onClick={onViewBenefits}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2

              rounded-xl

              border
              border-white/20

              bg-white/10

              px-4
              py-3

              text-sm
              font-semibold

              backdrop-blur

              transition

              hover:bg-white/20

              lg:gap-3
              lg:rounded-2xl
              lg:px-6
              lg:py-4
              lg:text-base
            "
          >
            How it works
            <ChevronRight size={16} className="lg:hidden" />
            <ChevronRight size={18} className="hidden lg:block" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default LoyaltyCard;