import {
  ArrowLeft,
  Heart,
  Star,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductHeader({
  product,
  favouriteProducts = [],
  onFavourite,
}) {
  const navigate = useNavigate();

  const isFavourite = favouriteProducts.some(
    (item) => item.id === product?.id
  );

  return (
    <div className="space-y-5">
      {/* Mobile Header */}

      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => navigate(-1)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-gray-200 dark:border-white/10
            bg-white dark:bg-[#181A1B]
            shadow-sm
            transition
            hover:bg-slate-100 dark:hover:bg-white/10
          "
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Product Details
        </h1>

        <button
          onClick={() => onFavourite?.(product)}
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            shadow-sm
            transition-all
            duration-200
            ${
              isFavourite
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] text-gray-500 dark:text-slate-400 hover:border-red-200 hover:text-red-500"
            }
          `}
        >
          <Heart
            size={20}
            className={isFavourite ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* Desktop Header */}

      <div className="hidden items-center justify-between lg:flex">
        <button
          onClick={() => navigate(-1)}
          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            p-3
            text-sm
            font-semibold
            text-gray-600 dark:text-slate-300
            transition
            hover:bg-slate-100 dark:hover:bg-white/10
            hover:text-[#16522d]
          "
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={() => onFavourite?.(product)}
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            shadow-sm
            transition-all
            duration-200
            ${
              isFavourite
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-gray-200 dark:border-white/10 bg-white dark:bg-[#181A1B] text-gray-500 dark:text-slate-400 hover:border-red-200 hover:text-red-500"
            }
          `}
        >
          <Heart
            size={20}
            className={isFavourite ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* Product Details */}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
              text-slate-900 dark:text-white
              lg:text-[38px]
            "
          >
            {product?.name}
          </h1>

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              text-sm
              text-gray-600 dark:text-slate-400
            "
          >
            {/* Rating */}

            <div className="flex items-center gap-1.5">
              <Star
                size={16}
                className="fill-[#ffc700] text-[#ffc700]"
              />

              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {product?.rating?.average ?? 0}
              </span>

              <span>
                ({product?.rating?.count ?? 0})
              </span>
            </div>

            <Circle
              size={5}
              className="fill-gray-400 text-gray-400 dark:fill-slate-600 dark:text-slate-600"
            />

            <span>{product?.category}</span>
          </div>
        </div>

        <span
          className={`
            shrink-0
            rounded-xl
            px-4
            py-2
            text-sm
            font-semibold
            ${
              product?.available
                ? "bg-green-50 dark:bg-green-900/30 text-[#16522d] dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }
          `}
        >
          {product?.available
            ? "Available"
            : "Unavailable"}
        </span>
      </div>
    </div>
  );
}