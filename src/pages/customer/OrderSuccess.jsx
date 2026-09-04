import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, House, PackageCheck, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order || {};
  const orderId = state?.orderId || order?._id || order?.id;
  const shortOrderId = orderId ? `#${String(orderId).slice(-8).toUpperCase()}` : "Order confirmed";
  const total = state?.total ?? order?.total_amount ?? order?.amount;
  const deliveryType = state?.deliveryType === "pickup" ? "pickup" : "delivery";

  return (
    <main className="min-h-[calc(100vh-72px)]  px-4 py-8 sm:py-12">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-2xl overflow-hidden rounded-sm bg-white shadow-[0_3px_12px_rgba(0,0,0,0.12)]"
      >
        <div className="h-2 bg-[var(--primary-color)]" />
        <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 220, damping: 15 }}
            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full  text-[var(--primary-color)]"
          >
            <CheckCircle2 size={52} strokeWidth={1.8} />
          </motion.div>
          <p className="text-sm font-semibold text-slate-500">ORDER PLACED SUCCESSFULLY</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Thank you for your order!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your order has been shared with the store. You’ll receive updates as it is prepared.
          </p>

          <div className="mx-auto mt-7 grid max-w-lg grid-cols-1 divide-y divide-slate-100 rounded-lg border border-slate-200 text-left sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order ID</p>
              <p className="mt-1 font-bold text-slate-800">{shortOrderId}</p>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Order total</p>
              <p className="mt-1 font-bold text-slate-800">{total !== undefined && total !== null ? `₹${Number(total).toFixed(2)}` : "—"}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-lg  px-4 py-3 text-left text-sm text-[var(--primary-color)]">
            <PackageCheck className="shrink-0" size={21} />
            <span>{deliveryType === "pickup" ? "Keep your order ID ready for pickup." : "We’ll notify you when your order is on its way."}</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => navigate("/customer/orders")} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--primary-color)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--secondary-color)]">
              <ShoppingBag size={17} /> View my orders <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate("/customer")} className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
              <House size={17} /> Continue shopping
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
