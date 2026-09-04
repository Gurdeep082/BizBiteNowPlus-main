import { ChevronDown, ChevronLeft, MapPin } from "lucide-react";

const CartHeader = ({
  address = {},
  itemCount = 0,
  onAddressClick,
  onBack,
}) => {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      {/* Left Section with Back Button & Title */}
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A1B] text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white active:scale-95 cursor-pointer"
            aria-label="Go Back"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Cart
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {itemCount} {itemCount === 1 ? "item" : "items"} • Review your order before checkout
          </p>
        </div>
      </div>

      {/* Address Selection Button */}
      <button
        type="button"
        onClick={onAddressClick}
        className="
          group
          flex
          mb-5
          w-full
          items-center
          justify-between
          gap-3
          rounded-2xl
          border
          border-slate-200 dark:border-white/10
          bg-white dark:bg-[#181A1B]
          px-4
          py-3
          shadow-sm
          transition-all
          duration-200
          hover:border-green-500
          hover:shadow-md
          cursor-pointer
          md:w-auto
          md:min-w-[300px]
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <MapPin size={18} className="text-green-600" />
          </div>

          <div className="text-left">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deliver To
            </p>

            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
              {address.label || "Home"}
            </h3>

            <p className="max-w-[180px] truncate text-[10px] text-slate-500 dark:text-slate-400">
              {address.address || address.mohalla || "Select delivery address"}
            </p>
          </div>
        </div>

        <ChevronDown
          size={18}
          className="text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover:rotate-180"
        />
      </button>
    </header>
  );
};

export default CartHeader;