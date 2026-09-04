import {
  IndianRupee,
  TrendingUp,
  Wallet,
  BadgePercent,
} from "lucide-react";

export default function RevenueInsights({
  summary,
  chartData,
}) {
  const highestRevenue = Math.max(
    ...chartData.map((item) => item.revenue)
  );

  const lowestRevenue = Math.min(
    ...chartData.map((item) => item.revenue)
  );

  const totalRevenue = chartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const avgRevenue = Math.round(
    totalRevenue / chartData.length
  );

  const cards = [
    {
      title: "Highest Revenue",
      value: `₹${highestRevenue.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "#16522D",
    },
    {
      title: "Lowest Revenue",
      value: `₹${lowestRevenue.toLocaleString("en-IN")}`,
      icon: BadgePercent,
      color: "#D4A017",
    },
    {
      title: "Average Revenue",
      value: `₹${avgRevenue.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "#1E3A5F",
    },
    {
      title: "Total Revenue",
      value: `₹${summary.revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "#16522D",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Revenue Insights
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Key revenue metrics for the selected reporting period.
        </p>
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
                {card.value}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}