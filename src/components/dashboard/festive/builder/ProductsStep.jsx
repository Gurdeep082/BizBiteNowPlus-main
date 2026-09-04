import { Plus, Search, Package, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsStep({
  data = [],
  products = [],
  onChange,
}) {
  const [search, setSearch] = useState("");

  const selectedProducts = data;

  const getId = (item) => item?.product_id || item?._id || item?.id;

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const addProduct = (product) => {
    const productId = getId(product);
    if (selectedProducts.some((item) => getId(item) === productId)) return;

    onChange?.([
      ...selectedProducts,
      {
        ...product,
        product_id: productId,
        _id: productId,
        offer_price: product.price || 0,
        variants: Array.isArray(product.variants)
          ? product.variants.map((v) => ({
            variant_name: v.name || v.variant_name,
            offer_price: v.price || 0,
          }))
          : [],
      },
    ]);
  };

  const removeProduct = (targetId) => {
    onChange?.(selectedProducts.filter((item) => getId(item) !== targetId));
  };

  const updateMainPrice = (targetId, value) => {
    onChange?.(
      selectedProducts.map((item) =>
        getId(item) === targetId ? { ...item, offer_price: value } : item
      )
    );
  };

  const updateVariantPrice = (targetId, variantName, value) => {
    onChange?.(
      selectedProducts.map((item) => {
        if (getId(item) === targetId) {
          return {
            ...item,
            variants: item.variants.map((v) =>
              v.variant_name === variantName ? { ...v, offer_price: value } : v
            ),
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Add Products</h2>
        <p className="mt-1 text-sm text-slate-500">
          Select products for this festive menu.
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-transparent pl-11 pr-4 outline-none focus:border-[#1A4D2E]"
        />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Available Products
        </h3>

        {filteredProducts.length === 0 && (
          <div className="rounded-xl border border-dashed py-10 text-center text-slate-500">
            No products available.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, idx) => {
            const pId = getId(product) || `avail-prod-${idx}`;
            const isAlreadyAdded = selectedProducts.some(
              (item) => getId(item) === pId
            );

            return (
              <div
                key={pId}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {product.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {product.category}
                    </p>
                  </div>
                  <Package size={20} className="text-[#1A4D2E]" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    ₹{product.price}
                  </span>

                  <button
                    disabled={isAlreadyAdded}
                    onClick={() => addProduct(product)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition cursor-pointer ${isAlreadyAdded
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-[#1A4D2E] hover:bg-[#245a37]"
                      }`}
                  >
                    <Plus size={16} />
                    {isAlreadyAdded ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-800">
          Selected Products
        </h3>

        {selectedProducts.length === 0 && (
          <div className="rounded-xl border border-dashed py-10 text-center text-slate-500">
            No products selected.
          </div>
        )}

        <div className="space-y-4">
          {selectedProducts.map((item, idx) => {
            const itemId = getId(item) || `sel-prod-${idx}`;
            const hasVariants = item.variants && item.variants.length > 0;

            const matchedProduct = products.find((p) => (p._id || p.id) === itemId) || {};
            const displayName = item.name || matchedProduct.name || "Loading Product...";
            const displayCategory = item.category || matchedProduct.category || "";

            return (
              <div
                key={itemId}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {displayName}
                    </h4>
                    <p className="text-sm text-slate-500">{displayCategory}</p>
                  </div>
                  <button
                    onClick={() => removeProduct(itemId)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {!hasVariants ? (
                  <div className="w-full sm:w-1/2 lg:w-1/3">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Offer Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.offer_price ?? ""}
                      onChange={(e) =>
                        updateMainPrice(itemId, Number(e.target.value))
                      }
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-[#1A4D2E]"
                    />
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {item.variants.map((variant, vIdx) => (
                      <div key={vIdx}>
                        <label className="mb-1 block text-xs font-medium text-slate-600 truncate">
                          {variant.variant_name} Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={variant.offer_price ?? ""}
                          onChange={(e) =>
                            updateVariantPrice(
                              itemId,
                              variant.variant_name,
                              Number(e.target.value)
                            )
                          }
                          className="h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-[#1A4D2E]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}