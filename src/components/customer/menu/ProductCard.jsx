import { Star, Clock3, Heart, Plus, Minus } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import PrimaryButton from "../common/PrimaryButton";
import SecondaryButton from "../common/SecondaryButton";

const ProductCard = ({
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
    category,
    price,
    originalPrice,
    rating,
    preparationTime,
    isVeg,
    bestseller,
    available,
  } = product;

  return (
    <Card
  padding="none"
  className="group overflow-hidden rounded-2xl w-full"
>
      {/* Image */}
      <div
        onClick={onClick}
        className="
          relative
          h-40
          cursor-pointer
          overflow-hidden
          rounded-t-2xl
          bg-slate-100
        "
      >
        <img
          src={image}
          alt={name || "Food Item"}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x400?text=Food+Image";
          }}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {/* Favourite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavourite?.();
          }}
          className="
            absolute
            right-3
            top-3
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            transition
            hover:scale-105
          "
        >
          <Heart
            size={22}
            fill={isFavourite ? "#ff0000" : "#ffffff"}
            stroke={isFavourite ? "#ff0000" : "#ffffff"}
            style={{
              transition: "fill .2s ease, stroke .2s ease",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))",
            }}
          />
        </button>

        {/* Bestseller */}
        {bestseller && (
          <Badge
            variant="premium"
            className="absolute left-3 top-3 text-[10px] px-2 py-1"
          >
            Bestseller
          </Badge>
        )}

        {/* Veg / Non Veg */}
        <div className="absolute bottom-3 left-3">
          <Badge
            icon={false}
            className="bg-white/90 text-slate-700 backdrop-blur text-[10px] px-2 py-1"
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-3 h-3 flex items-center justify-center rounded-[2px] border ${
                  isVeg ? "border-green-600" : "border-red-600"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isVeg ? "bg-green-600" : "bg-red-600"
                  }`}
                />
              </div>

              <span>{isVeg ? "Veg" : "Non Veg"}</span>
            </div>
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        {/* Category */}
        <Badge
          variant="info"
          icon={false}
          className="w-fit text-[10px] px-2 py-1"
        >
          {category}
        </Badge>

        {/* Name */}
        <h3
          onClick={onClick}
          className="
            cursor-pointer
            text-lg
            font-bold
            leading-6
            text-slate-900 dark:text-white
            transition-colors
            hover:text-[var(--primary)]
          "
        >
          {name}
        </h3>

        {/* Description */}
        <p
          className="
            line-clamp-2
            text-xs
            leading-5
            text-slate-500 dark:text-slate-400
          "
        >
          {description}
        </p>

        {/* Rating */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star size={14} fill="#FACC15" color="#FACC15" />

            <span className="font-semibold text-sm" style={{ color: "#FACC15" }}>
              {rating?.average ?? 0}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({rating?.count ?? 0})
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock3 size={13} />
            <span>{preparationTime}</span>
          </div>
        </div>

        {/* Price & Cart */}
        <div
          className="
            flex
            items-end
            justify-between
            gap-3
            border-t
            border-slate-100 dark:border-[#A9BDCF]/20
            pt-3
          "
        >
          {/* Price */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ₹{price}
              </span>

              {originalPrice && originalPrice > price && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          {available ? (
            quantity > 0 ? (
              <div className="flex items-center gap-2">
                <SecondaryButton
                  size="sm"
                  onClick={onDecrease}
                  className="!h-8 !w-8 !min-w-[32px] !rounded-lg !p-0"
                >
                  <Minus size={14} />
                </SecondaryButton>

                <span className="min-w-[18px] text-center text-base font-bold">
                  {quantity}
                </span>

                <PrimaryButton
                  size="sm"
                  onClick={onIncrease}
                  className="!h-8 !w-8 !min-w-[32px] !rounded-lg !p-0"
                >
                  <Plus size={14} />
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton
                icon={Plus}
                onClick={onAdd}
                className="!h-8 !px-3 !text-xs"
              >
                Add
              </PrimaryButton>
            )
          ) : (
            <Badge
              variant="danger"
              icon={false}
              className="text-[10px] px-2 py-1"
            >
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;