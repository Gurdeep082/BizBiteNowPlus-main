import { Check, Plus } from "lucide-react";

export default function AddonSelector({
  product,
  selectedAddons,
  setSelectedAddons,
}) {
  const addons = product?.addons ?? [];

const toggleAddon = (addon) => {
  const exists = selectedAddons.some(
    (item) => item.id === addon.id
  );

  if (exists) {
    setSelectedAddons(
      selectedAddons.filter((item) => item.id !== addon.id)
    );
  } else {
    setSelectedAddons([...selectedAddons, addon]);
  }
};

  return (
    <>
    {addons.length > 0 && (
    <section className="space-y-4" >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Add Extras
        </h3>

        <span className="text-sm text-gray-500 dark:text-slate-400">
          Optional
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {addons.map((addon) => {
          const active = selectedAddons.some(
  (item) => item.id === addon.id
);

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => toggleAddon(addon)}
              className={`
                group
                relative
                flex
                items-center
                justify-between
                rounded-xl
                border
                p-4
                text-left
                transition-all
                duration-200
                ${
                  active
                    ? "border-[#16522d] bg-[#16522d]/5 shadow-sm"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] hover:border-[#16522d]/40 hover:shadow-sm"
                }
              `}
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {addon.name}
                </h4>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {addon.description}
                </p>

                <p className="mt-3 font-bold text-[#16522d]">
                  + ₹{addon.price}
                </p>
              </div>

              <div
                className={`
                  ml-4
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  transition-all
                  ${
                    active
                      ? "border-[#16522d] bg-[#16522d]"
                      : "border-gray-300 dark:border-slate-700"
                  }
                `}
              >
                {active ? (
                  <Check
                    size={18}
                    className="text-white"
                  />
                ) : (
                  <Plus
                    size={18}
                    className="text-gray-500 dark:text-slate-400"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-[#16522d]/30 bg-[#16522d]/5 p-4">
        <p className="text-sm leading-6 text-gray-600 dark:text-slate-400">
          Selected Extras:
          <span className="ml-2 font-semibold text-[#16522d]">
            {selectedAddons.length}
          </span>
        </p>
      </div>
    </section>
    )}
    </>
  );
}