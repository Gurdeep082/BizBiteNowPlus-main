import { useState } from "react";
import { MoreVertical, PackageOpen, CheckCircle, Bike } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActionModal from "./OrderActionModal";
import { useNavigate } from "react-router-dom";

export default function OrdersTable({
  orders,
  deliveryBoys = [],
  activeTab = "new",
  selectedOrders = [],
  toggleOrder = () => {},
  toggleAll = () => {},
  onAccept,
  onPreparing,
  onReady,
  onDelivery,
  onDelivered,
  onCancel,
  onAssign,
  onDelete,
}) {
  const navigate = useNavigate();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder =
    orders.find(
      (item) => item.id === selectedOrderId || item._id === selectedOrderId
    ) || null;

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16522d]/10">
          <PackageOpen size={30} className="text-[#16522d]" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800">
          {activeTab === "new" ? "No New Orders" : "No Completed Orders"}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {activeTab === "new"
            ? "New orders will appear here once customers place them."
            : "Delivered orders will appear here."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-12 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={
                      orders.length > 0 &&
                      selectedOrders.length === orders.length
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Order
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Items
                </th>
                <th className="px-5 py-4 text-left text-sm font-semibold">
                  Payment
                </th>
                <th className="px-5 py-4 text-right text-sm font-semibold">
                  Amount
                </th>
                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 text-center text-sm font-semibold">
                  Quick Action
                </th>
                <th className="px-5 py-4 text-right text-sm font-semibold">
                  More
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const statusLower = String(order.status || "").toLowerCase();
                const isAssigned =
                  statusLower === "assigned" ||
                  statusLower === "out for delivery" ||
                  order.isAssigned ||
                  Boolean(order.deliveryBoyId);

                return (
                  <tr
                    key={order.id || order._id}
                    onClick={() =>
                      navigate(`/seller/orders/${order.id || order._id}`)
                    }
                    className="border-t transition cursor-pointer hover:bg-slate-50"
                  >
                    <td
                      className="px-5 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(
                          order.id || order._id
                        )}
                        onChange={() => toggleOrder(order.id || order._id)}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {order.orderId}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          timeStyle: "short",
                          dateStyle: "short",
                        })}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16522d]/10 font-bold text-[#16522d]">
                          {order.customer ? order.customer.charAt(0) : "G"}
                        </div>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-xs text-slate-500">
                            {order.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center font-semibold">
                      {order.items?.length || 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                            order.payment === "COD"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.payment}
                        </span>
                        <p className="text-xs text-slate-500">
                          {order.paymentStatus}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right font-bold">
                      ₹{order.amount}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* 🎯 DIRECT QUICK ACTION BUTTON COLUMN */}
                    <td
                      className="px-5 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusLower === "pending" && (
                        <button
                          onClick={() => onAccept && onAccept(order)}
                          className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-900 transition shadow-xs"
                        >
                          Accept
                        </button>
                      )}

                      {statusLower === "preparing" && (
                        <button
                          onClick={() => onReady && onReady(order)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
                        >
                          Mark Ready
                        </button>
                      )}

                      {(statusLower === "ready" || statusLower === "unassigned") &&
                        !isAssigned && (
                          <button
                            onClick={() => onAssign && onAssign(order)}
                            className="flex items-center justify-center gap-1 mx-auto rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition shadow-xs"
                          >
                            <Bike size={14} />
                            <span>Assign</span>
                          </button>
                        )}

                      {/* 🚀 ASSIGNED / OUT FOR DELIVERY -> MARK DELIVERED BUTTON */}
                      {(isAssigned ||
                        statusLower === "assigned" ||
                        statusLower === "out for delivery") &&
                        statusLower !== "delivered" &&
                        statusLower !== "cancelled" && (
                          <button
                            onClick={() => onDelivered && onDelivered(order)}
                            className="flex items-center justify-center gap-1 mx-auto rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-xs"
                          >
                            <CheckCircle size={14} />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                      {statusLower === "delivered" && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                          Completed
                        </span>
                      )}

                      {statusLower === "cancelled" && (
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                          Cancelled
                        </span>
                      )}
                    </td>

                    <td
                      className="px-5 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(order.id || order._id);
                          setActionModalOpen(true);
                        }}
                        className="rounded-lg p-2 transition hover:bg-slate-100 text-slate-500"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <OrderActionModal
        open={actionModalOpen}
        order={selectedOrder}
        deliveryBoys={deliveryBoys}
        onClose={() => {
          setActionModalOpen(false);
          setSelectedOrderId(null);
        }}
        acceptOrder={onAccept}
        markPreparing={onPreparing}
        markReady={onReady}
        onAssign={onAssign}
        markDelivery={onDelivery}
        markDelivered={onDelivered}
        cancelOrder={onCancel}
        onDelete={onDelete}
      />
    </>
  );
}