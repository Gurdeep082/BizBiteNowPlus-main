import {
  Search,
  Filter,
  CalendarRange,
  ArrowUpDown,
  CreditCard,
  RotateCcw,
} from "lucide-react";

const statusList = [
  "All",
  "Pending",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const paymentList = [
  "All",
  "Online",
  "COD",
];

const sortList = [
  "Newest",
  "Oldest",
  "Highest Amount",
  "Lowest Amount",
];

export default function OrderFilters({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
  sort,
  setSort,
  onReset,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid gap-4 xl:grid-cols-[1.4fr_auto_auto_auto_auto]">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="order-search"
            name="orderSearch"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#16522d] focus:ring-4 focus:ring-[#16522d]/10"
          />

        </div>

        {/* Status */}

        <div className="relative">

          <Filter
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-12 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm outline-none transition-all focus:border-[#16522d] focus:ring-4 focus:ring-[#16522d]/10"
          >
            {statusList.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Payment */}

        <div className="relative">

          <CreditCard
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="h-12 min-w-[150px] appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm outline-none transition-all focus:border-[#16522d] focus:ring-4 focus:ring-[#16522d]/10"
          >
            {paymentList.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Sort */}

        <div className="relative">

          <ArrowUpDown
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm outline-none transition-all focus:border-[#16522d] focus:ring-4 focus:ring-[#16522d]/10"
          >
            {sortList.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Reset */}

        <button
          onClick={onReset}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-medium transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <RotateCcw size={17} />

          Reset

        </button>

      </div>

    </div>
  );
}