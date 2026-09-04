import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, ArrowDownAZ, ArrowUpAZ, Crown, Medal, Award, Users,
  ShoppingBag, IndianRupee, Loader2, Gift, UserCircle2,
} from "lucide-react";
import API from "../../../api/axios";

import LoyaltyChart from "../../../components/dashboard/analytics/LoyaltyChart";
import CustomersSection from "../../../components/dashboard/widgets/CustomersSection";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

const getTier = (orders) => {
  if (orders >= 20) return "Gold";
  if (orders >= 10) return "Silver";
  return "Bronze";
};

const formatLastOrder = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} Days Ago`;
};

const TIER_BADGE = {
  Gold: { icon: Crown, className: "bg-amber-100 text-amber-700" },
  Silver: { icon: Medal, className: "bg-slate-100 text-slate-600" },
  Bronze: { icon: Award, className: "bg-orange-100 text-orange-700" },
};

const TABS = [
  { key: "customers", label: "Regular Customers", icon: Users },
  { key: "loyalty", label: "Loyalty", icon: Gift },
  { key: "insights", label: "Customer Insights", icon: UserCircle2 },
];

export default function RegularCustomersPage() {
  const [tab, setTab] = useState("customers");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("orders");
  const [sortOrder, setSortOrder] = useState("desc");

  const { loyaltyChartData, loyaltyLoading, fetchLoyaltyChart } = useSellerDashboardStore();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await API.get("/orders/customers");
        if (response.data?.success && response.data?.customers) {
          setCustomers(response.data.customers);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        setFetchError("Couldn't load customers. Try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Loyalty data only fetched when that tab is opened
  useEffect(() => {
    if (tab === "loyalty" && fetchLoyaltyChart) {
      fetchLoyaltyChart();
    }
  }, [tab, fetchLoyaltyChart]);

  const filteredCustomers = useMemo(() => {
    const enriched = customers.map((c) => {
      const orderCount = c.orders || c.orders_count || 0;
      const hasRealSpend = c.totalSpent != null;
      const estimatedSpent = hasRealSpend ? c.totalSpent : orderCount * 500;

      return {
        ...c,
        name: c.name || "Customer",
        phone: c.phone || "N/A",
        spent: estimatedSpent,
        isEstimate: !hasRealSpend,
        orders: orderCount,
        status: getTier(orderCount),
        lastOrder: formatLastOrder(c.lastOrderAt),
      };
    });

    const filtered = enriched.filter((customer) =>
      `${customer.name} ${customer.status} ${customer.phone}`.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "spent") return (a.spent - b.spent) * direction;
      return (a.orders - b.orders) * direction;
    });
  }, [customers, search, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const totalCustomers = filteredCustomers.length;
    const totalSpent = filteredCustomers.reduce((sum, c) => sum + c.spent, 0);
    const totalOrders = filteredCustomers.reduce((sum, c) => sum + c.orders, 0);
    const averageSpent = totalCustomers > 0 ? Math.round(totalSpent / totalCustomers) : 0;
    const anyEstimated = filteredCustomers.some((c) => c.isEstimate);
    return { totalCustomers, totalSpent, totalOrders, averageSpent, anyEstimated };
  }, [filteredCustomers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans text-slate-900"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Customers</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Repeat buyers, loyalty programme and per-customer order history.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${tab === t.key ? "bg-emerald-700 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "customers" && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600"
              />
            </div>
            <div className="flex flex-wrap gap-2.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="orders">Sort by Orders</option>
                <option value="spent">Sort by Spending</option>
              </select>
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700 cursor-pointer"
              >
                {sortOrder === "desc" ? (
                  <><ArrowDownAZ size={15} /> Desc</>
                ) : (
                  <><ArrowUpAZ size={15} /> Asc</>
                )}
              </button>
            </div>
          </div>

          {fetchError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {fetchError}
            </div>
          )}

          {loading ? (
            <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Loader2 size={28} className="animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} iconColor="text-violet-600" label="Customers" value={stats.totalCustomers} />
                <StatCard icon={ShoppingBag} iconColor="text-sky-600" label="Orders" value={stats.totalOrders} />
                <StatCard
                  icon={IndianRupee}
                  iconColor="text-emerald-600"
                  label={stats.anyEstimated ? "Est. Lifetime Spend" : "Lifetime Spend"}
                  value={`₹${stats.totalSpent.toLocaleString("en-IN")}`}
                />
                <StatCard
                  icon={Award}
                  iconColor="text-amber-600"
                  label={stats.anyEstimated ? "Est. Avg Spend" : "Avg Spend"}
                  value={`₹${stats.averageSpent.toLocaleString("en-IN")}`}
                />
              </div>

              {stats.anyEstimated && (
                <p className="text-xs text-slate-400">
                  Spend figures marked "Est." are approximated from order count where exact totals aren't available yet.
                </p>
              )}

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">Customer</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">Tier</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">Orders</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">Spend</th>
                      <th className="px-5 py-3 text-left text-xs font-bold uppercase text-slate-500">Last Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => {
                      const badge = TIER_BADGE[customer.status];
                      const BadgeIcon = badge.icon;
                      return (
                        <tr key={customer.phone} className="border-t border-slate-100 transition hover:bg-slate-50">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                                {customer.name?.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900">{customer.name}</h4>
                                <p className="text-xs text-slate-500">{customer.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.className}`}>
                              <BadgeIcon size={12} />
                              {customer.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">{customer.orders}</td>
                          <td className="px-5 py-4 text-sm font-bold text-emerald-700">
                            ₹{customer.spent.toLocaleString("en-IN")}
                            {customer.isEstimate && <span className="ml-1 text-[10px] font-medium text-slate-400">est.</span>}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500">{customer.lastOrder}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && (
                  <div className="p-14 text-center">
                    <Users size={44} className="mx-auto text-slate-300" />
                    <h3 className="mt-4 text-lg font-bold text-slate-700">No customers found</h3>
                    <p className="mt-1 text-sm text-slate-500">No customers match your current search.</p>
                  </div>
                )}
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 xl:hidden">
                {filteredCustomers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
                    <Users size={36} className="mx-auto text-slate-300" />
                    <h3 className="mt-3 text-sm font-bold text-slate-700">No customers found</h3>
                    <p className="mt-1 text-xs text-slate-500">Try changing your search or sorting option.</p>
                  </div>
                ) : (
                  filteredCustomers.map((customer) => {
                    const badge = TIER_BADGE[customer.status];
                    const BadgeIcon = badge.icon;
                    return (
                      <div key={customer.phone} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                              {customer.name?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">{customer.name}</h3>
                              <p className="text-xs text-slate-500">{customer.phone}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.className}`}>
                            <BadgeIcon size={12} />
                            {customer.status}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] text-slate-500">Orders</p>
                            <h4 className="mt-1 text-lg font-bold text-slate-900">{customer.orders}</h4>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] text-slate-500">Spend {customer.isEstimate && "(est.)"}</p>
                            <h4 className="mt-1 text-lg font-bold text-emerald-700">₹{customer.spent.toLocaleString("en-IN")}</h4>
                          </div>
                        </div>
                        <div className="mt-3 rounded-xl bg-slate-50 p-3">
                          <p className="text-[10px] text-slate-500">Last Order</p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-700">{customer.lastOrder}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "loyalty" && (
        <LoyaltyChart data={loyaltyChartData} loading={loyaltyLoading} />
      )}

      {tab === "insights" && <CustomersSection />}
    </motion.div>
  );
}

function StatCard({ icon: Icon, iconColor, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <Icon size={15} className={iconColor} />
      </div>
      <h3 className="mt-2 text-xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}