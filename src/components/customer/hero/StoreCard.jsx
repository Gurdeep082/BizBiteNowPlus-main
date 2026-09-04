import {
  Clock3,
  MapPin,
  Phone,
  Heart,
  Share2,
  Navigation,
  CalendarDays,
} from "lucide-react";

const StoreCard = ({
  address = "",
  phone = "",
  distance = "2.4 km",
  deliveryTime = "20-25 min",
  isOpen = true,
  onCall,
  onDirections,
  onShare,
  onFavorite,
  onBookTable,
}) => {
  return (
    <div
      className="
        -mt-7
        relative
        w-full
        rounded-[14px]

        border
        border-slate-200 dark:border-white/10

        bg-white dark:bg-[#181A1B]

        p-5

        shadow-lg
      "
    >
      {/* Store Details */}

      <div className="flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-[10px] bg-slate-100 dark:bg-white/10 px-4 py-2">
          <Clock3
            size={16}
            style={{ color: "var(--primary)" }}
          />

          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {deliveryTime}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-[10px] bg-slate-100 dark:bg-white/10 px-4 py-2">
          <MapPin
            size={16}
            style={{ color: "var(--primary)" }}
          />

          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {distance}
          </span>
        </div>

        <div
          className="rounded-[10px] px-4 py-2 text-sm font-semibold text-white"
          style={{
            background: isOpen
              ? "var(--primary)"
              : "#EF4444",
          }}
        >
          {isOpen ? "Open Now" : "Closed"}
        </div>

      </div>

      {/* Address */}

      <div className="mt-5">

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Restaurant Address
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {address}
        </p>

      </div>

      {/* Actions */}

      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">

        <button
          onClick={onCall}
          className="
            flex
            flex-col
            items-center
            justify-center

            gap-2

            rounded-[14px]

            bg-slate-100 dark:bg-white/10

            py-4

            transition-all

            hover:bg-slate-200 dark:hover:bg-white/20
          "
        >
          <Phone
            size={20}
            style={{ color: "var(--primary)" }}
          />

          <span className="text-xs font-medium">
            Call
          </span>
        </button>

        <button
          onClick={onDirections}
          className="
            flex
            flex-col
            items-center
            justify-center

            gap-2

            rounded-[14px]

            bg-slate-100 dark:bg-white/10

            py-4

            transition-all

            hover:bg-slate-200 dark:hover:bg-white/20
          "
        >
          <Navigation
            size={20}
            style={{ color: "var(--primary)" }}
          />

          <span className="text-xs font-medium">
            Directions
          </span>
        </button>





        <button
          onClick={onShare}
          className="
            flex
            flex-col
            items-center
            justify-center

            gap-2

            rounded-[14px]

            bg-slate-100 dark:bg-white/10

            py-4

            transition-all

            hover:bg-slate-200 dark:hover:bg-white/20
          "
        >
          <Share2
            size={20}
            style={{ color: "var(--primary)" }}
          />

          <span className="text-xs font-medium">
            Share
          </span>
        </button>



      </div>
    </div>
  );
};

export default StoreCard;