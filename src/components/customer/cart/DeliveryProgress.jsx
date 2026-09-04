import { CheckCircle2, Truck } from "lucide-react";

const DeliveryProgress = ({
  progress = 0,
  amountRemaining = 0,
  threshold = 499,
  unlocked = false,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            unlocked
              ? "bg-green-100 text-green-600"
              : "bg-orange-100 text-orange-500"
          }`}
        >
          {unlocked ? (
            <CheckCircle2 size={18} />
          ) : (
            <Truck size={18} />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {unlocked
              ? "Free Delivery Unlocked!"
              : "Unlock Free Delivery"}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {unlocked
              ? "Congratulations! Your order qualifies for free delivery."
              : `Add ₹${amountRemaining} more to unlock FREE DELIVERY.`}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>₹0</span>
          <span>₹{threshold}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {!unlocked && (
          <div className="mt-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
            {Math.round(progress)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryProgress;