import { create } from "zustand";
import { ShoppingCart, PackageX, Truck, CheckCircle2, IndianRupee } from "lucide-react";
import { mockData } from "../data/mockData";

const TIER_RANK = { FREE: 0, PRO: 1, PLUS: 2 };
const tierAtLeast = (tier, min) => (TIER_RANK[tier] ?? 0) >= (TIER_RANK[min] ?? 0);

const buildStatsFromCounters = (counters) => {
  if (!counters) return [];

  return [
    {
      id: "totalOrders",
      title: "Total Orders",
      value: counters.totalOrders ?? 0,
      icon: ShoppingCart,
      trend: 0,
      subtitle: "current total",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "unassigned",
      title: "Unassigned",
      value: counters.unassignedCount ?? 0,
      icon: PackageX,
      trend: 0,
      subtitle: "needs a rider",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      id: "assigned",
      title: "Out for Delivery",
      value: counters.assignedCount ?? 0,
      icon: Truck,
      trend: 0,
      subtitle: "in progress",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: "delivered",
      title: "Delivered",
      value: counters.deliveredCount ?? 0,
      icon: CheckCircle2,
      trend: 0,
      subtitle: "completed",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: `₹${counters.totalRevenue ?? 0}`,
      icon: IndianRupee,
      trend: 0,
      subtitle: "current total",
      iconBg: "bg-[#1A4D2E]/10",
      iconColor: "text-[#1A4D2E]",
    },
  ];
};

const useSellerDashboardStore = create((set, get) => ({
  // ===========================
  // STATES
  // ===========================
  profile: null,
  stats: [],
  counters: null,
  clusters: [],
  
  // Analytics States (NEW)
  revenueTrend: [],
  yoyComparison: null,
  budgetBreakdown: null,

  isLoading: false,
  error: null,

  // ===========================
  // ACTIONS & FETCHERS
  // ===========================

  fetchSellerProfile: async () => {
    set({ profile: mockData.seller, isLoading: false, error: null });
    return mockData.seller;
  },

  fetchAnalyticsData: async () => {
    try {
      set({ isLoading: true, error: null });

      const [trendRes, yoyRes, budgetRes] = await Promise.all([
        API.get("/seller/analytics/revenue-trend").catch(() => null),
        API.get("/seller/analytics/yoy-comparison").catch(() => null),
        API.get("/seller/analytics/budget-breakdown").catch(() => null),
      ]);

      set({
        revenueTrend: trendRes?.data?.data || [],
        yoyComparison: yoyRes?.data?.data || null,
        budgetBreakdown: budgetRes?.data?.data || null,
      });
    } catch (err) {
      console.error("Error fetching analytics data:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Combined Dashboard Overview
  fetchDashboardOverview: async () => {
    try {
      set({ isLoading: true, error: null });

      const profileRes = await API.get("/seller/me");
      const profile = profileRes.data.seller || profileRes.data.data || profileRes.data;
      set({ profile });

      const tier = profile?.tier || "FREE";

      const calls = [];
      if (tierAtLeast(tier, "PRO")) {
        calls.push(
          API.get("/orders/dashboard/counters").then(
            (res) => ({ key: "counters", data: res.data }),
            () => ({ key: "counters", data: null })
          )
        );
        // Fetch Analytics for PRO+
        calls.push(
          API.get("/seller/analytics/revenue-trend").then(
            (res) => ({ key: "revenueTrend", data: res.data }),
            () => ({ key: "revenueTrend", data: null })
          )
        );
        calls.push(
          API.get("/seller/analytics/yoy-comparison").then(
            (res) => ({ key: "yoyComparison", data: res.data }),
            () => ({ key: "yoyComparison", data: null })
          )
        );
        calls.push(
          API.get("/seller/analytics/budget-breakdown").then(
            (res) => ({ key: "budgetBreakdown", data: res.data }),
            () => ({ key: "budgetBreakdown", data: null })
          )
        );
      }

      if (tierAtLeast(tier, "PLUS")) {
        calls.push(
          API.get("/orders/dashboard/clusters").then(
            (res) => ({ key: "clusters", data: res.data }),
            () => ({ key: "clusters", data: null })
          )
        );
      }

      const results = await Promise.all(calls);
      const patch = {};

      for (const { key, data } of results) {
        if (!data) continue;

        if (key === "counters") {
          const raw = data.counters || data.data || data;
          patch.counters = raw;
          patch.stats = buildStatsFromCounters(raw);
        }
        if (key === "clusters") {
          const list = data.clusters || data.data || data;
          patch.clusters = Array.isArray(list)
            ? list.map((c) => ({
                mohalla: c.mohalla,
                count: c.count ?? 0,
                revenue: c.revenue ?? 0,
              }))
            : [];
        }
        if (key === "revenueTrend") patch.revenueTrend = data.data || [];
        if (key === "yoyComparison") patch.yoyComparison = data.data || null;
        if (key === "budgetBreakdown") patch.budgetBreakdown = data.data || null;
      }

      set(patch);
      return { profile, ...patch };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load seller profile",
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Selectors
  isPro: () => tierAtLeast(get().profile?.tier, "PRO"),
  isPlus: () => tierAtLeast(get().profile?.tier, "PLUS"),
  getStatById: (id) => get().stats.find((s) => s.id === id),
  
  // 🟢 Helper selector to instantly extract real store name
  getStoreName: () => {
    const p = get().profile;
    return p?.store_profile?.store_name || p?.store_profile?.name || p?.business_name || p?.name || "Store";
  },

  // Reset Store
  reset: () => {
    set({
      profile: null,
      stats: [],
      counters: null,
      clusters: [],
      revenueTrend: [],
      yoyComparison: null,
      budgetBreakdown: null,
      isLoading: false,
      error: null,
    });
  },
}));

export default useSellerDashboardStore;