import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search products, orders, customers..."
}) {
  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        className="
          h-11
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          pl-11
          pr-20
          text-sm
          font-medium
          text-slate-900
          placeholder:text-slate-400
          outline-none
          transition-all
          duration-200
          focus:border-[#1A4D2E]
          focus:ring-4
          focus:ring-[#1A4D2E]/10
        "
      />

      {/* Shortcut */}
      <div
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          hidden
          rounded-md
          border
          border-slate-200
          bg-slate-50
          px-2
          py-1
          text-[11px]
          font-medium
          text-slate-500
          md:flex
        "
      >
        Ctrl K
      </div>
    </div>
  );
}