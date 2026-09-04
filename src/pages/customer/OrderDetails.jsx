import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Headphones, Share2, FileText,
  CheckCircle2, MapPin, Utensils, Truck,
} from "lucide-react";

import useOrderStore from "../../api/stores/customerstore/customerOrderStore";
import OrderDetailsSkeleton from "../../components/customer/orders/OrderDetailsSkeleton";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchOrderById = useOrderStore((s) => s.fetchOrderById);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const rawOrder = await fetchOrderById(id);
        if (isMounted) setOrder(rawOrder);
      } catch (err) {
        console.error("Failed to load order details:", err);
        if (isMounted) setError(err?.response?.data?.message || err?.message || "Order not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrder();
    return () => { isMounted = false; };
  }, [id, fetchOrderById]);

  if (loading) return <OrderDetailsSkeleton />;

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xs w-full max-w-md">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Order Not Found</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {error || "The requested order details are unavailable."}
          </p>
          <button
            onClick={() => navigate("/customer/orders")}
            className="mt-6 rounded-xl bg-emerald-800 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-900 cursor-pointer"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderId = `#BBN${String(order._id).slice(-6).toUpperCase()}`;
  const totalAmount = order.total_amount || 0;

  const rawDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const dateFormatted = rawDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeFormatted = rawDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const statusStr = order.delivery_status || order.status || "Unassigned";


  // 🟢 Extract instruction alongside items
  const itemsList = (order.items || []).map((item, idx) => ({
    id: item._id || idx,
    name: item.name || item.product_id?.name || "Item",
    price: item.price || item.product_id?.price || 0,
    quantity: item.quantity || 1,
    image: item.product_id?.image || item.product_id?.imageUrl,
    instruction: item.instruction || item.special_instruction || item.note || "",
  }));

  // 🟢 5-Steps Status Mapping
  const statusStepMap = {
    unassigned: 1,
    placed: 1,
    pending: 1,
    new: 1,
    preparing: 2,
    ready: 3,
    "ready for pickup": 3,
    assigned: 4,
    "out for delivery": 4,
    delivered: 5,
    completed: 5,
    cancelled: 0,
  };
  
  const currentStep = statusStepMap[String(statusStr).toLowerCase()] ?? 1;

  const steps = [
    { id: 1, label: "Placed", icon: FileText },
    { id: 2, label: "Preparing", icon: Utensils },
    { id: 3, label: "Ready", icon: MapPin },
    { id: 4, label: "Assigned", icon: Truck },
    { id: 5, label: "Delivered", icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-full overflow-x-hidden min-h-screen px-3 sm:px-6 lg:px-10 py-4 sm:py-6 box-border bg-slate-100 dark:bg-[#1E2021] text-slate-800 dark:text-slate-100"
    >
      <div className="w-full max-w-[1780px] mx-auto space-y-4 sm:space-y-6 pb-24">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition shrink-0 cursor-pointer text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1
                className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white"
              >
                Order Details
              </h1>

              <p
                className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400"
              >
                Track your order in real time
              </p>
            </div>
          </div>


          <div className="flex items-center gap-2">
            {["Need Help?", "Share"].map((text, i) => (
              <button
                key={text}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
              >
                {i === 0 ? <Headphones size={15} /> : <Share2 size={15} />}
                <span>{text}</span>
              </button>
            ))}
          </div>
        </div>


        <div
          className="rounded-2xl p-4 sm:p-6 shadow-2xs space-y-6 w-full bg-white dark:bg-[#181A1B] border border-slate-200 dark:border-white/10"
        >

          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10"
          >
            <div className="space-y-0.5">
              <p
                className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                Order ID: {orderId}
              </p>

              <p
                className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400"
              >
                {dateFormatted} • {timeFormatted} • {itemsList.length} Items • ₹{totalAmount}
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0">

              <span
                className="inline-block rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                  color: "var(--primary-color)",
                }}
              >
                {statusStr}
              </span>

            </div>
          </div>


          {String(statusStr).toLowerCase() !== "cancelled" && (
            <div className="relative px-1 py-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center justify-between relative z-10 min-w-[340px]">

                {steps.map((step) => {

                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  const IconComponent = step.icon;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center text-center flex-1"
                    >

                      <div
                        className={`flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition ${
                          isCompleted
                            ? ""
                            : isCurrent
                              ? "bg-white dark:bg-[#181A1B]"
                              : "border-slate-300 dark:border-white/20 bg-white dark:bg-[#181A1B] text-slate-400 dark:text-slate-500"
                        }`}
                        style={
                          isCompleted || isCurrent
                            ? {
                                borderColor: "var(--primary-color)",
                                backgroundColor: isCompleted
                                  ? "var(--primary-color)"
                                  : undefined,
                                color: isCompleted
                                  ? "var(--accent-color)"
                                  : "var(--primary-color)",
                              }
                            : undefined
                        }
                      >
                        <IconComponent size={16} />
                      </div>


                      <span
                        className={`text-[10px] sm:text-xs font-semibold mt-1.5 whitespace-nowrap ${
                          isCurrent ? "" : "text-slate-500 dark:text-slate-400"
                        }`}
                        style={
                          isCurrent
                            ? { color: "var(--primary-color)" }
                            : undefined
                        }
                      >
                        {step.label}
                      </span>

                    </div>
                  );
                })}

              </div>
            </div>
          )}

        </div>


        {/* Order Items + Delivery Details */}
        {/* Continue same pattern: bg-white dark:bg-[#181A1B], border-slate-200 dark:border-white/10,
          text-slate-500 dark:text-slate-400, brand accents via var(--primary-color) */}


      </div>
    </motion.div>
  );
}
