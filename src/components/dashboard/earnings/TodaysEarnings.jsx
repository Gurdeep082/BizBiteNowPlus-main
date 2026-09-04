import { Banknote, Wallet, CreditCard, BadgeCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Card from "../../../components/UI/Card";
import Typography from "../../../components/UI/Typography";
import Badge from "../../../components/UI/Badge";

export default function TodaysEarnings({ summary }) {
  const totalCollected = (summary.codPending || 0) + (summary.onlineReceived || 0);
  const codPercentage =
    totalCollected > 0 ? Math.round((summary.codPending / totalCollected) * 100) : 0;
  const onlinePercentage = totalCollected > 0 ? 100 - codPercentage : 0;

  const revenueGrowth = summary.revenueGrowth ?? 0;
  const isGrowthPositive = revenueGrowth >= 0;

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1A4D2E] p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/15 p-4 text-white shrink-0">
              <Banknote size={28} />
            </div>
            <div>
              <Typography variant="small" weight="medium" className="text-emerald-100">Today's Earnings</Typography>
              <Typography variant="h2" color="text-white" className="mt-1 text-3xl sm:text-4xl">
                ₹{(summary.todayEarnings || 0).toLocaleString("en-IN")}
              </Typography>
              <Badge
                variant={isGrowthPositive ? "success" : "danger"}
                size="sm"
                className={`mt-2 !px-2.5 !py-1 !text-xs !border-0 ${isGrowthPositive ? "!bg-emerald-500/40 !text-white" : "!bg-rose-500/40 !text-white"}`}
              >
                {isGrowthPositive ? <ArrowUpRight size={13} className="mr-1" /> : <ArrowDownRight size={13} className="mr-1" />}
                {Math.abs(revenueGrowth)}% vs yesterday
              </Badge>
            </div>
          </div>

          <div className="w-full max-w-xs lg:w-72">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between text-sm text-emerald-50 mb-4">
                <Typography variant="small" weight="medium">Payment split today</Typography>
                <TrendingUp size={16} />
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-[#F4A300]" style={{ width: `${codPercentage}%` }} />
                <div className="h-full bg-emerald-400" style={{ width: `${onlinePercentage}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-emerald-50 font-medium">
                <span>COD {codPercentage}%</span>
                <span>Online {onlinePercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card padding="p-6" className="xl:col-span-7 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="text-lg">Payment Distribution</Typography>
              <Typography variant="small" className="mt-1 text-xs">Revenue collected by payment method</Typography>
            </div>
            <TrendingUp className="text-[#1A4D2E]" size={20} />
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <Typography variant="h6" className="text-sm">Cash on Delivery</Typography>
              <Typography variant="h6" color="text-[#F4A300]" className="text-sm">{codPercentage}%</Typography>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-amber-100">
              <div className="h-full rounded-full bg-[#F4A300] transition-all duration-700" style={{ width: `${codPercentage}%` }} />
            </div>
            <Typography variant="small" className="mt-2 text-xs">₹{(summary.codPending || 0).toLocaleString("en-IN")}</Typography>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <Typography variant="h6" className="text-sm">Online Payments</Typography>
              <Typography variant="h6" color="text-[#1A4D2E]" className="text-sm">{onlinePercentage}%</Typography>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
              <div className="h-full rounded-full bg-[#1A4D2E] transition-all duration-700" style={{ width: `${onlinePercentage}%` }} />
            </div>
            <Typography variant="small" className="mt-2 text-xs">₹{(summary.onlineReceived || 0).toLocaleString("en-IN")}</Typography>
          </div>
        </Card>

        <Card padding="p-6" className="xl:col-span-5 shadow-sm">
          <Typography variant="h4" className="text-lg">Business Insights</Typography>
          <Typography variant="small" className="mt-1 text-xs">Today's performance highlights</Typography>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-[#1A4D2E] shrink-0">
                <TrendingUp size={16} />
              </div>
              <div>
                <Typography variant="h6" className="text-sm">Revenue Growth</Typography>
                <Typography variant="small" className="mt-1 text-xs">
                  Revenue {isGrowthPositive ? "increased" : "decreased"} by{" "}
                  <Typography variant="span" weight="bold">{Math.abs(revenueGrowth)}%</Typography> over yesterday.
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="rounded-xl bg-violet-100 p-2 text-violet-700 shrink-0">
                <Wallet size={16} />
              </div>
              <div>
                <Typography variant="h6" className="text-sm">Average Order</Typography>
                <Typography variant="small" className="mt-1 text-xs">
                  Current average order value is ₹{(summary.averageOrderValue || 0).toLocaleString("en-IN")}.
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-700 shrink-0">
                <CreditCard size={16} />
              </div>
              <div>
                <Typography variant="h6" className="text-sm">COD Collection</Typography>
                <Typography variant="small" className="mt-1 text-xs">
                  Pending COD collection is ₹{(summary.codPending || 0).toLocaleString("en-IN")}.
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}