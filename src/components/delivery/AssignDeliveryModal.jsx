import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bike, Phone, PackageCheck, Loader2 } from "lucide-react";
import useOrderStore from "../../store/sellerOrderStore"; 

export default function AssignDeliveryModal({
  isOpen,
  onClose,
  order,
  deliveryBoys = [],
  onAssign,
}) {
  const [assigningId, setAssigningId] = useState(null);
  const { orders = [] } = useOrderStore(); 

  if (!isOpen || !order) return null;

  const rawDeliveryBoys = Array.isArray(deliveryBoys) ? deliveryBoys : [];

  const availableDeliveryBoys = rawDeliveryBoys.filter((boy) => {
    const boyId = String(boy._id || boy.id || "").trim();
    if (!boyId) return false;

    const hasActiveOrder = orders.some((ord) => {
      const assignedObj = ord.delivery_boy_id || ord.deliveryBoy || ord.delivery_boy;
      const assignedIdStr = String(
        typeof assignedObj === "object" && assignedObj !== null
          ? assignedObj._id || assignedObj.id || ""
          : assignedObj || ""
      ).trim();

      const ordStatus = String(ord.delivery_status || ord.status || "").trim().toLowerCase();

      return assignedIdStr === boyId && !["delivered", "completed", "cancelled"].includes(ordStatus);
    });
    return !hasActiveOrder;
  });

  const handleAssignClick = async (boy) => {
    const boyId = boy._id || boy.id;
    if (!onAssign || !boyId) return;

    try {
      setAssigningId(boyId);

      const phone =
        boy.phone ||
        boy.phone_number ||
        boy.phoneNumber ||
        boy.mobile ||
        boy.phoneNo ||
        "";

      await onAssign(boyId, phone, boy);
    } catch (error) {
      console.error("Failed to assign delivery partner:", error);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            type="button"
            className="absolute right-5 top-5 rounded-full p-2 hover:bg-slate-100 cursor-pointer text-slate-500 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="border-b p-6 pr-12">
            <h2 className="text-xl font-bold text-slate-800">
              Assign Delivery Partner
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Order #{order.orderId || order.order_id || String(order._id || "").slice(-6).toUpperCase()} &middot;{" "}
              {order.customer || order.customer_name || "Customer"}
            </p>
            {order.address && (
              <p className="mt-1 text-xs text-slate-400 leading-relaxed truncate">
                {order.address}
              </p>
            )}
          </div>

          {/* Delivery boys list */}
          <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6">
            {availableDeliveryBoys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <Bike size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-600">
                  No free delivery partners available
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  All active delivery partners are currently busy delivering orders. Once their order is marked as Delivered, they will reappear here.
                </p>
              </div>
            ) : (
              availableDeliveryBoys.map((boy) => {
                const boyId = boy._id || boy.id;
                const isAssigning = assigningId === boyId;

                const displayName =
                  boy.name ||
                  boy.fullName ||
                  boy.full_name ||
                  boy.user_name ||
                  boy.username ||
                  "Delivery Partner";

                const displayPhone =
                  boy.phone ||
                  boy.phone_number ||
                  boy.phoneNumber ||
                  boy.mobile ||
                  boy.phoneNo ||
                  "N/A";

                return (
                  <div
                    key={boyId}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16522d]/10 font-bold text-[#16522d]">
                        {displayName.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {displayName}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          {displayPhone !== "N/A" && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} /> {displayPhone}
                            </span>
                          )}

                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <PackageCheck size={12} />
                            Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignClick(boy)}
                      disabled={isAssigning}
                      className="flex items-center gap-2 rounded-xl bg-[#16522d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#124324] disabled:cursor-not-allowed disabled:opacity-60 shrink-0 cursor-pointer"
                    >
                      {isAssigning ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign"
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}