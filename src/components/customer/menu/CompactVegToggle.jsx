import { Leaf } from "lucide-react";

const options = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "veg",
    label: "Veg",
  },
  {
    id: "nonveg",
    label: "Non-Veg",
  },
];

const CompactVegToggle = ({ value = "all", onChange }) => {
  return (
    <div
      className="
        inline-flex

        items-center

        gap-1

        rounded-xl

        border
        border-slate-200 dark:border-white/10

        bg-white dark:bg-[#181A1B]

        p-1

        shadow-sm

        lg:hidden
      "
    >
      {options.map((option) => {
        const active = value === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onChange?.(option.id)}
            className={`
              flex
              items-center
              justify-center
              gap-1

              whitespace-nowrap

              rounded-xl

              px-3
              py-2

              text-xs
              font-semibold

              transition-all

              ${active ? "text-white" : "text-slate-600 dark:text-slate-400"}
            `}
            style={{
              background: active ? "var(--primary)" : "transparent",
            }}
          >
            {option.id !== "all" && (
              <div
                className={`
    flex h-4 w-4 items-center justify-center
    rounded-[2px]
    border
    ${
      active
        ? "border-white"
        : option.id === "veg"
          ? "border-[#008000]"
          : "border-[#D32F2F]"
    }
  `}
              >
                <div
                  className={`
      h-2 w-2 rounded-full
      ${
        active
          ? "bg-white"
          : option.id === "veg"
            ? "bg-[#008000]"
            : "bg-[#D32F2F]"
      }
    `}
                />
              </div>
            )}

            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default CompactVegToggle;
