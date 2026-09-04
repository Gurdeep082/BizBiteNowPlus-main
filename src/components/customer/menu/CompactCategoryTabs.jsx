const EMOJI_BY_CATEGORY = {
  burgers: "🍔",
  pizza: "🍕",
  starters: "🥟",
  drinks: "🥤",
  beverages: "🥤",
  dessert: "🍰",
  desserts: "🍰",
  biryani: "🍛",
  rice: "🍚",
  noodles: "🍜",
  salad: "🥗",
  sandwich: "🥪",
  chinese: "🥡",
};

const toEmoji = (name = "") => EMOJI_BY_CATEGORY[String(name).toLowerCase()] || "🍽️";

const normalizeCategories = (categories = []) => {
  const cleanList = categories.filter(
    (cat) => String(typeof cat === "object" ? cat.name || cat.id : cat).toLowerCase() !== "all"
  );

  const normalized = cleanList.map((item, index) => {
    if (typeof item === "string") {
      return { id: item, name: item, icon: toEmoji(item) };
    }
    return {
      id: item.id || item.name || `cat-${index}`,
      name: item.name || "Category",
      icon: toEmoji(item.name),
      ...item,
    };
  });

  return [{ id: "all", name: "All", icon: "🍽️" }, ...normalized];
};

const CompactCategoryTabs = ({
  categories = [],
  activeCategory,
  onChange,
}) => {
  const normalizedCategories = normalizeCategories(categories);

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide lg:hidden">
      {normalizedCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.id)}
          className={`whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition ${
            activeCategory === category.id
              ? "text-white"
              : "bg-white dark:bg-[#181A1B] text-slate-700 dark:text-slate-300"
          }`}
          style={
            activeCategory === category.id
              ? { background: "var(--primary)" }
              : undefined
          }
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
};

export default CompactCategoryTabs;