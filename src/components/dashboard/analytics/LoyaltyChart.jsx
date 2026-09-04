
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

import { Users, Award, Gift } from "lucide-react";
import ChartHeader from "./ChartHeader";

const COLORS = ["#16522D", "#1E3A5F", "#D4A017", "#8FA6C1", "#B7C4D3"];

const LoyaltyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <p className="font-semibold text-slate-900">{item.name}</p>
      <p className="mt-2 text-sm text-slate-500">Customers</p>
      <p className="text-xl font-bold text-[#16522D]">{item.customers}</p>
    </div>
  );
};

const LoyaltySummary = ({ totalMembers, highestEngage, targetStamps }) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Loyalty Members</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#16522D]/10">
            <Users size={20} className="text-[#16522D]" />
          </div>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">{totalMembers}</h2>
        <p className="mt-2 text-sm text-slate-500">Active enrolled customers</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Highest Engagement</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3A5F]/10">
            <Award size={20} className="text-[#1E3A5F]" />
          </div>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">{highestEngage.customers}</h2>
        <p className="mt-2 text-sm text-slate-500">{highestEngage.name}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">Reward Target</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4A017]/10">
            <Gift size={20} className="text-[#D4A017]" />
          </div>
        </div>
        <h2 className="mt-4 text-3xl font-bold text-slate-900">{targetStamps} Stamps</h2>
        <p className="mt-2 text-sm text-slate-500">Free reward eligibility</p>
      </div>
    </div>
  );
};

export default function LoyaltyChart({ data, loading }) {
  if (loading) {
    return <div className="h-[450px] w-full animate-pulse rounded-3xl bg-slate-100" />;
  }

  // Real backend prop data extraction
  const rawList = data?.stampDistribution || [];
  
  const formattedChartData = rawList.map((item, idx) => ({
    name: item.stamp || `Stamp ${idx + 1}`,
    customers: item.count ?? 0,
    fill: COLORS[idx % COLORS.length],
  }));

  const totalMembers = data?.loyaltyMembers ?? formattedChartData.reduce((sum, i) => sum + i.customers, 0);

  const highestEngage = formattedChartData.length > 0 
    ? formattedChartData.reduce((prev, curr) => (curr.customers > prev.customers ? curr : prev))
    : { name: "Stamp 1", customers: 0 };

  const targetStamps = data?.rewardTargetStamps ?? 5;
  const maxDomainValue = Math.max(...formattedChartData.map(d => d.customers), 10);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
      <ChartHeader
        title="Customer Loyalty Analytics"
        subtitle="Monitor loyalty programme participation"
      />

      <LoyaltySummary 
        totalMembers={totalMembers} 
        highestEngage={highestEngage} 
        targetStamps={targetStamps} 
      />

      {formattedChartData.length > 0 ? (
        <div className="flex flex-col items-center gap-8 lg:flex-row">
          <div className="h-[360px] w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="20%"
                outerRadius="95%"
                data={formattedChartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, maxDomainValue]} tick={false} />
                <RadialBar
                  dataKey="customers"
                  background
                  clockWise
                  cornerRadius={12}
                />
                <Tooltip content={<LoyaltyTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-4 w-full">
            {formattedChartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-[#16522D]/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ background: item.fill }}
                  />
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{item.customers}</p>
                  <p className="text-xs text-slate-500">Customers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-slate-400">
          No loyalty participation data recorded yet.
        </p>
      )}
    </div>
  );
}