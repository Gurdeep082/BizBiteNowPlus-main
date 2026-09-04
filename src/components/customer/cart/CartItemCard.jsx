import { Trash2 } from "lucide-react";

import QuantitySelector from "./QuantitySelector";

const CartItemCard = ({ item, onIncrease, onDecrease, onRemove }) => {
const {
  name,
  price,
  quantity,
  line_total,
  image,
  product_id,
  variant,
  addons = [],
} = item;

const product = product_id || {};

const productImage =
  image ||
  product.image ||
  product.images?.[0] ||
  "/placeholder-food.png";

const total = line_total ?? price * quantity;

const originalPrice =
  product.originalPrice ?? price;

const restaurant =
  product.restaurant_name || "";

const description =
  product.description || "";

const veg =
  product.veg ?? true;

  return (
    <article className="flex gap-3 p-4 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/5">
      {/* Product Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
        <img
          src={productImage}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
{/* Veg / Non Veg */}
<div className="mb-1 flex items-center gap-2">
  <div
    className={`
      flex h-4 w-4 items-center justify-center
      border
      ${
        veg
          ? "border-green-600"
          : "border-red-600"
      }
    `}
  >
    <div
      className={`
        h-2 w-2 rounded-full
        ${
          veg
            ? "bg-green-600"
            : "bg-red-600"
        }
      `}
    />
  </div>

  <span
    className={`
      text-[11px]
      font-medium
      ${
        veg
          ? "text-green-700"
          : "text-red-600"
      }
    `}
  >
    {veg ? "Veg" : "Non-Veg"}
  </span>
</div>

            {/* Name */}
            <h3 className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
              {name}
            </h3>

            {/* Restaurant */}
            {restaurant && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{restaurant}</p>
            )}

            {/* Description */}
            {description && (
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={onRemove}
            className="
              rounded-lg
              p-1.5
              text-slate-400 dark:text-slate-500
              transition
              hover:bg-red-50 dark:hover:bg-red-950/20
              hover:text-red-500
            "
          >
            <Trash2 size={30} />
          </button>
        </div>

        {/* Bottom */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantitySelector
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

          <div className="text-right">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ₹{total}
            </span>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              ₹{price} × {quantity}
            </p>

            {originalPrice > price && (
              <p className="text-[10px] font-medium text-green-600">
                Save ₹{(originalPrice - price) * quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItemCard;
