import { Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CheckoutFooter = ({
  loading = false,
  disabled = false,
  disabledMessage = "",
  total = 0,
  onPlaceOrder,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || loading) return;

    if (typeof onPlaceOrder === "function") {
      onPlaceOrder();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-6"
    >
      {disabledMessage && !loading && (
        <p className="mb-2 text-center text-sm font-semibold text-rose-600" role="alert">
          {disabledMessage}
        </p>
      )}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleClick}
        className="
          flex
          h-14
          w-full
          items-center
          justify-between
          rounded-2xl
          px-6
          font-semibold
          text-white
          transition-all
          duration-200
          hover:scale-[1.01]
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
          cursor-pointer
        "
        style={{
          backgroundColor: "var(--primary-color)",
        }}
      >
        <div className="text-left">
          <p className="text-xs text-white/80">Total Payable</p>

          <p className="text-lg font-bold">
            ₹{Number(total || 0).toFixed(2)}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 font-medium">
            <Loader2 size={20} className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 font-bold">
            <span>Place Order</span>
            <ArrowRight size={20} />
          </div>
        )}
      </button>
    </motion.div>
  );
};

export default CheckoutFooter;
