import {
  ArrowLeft,
  ReceiptText,
  UserCircle2,
} from "lucide-react";

const OrderHeader = ({
  order,
  onBack,
}) => {
  // 🟢 Format date cleanly if available from the backend
  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "16 Jul 2026, 11:42 AM";

  // 🟢 Handle proper Order ID extraction (supports MongoDB _id or custom ID)
  const displayOrderId = order?._id
    ? `#${String(order._id).slice(-6).toUpperCase()}`
    : order?.id
    ? `#${order.id}`
    : "BBN12345678";

  return (
    <header
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        w-full
        px-6
        py-5
        bg-white
        border
        border-slate-200/80
        shadow-xs
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            transition
            hover:bg-slate-100
            cursor-pointer
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Order Details
          </h1>

          <div className="mt-1 flex items-center gap-2">
            <ReceiptText
              size={15}
              className="text-green-600"
            />

            <span className="text-xs sm:text-sm text-slate-500">
              Order ID:
            </span>

            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              {displayOrderId}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
            Ordered On
          </p>

          <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900">
            {formattedDate}
          </p>
        </div>

        <div
          className="
            flex
            h-11
            w-11
            sm:h-12
            sm:w-12
            items-center
            justify-center
            rounded-full
            bg-green-600
            text-white
            shadow-sm
          "
        >
          <UserCircle2 size={24} />
        </div>
      </div>
    </header>
  );
};

export default OrderHeader;