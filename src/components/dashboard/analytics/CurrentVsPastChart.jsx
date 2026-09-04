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

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
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
          <span
            style={{
              color: item.color,
            }}
          >
            {item.name}
          </span>

          <span className="font-semibold text-slate-900">
            ₹{item.value}L
          </span>
        </div>
      ))}
    </div>
  );
};

export default function CurrentVsPastChart({
  data,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Current vs Previous Year
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Compare yearly revenue performance.
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            barGap={8}
            barCategoryGap={24}
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 12,
              }}
              tickFormatter={(value) => `₹${value}L`}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend
              wrapperStyle={{
                paddingTop: 12,
              }}
            />

            <Bar
              dataKey="current"
              name="Current Year"
              fill="#16522D"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="past"
              name="Previous Year"
              fill="#1E3A5F"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}