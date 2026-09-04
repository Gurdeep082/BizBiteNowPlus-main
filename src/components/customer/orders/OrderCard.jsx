
import {
  ArrowLeft,
  ChevronRight,
  Phone,
  FileText,
} from "lucide-react";

import Card from "../common/Card";
import OrderTimeline from "./OrderTimeline";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderCard = ({
  order,
  onBack,
  onHelp,
  onView,
  onShare,
}) => {
  if (!order) return null;

  // 🛡️ Total & Items calculation with fallbacks
  const total =
    order.summary?.total ??
    order.total_amount ??
    order.total ??
    0;

  const itemCount =
    order.items?.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    ) || 0;

  const orderId = order._id
    ? String(order._id).slice(-6).toUpperCase()
    : order.id
    ? String(order.id).slice(-6).toUpperCase()
    : "N/A";

  // 🏡 Delivery Address Handling (Object vs String)
  const deliveryAddress =
    typeof order.delivery_address === "object" && order.delivery_address !== null
      ? order.delivery_address.address_line || "Delivery Address"
      : order.address?.address || order.delivery_address || "Pickup / Store Order";

  const addressLabel =
    typeof order.delivery_address === "object" && order.delivery_address !== null
      ? "Home Address"
      : order.address?.label || "Delivery Location";

  // 🚨 MAIN FIX: Safe Step mapping (Prevents crash when order.tracking is undefined)
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
    statusStepMap[order.delivery_status] ??
    1;

  const timelineSteps = order?.tracking?.steps || [
    { title: "Order Placed", description: "Order received by store" },
    { title: "Accepted", description: "Store is preparing items" },
    { title: "Out for Delivery", description: "Partner on the way" },
    { title: "Delivered", description: "Order completed" },
  ];

  return (
    <div className="mx-auto max-w-full space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-100 p-6">
          {/* Left Section */}
          <div className="flex items-start gap-5">
            {onBack && (
              <button
                onClick={onBack}
                className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            <img
              src={
                order.restaurant?.image ||
                order.items?.[0]?.product_id?.image ||
                order.items?.[0]?.image ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300"
              }
              alt={order.restaurant?.name || "Store"}
              className="h-24 w-24 rounded-2xl object-cover"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">
                  {order.restaurant?.name || "BizBite Restaurant"}
                </h2>
                <ChevronRight size={20} className="text-slate-400" />
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Order ID : #{orderId}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "--"}
                </span>

                <span>•</span>

                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </span>

                <span>•</span>

                <span>{itemCount} Items</span>

                <span>•</span>

                <span className="font-semibold text-slate-900">
                  ₹{Number(total).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end gap-4">
            <div className="text-right">
              <OrderStatusBadge
                status={order.delivery_status || order.status || "Processing"}
              />

              <p className="mt-4 text-sm text-slate-500">Estimated Delivery</p>

              <h3 className="text-sm font-bold text-emerald-600">
                {order.estimatedDelivery || "25-30 Mins"}
              </h3>
            </div>
          </div>
        </div>

        {/* Timeline Section (Fixes currentStep undefined crash) */}
        <div className="p-4">
          <OrderTimeline
            currentStep={currentStep}
            timeline={timelineSteps}
          />
        </div>
      </Card>

      {/* Order Items List */}
      <Card className="w-full rounded-3xl border border-slate-200 p-6">
        <h3 className="mb-6 text-xl font-bold text-slate-900">Order Items</h3>

        <div className="space-y-5">
          {order.items?.map((item, idx) => {
            const productName =
              typeof item.product_id === "object"
                ? item.product_id?.name || item.name
                : item.name || "Item";

            const productImg =
              typeof item.product_id === "object"
                ? item.product_id?.image
                : item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150";

            const productPrice =
              item.price || (typeof item.product_id === "object" ? item.product_id?.price : 0);

            return (
              <div
                key={item._id || item.id || idx}
                className="flex items-center gap-4 border-b border-slate-50 pb-3 last:border-0 last:pb-0"
              >
                <img
                  src={productImg}
                  alt={productName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    {productName}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">₹{productPrice}</p>
                </div>

                <span className="font-semibold text-emerald-600">
                  ×{item.quantity}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Delivery & Payment Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Delivery Address */}
        <Card className="rounded-3xl border border-slate-200 p-6 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white">
              📍
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">
                Delivery Address
              </h3>
              <p className="mt-3 font-semibold text-slate-700">{addressLabel}</p>
              <p className="mt-1 text-slate-500 leading-6">{deliveryAddress}</p>

              {order.mohalla && (
                <p className="mt-2 text-sm text-slate-400">
                  Mohalla : {order.mohalla}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="rounded-3xl border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-900">Payment</h3>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Method</span>
              <span className="font-semibold">
                {order.payment_method || order.payment?.method || "COD"}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-emerald-600">
                {order.payment_status || order.payment?.status || "Pending"}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Paid</span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹{Number(total).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4">
        <button
          onClick={() => onHelp?.(order)}
          className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-50"
        >
          Need Help
        </button>

        <button
          onClick={onView}
          className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 font-semibold transition hover:bg-slate-50"
        >
          <FileText size={18} />
          Order Details
        </button>

        <button
          onClick={() => onShare?.(order)}
          className="flex w-60 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Phone size={18} />
          Contact Delivery Partner
        </button>
      </div>
    </div>
  );
};

export default OrderCard;