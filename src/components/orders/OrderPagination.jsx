import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function OrderPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalOrders,
  onPageChange,
  onRowsChange,
}) {
  const start =
    totalOrders === 0
      ? 0
      : (currentPage - 1) * rowsPerPage + 1;

  const end = Math.min(
    currentPage * rowsPerPage,
    totalOrders
  );

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div className="flex items-center gap-3">

        <span className="text-sm text-slate-500">
          Rows per page
        </span>

        <select
          value={rowsPerPage}
          onChange={(e) =>
            onRowsChange(Number(e.target.value))
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16522d]"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>

      </div>

      {/* Center */}

      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-900">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-900">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-900">
          {totalOrders}
        </span>{" "}
        orders
      </p>

      {/* Right */}

      <div className="flex items-center gap-2">

        <button
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
            currentPage === 1
              ? "cursor-not-allowed border-slate-200 text-slate-300"
              : "border-slate-200 hover:border-[#16522d] hover:bg-[#16522d] hover:text-white"
          }`}
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map((page) => (
          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
              page === currentPage
                ? "bg-[#16522d] text-white"
                : "border border-slate-200 hover:border-[#16522d] hover:text-[#16522d]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
            currentPage === totalPages
              ? "cursor-not-allowed border-slate-200 text-slate-300"
              : "border-slate-200 hover:border-[#16522d] hover:bg-[#16522d] hover:text-white"
          }`}
        >
          <ChevronRight size={18} />
        </button>

      </div>

    </div>
  );
}