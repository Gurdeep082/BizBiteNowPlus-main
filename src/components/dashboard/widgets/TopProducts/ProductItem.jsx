import Badge from "../../../UI/Badge";
import ProductProgress from "./ProductProgress";

const ProductItem = ({ product, rank }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-transparent p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-16 rounded-xl object-cover"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">
            {product.name}
          </h4>

          <span className="rounded-full bg-[#1A4D2E]/10 px-3 py-1 text-sm font-semibold text-[#1A4D2E]">
            #{rank}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>{product.sold} Sold</span>

          <span className="font-medium text-gray-700">
            ₹{product.revenue.toLocaleString()}
          </span>
        </div>

        <ProductProgress
          value={(product.sold / 200) * 100}
        />

        <div className="mt-3">
          <Badge status={product.stock} />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;