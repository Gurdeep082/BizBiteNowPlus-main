import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  ShoppingBag,
  Receipt,
  Percent,
} from "lucide-react";

export default function RevenueSummary({
  summary,
  activeMetric,
  onMetricChange,
}) {
  const cards = [
    {
      key: "revenue",
      title: "Revenue",
      value: `₹${summary.revenue.toLocaleString("en-IN")}`,
      growth: summary.revenueGrowth,
      icon: IndianRupee,
      color: "#16522D",
    },
    {
      key: "orders",
      title: "Orders",
      value: summary.orders.toLocaleString("en-IN"),
      growth: summary.ordersGrowth,
      icon: ShoppingBag,
      color: "#1E3A5F",
    },
    {
      key: "averageOrder",
      title: "Average Order",
      value: `₹${summary.averageOrder.toLocaleString("en-IN")}`,
      growth: summary.averageOrderGrowth,
      icon: Receipt,
      color: "#D4A017",
    },
    {
      key: "conversion",
      title: "Conversion Rate",
      value: `${summary.conversion}%`,
      growth: summary.conversionGrowth,
      icon: Percent,
      color: "#16522D",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const positive = card.growth >= 0;
        const active = activeMetric === card.key;

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onMetricChange(card.key)}
            className={`w-full rounded-2xl border bg-white p-5 text-left transition-all duration-300 ${
              active
                ? "border-[#16522D] ring-2 ring-[#16522D]/10 shadow-lg"
                : "border-slate-200 hover:-translate-y-1 hover:border-[#16522D]/20 hover:shadow-md"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>

              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${card.color}15`,
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: card.color,
                  }}
                />
              </div>
            </div>

            <div
              className={`mt-5 flex items-center gap-2 text-sm ${
                positive
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={16} />
              ) : (
                <ArrowDownRight size={16} />
              )}

              <span className="font-semibold">
                {Math.abs(card.growth)}%
              </span>

              <span className="text-slate-500">
                vs previous period
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}