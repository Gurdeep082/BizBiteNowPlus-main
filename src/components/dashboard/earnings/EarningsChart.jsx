import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp, CalendarDays, RefreshCw, LineChart } from "lucide-react";

import Typography from "../../UI/Typography";
import Button from "../../UI/Button";
import Card from "../../UI/Card";

const FILTERS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "All Time", value: "all" },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <Typography variant="small" weight="bold" color="text-slate-900">{label}</Typography>
      <Typography variant="h4" color="text-[#1A4D2E]" className="mt-2 text-lg">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </Typography>
    </div>
  );
};

export default function EarningsChart({ data, filter, onFilterChange, onRefresh }) {
  const chartData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const totalRevenue = chartData.reduce((sum, item) => sum + (item.earnings || 0), 0);
  const highestRevenue = chartData.length ? Math.max(...chartData.map((item) => item.earnings || 0)) : 0;
  const averageRevenue = chartData.length ? Math.round(totalRevenue / chartData.length) : 0;

  return (
    <Card padding="p-6" className="shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Typography variant="h3" className="text-xl sm:text-2xl">Revenue Trend</Typography>
          <Typography variant="small" className="mt-1 text-sm">Visualize your earnings performance over time.</Typography>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              variant={filter === item.value ? "primary" : "outline"}
              onClick={() => onFilterChange(item.value)}
              className={`!h-9 !px-4 !text-xs !rounded-xl ${filter !== item.value ? "!border-slate-200 !text-slate-600 hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]" : ""}`}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={onRefresh}
            className="!h-9 !w-9 !p-0 !border-slate-200 !bg-white hover:!bg-slate-50 text-slate-500"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card padding="p-5" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Total Revenue</Typography>
            <TrendingUp size={16} className="text-[#1A4D2E]" />
          </div>
          <Typography variant="h3" className="mt-2 text-2xl">₹{totalRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
        <Card padding="p-5" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Highest Day</Typography>
            <TrendingUp size={16} className="text-[#1A4D2E]" />
          </div>
          <Typography variant="h3" className="mt-2 text-2xl">₹{highestRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
        <Card padding="p-5" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Average</Typography>
            <CalendarDays size={16} className="text-[#F4A300]" />
          </div>
          <Typography variant="h3" className="mt-2 text-2xl">₹{averageRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
      </div>

      <div className="mt-8 h-[360px]">
        {chartData.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 text-center">
            <LineChart size={26} className="text-slate-300" />
            <Typography variant="h6" className="text-sm">No revenue data for this period.</Typography>
            <Typography variant="small" className="text-xs">Try a wider date range.</Typography>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A4D2E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#1A4D2E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#1A4D2E"
                strokeWidth={3}
                fill="url(#earningGradient)"
                activeDot={{ r: 6, fill: "#1A4D2E" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}