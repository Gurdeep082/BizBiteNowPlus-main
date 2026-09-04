import { Search, X, Mic } from "lucide-react";

const ProductSearch = ({
  value = "",
  placeholder = "Search food, drinks, desserts...",
  loading = false,
  showVoice = false,
  onChange,
  onClear,
  onVoice,
}) => {
  return (
    <div
      className="
        sticky
        top-[64px]
        z-20

        bg-white/90 dark:bg-[#1E2021]/90
        backdrop-blur-xl

        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-3

          rounded-2xl

          border
          border-slate-200 dark:border-white/10

          bg-white dark:bg-[#181A1B]

          px-4
          py-3

          shadow-sm

          transition-all
          duration-300

          hover:shadow-md
          focus-within:shadow-lg
        "
      >
        {/* Search */}

        <Search
          size={20}
          className="shrink-0 text-slate-400 dark:text-slate-500"
        />

        {/* Input */}

        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="
            flex-1

            bg-transparent

            text-[15px]
            text-slate-900 dark:text-white

            outline-none

            placeholder:text-slate-400 dark:placeholder:text-slate-500
          "
        />

        {/* Loading */}

        {loading && (
          <div
            className="
              h-5
              w-5

              animate-spin

              rounded-full

              border-2
              border-slate-300
              border-t-transparent
            "
            style={{
              borderTopColor: "var(--primary)",
            }}
          />
        )}

        {/* Clear */}

        {!!value && !loading && (
          <button
            onClick={onClear}
            className="
              flex
              h-9
              w-9

              items-center
              justify-center

              rounded-xl

              transition

              hover:bg-slate-100 dark:hover:bg-white/10
            "
          >
            <X
              size={18}
              className="text-slate-500 dark:text-slate-400"
            />
          </button>
        )}

        {/* Voice */}

        {showVoice && (
          <button
            onClick={onVoice}
            className="
              flex
              h-9
              w-9

              items-center
              justify-center

              rounded-xl

              transition

              hover:bg-slate-100 dark:hover:bg-white/10
            "
          >
            <Mic
              size={18}
              style={{
                color: "var(--primary)",
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;