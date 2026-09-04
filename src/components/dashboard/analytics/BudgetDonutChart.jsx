import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
}) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold text-slate-900">
        {item.name}
      </p>

      <p className="mt-2 text-sm text-slate-600">
        Orders
        <span className="ml-2 font-semibold text-slate-900">
          {item.value}%
        </span>
      </p>
    </div>
  );
};

export default function BudgetDonutChart({
  data,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12.5 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Order Status Distribution
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Breakdown of orders by their current status.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 lg:flex-row">
        <div className="h-[320px] w-full lg:w-[60%]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={3}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<CustomTooltip />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-[40%]">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-[#16522D]/20"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="text-sm font-medium text-slate-700">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-bold text-slate-900">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}