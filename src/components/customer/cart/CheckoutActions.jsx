import { ArrowRight, ShoppingBag } from "lucide-react";

const formatPrice = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const CheckoutActions = ({
  total = 0,
  loading = false,
  onCheckout,
  onContinueShopping,
}) => {
  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-white/5 px-4 py-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Total Payable
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(total)}
          </h3>
        </div>

        <ShoppingBag
          size={28}
          className="text-green-600"
        />
      </div>

      {/* Checkout Button */}
      <button
        type="button"
        disabled={loading}
        onClick={onCheckout}
        className="
          group
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-green-600
          px-6
          text-base
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-green-700
          hover:shadow-lg
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <span>
          {loading ? "Processing..." : "Proceed to Checkout"}
        </span>

        {!loading && (
          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </button>

      {/* Continue Shopping */}
      <button
        type="button"
        onClick={onContinueShopping}
        className="
          w-full
          rounded-xl
          border
          border-gray-200 dark:border-white/10
          bg-white dark:bg-[#181A1B]
          py-3.5
          text-sm
          font-semibold
          text-gray-700 dark:text-slate-300
          transition-all
          duration-200
          hover:border-green-600
          hover:text-green-600
          hover:shadow-sm
        "
      >
        Continue Shopping
      </button>

      {/* Secure Checkout */}
      <div className="text-center">
        <p className="text-xs text-gray-400 dark:text-slate-500">
          🔒 Secure checkout • Safe payment • Fast delivery
        </p>
      </div>
    </div>
  );
};

export default CheckoutActions;