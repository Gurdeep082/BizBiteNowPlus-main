import {
  Clock3,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const MobileCurrentCard = ({
  order,
  onView,
  onReorder,
}) => {
  if (!order) return null;

  const item = order.items?.[0];

  return (
    <div
      className="
        overflow-hidden
        rounded-[14px]
        border
         shrink-0

        w-full
        max-w-full
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          px-4
          py-3
        "
      >
        <div>
          <h3 className="font-bold text-slate-900">
            Current Order
          </h3>

          <p className="text-[10px] font-bold text-slate-900 leading-none">
            #{order?.id ?? "N/A"}
          </p>
        </div>

        <span
          className="
            rounded-full
            bg-green-100
            px-3
            py-1
            text-xs
            font-semibold
            text-green-700
          "
        >
          {order.status}
        </span>
      </div>

      {/* Body */}

      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={item?.image}
            alt={item?.name}
            className="
              h-20
              w-20
              rounded-2xl
              object-cover
            "
          />

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-semibold text-slate-900">
              {item?.name}
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              {order.items?.length} item
              {order.items?.length > 1
                ? "s"
                : ""}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Clock3
                size={15}
                className="text-slate-400"
              />

              <span className="text-sm text-slate-600">
                {order.estimatedTime ||
                  "25-30 min"}
              </span>
            </div>

            <p className="-mt-4 text-sm text-right font-bold text-slate-900">
              ₹
              {order.summary?.total ??
                order.total}
            </p>
          </div>
        </div>
                {/* Bottom Actions */}

        <div
          className="
            mt-5
            flex
            gap-3
          "
        >
          <button
            onClick={onReorder}
            className="
              flex-1
              rounded-xl
              border
              border-slate-200
              py-3

              text-sm
              font-semibold
              text-slate-700

              transition
              hover:bg-slate-50
            "
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw size={16} />
              Reorder
            </span>
          </button>

          <button
            onClick={onView}
            className="
              flex-1
              rounded-xl
              py-3

              text-sm
              font-semibold
              text-white

              transition
              hover:opacity-90
            "
            style={{
              background: "var(--primary)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Details
              <ChevronRight size={16} />
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileCurrentCard;