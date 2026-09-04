import { Edit3, Trash2, Eye, Package } from "lucide-react";

export default function ProductCard({ product, onView, onEdit, onDelete }) {
  // 🟢🔴 Strict Normalization Check (DB sends food_type: 'non-veg' or is_veg: false)
  const foodType = String(
    product?.food_type || product?.foodType || ""
  ).toLowerCase();

  const isNonVeg =
    foodType === "non-veg" ||
    foodType === "egg" ||
    product?.is_veg === false ||
    product?.is_veg === "false" ||
    product?.isVeg === false ||
    product?.isVeg === "false";

  const isVeg = !isNonVeg;

  const displaySku = product?.sku || "N/A";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={product?.image || "/placeholder.jpg"}
          alt={product?.name || "Product"}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />

        {/* 🟢🔴 Veg / Non-Veg Indicator */}
        <div className="absolute left-4 top-4 flex items-center justify-center rounded-md bg-white/95 p-1.5 shadow backdrop-blur-sm">
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-xs border-2 ${
              isVeg ? "border-emerald-600" : "border-red-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isVeg ? "bg-emerald-600" : "bg-red-600"
              }`}
            />
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
          {product?.is_available !== false && product?.available !== false ? (
            <span className="text-emerald-600">Available</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 truncate max-w-[200px]">
              {product?.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {product?.category || "Uncategorized"}
            </p>
          </div>

          <Package className="text-slate-400 shrink-0" size={22} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <h2 className="text-2xl font-bold text-slate-900">
              ₹{product?.price ?? 0}
            </h2>
          </div>

          {/* SKU Display */}
          <div className="text-right">
            <p className="text-sm text-slate-500">SKU</p>
            <h3 className="font-bold text-slate-800 text-sm">
              {displaySku}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => onView && onView(product)}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-slate-700 transition hover:bg-slate-100 cursor-pointer"
          >
            <Eye size={18} className="mx-auto" />
          </button>

          <button
            type="button"
            onClick={() => onEdit && onEdit(product)}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-blue-600 transition hover:bg-blue-50 cursor-pointer"
          >
            <Edit3 size={18} className="mx-auto" />
          </button>

          <button
            type="button"
            onClick={() => onDelete && onDelete(product)}
            className="flex-1 rounded-xl border border-red-200 py-2.5 text-red-600 transition hover:bg-red-50 cursor-pointer"
          >
            <Trash2 size={18} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}