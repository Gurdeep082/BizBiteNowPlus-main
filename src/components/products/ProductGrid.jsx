import ProductCard from "./ProductCard";
import ProductTable from "./ProductTable";

export default function ProductGrid({
  products,
  view,
  onView,
  onEdit,
  onDelete,
}) {
  // Empty State
  if (products.length === 0) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
        <h2 className="text-xl font-semibold text-slate-900">
          No Products Found
        </h2>

        <p className="mt-2 text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  // List View
  if (view === "list") {
    return (
      <ProductTable
        products={products}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  // Grid View
  return (
    <div
      className="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {products.map((product, index) => (
        <ProductCard
          key={product._id || product.id || index}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}