import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";

export default function OrderRow({
  order,
  onAccept,
  onPreparing,
  onReady,
  onDelivery,
  onDelivered,
  onCancel,
}) {
  const navigate = useNavigate();

  const paymentColor =
    order.payment === "Online"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">

      {/* Order */}

      <td className="px-6 py-5">

        <div className="space-y-1">

          <h3 className="font-bold text-slate-900">
            #{order.orderId}
          </h3>

          <p className="text-xs text-slate-500">
            {order.date}
          </p>

        </div>

      </td>

      {/* Customer */}

      <td className="px-6 py-5">

        <div>

          <h4 className="font-semibold text-slate-900">
            {order.customer}
          </h4>

          <p className="text-xs text-slate-500">
            {order.phone}
          </p>

        </div>

      </td>

      {/* Items */}

      <td className="px-6 py-5">

        <span className="font-medium">
          {order.items} Items
        </span>

      </td>

      {/* Amount */}

      <td className="px-6 py-5">

        <span className="font-bold text-[#16522d]">
          ₹{order.amount.toLocaleString()}
        </span>

      </td>

      {/* Payment */}

      <td className="px-6 py-5">

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColor}`}
        >
          {order.payment}
        </span>

      </td>

      {/* Status */}

      <td className="px-6 py-5">

        <OrderStatusBadge
          status={order.status}
        />

      </td>

      {/* View */}

      <td className="px-6 py-5">

        <button
          onClick={() =>
            navigate(`/seller/orders/${order.id}`)
          }
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          <Eye
            size={18}
            className="text-[#16522d]"
          />
        </button>

      </td>

      {/* Actions */}

      <td className="px-6 py-5">

        <OrderActions
          order={order}
          onView={() =>
            navigate(`/seller/orders/${order.id}`)
          }
          onAccept={onAccept}
          onPreparing={onPreparing}
          onReady={onReady}
          onDelivery={onDelivery}
          onDelivered={onDelivered}
          onCancel={onCancel}
        />

      </td>

    </tr>
  );
}