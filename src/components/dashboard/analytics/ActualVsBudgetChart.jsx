import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const AXIS_TICK = {
  fill: "#64748B",
  fontSize: 12,
};

const REVENUE_DOT = {
  r: 5,
  fill: "#16522D",
  stroke: "#fff",
  strokeWidth: 2,
};

const TARGET_DOT = {
  r: 5,
  fill: "#1E3A5F",
  stroke: "#fff",
  strokeWidth: 2,
};

const ACTIVE_DOT = {
  r: 7,
};

const CHART_MARGIN = {
  top: 10,
  right: 20,
  left: -10,
  bottom: 0,
};

const LEGEND_STYLE = {
  paddingTop: 12,
};

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="mb-2 font-semibold text-slate-900">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-6 text-sm"
        >
          <span style={{ color: item.color }}>
            {item.name}
          </span>

          <span className="font-semibold text-slate-900">
            ₹{item.value}L
          </span>
        </div>
      ))}
    </div>
  );
});

function ActualVsBudgetChart({ data }) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Revenue Trend
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Compare monthly revenue against your sales target.
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={CHART_MARGIN}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={AXIS_TICK}
              tickFormatter={(v) => `₹${v}L`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={LEGEND_STYLE} />

            <Line
              type="monotone"
              dataKey="actual"
              name="Revenue"
              stroke="#16522D"
              strokeWidth={3}
              dot={REVENUE_DOT}
              activeDot={ACTIVE_DOT}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="budget"
              name="Target"
              stroke="#1E3A5F"
              strokeWidth={3}
              dot={TARGET_DOT}
              activeDot={ACTIVE_DOT}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(ActualVsBudgetChart);