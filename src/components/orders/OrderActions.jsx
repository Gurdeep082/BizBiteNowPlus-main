import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  XCircle,
  Clock3,
} from "lucide-react";

export default function OrderActions({
  order,
  onView,
  onAccept,
  onPreparing,
  onReady,
  onDelivery,
  onDelivered,
  onCancel,
}) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  const actionButton =
    "flex w-full items-center gap-3 px-4 py-3 text-sm transition";

  return (
    <div
      ref={menuRef}
      className="relative z-[1000]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 transition hover:bg-slate-100"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

          {order.status === "Pending" && (
            <>
              <button
                onClick={() => {
                  onAccept?.(order);
                  setOpen(false);
                }}
                className={`${actionButton} hover:bg-green-50`}
              >
                <CheckCircle2
                  size={16}
                  className="text-green-600"
                />
                Accept Order
              </button>

              <button
                onClick={() => {
                  onCancel?.(order);
                  setOpen(false);
                }}
                className={`${actionButton} text-red-600 hover:bg-red-50`}
              >
                <XCircle size={16} />
                Cancel Order
              </button>
            </>
          )}

          {order.status === "Preparing" && (
            <button
              onClick={() => {
                onReady?.(order);
                setOpen(false);
              }}
              className={`${actionButton} hover:bg-orange-50`}
            >
              <ChefHat
                size={16}
                className="text-orange-600"
              />
              Mark Ready
            </button>
          )}

          {order.status === "Ready" && (
            <button
              onClick={() => {
                onDelivery?.(order);
                setOpen(false);
              }}
              className={`${actionButton} hover:bg-sky-50`}
            >
              <Bike
                size={16}
                className="text-sky-600"
              />
              Out for Delivery
            </button>
          )}

          {order.status === "Out for Delivery" && (
            <button
              onClick={() => {
                onDelivered?.(order);
                setOpen(false);
              }}
              className={`${actionButton} hover:bg-green-50`}
            >
              <PackageCheck
                size={16}
                className="text-green-600"
              />
              Mark Delivered
            </button>
          )}

          {order.status === "Delivered" && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 size={16} />
              Order Completed
            </div>
          )}

          {order.status === "Cancelled" && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-red-600">
              <XCircle size={16} />
              Order Cancelled
            </div>
          )}

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 size={14} />
              Tracking Step {order.trackingStep + 1} / 5
            </div>

          </div>

        </div>
      )}
    </div>
  );
}