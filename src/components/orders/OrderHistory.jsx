import { CalendarDays, Clock3, Crown } from "lucide-react";

export default function OrderHistory({
  orders = [],
  historyType = "today", // today | 30days | unlimited
  isPlus = true,
}) {
  if (
    (historyType === "30days" ||
      historyType === "unlimited") &&
    !isPlus
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <Crown
          className="mx-auto mb-3 text-amber-500"
          size={36}
        />

        <h3 className="text-lg font-semibold">
          BizBiteNow+ Feature
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Upgrade to view extended order history.
        </p>
      </div>
    );
  }

  let filtered = [...orders];

  if (historyType === "today") {
    const today = new Date().toDateString();

    filtered = filtered.filter(
      (o) =>
        o.status === "Delivered" &&
        new Date(o.createdAt).toDateString() ===
          today
    );
  }

  if (historyType === "30days") {
    const now = new Date();

    filtered = filtered.filter((o) => {
      const diff =
        (now - new Date(o.createdAt)) /
        (1000 * 60 * 60 * 24);

      return (
        diff <= 30 &&
        o.status === "Delivered"
      );
    });
  }

  if (historyType === "unlimited") {
    filtered = filtered.filter(
      (o) => o.status === "Delivered"
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-4">

        <div className="flex items-center gap-2">

          <CalendarDays
            size={18}
            className="text-[#16522d]"
          />

          <h2 className="font-semibold">
            {historyType === "today"
              ? "Today's Orders"
              : historyType === "30days"
              ? "Last 30 Days"
              : "Complete History"}
          </h2>

        </div>

        <span className="rounded-lg bg-[#16522d]/10 px-3 py-1 text-sm font-semibold text-[#16522d]">
          {filtered.length} Orders
        </span>

      </div>

      <div className="max-h-[500px] overflow-y-auto">

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Clock3
              className="mx-auto mb-3"
              size={34}
            />

            No orders found.
          </div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b px-6 py-4 transition hover:bg-slate-50"
            >
              <div>

                <p className="font-semibold">
                  {order.orderId}
                </p>

                <p className="text-sm text-slate-500">
                  {order.customer}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold">
                  ₹{order.amount}
                </p>

                <p className="text-xs text-slate-500">
                  {order.createdAt}
                </p>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}