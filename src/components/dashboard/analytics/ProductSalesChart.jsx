import React, { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const X_AXIS_TICK = {
  fill: "#64748B",
  fontSize: 12,
};

const Y_AXIS_TICK = {
  fill: "#334155",
  fontSize: 13,
};

const LEGEND_STYLE = {
  paddingTop: 12,
};

const BAR_RADIUS = [0, 8, 8, 0];

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
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
});

function ProductSalesChart({ data }) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Top Selling Products
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Compare actual product sales with monthly sales targets.
        </p>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
            barGap={8}
            barCategoryGap={20}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={X_AXIS_TICK}
            />

            <YAxis
              type="category"
              dataKey="product"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={Y_AXIS_TICK}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend wrapperStyle={LEGEND_STYLE} />

            <Bar
              dataKey="actual"
              name="Units Sold"
              fill="#16522D"
              radius={BAR_RADIUS}
              isAnimationActive={false}
            />

            <Bar
              dataKey="budget"
              name="Target"
              fill="#1E3A5F"
              radius={BAR_RADIUS}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(ProductSalesChart);