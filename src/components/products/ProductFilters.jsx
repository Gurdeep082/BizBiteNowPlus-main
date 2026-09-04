import { Search, LayoutGrid, List } from "lucide-react";
import { categories } from "../../data/productsData.js";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  view,
  setView,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div className="flex flex-1 flex-col gap-4 md:flex-row">

          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
            />
          </div>

          {/* Category */}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E] focus:ring-2 focus:ring-[#1A4D2E]/20"
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

        </div>

        {/* Right */}

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 p-1">

          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 transition ${
              view === "grid"
                ? "bg-[#1A4D2E] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 transition ${
              view === "list"
                ? "bg-[#1A4D2E] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}