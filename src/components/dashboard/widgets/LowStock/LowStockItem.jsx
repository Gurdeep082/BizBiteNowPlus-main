import Badge from "../../../UI/Badge";
import Button from "../../../UI/Button";
import { STOCK_STATUS } from "./constants";

const LowStockItem = ({ product }) => {
  const status =
    product.stock <= 5
      ? STOCK_STATUS.critical
      : STOCK_STATUS.warning;

  return (
    <div className="rounded-2xl border border-gray-100 p-4 transition hover:border-[#1A4D2E]/20 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">
            {product.name}
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            Only <strong>{product.stock}</strong> units remaining
          </p>
        </div>

        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-2 flex-1 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-red-500"
            style={{
              width: `${Math.min((product.stock / 20) * 100, 100)}%`,
            }}
          />
        </div>

        <Button
          size="sm"
          className="ml-4"
        >
          Restock
        </Button>
      </div>
    </div>
  );
};

export default LowStockItem;