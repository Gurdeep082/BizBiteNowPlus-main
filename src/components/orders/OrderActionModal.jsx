import {
  X,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  Trash2,
} from "lucide-react";

export default function OrderActionModal({
  open,
  order,
  onClose,
  acceptOrder,
  markReady,
  onAssign,
  markDelivered,
  cancelOrder,
  onDelete,
}) {
  if (!open || !order) return null;

  const actionClass =
    "flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium transition hover:shadow-md cursor-pointer";

  const currentStatus = String(order.status || "Unassigned").trim().toUpperCase();

  const handleActionClick = async (actionFunction) => {
    if (!actionFunction) return;
    try {
      await actionFunction(order.id);
      onClose();
    } catch (err) {
      console.error("Action handler error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="border-b p-8">
          <h2 className="text-2xl font-bold text-slate-800">Order Actions</h2>
          <p className="mt-1 text-slate-500">Order Token Ref: {order.orderId}</p>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {/* Customer Details */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-slate-800">Customer Details</h3>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400" />
                <span className="font-semibold text-slate-700">{order.customer}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-400" />
                <span className="text-slate-600">{order.phone}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-slate-400" />
                <span className="text-slate-600 leading-relaxed">{order.address}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Grand Subtotal</span>
                  <span className="font-black text-xl text-[#16522d]">₹{order.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-slate-800">Quick Actions</h3>

            <div className="space-y-3">
              {/* Accept / Reject */}
              {(currentStatus === "PENDING" || currentStatus === "UNASSIGNED") && (
                <>
                  <button
                    onClick={() => handleActionClick(acceptOrder)}
                    className={`${actionClass} hover:border-green-200 hover:bg-green-50 text-green-700 font-bold`}
                  >
                    <CheckCircle2 size={20} className="text-green-600" />
                    <span>Accept Order</span>
                  </button>

                  <button
                    onClick={() => handleActionClick(cancelOrder)}
                    className={`${actionClass} hover:border-red-200 hover:bg-red-50 text-red-600`}
                  >
                    <XCircle size={20} className="text-red-600" />
                    <span>Reject Order</span>
                  </button>
                </>
              )}

              {/* Preparing -> Ready */}
              {currentStatus === "PREPARING" && (
                <button
                  onClick={() => handleActionClick(markReady)}
                  className={`${actionClass} hover:border-orange-200 hover:bg-orange-50 text-orange-700 font-bold`}
                >
                  <ChefHat size={20} className="text-orange-600" />
                  <span>Mark Ready (Food Done)</span>
                </button>
              )}

              {/* Ready -> Assign delivery */}
              {currentStatus === "READY" && (
                <button
                  onClick={() => {
                    if (onAssign) onAssign(order);
                    onClose();
                  }}
                  className={`${actionClass} hover:border-sky-200 hover:bg-sky-50 text-sky-700 font-bold`}
                >
                  <Bike size={20} className="text-sky-600" />
                  <span>Assign Delivery Partner</span>
                </button>
              )}

              {/* Out for delivery -> Delivered */}
              {currentStatus === "OUT FOR DELIVERY" && (
                <button
                  onClick={() => handleActionClick(markDelivered)}
                  className={`${actionClass} hover:border-green-200 hover:bg-green-50 text-green-700 font-bold`}
                >
                  <PackageCheck size={20} className="text-green-600" />
                  <span>Mark Delivered</span>
                </button>
              )}

              {/* Delivered — closed, but still deletable (e.g. clean up test/duplicate logs) */}
              {currentStatus === "DELIVERED" && (
                <>
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                    <CheckCircle2 size={32} className="mx-auto mb-3 text-green-600" />
                    <p className="font-semibold text-green-700">Order successfully fulfilled and closed.</p>
                  </div>

                  {onDelete && (
                    <button
                      onClick={() => handleActionClick(onDelete)}
                      className={`${actionClass} hover:border-red-200 hover:bg-red-50 text-red-500`}
                    >
                      <Trash2 size={18} className="text-red-500" />
                      <span>Delete Order</span>
                    </button>
                  )}
                </>
              )}

              {/* Cancelled — closed, but still deletable */}
              {currentStatus === "CANCELLED" && (
                <>
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                    <XCircle size={32} className="mx-auto mb-3 text-red-600" />
                    <p className="font-semibold text-red-700">This order was cancelled.</p>
                  </div>

                  {onDelete && (
                    <button
                      onClick={() => handleActionClick(onDelete)}
                      className={`${actionClass} hover:border-red-200 hover:bg-red-50 text-red-500`}
                    >
                      <Trash2 size={18} className="text-red-500" />
                      <span>Delete Order</span>
                    </button>
                  )}
                </>
              )}

              {/* Universal cancel while in-progress (Preparing / Ready / Out for Delivery) */}
              {currentStatus !== "DELIVERED" &&
                currentStatus !== "CANCELLED" &&
                currentStatus !== "PENDING" &&
                currentStatus !== "UNASSIGNED" && (
                  <button
                    onClick={() => handleActionClick(cancelOrder)}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                  >
                    Cancel Active Order
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}