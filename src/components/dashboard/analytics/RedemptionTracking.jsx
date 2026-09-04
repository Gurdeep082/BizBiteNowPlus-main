import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Megaphone,
  Users,
  Gift,
  Percent,
  IndianRupee,
  Trophy,
} from "lucide-react";
import ChartHeader from "./ChartHeader";

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`;
const COLORS = ["#16522D", "#1E3A5F", "#D4A017", "#8FA6C1", "#B7C4D3"];

export default function RedemptionTracking({ data, loading }) {
  if (loading) {
    return <div className="h-[450px] w-full animate-pulse rounded-3xl bg-slate-100" />;
  }

  const activeCampaigns = data?.activeCampaigns ?? 0;
  const customersReached = data?.customersReached ?? 0;
  const redeemedOffers = data?.redeemedOffers ?? 0;
  const conversionRate = data?.conversionRate ?? "0%";
  const totalCampaignRevenue = data?.totalCampaignRevenue ?? 0;

  const topCampaignsList = (data?.topCampaigns || []).map((c, idx) => ({
    name: c.name || `Campaign ${idx + 1}`,
    redeemed: c.redeemed ?? 0,
    revenue: c.revenue ?? 0,
    fill: COLORS[idx % COLORS.length],
  }));

  const bestCampaignName = data?.bestCampaignName || (topCampaignsList[0]?.name ?? "None");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <ChartHeader
        title="Offer Performance"
        subtitle="Track campaign performance, revenue and customer engagement."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-[#16522D] p-5 text-white shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium opacity-80">Campaigns</p>
            <h2 className="text-3xl font-bold mt-2">{activeCampaigns}</h2>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <Megaphone size={22} className="text-white" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">Customers Reached</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{customersReached}</h2>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <Users size={22} className="text-slate-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">Redeemed</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{redeemedOffers}</h2>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <Gift size={22} className="text-slate-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">Conversion</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{conversionRate}</h2>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <Percent size={22} className="text-slate-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">Revenue Generated</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalCampaignRevenue)}</h3>
            <p className="text-xs text-slate-400 mt-1">Total campaign revenue</p>
          </div>
          <div className="rounded-xl bg-[#16522D]/10 p-3">
            <IndianRupee size={22} className="text-[#16522D]" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs font-medium text-slate-500">Best Campaign</p>
            <h3 className="text-2xl font-bold text-[#16522D] mt-1">{bestCampaignName}</h3>
            <p className="text-xs text-slate-400 mt-1">Highest revenue generated</p>
          </div>
          <div className="rounded-xl bg-amber-100 p-3">
            <Trophy size={22} className="text-amber-600" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Top Performing Campaigns</h3>
          <p className="text-xs text-slate-400">Ranked by redeemed offers.</p>
        </div>

        {topCampaignsList.length > 0 ? (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topCampaignsList}
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="redeemed" radius={[0, 8, 8, 0]}>
                  {topCampaignsList.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-slate-400">
            No active offer campaign redemptions found in database.
          </p>
        )}
      </div>
    </div>
  );
}