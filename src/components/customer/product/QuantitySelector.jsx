import { Minus, Plus, Hash } from "lucide-react";

export default function QuantitySelector({
  quantity,
  setQuantity,
}) {
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="rounded-lg md:rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] p-3 md:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-[#16522d]/10">
            <Hash
              size={18}
              className="text-[#16522d] md:h-[22px] md:w-[22px]"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-base text-lg font-bold text-slate-900 dark:text-white">
              Quantity
            </h3>

            <p className="mt-0.5 text-xs md:mt-1 md:text-xs text-gray-500 dark:text-slate-400 truncate">
              Select the number of servings
            </p>
          </div>
        </div>


      </div>

      <div className="mt-4 md:mt-6 flex justify-center">
        <div className="flex items-center rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-1.5 md:p-2">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="
              flex
              h-9
              w-9
              md:h-10
              md:w-10
              items-center
              justify-center
              rounded-lg
              md:rounded-xl
              border
              border-gray-200 dark:border-white/10
              bg-white dark:bg-[#232627]
              transition-all
              duration-200
              hover:border-[#16522d]
              hover:bg-[#16522d]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:hover:border-gray-200
              disabled:hover:bg-white
              disabled:hover:text-gray-500
            "
          >
            <Minus size={16} className="md:h-[18px] md:w-[18px]" />
          </button>

          <div className="flex min-w-[64px] md:min-w-[90px] flex-col items-center justify-center px-2 md:px-4">
            <span className="text-lg md:text-xl font-bold text-[#16522d]">
              {quantity}
            </span>

            <span className="text-[10px] md:text-xs text-gray-500 dark:text-slate-400">
              Qty
            </span>
          </div>

          <button
            type="button"
            onClick={increaseQuantity}
            className="
              flex
              h-9
              w-9
              md:h-10
              md:w-10
              items-center
              justify-center
              rounded-lg
              md:rounded-xl
              bg-[#16522d]
              text-white
              transition-all
              duration-200
              hover:bg-[#124325]
            "
          >
            <Plus size={16} className="md:h-[18px] md:w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}