import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  Stamp,
  Gift,
  Percent,
  Bike,
  HelpCircle,
  Info,
} from "lucide-react";

const REWARD_ICONS = {
  item: Gift,
  discount: Percent,
  delivery: Bike,
};

const RewardProgress = ({ data, onRedeem }) => {
  const {
    threshold = 5,
    stampsCollected = 0,
    rewardType = "item",
    rewardDetail = "Free Reward",
  } = data || {};

  const RewardIcon = REWARD_ICONS[rewardType] || Gift;
  const progressPercent = Math.min((stampsCollected / threshold) * 100, 100);
  const rewardReady = stampsCollected >= threshold;

  return (
    <>
      {/* Mobile — "My Stamp Journey" card */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="lg:hidden rounded-[22px] p-4 shadow-sm"
        style={{
          background: "var(--primary-color)",
          color: "var(--accent-color)",
        }}
      >
        <h2 className="text-lg font-semibold">
          My Stamp Journey
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: "color-mix(in srgb, var(--accent-color) 70%, transparent)",
          }}
        >
          Unlock your Free Reward!
        </p>


        <div
          className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent-color) 15%, transparent)",
          }}
        >
          <span
            className="text-xs"
            style={{
              color:
                "color-mix(in srgb, var(--accent-color) 70%, transparent)",
            }}
          >
            Stamps
          </span>

          <span className="text-sm font-bold">
            {stampsCollected} / {threshold}
          </span>
        </div>


        {/* Stamp row */}

        <div className="mt-6">
          <div className="flex w-full items-center justify-between relative">

            <div
              className="absolute left-0 right-0 top-[14px] h-1 rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 20%, transparent)",
              }}
            />

            <div
              className="absolute left-0 top-[14px] h-1 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "var(--accent-color)",
              }}
            />


            {Array.from({ length: threshold }).map((_, index) => {
              const stamp = index + 1;
              const completed = stamp <= stampsCollected;

              return (
                <div
                  key={stamp}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all"
                    style={{
                      borderColor: completed
                        ? "var(--accent-color)"
                        : "color-mix(in srgb, var(--accent-color) 40%, transparent)",

                      backgroundColor: completed
                        ? "var(--accent-color)"
                        : "color-mix(in srgb, var(--accent-color) 10%, transparent)",
                    }}
                  >
                    {completed ? (
                      <CheckCircle2
                        size={13}
                        style={{ color: "var(--primary-color)" }}
                      />
                    ) : (
                      <Lock
                        size={11}
                        style={{
                          color:
                            "color-mix(in srgb, var(--accent-color) 60%, transparent)",
                        }}
                      />
                    )}
                  </div>

                  <span
                    className="mt-1.5 text-[8px] font-medium"
                    style={{
                      color: completed
                        ? "color-mix(in srgb, var(--accent-color) 80%, transparent)"
                        : "color-mix(in srgb, var(--accent-color) 50%, transparent)",
                    }}
                  >
                    Stamp {stamp}
                  </span>
                </div>
              );
            })}


            {/* Reward */}

            <div className="relative z-10 flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: rewardReady
                    ? "var(--accent-color)"
                    : "color-mix(in srgb, var(--accent-color) 40%, transparent)",

                  backgroundColor: rewardReady
                    ? "var(--accent-color)"
                    : "color-mix(in srgb, var(--accent-color) 10%, transparent)",
                }}
              >
                <RewardIcon
                  size={14}
                  style={{
                    color: rewardReady
                      ? "var(--primary-color)"
                      : "var(--accent-color)",
                  }}
                />
              </div>

              <span
                className="mt-1.5 text-[8px] font-semibold"
                style={{
                  color:
                    "color-mix(in srgb, var(--accent-color) 70%, transparent)",
                }}
              >
                Reward
              </span>
            </div>

          </div>
        </div>


        {/* Claim reward */}

        <button
          onClick={onRedeem}
          disabled={!rewardReady}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "var(--primary-color)",
          }}
        >
          <RewardIcon
            size={16}
            style={{ color: "var(--primary-color)" }}
          />

          {rewardReady
            ? "Reward ready! Claim now"
            : "Keep ordering to unlock"}
        </button>


        {/* Footer links */}

        <div
          className="mt-4 flex items-center justify-between pt-4"
          style={{
            borderTop:
              "1px solid color-mix(in srgb, var(--accent-color) 15%, transparent)",
          }}
        >
          <button
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{
              color:
                "color-mix(in srgb, var(--accent-color) 80%, transparent)",
            }}
          >
            <HelpCircle size={14} />
            How it works
          </button>

          <button
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{
              color:
                "color-mix(in srgb, var(--accent-color) 80%, transparent)",
            }}
          >
            <Info size={14} />
            Unlock Details
          </button>
        </div>

      </motion.section>

      {/* Desktop — unchanged existing design */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="hidden lg:block rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm lg:rounded-[32px] lg:p-6"
      >
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold lg:text-2xl">
              Stamp Journey
            </h2>

            <p className="mt-1 text-sm text-slate-500 lg:mt-2 lg:text-base">
              Collect {threshold} stamps to unlock{" "}
              <span className="font-semibold text-slate-700">
                {rewardDetail}
              </span>
            </p>
          </div>

          <div
            className="
      rounded-xl
      px-3
      py-1.5
      text-white
      lg:rounded-2xl
      lg:px-4
      lg:py-2
    "
            style={{
              background: "var(--primary-color)",
            }}
          >
            <p className="text-xs opacity-80 lg:text-sm">
              Progress
            </p>

            <p className="text-sm font-bold lg:text-lg">
              {stampsCollected}/{threshold}
            </p>
          </div>
        </div>

{/* Stamp Journey */}

<div className="mt-6 overflow-x-auto lg:mt-10 lg:overflow-visible">
  <div className="relative flex min-w-[420px] items-center justify-between px-6 lg:min-w-0 lg:px-7">

    {/* Line */}
    <div
      className="
        pointer-events-none
        absolute
        left-6
        right-6
        top-[18px]
        h-1
        rounded-full
        lg:left-7
        lg:right-7
        lg:top-6
      "
      style={{
        background: "var(--secondary-color)",
      }}
    />

    {/* Active Progress */}
    <div
      className="
        pointer-events-none
        absolute
        left-6
        top-[18px]
        h-1
        rounded-full
        transition-all
        duration-500
        lg:left-7
        lg:top-6
      "
      style={{
        background: "var(--primary-color)",
        width: `calc(
          (100% - 3.5rem) *
          ${Math.min(stampsCollected / threshold, 1)}
        )`,
      }}
    />

            {Array.from({ length: threshold }).map((_, index) => {
              const stamp = index + 1;

              const completed = stamp <= stampsCollected;
              const current = stamp === stampsCollected + 1;

              return (
                <div
                  key={stamp}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div
                    className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border-[3px]
              border-white
              shadow-md
              transition-all

              lg:h-12
              lg:w-12
              lg:border-4

              ${current ? "scale-110" : ""}
            `}
                    style={{
                      background: completed
                        ? "var(--primary-color)"
                        : "var(--secondary-color)",
                    }}
                  >
                    {completed ? (
                      <>
                        <CheckCircle2
                          size={16}
                          style={{
                            color: "var(--accent-color)",
                          }}
                          className="lg:hidden"
                        />

                        <CheckCircle2
                          size={22}
                          style={{
                            color: "var(--accent-color)",
                          }}
                          className="hidden lg:block"
                        />
                      </>
                    ) : (
                      <>
                        <Lock
                          size={14}
                          style={{
                            color: "var(--primary-color)",
                          }}
                          className="lg:hidden"
                        />

                        <Lock
                          size={20}
                          style={{
                            color: "var(--primary-color)",
                          }}
                          className="hidden lg:block"
                        />
                      </>
                    )}
                  </div>

                  <span
                    className="
              mt-2
              text-[10px]
              font-semibold
              lg:mt-3
              lg:text-xs
            "
                    style={{
                      color: "var(--primary-color)",
                    }}
                  >
                    Stamp {stamp}
                  </span>
                </div>
              );
            })}

            {/* Reward */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border-[3px]
          border-white
          shadow-lg

          lg:h-14
          lg:w-14
          lg:border-4
        "
                style={{
                  background:
                    stampsCollected >= threshold
                      ? "var(--primary-color)"
                      : "var(--secondary-color)",
                }}
              >
                <RewardIcon
                  size={18}
                  className="lg:hidden"
                  style={{
                    color:
                      stampsCollected >= threshold
                        ? "var(--accent-color)"
                        : "var(--primary-color)",
                  }}
                />

                <RewardIcon
                  size={24}
                  className="hidden lg:block"
                  style={{
                    color:
                      stampsCollected >= threshold
                        ? "var(--accent-color)"
                        : "var(--primary-color)",
                  }}
                />
              </div>

              <span
                className="
          mt-2
          text-[10px]
          font-bold
          lg:mt-3
          lg:text-xs
        "
                style={{
                  color: "var(--primary-color)",
                }}
              >
                Reward
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Card */}

        <div
          className="mt-6 rounded-2xl p-3 lg:mt-10 lg:rounded-3xl lg:p-5"
          style={{
            background: "var(--secondary-color)",
          }}
        >
          {stampsCollected >= threshold ? (
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium lg:text-sm"
                  style={{
                    color: "var(--primary-color)",
                  }}
                >
                  🎉 Congratulations!
                </p>

                <h3
                  className="mt-1 text-base font-bold lg:text-xl"
                  style={{
                    color: "var(--primary-color)",
                  }}
                >
                  {rewardDetail}
                </h3>

                <p
                  className="mt-1 text-sm lg:text-base"
                  style={{
                    color: "var(--primary-color)",
                    opacity: 0.7,
                  }}
                >
                  Your reward is ready to redeem.
                </p>
              </div>

              <RewardIcon
                size={24}
                className="lg:hidden"
                style={{
                  color: "var(--primary-color)",
                }}
              />

              <RewardIcon
                size={34}
                className="hidden lg:block"
                style={{
                  color: "var(--primary-color)",
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium lg:text-sm"
                  style={{
                    color: "var(--accent-color)",
                  }}
                >
                  Keep Going!
                </p>

                <h3
                  className="mt-1 text-base font-bold lg:text-xl"
                  style={{
                    color: "var(--accent-color)",
                  }}
                >
                  {threshold - stampsCollected} more{" "}
                  {threshold - stampsCollected === 1
                    ? "order"
                    : "orders"}{" "}
                  left
                </h3>

                <p
                  className="mt-1 text-sm lg:text-base"
                  style={{
                    color: "var(--accent-color)",
                    opacity: 0.7,
                  }}
                >
                  Unlock <strong>{rewardDetail}</strong>
                </p>
              </div>

              <Stamp
                size={24}
                className="lg:hidden"
                style={{
                  color: "var(--accent-color)",
                }}
              />

              <Stamp
                size={34}
                className="hidden lg:block"
                style={{
                  color: "var(--accent-color)",
                }}
              />
            </div>
          )}
        </div>
      </motion.section>
    </>
  );
};

export default RewardProgress;