import { Link } from "react-router-dom";
import DashboardWidget from "../../DashboardWidget";
import EmptyState from "../../../UI/EmptyState";
import LowStockItem from "./LowStockItem";
import { lowStock } from "../../../../data/dashboardData";

const LowStock = () => {
  return (
    <DashboardWidget
      title="Low Stock Alerts"
      subtitle="Products requiring attention"
      action={
        <Link
          to="/seller/inventory"
          className="text-sm font-medium text-[#1A4D2E] hover:underline"
        >
          Manage Inventory
        </Link>
      }
    >
      {lowStock.length === 0 ? (
        <EmptyState
          title="Inventory is healthy"
          description="No products are running low on stock."
        />
      ) : (
        <div className="space-y-4">
          {lowStock.map((product) => (
            <LowStockItem
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </DashboardWidget>
  );
};

export default LowStock;