import { memo } from "react";
import { TrendingUp, ShoppingCart, IndianRupee } from "lucide-react";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const SummaryCard = ({ title, value, icon: Icon }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="absolute inset-y-0 left-0 w-1 bg-[#1A4D2E]/70 opacity-0 transition group-hover:opacity-100" />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      {Icon && (
        <div className="rounded-xl bg-[#1A4D2E]/10 p-2.5">
          <Icon size={20} className="text-[#1A4D2E]" />
        </div>
      )}
    </div>
  </div>
);

const SectionCard = ({ title, subtitle, children, span }) => (
  <div className={`${span} rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}>
    <div className="mb-4">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const EmptyState = ({ text }) => (
  <p className="flex h-32 items-center justify-center text-center text-sm text-slate-400">
    {text}
  </p>
);

function SalesChart({ summary, topProducts = [], loading = false }) {
  const { revenueTrend, yoyComparison, budgetBreakdown } = useSellerDashboardStore();
  const hasSummary = !!summary;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {loading && !hasSummary ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))
        ) : hasSummary ? (
          <>
            <SummaryCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={IndianRupee} />
            <SummaryCard title="Total Orders" value={summary.totalOrders ?? 0} icon={ShoppingCart} />
            <SummaryCard title="Delivered" value={summary.deliveredCount ?? 0} icon={TrendingUp} />
          </>
        ) : (
          <div className="sm:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Revenue summary not available
          </div>
        )}
      </div>

      {/* Revenue Trend & YoY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <SectionCard title="Revenue Trend" span="xl:col-span-8">
          {revenueTrend && revenueTrend.length > 0 ? (
            <div className="space-y-2">
              {revenueTrend.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{item.month}</span>
                  <span className="text-sm font-semibold text-[#1A4D2E]">{formatCurrency(item.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="No historical revenue data available yet." />
          )}
        </SectionCard>

        <SectionCard title="Current vs Previous Year" span="xl:col-span-4">
          {yoyComparison ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-sm">
                <span className="text-slate-500">Current Year</span>
                <span className="font-bold text-slate-900">{formatCurrency(yoyComparison.currentYear)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-sm">
                <span className="text-slate-500">Previous Year</span>
                <span className="font-bold text-slate-900">{formatCurrency(yoyComparison.previousYear)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-sm">
                <span className="text-slate-500">Growth</span>
                <span className={`font-bold ${yoyComparison.growthPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {yoyComparison.growthPercentage}%
                </span>
              </div>
            </div>
          ) : (
            <EmptyState text="YoY comparison data unavailable." />
          )}
        </SectionCard>
      </div>

      {/* Top Products & Budget */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <SectionCard title="Top Products" subtitle="Ranked by quantity sold, from recent orders" span="xl:col-span-8">
          {topProducts.length === 0 ? (
            <EmptyState text="No product sales in the current order history window." />
          ) : (
            <div className="space-y-2">
              {topProducts.slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.quantitySold} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1A4D2E]">{formatCurrency(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Budget Breakdown" span="xl:col-span-4">
          {budgetBreakdown ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-sm">
                <span className="text-slate-500">Monthly Target</span>
                <span className="font-bold text-slate-900">{formatCurrency(budgetBreakdown.monthlyTarget)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-sm">
                <span className="text-slate-500">Achieved</span>
                <span className="font-bold text-green-600">{formatCurrency(budgetBreakdown.achieved)}</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-sm">
                <span className="text-slate-500">Remaining</span>
                <span className="font-bold text-amber-600">{formatCurrency(budgetBreakdown.remaining)}</span>
              </div>
            </div>
          ) : (
            <EmptyState text="Budget breakdown data unavailable." />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default memo(SalesChart);