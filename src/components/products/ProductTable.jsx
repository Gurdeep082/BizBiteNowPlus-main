import { Eye, Edit3, Trash2 } from "lucide-react";

export default function ProductTable({
  products = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left table-fixed border-collapse">
        {/* Table Header - Exact Width Allocation to Fix Extra Gap */}
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50/50">
            <th className="w-[35%] px-6 py-4">Product</th>
            <th className="w-[20%] px-6 py-4">Category</th>
            <th className="w-[15%] px-6 py-4">Price</th>
            <th className="w-[15%] px-6 py-4">Status</th>
            <th className="w-[15%] px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-sm">
          {products.map((product) => {
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

            return (
              <tr
                key={product._id || product.id}
                className="transition hover:bg-slate-50/50"
              >
                {/* Product Name & Image */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                      <img
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {/* Veg/Non-Veg Badge */}
                      <span className="absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-xs bg-white/95 p-0.5 shadow-xs">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isVeg ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      {product.sku && (
                        <p className="text-xs text-slate-400 font-medium">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 font-medium text-slate-600 truncate">
                  {product.category}
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-bold text-slate-900">
                  ₹{product.price}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      product.is_available !== false && product.available !== false
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_available !== false && product.available !== false
                      ? "Available"
                      : "Out of Stock"}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView?.(product)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit?.(product)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(product)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}