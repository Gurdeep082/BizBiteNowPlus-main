import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, User, Phone, ShoppingBag, FileText } from "lucide-react";
import useOrderStore from "../../../store/sellerOrderStore";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Safely fetch order without causing Infinite Re-render Loop
  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        if (typeof fetchOrderById === "function") {
          const res = await fetchOrderById(id);
          if (isMounted) setOrder(res);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id, fetchOrderById]);

  const handleStatusChange = async (newStatus) => {
    if (!id) return;
    try {
      if (typeof updateOrderStatus === "function") {
        await updateOrderStatus(id, newStatus);
      }
      setOrder((prev) => (prev ? { ...prev, status: newStatus, delivery_status: newStatus } : prev));
    } catch (err) {
      // Success + error toasts 
      console.error("Failed to update status:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Order not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const customerName = order.customer_name || order.customer?.name || "Guest";
  const customerPhone = order.customer_phone || order.customer?.phone || "N/A";
  const address =
    typeof order.delivery_address === "object"
      ? order.delivery_address?.address_line || order.delivery_address?.address
      : order.delivery_address || "N/A";

  const items = order.items || [];
  const status = order.delivery_status || order.status || "Pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-md border border-slate-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Assigned">Assigned</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Order Items */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={20} className="text-emerald-800" /> Order Items ({items.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => {
                // 🟢 Extracting special instructions from item object
                const instruction = item.instruction || item.special_instruction || item.note;
                const variantName = item.variant?.name;

                return (
                  <div key={idx} className="py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">
                          {item.name || item.title || item.product_id?.name || "Item"}
                          {variantName && (
                            <span className="ml-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-1.5 py-0.5">
                              {variantName}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity || item.qty || 1}</p>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">
                        ₹{(item.price || item.product_id?.price || 0) * (item.quantity || item.qty || 1)}
                      </p>
                    </div>

                    {/* 🟢 Render instructions if available */}
                    {instruction && (
                      <div className="flex items-start gap-1.5 bg-amber-50/60 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-900">
                        <FileText size={14} className="text-amber-600 shrink-0 mt-0.5" />
                        <span className="font-medium"><strong className="text-amber-800">Instruction:</strong> {instruction}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-base text-slate-900">
              <span>Total Amount</span>
              <span>₹{order.total_amount || order.amount || 0}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Customer Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Customer Details</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <User size={15} className="text-slate-400" />
                <span className="font-semibold text-slate-800">{customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" />
                <span>{customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}