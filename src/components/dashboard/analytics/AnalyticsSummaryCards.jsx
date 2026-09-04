import React, { memo, useMemo } from "react";
import {
  TrendingUp,
  Wallet,
  BarChart3,
  CalendarRange,
  Percent,
} from "lucide-react";

const formatCurrency = (value) =>
  `₹${value.toLocaleString("en-IN")}`;

const SummaryCard = memo(({ card }) => {
  const Icon = card.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#16522D]/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-[28px] font-bold leading-none text-slate-900">
            {card.value}
          </h2>

          <p className="mt-4 text-sm font-medium text-slate-500">
            {card.title}
          </p>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${card.color}15`,
          }}
        >
          <Icon
            size={22}
            style={{
              color: card.color,
            }}
          />
        </div>
      </div>
    </div>
  );
});

function AnalyticsSummaryCards({ summary }) {
  const cards = useMemo(
    () => [
      {
        title: "Current Year Revenue",
        value: formatCurrency(summary.currentYearSales),
        icon: TrendingUp,
        color: "#16522D",
      },
      {
        title: "Revenue Target",
        value: formatCurrency(summary.budgetSales),
        icon: Wallet,
        color: "#1E3A5F",
      },
      {
        title: "Target Variance",
        value: `${summary.budgetVariance}%`,
        icon: BarChart3,
        color: "#D4A017",
      },
      {
        title: "Last Year Revenue",
        value: formatCurrency(summary.pastYearSales),
        icon: CalendarRange,
        color: "#1E3A5F",
      },
      {
        title: "Growth Rate",
        value: `${summary.salesGrowth}%`,
        icon: Percent,
        color: "#16522D",
      },
    ],
    [summary]
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <SummaryCard
          key={card.title}
          card={card}
        />
      ))}
    </div>
  );
}

export default memo(AnalyticsSummaryCards);