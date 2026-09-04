import {
  ClipboardList,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
} from "lucide-react";

const columns = [
  {
    title: "Pending",
    color: "bg-amber-50 border-amber-200",
    icon: ClipboardList,
  },
  {
    title: "Preparing",
    color: "bg-orange-50 border-orange-200",
    icon: ChefHat,
  },
  {
    title: "Ready",
    color: "bg-violet-50 border-violet-200",
    icon: PackageCheck,
  },
  {
    title: "Out for Delivery",
    color: "bg-sky-50 border-sky-200",
    icon: Bike,
  },
  {
    title: "Delivered",
    color: "bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
];

export default function OrderBoard({
  orders = [],
  onSelect,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-5">

      {columns.map((column) => {
        const Icon = column.icon;

        const data = orders.filter(
          (order) => order.status === column.title
        );

        return (
          <div
            key={column.title}
            className={`rounded-2xl border ${column.color}`}
          >
            <div className="flex items-center justify-between border-b bg-white px-4 py-3">

              <div className="flex items-center gap-2">

                <Icon
                  size={18}
                  className="text-[#16522d]"
                />

                <h3 className="font-semibold">
                  {column.title}
                </h3>

              </div>

              <span className="rounded-full bg-[#16522d]/10 px-2 py-1 text-xs font-bold text-[#16522d]">
                {data.length}
              </span>

            </div>

            <div className="space-y-3 p-4">

              {data.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-sm text-slate-400">
                  No Orders
                </div>
              )}

              {data.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelect?.(order)}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">

                    <p className="font-semibold">
                      {order.orderId}
                    </p>

                    <span className="text-xs text-slate-500">
                      {order.items.length} Items
                    </span>

                  </div>

                  <p className="mt-2 text-sm font-medium">
                    {order.customer}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {order.phone}
                  </p>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs">
                      {order.payment}
                    </span>

                    <span className="font-bold text-[#16522d]">
                      ₹{order.amount}
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </div>
        );
      })}

    </div>
  );
}