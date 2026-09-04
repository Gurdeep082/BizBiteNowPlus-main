import { create } from "zustand";
import API from "../services/api";

const getLocalDateString = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const extractAmount = (order) => {
  if (!order) return 0;
  const num = Number(
    order.total_amount ??
      order.totalPrice ??
      order.total ??
      order.amount ??
      order.grandTotal ??
      0
  );
  return isNaN(num) ? 0 : num;
};

const extractDate = (order) => {
  if (!order) return new Date();
  const rawDate =
    order.createdAt ||
    order.created_at ||
    order.order_date ||
    order.date ||
    order.updatedAt;
  return rawDate ? new Date(rawDate) : new Date();
};

const processOrdersToEarnings = (orders = []) => {
  const todayStr = getLocalDateString(new Date());
  let todayEarnings = 0;
  let todayOrdersCount = 0;
  let codPending = 0;
  let onlineReceived = 0;
  let monthlyRevenue = 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const customerMap = new Map();
  const historyMap = new Map();
  const todaysOrdersList = [];

  const REJECTED_STATUSES = ["CANCELLED", "REJECTED", "DECLINED", "FAILED"];

  orders.forEach((order) => {
    const rawStatus = String(
      order.order_status || order.orderStatus || order.status || ""
    )
      .toUpperCase()
      .trim();

    if (REJECTED_STATUSES.includes(rawStatus)) {
      return;
    }

    const amt = extractAmount(order);
    const dateObj = extractDate(order);
    const orderDateStr = getLocalDateString(dateObj);

    const isToday = orderDateStr === todayStr;
    const isThisMonth =
      dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear;

    if (isThisMonth) monthlyRevenue += amt;

    // Sabhi valid orders ko history aur customer analytics me add karein
    const paymentMethod = String(
      order.payment_method || order.payment || "COD"
    ).toUpperCase();
    const isCOD = paymentMethod.includes("COD") || paymentMethod.includes("CASH");

    if (isToday) {
      todayEarnings += amt;
      todayOrdersCount += 1;

      if (isCOD) codPending += amt;
      else onlineReceived += amt;

      todaysOrdersList.push({
        orderId: order._id ? `#${order._id.slice(-6).toUpperCase()}` : "ORD-NEW",
        customer: order.customer_name || order.customer?.name || "Guest Customer",
        phone: order.customer_phone || order.customer?.phone || "N/A",
        payment: order.payment_method || order.payment || "COD",
        status: rawStatus || "ACCEPTED",
        amount: `₹${amt}`,
        time: dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }

    const phone = order.customer_phone || order.customer?.phone || "N/A";
    const name = order.customer_name || order.customer?.name || "Customer";
    if (phone !== "N/A") {
      const existing = customerMap.get(phone) || { name, phone, ordersCount: 0, totalSpent: 0 };
      existing.ordersCount += 1;
      existing.totalSpent += amt;
      customerMap.set(phone, existing);
    }

    if (orderDateStr) {
      const existingHist = historyMap.get(orderDateStr) || { date: orderDateStr, orders: 0, earnings: 0 };
      existingHist.orders += 1;
      existingHist.earnings += amt;
      historyMap.set(orderDateStr, existingHist);
    }
  });

  const averageOrderValue = todayOrdersCount > 0 ? Math.round(todayEarnings / todayOrdersCount) : 0;

  return {
    earningsSummary: {
      todayEarnings: `₹${todayEarnings}`,
      todayOrders: todayOrdersCount,
      averageOrderValue: `₹${averageOrderValue}`,
      codPending: `₹${codPending}`,
      onlineReceived: `₹${onlineReceived}`,
      monthlyRevenue: `₹${monthlyRevenue}`,
    },
    earningsChartData: Array.from(historyMap.values()).map((h) => ({ label: h.date, earnings: h.earnings, orders: h.orders })),
    todaysOrders: todaysOrdersList,
    earningsHistory: Array.from(historyMap.values()),
    regularCustomers: Array.from(customerMap.values()).map((c) => ({ ...c, totalSpent: `₹${c.totalSpent}` })),
  };
};

const useEarningStore = create((set) => ({
  earningsSummary: {
    todayEarnings: "₹0",
    todayOrders: 0,
    averageOrderValue: "₹0",
    codPending: "₹0",
    onlineReceived: "₹0",
    monthlyRevenue: "₹0",
  },
  earningsChartData: [],
  todaysOrders: [],
  earningsHistory: [],
  regularCustomers: [],
  loading: false,
  error: null,

  fetchEarnings: async (range) => {
    try {
      set({ loading: true, error: null });

      let rawData = null;

      // 1️⃣ Pehle dedicated earnings endpoint try karein
      try {
        const res = await API.get("/earnings/dashboard", { params: { range } });
        const apiData = res.data.data || res.data;
        if (apiData && apiData.earningsSummary) {
          rawData = apiData;
        }
      } catch {
        // Fallback to orders list if endpoint fails
      }

      // 2️⃣ Agar dedicated endpoint data na de, toh orders fetch karke khud calculate karein
      if (!rawData) {
        const ordersRes = await API.get("/orders/list").catch(() => API.get("/orders/seller/list"));
        const ordersList = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data.orders || ordersRes.data.data || [];

        rawData = processOrdersToEarnings(ordersList);
      }

      set({
        earningsSummary: rawData.earningsSummary || { todayEarnings: "₹0", todayOrders: 0, averageOrderValue: "₹0", codPending: "₹0", onlineReceived: "₹0", monthlyRevenue: "₹0" },
        earningsChartData: rawData.earningsChartData || [],
        todaysOrders: rawData.todaysOrders || [],
        earningsHistory: rawData.earningsHistory || [],
        regularCustomers: rawData.regularCustomers || [],
      });

      return rawData;
    } catch (err) {
      set({ error: err.response?.data?.message || "Unable to calculate earnings data" });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      earningsSummary: { todayEarnings: "₹0", todayOrders: 0, averageOrderValue: "₹0", codPending: "₹0", onlineReceived: "₹0", monthlyRevenue: "₹0" },
      earningsChartData: [],
      todaysOrders: [],
      earningsHistory: [],
      regularCustomers: [],
      loading: false,
      error: null,
    });
  },
}));

export default useEarningStore;