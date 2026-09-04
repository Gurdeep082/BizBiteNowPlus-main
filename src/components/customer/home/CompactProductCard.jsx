import { Heart, Plus, Minus, Star } from "lucide-react";

const CompactProductCard = ({
  product,
  quantity = 0,
  isFavourite = false,
  onFavourite,
  onAdd,
  onIncrease,
  onDecrease,
  onClick,
}) => {
  if (!product) return null;

  const {
    image,
    name,
    description,
    price,
    originalPrice,
    rating,
    isVeg,
    available,
  } = product;

  return (
    <div
      className="
    flex
    h-[290px]
    w-[170px]
    flex-shrink-0
    flex-col
    overflow-hidden
    rounded-[14px]
    border
    border-slate-200 dark:border-white/10
    bg-white dark:bg-[#181A1B]
    shadow-sm
    transition-all
    hover:shadow-md
  "
    >
      {/* Image */}

      <div
        className="relative max-h-35 min-h-35 cursor-pointer bg-slate-100 dark:bg-white/10"
        onClick={onClick}
      >
        <img
          src={image || "https://via.placeholder.com/400x300?text=Food"}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=Food";
          }}
        />

        {/* Favourite */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavourite?.();
          }}
          className="
            absolute
            right-0
            top-0
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-transparent
                      "
        >
          <Heart
            size={18}
            fill={isFavourite ? "#ff0000" : "#ffffff"}
            stroke={isFavourite ? "#ff0000" : "#ffffff"}
            style={{
              transition: "fill 0.2s ease, stroke 0.2s ease",
              filter: "drop-shadow(0 3px 6px rgb(0, 0, 0))",
            }}
          />
        </button>

        {/* Veg */}

        <div
          className="
            absolute
            left-2
            top-2
            rounded-[4px]
            bg-white/90
            px-0.5
            py-0.5
            backdrop-blur
          "
        >
          <div
            className={`w-3.5 h-3.5 flex items-center justify-center rounded-[2px] border ${
              isVeg ? "border-green-600" : "border-red-600"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isVeg ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="flex flex-1 flex-col p-3">
        <h3
          onClick={onClick}
          className="
      line-clamp-2
      min-h-[20px]
      cursor-pointer
      text-xs
      font-semibold
      text-slate-900 dark:text-white
    "
        >
          {name}
        </h3>

        {/* Description */}
        {description && name.length <= 28 && (
          <p
            className="
        mt-1
        h-8
        line-clamp-2
        text-[12px]
        leading-4
        text-slate-500 dark:text-slate-400
      "
          >
            {description}
          </p>
        )}

        {/* Rating */}

        <div className="mt-2 flex h-5 items-center gap-1 text-xs">
          <Star size={14} fill="#FACC15" color="#FACC15" />
          <span className="font-medium" style={{ color: "#FACC15" }}>{rating?.average ?? 0}</span>
          <span className="text-slate-400 dark:text-slate-500">({rating?.count ?? 0})</span>
        </div>

        {/* Bottom */}

        <div className="-mt-2 flex items-center justify-between pt-3">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">₹{price}</div>

            {originalPrice > price && (
              <div className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{originalPrice}
              </div>
            )}
          </div>

          {!available ? (
            <span className="text-xs font-semibold text-red-500">Out of stock</span>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/10"
              >
                <Minus size={14} />
              </button>

              <span className="w-4 text-center text-sm font-semibold">
                {quantity}
              </span>

              <button
                onClick={onIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{
                  background: "var(--primary)",
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
              style={{
                background: "var(--primary)",
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactProductCard;
