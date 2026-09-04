import { CheckCircle2, Clock, Truck, PackageX, IndianRupee } from "lucide-react";

// Matches the REAL order shape returned by getOrders / getCustomerOrders
// in order.controller.js — not the old dashboardData demo shape:
//
// {
//   _id, customer_name, customer_phone,
//   items: [{ product_id: { _id, name, price, imageUrl, image }, name, price, quantity }],
//   total_amount, order_type, payment_method, payment_status,
//   delivery_status: "Unassigned"|"Assigned"|"Ready for Pickup"|"Delivered",
//   delivery_boy_id: { name, phoneNumber, phone, vehicleNumber, is_available } | null,
//   mohalla, createdAt
// }

const STATUS_STYLES = {
  Unassigned: { icon: PackageX, badge: "bg-amber-100 text-amber-700" },
  Assigned: { icon: Truck, badge: "bg-indigo-100 text-indigo-700" },
  "Ready for Pickup": { icon: Clock, badge: "bg-blue-100 text-blue-700" },
  Delivered: { icon: CheckCircle2, badge: "bg-green-100 text-green-700" },
};

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const OrderItem = ({ order }) => {
  const status = order.delivery_status || "Unassigned";
  const { icon: StatusIcon, badge } = STATUS_STYLES[status] || STATUS_STYLES.Unassigned;

  const itemsCount = Array.isArray(order.items) ? order.items.length : 0;
  const itemsSummary = Array.isArray(order.items)
    ? order.items
        .slice(0, 2)
        .map((i) => i.name || i.product_id?.name || "Item")
        .join(", ") + (itemsCount > 2 ? ` +${itemsCount - 2} more` : "")
    : "";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 transition hover:border-slate-200">
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${badge}`}>
          <StatusIcon size={16} />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">
            {order.customer_name || "Customer"}
            <span className="ml-2 text-xs font-normal text-slate-400">
              #{order._id ? String(order._id).slice(-6).toUpperCase() : ""}
            </span>
          </p>
          <p className="text-xs text-slate-400">
            {itemsSummary || "No items"} · {formatTime(order.createdAt)}
          </p>
          {order.mohalla && (
            <p className="text-xs text-slate-400">{order.mohalla}</p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="flex items-center justify-end gap-0.5 text-sm font-semibold text-slate-900">
          <IndianRupee size={13} />
          {formatCurrency(order.total_amount).replace("₹", "")}
        </p>
        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default OrderItem;