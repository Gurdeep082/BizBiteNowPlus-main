import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  ShoppingBag,
  Clock3,
  UserCheck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";

// TERA CUSTOM BUTTON COMPONENT
import Button from "../../../components/UI/Button";

import useSellerDashboardStore from "../../../store/sellerDashboardStore";
import useAnalyticsStore from "../../../store/analyticsStore";
import useOrderStore from "../../../store/sellerOrderStore";
import useAuthStore from "../../../store/authStore";
import axiosInstance from "../../../api/axios";
import { notifySuccess } from "../../../utils/toast";

const getStatusBadge = (status) => {
  const normStatus = String(status || "").trim().toLowerCase();
  switch (normStatus) {
    case "pending":
    case "new":
    case "unassigned":
    case "assigned":
    case "placed":
    case "order_created":
      return { label: "New", bg: "bg-blue-50 text-blue-600 border-blue-200" };
    case "preparing":
      return { label: "Preparing", bg: "bg-amber-50 text-amber-600 border-amber-200" };
    case "ready":
      return { label: "Ready", bg: "bg-emerald-50 text-emerald-600 border-emerald-200" };
    case "out for delivery":
    case "delivered":
    case "completed":
      return { label: "Completed", bg: "bg-purple-50 text-purple-600 border-purple-200" };
    case "cancelled":
    case "canceled":
      return { label: "Cancelled", bg: "bg-rose-50 text-rose-600 border-rose-200" };
    default:
      return { label: status || "New", bg: "bg-slate-50 text-slate-600 border-slate-200" };
  }
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { profile, fetchDashboardOverview } = useSellerDashboardStore();
  const { topProducts = [], fetchAnalyticsOverview } = useAnalyticsStore();

  const rawOrders = useOrderStore((state) => state.orders);
  const ordersLoading = useOrderStore((state) => state.isLoading);
  const fetchSellerOrders = useOrderStore((state) => state.fetchSellerOrders);

  const ordersList = useMemo(() => (Array.isArray(rawOrders) ? rawOrders : []), [rawOrders]);

  const [isOpen, setIsOpen] = useState(true);
  const [isToggleLoading, setIsToggleLoading] = useState(false);
  const [liveTime, setLiveTime] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  // 🟢 Earnings API States
  const [earningsData, setEarningsData] = useState(null);
  const [isEarningsLoading, setIsEarningsLoading] = useState(false);
  const [earningsRange, setEarningsRange] = useState("today");

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Weekly", value: "7d" },
    { label: "Monthly", value: "30d" },
  ];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setFormattedDate(
        now.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardOverview();
    if (typeof fetchSellerOrders === "function") {
      fetchSellerOrders();
    }
  }, [fetchDashboardOverview, fetchSellerOrders]);

  useEffect(() => {
    fetchAnalyticsOverview(profile?.tier || "PLUS");
  }, [profile?.tier, fetchAnalyticsOverview]);

  useEffect(() => {
    if (profile) {
      const openStatus = profile?.store_profile?.is_open ?? profile?.is_open ?? true;
      setIsOpen(Boolean(openStatus));
    }
  }, [profile]);

  // 🟢 Fetch dynamic earnings data
  useEffect(() => {
    const fetchEarningsData = async () => {
      setIsEarningsLoading(true);
      try {
        const response = await axiosInstance.get(`/earnings/dashboard?range=${earningsRange}`);
        setEarningsData(response.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch earnings overview:", error);
      } finally {
        setIsEarningsLoading(false);
      }
    };

    fetchEarningsData();
  }, [earningsRange]);

  const handleToggleStatus = async () => {
    if (isToggleLoading) return;
    const nextStatus = !isOpen;
    setIsOpen(nextStatus);
    setIsToggleLoading(true);

    try {
      await axiosInstance.put(
        "/seller/me",
        {
          section: "store_profile",
          data: { is_open: nextStatus },
        },
        { meta: { toastError: "Couldn't update store status" } }
      );
      notifySuccess(nextStatus ? "Restaurant is now open" : "Restaurant is now closed");
      if (typeof fetchDashboardOverview === "function") {
        await fetchDashboardOverview();
      }
    } catch (error) {
      console.error("Failed to update store status:", error);
      setIsOpen(!nextStatus);
    } finally {
      setIsToggleLoading(false);
    }
  };

  const orderMetrics = useMemo(() => {
    const total = ordersList.length;
    let pending = 0, preparing = 0, completed = 0, cancelled = 0, revenue = 0;

    ordersList.forEach((o) => {
      const status = String(o.order_status || o.status || o.delivery_status || "").trim().toLowerCase();
      const amount = o.total_amount ?? o.summary?.total ?? o.amount ?? 0;

      if (["pending", "new", "unassigned", "assigned", "placed", "order_created"].includes(status)) {
        pending++;
      } else if (status === "preparing") {
        preparing++;
      } else if (["ready", "out for delivery", "delivered", "completed"].includes(status)) {
        completed++;
      } else if (["cancelled", "canceled"].includes(status)) {
        cancelled++;
      } else {
        pending++;
      }

      if (status !== "cancelled" && status !== "canceled") {
        revenue += amount;
      }
    });

    return { total, pending, preparing, completed, cancelled, revenue };
  }, [ordersList]);

  const recentRealOrders = useMemo(() => {
    return [...ordersList]
      .sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0))
      .slice(0, 5)
      .map((o) => {
        const rawMongoId = String(o._id || o.id || "");
        const statusStr = String(o.order_status || o.status || o.delivery_status || "Pending");
        const badge = getStatusBadge(statusStr);
        const itemsArr = Array.isArray(o.items) ? o.items : Array.isArray(o.order_items) ? o.order_items : [];
        const firstItem = itemsArr[0] || {};
        const productObj = firstItem.product_id || firstItem.product || {};

        const realImage =
          o.image ||
          productObj.image ||
          productObj.img ||
          productObj.image_url ||
          firstItem.image ||
          firstItem.img ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";

        const orderTime = o.createdAt || o.created_at
          ? new Date(o.createdAt || o.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "Recently";

        return {
          id: o.order_id || o.orderId || (rawMongoId ? `#BN${rawMongoId.slice(-5).toUpperCase()}` : "#ORD"),
          customer: o.customer_name || o.customer?.name || o.user_name || "Guest Customer",
          itemsCount: itemsArr.length || 1,
          amount: o.total_amount ?? o.summary?.total ?? o.amount ?? 0,
          status: badge.label,
          badgeBg: badge.bg,
          time: orderTime,
          image: realImage,
        };
      });
  }, [ordersList]);

  const computedTopProducts = useMemo(() => {
    const productMap = {};

    if (ordersList && ordersList.length > 0) {
      ordersList.forEach((order) => {
        const status = String(order.order_status || order.status || order.delivery_status || "").trim().toLowerCase();
        if (["cancelled", "canceled"].includes(status)) return;

        const itemsArr = Array.isArray(order.items) ? order.items : Array.isArray(order.order_items) ? order.order_items : [];

        itemsArr.forEach((item) => {
          const prod = item.product_id || item.product || {};
          const name = prod.name || item.name;
          const image = prod.image || prod.img || item.image || item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
          const qty = Number(item.quantity) || 1;

          if (!name) return;

          if (!productMap[name]) {
            productMap[name] = { name, image, ordersCount: 0 };
          }
          productMap[name].ordersCount += qty;
        });
      });

      const sortedLive = Object.values(productMap).sort((a, b) => b.ordersCount - a.ordersCount);
      if (sortedLive.length > 0) return sortedLive.slice(0, 5);
    }

    if (topProducts && topProducts.length > 0) {
      return topProducts.slice(0, 5).map((item) => {
        const prod = item.product_id || item.product || {};
        return {
          name: item.name || item.title || prod.name || "Special Item",
          ordersCount: item.ordersCount || item.count || item.quantity || 1,
          image: item.image || prod.image || prod.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100",
        };
      });
    }

    return [];
  }, [topProducts, ordersList]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-5 pb-12 font-sans">

      {/* 🟡 HERO TOP ROW: COMPACT DATE & LIVE TIME */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0">
              <Calendar size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Today</p>
              <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <Clock size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400">Live Time</p>
              <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{liveTime}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-[#16522D] p-5 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Restaurant Status</p>
              <h2 className="text-2xl font-bold mt-0.5 tracking-tight">{isOpen ? "OPEN" : "CLOSED"}</h2>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {isOpen ? "Your restaurant is currently accepting online orders." : "Online orders are paused."}
              </p>
            </div>
            <span className={`flex h-3 w-3 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"} shadow-xs`} />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/20 p-3 backdrop-blur-sm border border-white/10">
            <div>
              <p className="text-xs font-bold text-white">Restaurant Open</p>
              <p className="text-[10px] text-emerald-200">
                {isOpen ? "Customers can place orders online." : "Store is currently marked offline."}
              </p>
            </div>
            {/* Custom Button used as Toggle Switch */}
            <Button
              onClick={handleToggleStatus}
              disabled={isToggleLoading}
              className={`!h-6 !w-11 !px-0 !rounded-full !border-0 transition-colors duration-200 ${isOpen ? "!bg-amber-500" : "!bg-slate-600"}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${isOpen ? "translate-x-3" : "-translate-x-2.5"}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* 📊 5 LIVE METRICS ROW */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShoppingBag size={16} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{orderMetrics.total}</h3>
          <p className="text-[11px] font-semibold text-emerald-600">Live updated</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Pending</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Clock3 size={16} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{orderMetrics.pending}</h3>
          <Button variant="outline" onClick={() => navigate("/seller/orders")} className="!h-7 !px-2 !text-[11px] !rounded-lg w-full mt-1">
            View orders →
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Preparing</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><UserCheck size={16} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{orderMetrics.preparing}</h3>
          <Button variant="outline" onClick={() => navigate("/seller/orders")} className="!h-7 !px-2 !text-[11px] !rounded-lg w-full mt-1">
            View orders →
          </Button>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Completed</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600"><CheckCircle2 size={16} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{orderMetrics.completed}</h3>
          <p className="text-[11px] font-semibold text-purple-600">Delivered / Ready</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Cancelled</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><XCircle size={16} /></div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{orderMetrics.cancelled}</h3>
          <p className="text-[11px] font-semibold text-rose-500">Cancelled</p>
        </div>
      </div>

      {/* 🟢 BOTTOM 3 PANELS ROW */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* PANEL 1: RECENT ORDERS */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Recent Orders</h3>
            <Button variant="outline" onClick={() => navigate("/seller/orders")} className="!h-7 !px-3 !text-[10px] !rounded-lg">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                <Loader2 size={20} className="animate-spin text-emerald-600" />
                <p className="text-xs font-medium">Loading orders...</p>
              </div>
            ) : recentRealOrders.length === 0 ? (
              <p className="py-10 text-center text-xs text-slate-400 font-medium">No recent orders found.</p>
            ) : (
              recentRealOrders.map((ord) => (
                <div key={ord.id} onClick={() => navigate("/seller/orders")} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                      <img src={ord.image} alt="food" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-700">{ord.id}</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{ord.customer}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {ord.itemsCount} Item(s) &middot; <span className="font-bold text-slate-700">₹{ord.amount}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${ord.badgeBg}`}>{ord.status}</span>
                    <span className="text-[10px] font-medium text-slate-400">{ord.time}</span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                </div>
              ))
            )}
          </div>

          <Button variant="primary" onClick={() => navigate("/seller/orders")} className="w-full mt-2">
            View all orders →
          </Button>
        </div>

        {/* 🟢 PANEL 2: TOP SELLING ITEMS */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Top Selling Items</h3>
            <Button variant="outline" onClick={() => navigate("/seller/products")} className="!h-7 !px-3 !text-[10px] !rounded-lg">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                <Loader2 size={20} className="animate-spin text-emerald-600" />
                <p className="text-xs font-medium">Loading items...</p>
              </div>
            ) : computedTopProducts.length > 0 ? (
              computedTopProducts.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{idx + 1}. {item.name}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">{item.ordersCount} Orders</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-10 text-center text-xs text-slate-400 font-medium">No sales recorded yet.</p>
            )}
          </div>
        </div>

        {/* PANEL 3: EARNINGS OVERVIEW (Dynamic Filters) */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Earnings</h3>

              {/* 🟢 Custom Pill Filters */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                {filterOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={earningsRange === opt.value ? "primary" : "outline"}
                    onClick={() => setEarningsRange(opt.value)}
                    className="!h-7 !px-3 !text-[10px] !rounded-md"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {isEarningsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                <Loader2 size={20} className="animate-spin text-emerald-600" />
                <p className="text-xs font-medium">Loading earnings...</p>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    {earningsRange === 'today' ? "Today's Earnings" : earningsRange === '7d' ? "This Week's Earnings" : "This Month's Earnings"}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                    ₹{(
                      (earningsRange === "today"
                        ? earningsData?.earningsSummary?.todayEarnings
                        : earningsRange === "7d"
                          ? (earningsData?.earningsSummary?.weeklyRevenue ?? earningsData?.earningsSummary?.monthlyRevenue ?? earningsData?.earningsSummary?.totalRevenue)
                          : (earningsData?.earningsSummary?.monthlyRevenue ?? earningsData?.earningsSummary?.totalRevenue)) || 0
                    ).toLocaleString("en-IN")}
                  </h2>

                  {earningsData?.earningsSummary?.revenueGrowth > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      +{earningsData.earningsSummary.revenueGrowth}% Growth
                    </span>
                  )}
                </div>

                <div className="my-4 h-16 w-full opacity-60">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30">
                    <path d="M0,25 Q15,10 30,20 T60,15 T90,5 T100,2" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                  <p className="font-bold text-slate-800 text-[11px]">Breakdown</p>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Average Order Value</span>
                    <span className="font-bold text-slate-900">
                      ₹{(earningsData?.earningsSummary?.averageOrderValue || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Online Payments Received</span>
                    <span className="font-bold text-slate-900">
                      ₹{(earningsData?.earningsSummary?.onlineReceived || 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Cash on Delivery (Pending)</span>
                    <span className="font-bold text-amber-600">
                      ₹{(earningsData?.earningsSummary?.codPending || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button variant="primary" onClick={() => navigate("/seller/earnings")} className="w-full mt-2">
            View full earnings →
          </Button>
        </div>
      </div>
    </motion.div>
  );
}