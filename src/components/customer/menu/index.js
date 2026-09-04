import { useEffect, useRef, useState } from "react";
import {
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

const SortDropdown = ({
  value = "recommended",
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const selected =
    sortOptions.find((item) => item.value === value) ||
    sortOptions[0];

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
    >
      {/* Trigger */}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          items-center
          gap-3

          rounded-2xl

          border
          border-slate-200

          bg-white

          px-4
          py-3

          shadow-sm

          transition-all

          hover:shadow-md
        "
      >
        <selected.icon
          size={18}
          style={{
            color: "var(--primary)",
          }}
        />

        <span className="text-sm font-medium text-slate-700">
          {selected.label}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3

            w-64

            overflow-hidden

            rounded-2xl

            border
            border-slate-200

            bg-white

            shadow-2xl

            z-50
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
                  onChange?.(option.value);
                  setOpen(false);
                }}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between

                  px-5
                  py-4

                  transition-all

                  ${
                    active
                      ? "bg-slate-50"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    style={{
                      color: active
                        ? "var(--primary)"
                        : "#64748B",
                    }}
                  />

                  <span
                    className={`text-sm ${
                      active
                        ? "font-semibold text-slate-900"
                        : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>

                {active && (
                  <Check
                    size={18}
                    style={{
                      color: "var(--primary)",
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

export default SortDropdown;