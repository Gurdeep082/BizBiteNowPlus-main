import React from "react";

const CompactHistoryCard = ({
  order,
  onView,
  onRate,
  onReorder,
}) => {
  if (!order) return null;

  const statusClass =
    order.status === "Delivered" ||
    order.status === "Picked Up"
      ? "bg-green-600 text-white"
      : order.status === "Cancelled"
      ? "bg-red-500 text-white"
      : "bg-orange-500 text-white";

  return (
    <div
      className="
        w-full
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
        transition
        hover:shadow-md
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={order.items?.[0]?.image}
            alt={order.items?.[0]?.name}
            className="
              h-11
              w-11
              rounded-xl
              border
              border-slate-100
              object-cover
            "
          />

          <div>
          <h3 className="text-[15px] font-bold text-slate-900 leading-none">
            #{order?.id ?? "N/A"}
          </h3>

            <p className="mt-1 text-xs text-slate-500">
  {order.restaurant?.name || "BizBiteNow"}
</p>
          </div>
        </div>

        <span
          className={`
            rounded-[10px]
            px-3
            py-1
            text-[11px]
            font-semibold
            whitespace-nowrap
            ${statusClass}
          `}
        >
          {order.status}
        </span>
      </div>

      {/* Date & Amount */}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {order.date}
        </span>

        <span className="font-semibold text-slate-900">
          ₹
          {order.summary?.total ??
            order.total}
        </span>
      </div>

      {/* Order Type */}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Order Type
        </span>

        <span className="font-medium text-slate-900">
          {order.orderType ||
            "Delivery"}
        </span>
      </div>

      {/* Divider */}

      <div className="my-3 border-t border-slate-200" />

      {/* Bottom Actions */}

      <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(order);
          }}
          className="
            py-2
            text-sm
            text-slate-600
            hover:text-[var(--primary)]
          "
        >
          View Order
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRate?.(order);
          }}
          className="
            py-2
            text-sm
            text-slate-600
            hover:text-[var(--primary)]
          "
        >
          Rate Us
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onReorder?.(order);
          }}
          className="
            py-2
            text-sm
            font-medium
            text-[var(--primary)]
          "
        >
          Reorder
        </button>
      </div>
    </div>
  );
};

export default CompactHistoryCard;