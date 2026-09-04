import {
  Search,
  Download,
  RotateCw,
  Filter,
  X,
} from "lucide-react";

export default function EarningsFilters({
  search,
  onSearchChange,
  range,
  onRangeChange,
  payment,
  onPaymentChange,
  onRefresh,
  onExport,
  onReset,
}) {
  const activeFilters =
    (search ? 1 : 0) +
    (range !== "30d" ? 1 : 0) +
    (payment !== "all" ? 1 : 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Earnings Filters
          </h2>

          <p className="mt-1 text-slate-500">
            Filter earnings, payments and history.
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2">

          <Filter
            size={16}
            className="text-violet-600"
          />

          <span className="text-sm font-semibold text-violet-700">
            {activeFilters} Active
          </span>

        </div>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}

        <div className="relative xl:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search..."
            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none transition focus:border-violet-500"
          />

        </div>

        {/* Range */}

        <select
          value={range}
          onChange={(e) =>
            onRangeChange(e.target.value)
          }
          className="h-12 rounded-xl border border-slate-200 px-4 outline-none"
        >
          <option value="7d">
            Last 7 Days
          </option>

          <option value="30d">
            Last 30 Days
          </option>

          <option value="90d">
            Last 90 Days
          </option>

          <option value="all">
            All Time
          </option>

        </select>

        {/* Payment */}

        <select
          value={payment}
          onChange={(e) =>
            onPaymentChange(e.target.value)
          }
          className="h-12 rounded-xl border border-slate-200 px-4 outline-none"
        >
          <option value="all">
            All Payments
          </option>

          <option value="COD">
            COD
          </option>

          <option value="Online">
            Online
          </option>

        </select>

        {/* Actions */}

        <div className="flex gap-3">

          <button
            onClick={onRefresh}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold text-white transition hover:bg-violet-700"
          >
            <RotateCw size={18} />
            Refresh
          </button>

          <button
            onClick={onExport}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 transition hover:bg-[#FDFDF5]"
          >
            <Download size={18} />
          </button>

          <button
            onClick={onReset}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
          >
            <X size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}