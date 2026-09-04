const CategoryTabs = ({
  categories = [],
  activeCategory = "",
  onChange,
}) => {
  return (
    <div
      className="
        sticky
        top-20
        z-30
        px-4
        py-3
        lg:px-6
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
          overflow-x-auto
          rounded-3xl
          border
          border-slate-200
          dark:border-[#A9BDCF]/40
          bg-white/90
          dark:bg-[#181A1B]
          backdrop-blur-xl
          px-4
          py-3
          shadow-lg
          scrollbar-hide
        "
      >
        {categories.map((category) => {
          const active = category.id === activeCategory;

          return (
            <button
              key={category.id}
              onClick={() => onChange?.(category.id)}
              className={`
                flex
                items-center
                gap-2
                whitespace-nowrap
                rounded-2xl
                px-5
                py-3
                text-sm
                font-semibold
                transition-all

                ${
                  active
                    ? "text-white shadow-md"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-[#232627] dark:text-white"
                }
              `}
              style={{
                background: active
                  ? "var(--primary)"
                  : undefined,
              }}
            >
              <span>{category.icon}</span>

              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;