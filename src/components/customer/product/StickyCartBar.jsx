import {
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

export default function StickyCartBar({
  product,
  quantity = 1,
  selectedAddons = [],
  onAddToCart,
  loading = false,
}) {
  const basePrice = product?.price || 399;

  const addonsPrice = selectedAddons.reduce((total, addon) => {
    if (typeof addon === "object") {
      return total + (addon.price || 0);
    }

    return total;
  }, 0);

  const total = (basePrice + addonsPrice) * quantity;

  return (
    <>
      {/* Desktop Sticky Card */}

      <div
        className="
          fixed
          bottom-6
          right-6
          z-40
          hidden
          w-[360px]
          rounded-3xl
          border
          border-gray-200 dark:border-white/10
          bg-white/95 dark:bg-[#181A1B]/95
          p-5
          shadow-2xl
          backdrop-blur-lg
          lg:block
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Total Amount
            </p>

            <h2 className="mt-1 text-3xl font-bold text-[#16522d]">
              ₹{total}
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
              {quantity} {quantity > 1 ? "Items" : "Item"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#16522d]/10 p-4">
            <ShoppingBag
              size={30}
              className="text-[#16522d]"
            />
          </div>
        </div>

        <button
          onClick={onAddToCart}
          disabled={loading}
          className="
            mt-5
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-[#16522d]
            text-base
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-[#124325]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <ShoppingCart size={20} />

          {loading
            ? "Adding..."
            : "Add To Cart"}
        </button>
      </div>

      {/* Mobile Bottom Bar */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-gray-200 dark:border-white/10
          bg-white/95 dark:bg-[#181A1B]/95
          px-4
          py-3
          shadow-[0_-8px_24px_rgba(0,0,0,0.08)]
          backdrop-blur-lg
          lg:hidden
        "
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Total
            </p>

            <h3 className="text-2xl font-bold text-[#16522d]">
              ₹{total}
            </h3>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              {quantity} {quantity > 1 ? "Items" : "Item"}
            </p>
          </div>

          <button
            onClick={onAddToCart}
            disabled={loading}
            className="
              flex
              h-14
              min-w-[170px]
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-[#16522d]
              px-6
              text-base
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#124325]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <ShoppingCart size={20} />

            {loading
              ? "Adding..."
              : "Add To Cart"}
          </button>
        </div>
      </div>

      {/* Bottom spacing for mobile */}

      <div className="h-24 lg:hidden" />
    </>
  );
}
