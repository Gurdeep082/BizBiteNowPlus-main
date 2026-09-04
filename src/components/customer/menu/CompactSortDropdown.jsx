import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Check,
  ArrowUpAZ,
  ArrowDownAZ,
  Star,
  Flame,
  Clock3,
  Sparkles,
} from "lucide-react";

const sortOptions = [
  {
    value: "recommended",
    label: "Recommended",
    icon: Sparkles,
  },
  {
    value: "popular",
    label: "Most Popular",
    icon: Flame,
  },
  {
    value: "rating",
    label: "Highest Rated",
    icon: Star,
  },
  {
    value: "price-low",
    label: "Price: Low to High",
    icon: ArrowUpAZ,
  },
  {
    value: "price-high",
    label: "Price: High to Low",
    icon: ArrowDownAZ,
  },
  {
    value: "fastest",
    label: "Fastest Ready",
    icon: Clock3,
  },
];

const CompactSortDropdown = ({
  value = "recommended",
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative lg:hidden"
    >
      {/* Trigger */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          flex
          items-center
          gap-1

          rounded-xl

          border
          border-slate-200 dark:border-white/10

          bg-white dark:bg-[#181A1B]

          px-3
          py-3

          shadow-sm

          transition

          hover:shadow
        "
      >
        <SlidersHorizontal
          size={14}
          style={{
            color: "var(--primary)",
          }}
        />

        <span
          className="
            text-xs
            font-semibold
            text-slate-700 dark:text-slate-300
          "
        >
          Sort
        </span>

        <ChevronDown
          size={14}
          className={
            open
              ? "rotate-180 transition text-slate-500 dark:text-slate-400"
              : "transition text-slate-500 dark:text-slate-400"
          }
        />
      </button>

      {/* Menu */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2

            w-56

            overflow-hidden

            rounded-2xl

            border
            border-slate-200 dark:border-white/10

            bg-white dark:bg-[#181A1B]

            shadow-xl

            z-[9999]
          "
        >
          {sortOptions.map((option) => {
            const Icon = option.icon;

            const active =
              option.value === value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange?.(
                    option.value
                  );
                  setOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between

                  px-4
                  py-3

                  transition

                  ${
                    active
                      ? "bg-slate-50 dark:bg-white/5"
                      : "hover:bg-slate-50 dark:hover:bg-white/5"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={15}
                    style={{
                      color: active
                        ? "var(--primary)"
                        : "#64748B",
                    }}
                  />

                  <span
                    className={`
                      text-xs

                      ${
                        active
                          ? "font-semibold text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-400"
                      }
                    `}
                  >
                    {option.label}
                  </span>
                </div>

                {active && (
                  <Check
                    size={15}
                    style={{
                      color:
                        "var(--primary)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompactSortDropdown;