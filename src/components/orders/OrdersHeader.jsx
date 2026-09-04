import { Plus, Download, RefreshCw } from "lucide-react";
import Button from "../UI/Button";

export default function OrdersHeader({
  totalOrders = 0,
  onRefresh,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}

      <div>

        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#16522d]">
          Order Management
        </span>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#16522d]">
          Orders
        </h1>

        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Track incoming orders, update their status,
          manage deliveries and monitor restaurant sales.
        </p>

        

      </div>
      

      {/* Right */}

      <div className="flex flex-wrap items-center gap-3">

        <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-3">

          <p className="text-xs text-slate-500">
            Total Orders
          </p>

          <h3 className="text-2xl font-black text-[#16522d]">
            {totalOrders}
          </h3>

        </div>

        <Button
          variant="outline"
          onClick={onRefresh}
        >
          <RefreshCw size={18} />

          Refresh

        </Button>

        <Button
          variant="outline"
          onClick={onExport}
        >
          <Download size={18} />

          Export

        </Button>

      </div>

    </div>
  );
}