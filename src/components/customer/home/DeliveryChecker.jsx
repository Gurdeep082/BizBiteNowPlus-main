import { MapPin } from "lucide-react";

const DeliveryChecker = ({
  location = "",
  onCheck,
}) => {
  return (
    <section className="lg:hidden px-2">
      <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-[#181A1B] px-5 py-2 shadow-[0_4px_12px_rgba(15,23,42,0.08)]">

        {/* Left */}

        <div className="flex flex-1 items-center gap-3 min-w-0">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)]">
            <MapPin
              size={30}
              style={{
                color: "var(--primary)",
              }}
            />
          </div>

          <div className="flex-1 min-w-0">

            <h3 className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white">
              Delivery Available?
            </h3>

            <p className="mt-0 text-[10px] leading-3.5 text-slate-500 dark:text-slate-400">
              Check delivery availability at your location.
            </p>

            {location && (
              <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--primary)]">
                <MapPin
                  size={15}
                  className="text-red-500"
                />
                {location}
              </span>
            )}

          </div>

        </div>

        {/* Button */}

        <button
          onClick={onCheck}
          className="
            ml-4
            h-8
            shrink-0
            rounded-xl
            px-4
            text-[12px]
            font-semibold
            text-white
            transition
            hover:scale-[1.02]
          "
          style={{
            background: "var(--primary)",
            boxShadow:
              "0 0 0 2px rgba(255,164,32,.55),0 4px 10px rgba(255,164,32,.28)",
          }}
        >
          Check
        </button>

      </div>
    </section>
  );
};

export default DeliveryChecker;