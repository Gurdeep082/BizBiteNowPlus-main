import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

export default function OrdersInsights({
  summary,
  chartData,
}) {
  const totalOrders = summary.orders;

  const completed = Math.round(totalOrders * 0.89);
  const cancelled = Math.round(totalOrders * 0.05);
  const pending = Math.round(totalOrders * 0.04);
  const returned =
    totalOrders - completed - cancelled - pending;

  const peakDay = chartData.reduce((prev, current) =>
    current.orders > prev.orders ? current : prev
  );

  const avgOrders = Math.round(
    totalOrders / chartData.length
  );

  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "#16522D",
    },
    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "#16522D",
    },
    {
      title: "Cancelled",
      value: cancelled,
      icon: XCircle,
      color: "#1E3A5F",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      color: "#D4A017",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Order Insights
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Monitor order performance and fulfillment trends.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Peak Day
          </p>

          <p className="mt-1 text-lg font-bold text-[#16522D]">
            {peakDay.day}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#16522D]/20 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${card.color}15`,
                  }}
                >
                  <Icon
                    size={18}
                    style={{
                      color: card.color,
                    }}
                  />
                </div>
              </div>

              <h4 className="mt-4 text-2xl font-bold text-slate-900">
                {card.value.toLocaleString("en-IN")}
              </h4>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Average Orders / Day
          </p>

          <h4 className="mt-2 text-2xl font-bold text-slate-900">
            {avgOrders.toLocaleString("en-IN")}
          </h4>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Return Rate
          </p>

          <h4 className="mt-2 text-2xl font-bold text-[#16522D]">
            {((returned / totalOrders) * 100).toFixed(1)}%
          </h4>
        </div>
      </div>
    </div>
  );
}