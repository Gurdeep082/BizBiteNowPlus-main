import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import SalesChart from "../../../components/dashboard/analytics/SalesChart";
import TopProducts from "../../../components/dashboard/widgets/TopProducts/TopProducts";
import RecentOrders from "../../../components/dashboard/widgets/RecentOrders/RecentOrders";
import LoyaltyChart from "../../../components/dashboard/analytics/LoyaltyChart";
import CustomersSection from "../../../components/dashboard/widgets/CustomersSection";

import useAnalyticsStore from "../../../store/analyticsStore";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

export default function Analytics() {
  const { profile, fetchSellerProfile, fetchDashboardOverview } = useSellerDashboardStore();
  const {
    salesSummary,
    recentOrders,
    topProducts,
    loyaltyChartData,
    loading,
    error,
    fetchAnalyticsOverview,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchSellerProfile();
    fetchDashboardOverview();
  }, [fetchSellerProfile, fetchDashboardOverview]);

  useEffect(() => {
    fetchAnalyticsOverview(profile?.tier || "PRO");
  }, [profile?.tier, fetchAnalyticsOverview]);

  // 🟢 Filter out dummy items like "Special Item" from top products
  const validTopProducts = useMemo(() => {
    if (!Array.isArray(topProducts)) return [];
    return topProducts.filter((item) => {
      const itemName = String(item.name || item.title || "").trim();
      return itemName && itemName.toLowerCase() !== "special item";
    });
  }, [topProducts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans text-slate-900"
    >
      {/* 🟢 TOP HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track revenue, products, customer orders and business activity in real-time.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-600 shadow-xs">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Sales Section */}
        <SalesChart summary={salesSummary} topProducts={validTopProducts} loading={loading} />

        {/* Top Products & Recent Orders Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TopProducts products={validTopProducts} loading={loading} />
          <RecentOrders orders={recentOrders} loading={loading} />
        </div>

        {/* Loyalty Widget (Business Activity removed) */}
        <div className="grid gap-6 lg:grid-cols-1">
          <LoyaltyChart data={loyaltyChartData} loading={loading} />
        </div>

        {/* Customers Section */}
        <CustomersSection />
      </div>
    </motion.div>
  );
}