import {
  ChevronDown,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

const FILTERS = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function ChartHeader({
  title = "Seller Analytics",
  subtitle = "Track your store performance",
  filter = "7d",
  onFilterChange,
  onRefresh,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        <div className="relative">

          <CalendarDays
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#16522D]"
          />

          <select
            value={filter}
            onChange={(e) =>
              onFilterChange?.(e.target.value)
            }
            className="
              h-11
              min-w-[180px]
              appearance-none
              rounded-xl
              border
              border-slate-200
              bg-white
              pl-11
              pr-10
              text-sm
              font-medium
              text-slate-700
              outline-none
              transition-all
              duration-300
              hover:border-[#16522D]
              focus:border-[#16522D]
              focus:ring-4
              focus:ring-[#16522D]/10
            "
          >
            {FILTERS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            transition-all
            duration-300
            hover:border-[#16522D]
            hover:bg-[#16522D]
            hover:shadow-md
            group
          "
        >
          <RefreshCw
            size={18}
            className="text-[#16522D] transition-colors duration-300 group-hover:text-white"
          />
        </button>

      </div>

    </div>
  );
}