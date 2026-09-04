import { Search, SlidersHorizontal, Mic } from "lucide-react";

const SearchBar = ({
  value = "",
  placeholder = "Search your favourite food...",
  showVoice = false,
  onChange,
  onFilterClick,
  onVoiceClick,
}) => {
  return (
    <div className="relative w-full">
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

          focus-within:border-transparent
          focus-within:ring-2

          hover:shadow-md
        "
        style={{
          "--tw-ring-color": "var(--primary)",
        }}
      >
        {/* Search Icon */}

        <Search
          size={20}
          className="shrink-0 text-slate-400 dark:text-slate-500"
        />

        {/* Input */}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="
            flex-1

            bg-transparent

            text-[15px]

            text-slate-800 dark:text-slate-100

            outline-none

            placeholder:text-slate-400 dark:placeholder:text-slate-500
          "
        />

        {/* Voice */}

        {showVoice && (
          <button
            onClick={onVoiceClick}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              transition-all

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

        {/* Filter */}

        <button
          onClick={onFilterClick}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-xl

            transition-all

            hover:bg-slate-100
          "
        >
          <SlidersHorizontal
            size={18}
            style={{
              color: "var(--primary)",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;