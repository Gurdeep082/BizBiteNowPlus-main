import { useMemo, useState } from "react";
import { Search, CalendarDays, ArrowDownAZ, ArrowUpAZ, IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";

import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";

export default function EarningsHistory({ history = [] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const filteredHistory = useMemo(() => {
    const data = history.filter((item) => item.date.toLowerCase().includes(search.toLowerCase()));
    return [...data].sort((a, b) =>
      sort === "latest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
    );
  }, [history, search, sort]);

  const stats = useMemo(() => {
    const totalRevenue = filteredHistory.reduce((sum, item) => sum + (item.totalEarnings || 0), 0);
    const totalOrders = filteredHistory.reduce((sum, item) => sum + (item.totalOrders || 0), 0);
    const averageRevenue = filteredHistory.length > 0 ? Math.round(totalRevenue / filteredHistory.length) : 0;

    const highestDay = filteredHistory.reduce(
      (prev, current) => ((current.totalEarnings || 0) > (prev.totalEarnings || 0) ? current : prev),
      filteredHistory[0] || { totalEarnings: 0, date: "-" }
    );

    return { totalRevenue, totalOrders, averageRevenue, highestDay };
  }, [filteredHistory]);

  return (
    <Card padding="p-6" className="shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Typography variant="h3" className="text-xl sm:text-2xl">Earnings History</Typography>
          <Typography variant="small" className="mt-1 text-sm">Browse historical earnings and revenue performance.</Typography>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="w-full sm:w-56">
            <Input
              type="text"
              placeholder="Search date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="!py-2 !text-sm"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSort(sort === "latest" ? "oldest" : "latest")}
            className="!h-10 !px-4 !text-sm !font-semibold !bg-white hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]"
          >
            {sort === "latest" ? (
              <>
                <ArrowDownAZ size={15} /> Latest
              </>
            ) : (
              <>
                <ArrowUpAZ size={15} /> Oldest
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Total Revenue</Typography>
            <IndianRupee size={15} className="text-[#1A4D2E]" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">₹{stats.totalRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Orders</Typography>
            <ShoppingBag size={15} className="text-sky-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">{stats.totalOrders}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Average / Day</Typography>
            <TrendingUp size={15} className="text-violet-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">₹{stats.averageRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Best Day</Typography>
            <CalendarDays size={15} className="text-[#F4A300]" />
          </div>
          <Typography variant="h6" className="mt-2 text-sm">{stats.highestDay.date}</Typography>
          <Typography variant="small" weight="bold" color="text-[#F4A300]" className="mt-1 text-xs">
            ₹{(stats.highestDay.totalEarnings || 0).toLocaleString("en-IN")}
          </Typography>
        </Card>
      </div>

      {/* Desktop Table */}
      <div className="mt-8 hidden xl:block">
        <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-slate-100">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Orders</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Revenue</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Average Order</th>
                <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const average = item.totalOrders > 0 ? Math.round(item.totalEarnings / item.totalOrders) : 0;
                const performance =
                  item.totalEarnings >= stats.averageRevenue
                    ? "Excellent"
                    : item.totalEarnings >= stats.averageRevenue * 0.8
                      ? "Good"
                      : "Average";

                return (
                  <tr key={item.date} className="border-t border-slate-50 transition hover:bg-slate-50 bg-white">
                    <td className="px-5 py-4">
                      <Typography variant="p" weight="semibold" className="text-sm">{item.date}</Typography>
                      <Typography variant="small" className="mt-0.5 text-[11px]">Earnings Record</Typography>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">{item.totalOrders}</td>
                    <td className="px-5 py-4 text-sm font-bold text-[#1A4D2E]">
                      ₹{item.totalEarnings.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">₹{average.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={performance === "Excellent" ? "success" : performance === "Good" ? "info" : "warning"}
                        size="sm"
                        className="!px-2.5 !py-1 !text-[11px]"
                      >
                        {performance}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="mt-6 space-y-3 xl:hidden">
        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
            <CalendarDays size={36} className="mx-auto text-slate-300" />
            <Typography variant="h6" className="mt-3 text-sm">No history found</Typography>
            <Typography variant="small" className="mt-1 text-xs">Try changing your search or sort option.</Typography>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const average = item.totalOrders > 0 ? Math.round(item.totalEarnings / item.totalOrders) : 0;
            const performance =
              item.totalEarnings >= stats.averageRevenue
                ? "Excellent"
                : item.totalEarnings >= stats.averageRevenue * 0.8
                  ? "Good"
                  : "Average";

            return (
              <Card key={item.date} padding="p-4" className="shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-sm">{item.date}</Typography>
                    <Typography variant="small" className="text-xs">Daily Earnings</Typography>
                  </div>
                  <Badge
                    variant={performance === "Excellent" ? "success" : performance === "Good" ? "info" : "warning"}
                    size="sm"
                    className="!px-2.5 !py-1 !text-[11px]"
                  >
                    {performance}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <Typography variant="small" className="text-[10px]">Orders</Typography>
                    <Typography variant="h4" className="mt-0.5 text-lg">{item.totalOrders}</Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-[10px]">Revenue</Typography>
                    <Typography variant="h4" color="text-[#1A4D2E]" className="mt-0.5 text-lg">
                      ₹{item.totalEarnings.toLocaleString("en-IN")}
                    </Typography>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <Typography variant="small" className="text-[10px]">Average Order Value</Typography>
                  <Typography variant="h6" className="mt-1 text-sm">₹{average.toLocaleString("en-IN")}</Typography>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {filteredHistory.length === 0 && (
        <div className="mt-8 hidden rounded-2xl border border-dashed border-slate-200 p-14 text-center xl:block">
          <CalendarDays size={44} className="mx-auto text-slate-300" />
          <Typography variant="h4" className="mt-4 text-lg">No earnings history</Typography>
          <Typography variant="small" className="mt-1 text-sm">No earnings records match your current search.</Typography>
        </div>
      )}
    </Card>
  );
}