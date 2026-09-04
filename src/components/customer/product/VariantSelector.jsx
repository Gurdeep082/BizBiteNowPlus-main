import { Check } from "lucide-react";

export default function VariantSelector({
  product,
  selectedVariant,
  setSelectedVariant,
}) {
  const variants = product?.variants ?? [];

  if (!variants.length) return null;

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
        Choose Option
      </h3>

      <div className="space-y-3">
        {variants.map((variant) => {
          const active =
            selectedVariant === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() =>
                setSelectedVariant(variant.id)
              }
              className={`
                flex
                w-full
                items-center
                justify-between
                rounded-2xl
                border
                p-4
                text-left
                transition-all
                duration-200
                ${
                  active
                    ? "border-[#16522d] bg-[#16522d]/5"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] hover:border-[#16522d]/40"
                }
              `}
            >
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {variant.name}
                </h4>

                <p className="mt-2 font-semibold text-[#16522d]">
                  ₹{variant.price}
                </p>
              </div>

              <div
                className={`
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  ${
                    active
                      ? "border-[#16522d] bg-[#16522d]"
                      : "border-gray-300 dark:border-slate-700"
                  }
                `}
              >
                {active && (
                  <Check
                    size={14}
                    className="text-white"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}