import { create } from "zustand";
import API from "../services/api";

const TIER_RANK = { FREE: 0, PRO: 1, PLUS: 2 };
const tierAtLeast = (tier, min) => (TIER_RANK[tier] ?? 0) >= (TIER_RANK[min] ?? 0);

// ===========================
// DERIVE TOP PRODUCTS (INCLUDES SPECIAL MENU ITEMS)
// Aggregates standard products + special menu items across loaded orders
// ===========================
const deriveTopProducts = (orders) => {
  if (!Array.isArray(orders) || !orders.length) return [];

  const tally = new Map();

  for (const order of orders) {
    const items = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      // Fallback ID checking to ensure Special Menu items aren't skipped
      const id = item.product_id?._id || item.product_id || item._id || item.id || item.name;
      if (!id) continue;

      const name = item.product_id?.name || item.name || "Special Item";
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price ?? item.product_id?.price ?? 0);
      const isSpecial = Boolean(item.is_special || item.category === "Special Menu" || item.isSpecial);

      const existing = tally.get(id) || { id, name, quantitySold: 0, revenue: 0, isSpecial };
      existing.quantitySold += qty;
      existing.revenue += qty * price;
      tally.set(id, existing);
    }
  }

  return Array.from(tally.values()).sort((a, b) => b.quantitySold - a.quantitySold);
};

const useAnalyticsStore = create((set, get) => ({
  // STATES
  salesSummary: null,
  recentOrders: [],
  topProducts: [],
  recentActivity: [],
  loyaltyChartData: [],
  redemptionTracking: null,
  loading: false,
  error: null,

  // Fetch Sales Summary
  fetchSalesSummary: async () => {
    try {
      set({ loading: true, error: null });
      const res = await API.get("/orders/dashboard/counters");
      const raw = res.data.counters || res.data.data || res.data;
      set({ salesSummary: raw });
      return raw;
    } catch (err) {
      const status = err.response?.status;
      set({
        error:
          status === 403 || status === 400
            ? null
            : err.response?.data?.message || "Unable to load sales summary",
      });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch Recent Orders (Feeds Top Products & Special Menu Items)
  fetchRecentOrders: async (order_type) => {
    try {
      set({ loading: true, error: null });
      const params = {};
      if (order_type) params.order_type = order_type;

      const res = await API.get("/orders/list", { params });
      const list = res.data.orders || res.data.data || res.data;
      const orders = Array.isArray(list) ? list : [];

      set({
        recentOrders: orders,
        topProducts: deriveTopProducts(orders),
      });
      return orders;
    } catch (err) {
      set({ error: err.response?.data?.message || "Unable to load recent orders" });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch Extra Analytics (Recent Activity, Loyalty & Redemption)
  fetchExtraAnalytics: async () => {
    try {
      const [activityRes, loyaltyRes, redemptionRes] = await Promise.all([
        API.get("/seller/analytics/recent-activity").catch(() => null),
        API.get("/seller/analytics/loyalty-trend").catch(() => null),
        API.get("/seller/analytics/redemption-tracking").catch(() => null),
      ]);

      set({
        recentActivity: activityRes?.data?.data || [],
        loyaltyChartData: loyaltyRes?.data?.data || [],
        redemptionTracking: redemptionRes?.data?.data || null,
      });
    } catch (err) {
      console.error("Error loading extra analytics:", err);
    }
  },

  // Fetch Overview for Analytics Page
  fetchAnalyticsOverview: async (tier = "FREE") => {
    try {
      set({ loading: true, error: null });

      const calls = [
        get().fetchRecentOrders(),
        get().fetchExtraAnalytics(),
      ];

      if (tierAtLeast(tier, "PRO")) {
        calls.push(get().fetchSalesSummary());
      }

      await Promise.allSettled(calls);
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      salesSummary: null,
      recentOrders: [],
      topProducts: [],
      recentActivity: [],
      loyaltyChartData: [],
      redemptionTracking: null,
      loading: false,
      error: null,
    });
  },
}));

export default useAnalyticsStore;