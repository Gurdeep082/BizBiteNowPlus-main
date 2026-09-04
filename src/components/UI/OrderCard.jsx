import { motion } from "framer-motion";
import { Clock, MapPin, ChevronRight, Package } from "lucide-react";

export default function OrderCard({ order, onClick, onTrack, onView }) {
  if (!order) return null;

  // 🛡️ Safe ID Extraction
  const orderId = order._id
    ? String(order._id).slice(-6).toUpperCase()
    : order.id
    ? String(order.id).slice(-6).toUpperCase()
    : "N/A";

  // Safe Date Handling
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "Recently";

  const totalAmount = order.total_amount || 0;
  const status = order.delivery_status || "Unassigned";

  // Safe Address Extraction (Handles both String & Object)
  const deliveryAddress =
    typeof order.delivery_address === "object" && order.delivery_address !== null
      ? order.delivery_address.address_line || "Delivery Address"
      : order.delivery_address || "Pickup / Store Order";

  // Stepper Fallback Map
  const statusStepMap = {
    Unassigned: 1,
    Assigned: 2,
    "Out for Delivery": 3,
    Delivered: 4,
    "Ready for Pickup": 3,
  };

  const currentStep =
    order?.tracking?.currentStep ??
    order?.currentStep ??
    statusStepMap[status] ??
    1;

  const totalSteps = 4;

  const handleClick = () => {
    if (onClick) onClick(order);
    else if (onView) onView(order);
    else if (onTrack) onTrack(order);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-slate-500" />
          <span className="font-bold text-slate-900">Order #{orderId}</span>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === "Delivered"
              ? "bg-emerald-100 text-emerald-800"
              : status === "Out for Delivery"
              ? "bg-blue-100 text-blue-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Details Row */}
      <div className="my-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>{orderDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span className="line-clamp-1">{deliveryAddress}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Tracking Progress</span>
          <span>
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Footer Row */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
        <span className="font-bold text-slate-900">₹{totalAmount}</span>
        <div className="flex items-center text-xs font-semibold text-emerald-600">
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}