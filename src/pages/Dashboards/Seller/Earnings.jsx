import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Download,
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Wallet,
  LayoutGrid,
  TrendingUp,
  CreditCard,
  History,
  BarChart3,
} from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import EmptyState from "../../../components/UI/EmptyState";

import EarningsSummaryCards from "../../../components/dashboard/earnings/EarningsSummaryCards";
import EarningsChart from "../../../components/dashboard/earnings/EarningsChart";
import TodaysEarnings from "../../../components/dashboard/earnings/TodaysEarnings";
import CODPaymentTable from "../../../components/dashboard/earnings/CODPaymentTable";
import EarningsHistory from "../../../components/dashboard/earnings/EarningsHistory";

import SalesChart from "../../../components/dashboard/analytics/SalesChart";
import RecentOrders from "../../../components/dashboard/widgets/RecentOrders/RecentOrders";

import useEarningStore from "../../../store/earningStore";
import useAnalyticsStore from "../../../store/analyticsStore";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "trend", label: "Revenue Trend", icon: TrendingUp },
  { key: "cod", label: "COD Payments", icon: CreditCard },
  { key: "history", label: "History", icon: History },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Earnings() {
  const {
    earningsSummary,
    earningsChartData,
    todaysOrders,
    earningsHistory,
    fetchEarnings,
    loading,
    error,
  } = useEarningStore();

  const { profile, fetchSellerProfile, fetchDashboardOverview } = useSellerDashboardStore();
  const {
    salesSummary,
    recentOrders,
    topProducts,
    loading: analyticsLoading,
    error: analyticsError,
    fetchAnalyticsOverview,
  } = useAnalyticsStore();

  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("30d");
  const [payment, setPayment] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchEarnings(range).catch((err) => {
      if (isMounted) console.error("Error loading earnings:", err);
    });
    return () => {
      isMounted = false;
    };
  }, [range]);

  useEffect(() => {
    if (tab !== "analytics") return;
    fetchSellerProfile();
    fetchDashboardOverview();
  }, [tab, fetchSellerProfile, fetchDashboardOverview]);

  useEffect(() => {
    if (tab !== "analytics") return;
    fetchAnalyticsOverview(profile?.tier || "PRO");
  }, [tab, profile?.tier, fetchAnalyticsOverview]);

  const handleRefresh = async () => {
    setSearch("");
    setPayment("all");
    setRefreshing(true);
    try {
      if (range === "30d") {
        await fetchEarnings("30d");
      } else {
        setRange("30d");
      }
    } catch (err) {
      console.error("Error refreshing earnings:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return (todaysOrders || []).filter((order) => {
      const matchesSearch = `${order.customer} ${order.orderId}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPayment =
        payment === "all" ? true : order.payment.toLowerCase() === payment.toLowerCase();

      return matchesSearch && matchesPayment;
    });
  }, [todaysOrders, search, payment]);

  const filteredHistory = useMemo(() => {
    return (earningsHistory || []).filter((item) =>
      item.date.toLowerCase().includes(search.toLowerCase()),
    );
  }, [earningsHistory, search]);

  const validTopProducts = useMemo(() => {
    if (!Array.isArray(topProducts)) return [];
    return topProducts.filter((item) => {
      const itemName = String(item.name || item.title || "").trim();
      return itemName && itemName.toLowerCase() !== "special item";
    });
  }, [topProducts]);

  const hasAnyData =
    (todaysOrders && todaysOrders.length > 0) || (earningsHistory && earningsHistory.length > 0);

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    const summaryData = [
      {
        "Today's Earnings": earningsSummary.todayEarnings,
        "Today's Orders": earningsSummary.todayOrders,
        "Average Order": earningsSummary.averageOrderValue,
        "COD Pending": earningsSummary.codPending,
        "Online Received": earningsSummary.onlineReceived,
        "Monthly Revenue": earningsSummary.monthlyRevenue,
      },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    const ordersSheet = XLSX.utils.json_to_sheet(
      filteredOrders.map((order) => ({
        OrderID: order.orderId,
        Customer: order.customer,
        Phone: order.phone,
        Payment: order.payment,
        Status: order.status,
        Amount: order.amount,
        Time: order.time,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, ordersSheet, "Today Orders");

    const historySheet = XLSX.utils.json_to_sheet(filteredHistory);
    XLSX.utils.book_append_sheet(workbook, historySheet, "History");

    XLSX.writeFile(
      workbook,
      `Earnings_Report_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h3">Earnings & Revenue</Typography>
          <Typography variant="small" className="mt-0.5">
            Track your earnings, payments, revenue trends and analytics.
          </Typography>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="!h-9 !px-4 !text-xs !bg-white hover:!bg-slate-50 shadow-sm"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={loading || !hasAnyData}
            title={!hasAnyData ? "No data to export yet" : "Download as Excel"}
            className="!h-9 !px-4 !text-xs shadow-sm"
          >
            <Download size={14} /> Export Excel
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-xs">
          <AlertTriangle size={16} className="mt-0.5 text-rose-600 shrink-0" />
          <Typography variant="small" weight="semibold" color="text-rose-600">
            Couldn't load earnings: {error}. Try refreshing the page.
          </Typography>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs hide-scrollbar">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.key}
              variant={tab === t.key ? "primary" : "outline"}
              onClick={() => setTab(t.key)}
              className={`!h-9 !px-4 !text-xs !rounded-xl ${tab !== t.key ? "!border-transparent !text-slate-500 hover:!bg-slate-50" : "shadow-sm"}`}
            >
              <Icon size={15} /> {t.label}
            </Button>
          );
        })}
      </div>

      {(tab === "cod" || tab === "history") && (
        <Card padding="p-4" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex-1 sm:w-80">
            <Input
              type="text"
              placeholder={tab === "cod" ? "Search order ID or customer..." : "Search by date..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="!py-2 !text-sm"
            />
          </div>

          {tab === "cod" && (
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 cursor-pointer transition-all"
            >
              <option value="all">All Payments</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online</option>
            </select>
          )}
        </Card>
      )}

      {tab === "analytics" ? (
        <div className="space-y-6">
          {analyticsError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {analyticsError}
            </div>
          )}

          <SalesChart summary={salesSummary} topProducts={validTopProducts} loading={analyticsLoading} />

          <div>
            <Typography variant="small" weight="semibold" className="uppercase tracking-wide text-slate-400 mb-4 block">
              Products & Orders
            </Typography>
            <div className="grid gap-6 lg:grid-cols-2">
              <RecentOrders orders={recentOrders} loading={analyticsLoading} />
            </div>
          </div>
        </div>
      ) : loading && !earningsSummary ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-100 bg-white py-20 shadow-sm">
          <Loader2 size={28} className="animate-spin text-[#1A4D2E]" />
          <Typography variant="small" weight="medium" color="text-slate-400">Loading your earnings...</Typography>
        </div>
      ) : !loading && !hasAnyData && !error ? (
        <EmptyState
          icon={Wallet}
          title="No earnings data yet."
          description="Once you start receiving orders, your earnings will show up here."
          className="!py-20"
        />
      ) : (
        <>
          {tab === "overview" && (
            <div className="space-y-6">
              <EarningsSummaryCards summary={earningsSummary} />
              <TodaysEarnings summary={earningsSummary} />
            </div>
          )}

          {tab === "trend" && (
            <EarningsChart
              data={earningsChartData}
              filter={range}
              onFilterChange={setRange}
              onRefresh={handleRefresh}
            />
          )}

          {tab === "cod" && <CODPaymentTable orders={filteredOrders} />}

          {tab === "history" && <EarningsHistory history={filteredHistory} />}
        </>
      )}
    </motion.div>
  );
}