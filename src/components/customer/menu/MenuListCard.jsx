import {
  Heart,
  Leaf,
  Star,
  Plus,
  Minus,
} from "lucide-react";

const MenuListCard = ({
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
    rating,
    price,
    originalPrice,
    isVeg,
  } = product;

  return (
    <div
      className="
        flex
        items-center
        gap-3

        rounded-2xl
        border
        border-slate-200 dark:border-white/10

        bg-white dark:bg-[#181A1B]

        p-2.5

        shadow-sm

        transition

        hover:shadow-md
      "
    >
{/* Image */}

<div
  className="
    relative
    h-20
    w-20
    flex-shrink-0
  "
>
  <div
    onClick={onClick}
    className="
      h-full
      w-full
      cursor-pointer
      overflow-hidden
      rounded-xl
      bg-slate-100 dark:bg-white/10
    "
  >
    <img
      src={
        image
      }
      alt={name}
      className="h-full w-full object-cover"
    />
  </div>

  {/* Favourite */}

  <button
    onClick={onFavourite}
    className="
      absolute
      -left-1
      -top-1
      flex
      h-7
      w-7
      items-center
      justify-center
      rounded-full
      bg-white/95 dark:bg-[#181A1B]/95
      shadow-md
      backdrop-blur-sm
      transition
      hover:scale-105
    "
  >
    <Heart
      size={15}
      fill={isFavourite ? "#EF4444" : "none"}
      stroke={isFavourite ? "#EF4444" : "#94A3B8"}
    />
  </button>
</div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        {/* Name + Veg + Favourite */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-2
          "
        >
          <h3
            onClick={onClick}
            className="
              line-clamp-2

              flex-1

              cursor-pointer

              text-sm
              font-semibold

              leading-5

              text-slate-900 dark:text-white
            "
          >
            {name}
          </h3>

          <div className="flex items-center gap-2">
<div
  className={`
    flex h-4 w-4 items-center justify-center
    rounded-[2px]
    border
    ${
      isVeg
        ? "border-[#008000]"
        : "border-[#D32F2F]"
    }
  `}
>
  <div
    className={`
      h-2 w-2 rounded-full
      ${
        isVeg
          ? "bg-[#008000]"
          : "bg-[#D32F2F]"
      }
    `}
  />
</div>

          </div>
        </div>

        {/* Rating */}

        <div
          className="
            mt-1

            flex
            items-center
            gap-1

            text-xs
          "
        >
          <Star
            size={13}
            fill="#FACC15"
            color="#FACC15"
          />

          <span className="font-medium">
            {rating?.average ?? 0}
          </span>

          <span className="text-slate-400 dark:text-slate-500">
            ({rating?.count ?? 0})
          </span>
        </div>
                {/* Price */}

        <div
          className="
            mt-2

            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              text-base
              font-bold
              text-slate-900 dark:text-white
            "
          >
            ₹{price}
          </span>

          {originalPrice > price && (
            <span
              className="
                text-xs
                text-slate-400 dark:text-slate-500
                line-through
              "
            >
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Right Actions */}

      <div
        className="
          flex
          h-full
          items-center
          justify-center
          pl-1
        "
      >
        {!product.available ? (
          <span
            className="
              rounded-lg
              bg-red-50 dark:bg-red-950/30

              px-3
              py-2

              text-xs
              font-semibold

              text-red-600 dark:text-red-400
            "
          >
            Out
          </span>
        ) : quantity > 0 ? (
          <div
            className="
              flex
              items-center
              gap-1

              rounded-xl

              border
              border-slate-200 dark:border-white/10

              bg-white dark:bg-[#181A1B]

              p-1
            "
          >
            <button
              onClick={onDecrease}
              className="
                flex
                h-7
                w-7

                items-center
                justify-center

                rounded-lg

                bg-slate-100 dark:bg-white/10

                transition

                hover:bg-slate-200 dark:hover:bg-white/15
              "
            >
              <Minus size={14} />
            </button>

            <span
              className="
                w-5

                text-center

                text-sm
                font-semibold
              "
            >
              {quantity}
            </span>

            <button
              onClick={onIncrease}
              className="
                flex
                h-7
                w-7

                items-center
                justify-center

                rounded-lg

                text-white

                transition
              "
              style={{
                background:
                  "var(--primary)",
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="
              h-9
              min-w-[72px]

              rounded-xl

              px-4

              text-xs
              font-semibold

              text-white

              transition

              hover:opacity-90
            "
            style={{
              background:
                "var(--primary)",
            }}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuListCard;