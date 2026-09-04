import {
  Users,
  ShoppingCart,
  BadgeCheck,
  Percent,
} from "lucide-react";

export default function ConversionInsights({
  summary,
  chartData,
}) {
  const visitors = chartData.reduce(
    (sum, item) => sum + (item.visitors || 0),
    0
  );

  const orders = summary.orders;

  const conversion = summary.conversion;

  const addToCart = Math.round(visitors * 0.43);

  const checkout = Math.round(addToCart * 0.68);

  const abandoned = checkout - orders;

  const bestDay = chartData.reduce((prev, current) => {
    const prevRate =
      (prev.orders / prev.visitors) * 100;

    const currentRate =
      (current.orders / current.visitors) * 100;

    return currentRate > prevRate ? current : prev;
  });

  const cards = [
    {
      title: "Visitors",
      value: visitors.toLocaleString("en-IN"),
      icon: Users,
      color: "#16522D",
    },
    {
      title: "Add To Cart",
      value: addToCart.toLocaleString("en-IN"),
      icon: ShoppingCart,
      color: "#D4A017",
    },
    {
      title: "Completed Orders",
      value: orders.toLocaleString("en-IN"),
      icon: BadgeCheck,
      color: "#1E3A5F",
    },
    {
      title: "Conversion Rate",
      value: `${conversion}%`,
      icon: Percent,
      color: "#16522D",
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Conversion Insights
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Track how visitors move through your sales funnel.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Best Day
          </p>

          <p className="mt-1 text-lg font-bold text-[#16522D]">
            {bestDay.day}
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
                {card.value}
              </h4>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Checkout Started
          </p>

          <h4 className="mt-2 text-2xl font-bold text-slate-900">
            {checkout.toLocaleString("en-IN")}
          </h4>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Abandoned Checkout
          </p>

          <h4 className="mt-2 text-2xl font-bold text-slate-900">
            {abandoned.toLocaleString("en-IN")}
          </h4>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Overall Conversion
          </p>

          <h4 className="mt-2 text-2xl font-bold text-[#16522D]">
            {conversion}%
          </h4>
        </div>
      </div>
    </div>
  );
}