import { ShoppingCart, ArrowRight } from "lucide-react";

const EmptyCart = ({
  onContinueShopping,
}) => {
  return (
    <section className="flex min-h-[500px] items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-[#181A1B] p-8 shadow-sm">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-50">
          <ShoppingCart
            size={56}
            className="text-green-600"
          />
        </div>

        <h2 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">
          Your cart is empty
        </h2>

        <p className="mt-3 text-gray-500 dark:text-slate-400">
          Looks like you haven't added anything yet.
          Discover delicious dishes and add your
          favourites to get started.
        </p>

        <button
          type="button"
          onClick={onContinueShopping}
          className="
            group
            mt-8
            inline-flex
            h-12
            items-center
            gap-2
            rounded-xl
            bg-green-600
            px-6
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-green-700
            hover:shadow-lg
            active:scale-[0.98]
          "
        >
          Continue Shopping

          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
};

export default EmptyCart;