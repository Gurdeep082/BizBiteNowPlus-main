import { SlidersHorizontal, Flame, BadgePercent, Star } from "lucide-react";

const ProductFilters = ({
  filters = {},
  onChange,
  onMoreFilters,
}) => {
  const toggleFilter = (key) => {
    onChange?.({
      ...filters,
      [key]: !filters[key],
    });
  };

  const FilterChip = ({
    label,
    active,
    icon: Icon,
    onClick,
  }) => (
    <button
      onClick={onClick}
      className={`
        flex
        shrink-0
        items-center
        gap-2

        rounded-full

        border

        px-4
        py-2.5

        text-sm
        font-medium

        transition-all
        duration-300

        ${
          active
            ? "text-white shadow-lg"
            : "border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A1B] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5"
        }
      `}
      style={{
        background: active ? "var(--primary)" : undefined,
        borderColor: active ? "var(--primary)" : undefined,
      }}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );

  return (
    <section className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">

      <FilterChip
        label="Bestseller"
        icon={Flame}
        active={filters.bestseller}
        onClick={() => toggleFilter("bestseller")}
      />

      <FilterChip
        label="Offers"
        icon={BadgePercent}
        active={filters.offers}
        onClick={() => toggleFilter("offers")}
      />


      <FilterChip
        label="Available"
        active={filters.available}
        onClick={() => toggleFilter("available")}
      />



    </section>
  );
};

export default ProductFilters;