import { create } from "zustand";
import useAuthStore from "../../../store/authStore";
import api from "../../localOrderApi";

// Helper: normalizes error shapes into one string
const extractErrorMessage = (error, fallbackMsg) =>
  error.response?.data?.message || error.message || fallbackMsg;

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Direct aliases to prevent undefined function errors in Checkout.jsx / Home.jsx
  placeOrder: async (payload) => get().createOrder(payload),
  createCustomerOrder: async (payload) => get().createOrder(payload),

  // Alias for Home.jsx / Orders.jsx — resolves the logged-in customer's
  // identity the same way the rest of the app does
  fetchOrders: async () => {
    const authState = useAuthStore.getState();
    const sellerId =
      authState.profile?.seller_id || localStorage.getItem("seller_id");
    const customerPhone =
      authState.profile?.customer_phone ||
      authState.user?.phoneNumber ||
      authState.user?.phone ||
      localStorage.getItem("customer_phone");
    return await get().fetchCustomerOrders(sellerId, customerPhone);
  },

  // POST /api/orders/create — naya order place karna
  createOrder: async (orderPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/create", orderPayload);
      const newOrder = response.data?.order || response.data?.data || response.data;

      if (!newOrder) {
        throw new Error("Order created but server response was missing order data.");
      }

      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
      }));

      return newOrder;
    } catch (error) {
      console.error("createOrder failed:", error.response?.data || error.message);
      const msg = extractErrorMessage(error, "Failed to place order.");
      set({ error: msg });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // 🔐 Razorpay: Step 1 — backend pe razorpay order initiate
  createRazorpayOrder: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/checkout/initiate", payload);
      return res.data?.data || res.data;
    } catch (err) {
      console.error("Create Razorpay Order Error:", err);
      const msg = extractErrorMessage(err, "Failed to initiate payment");
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // 🔐 Razorpay: Step 2 — payment signature verify on backend
  verifyRazorpayPayment: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/checkout/verify", payload);
      return res.data?.data || res.data;
    } catch (err) {
      console.error("Verify Razorpay Payment Error:", err);
      const msg = extractErrorMessage(err, "Payment verification failed");
      set({ error: msg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch Single Order by ID
  fetchOrderById: async (id) => {
    if (!id) {
      set({ error: "Order id missing.", loading: false });
      return null;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.get(`/${id}`);
      const orderData = response.data?.order ?? response.data?.data ?? null;

      if (orderData) {
        set((state) => ({
          orders: [
            ...state.orders.filter((o) => String(o._id || o.id) !== String(id)),
            orderData,
          ],
          currentOrder: orderData,
        }));
      }

      return orderData;
    } catch (error) {
      console.error("fetchOrderById failed:", error.response?.data || error.message);
      set({
        error: extractErrorMessage(error, "Order not found."),
        currentOrder: null,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch All Customer Orders
  fetchCustomerOrders: async (sellerId, customerPhone) => {
    set({ loading: true, error: null });
    try {
      const seller_id = sellerId || localStorage.getItem("seller_id");
      const customer_phone = customerPhone || localStorage.getItem("customer_phone");

      let res;
      if (seller_id && customer_phone) {
        res = await api.get("/customer-orders", {
          params: { seller_id, customer_phone },
        });
      } else {
        res = await api.get("/customer-orders");
      }

      const rawList =
        res.data?.orders ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);
      const validList = Array.isArray(rawList) ? rawList : [];

      set({ orders: validList, error: null, loading: false });
      return validList;
    } catch (error) {
      console.error("fetchCustomerOrders failed:", error.response?.data || error.message);
      set({
        loading: false,
        error: extractErrorMessage(error, "Failed to load your orders."),
        orders: [],
      });
      return [];
    }
  },

  // PUT /api/orders/update/:id — order update karna
  updateOrder: async (id, updatePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/update/${id}`, updatePayload);
      const updatedOrder = response.data?.order || response.data?.data;
      set((state) => ({
        orders: state.orders.map((o) => (String(o._id || o.id) === String(id) ? updatedOrder : o)),
        currentOrder:
          state.currentOrder && String(state.currentOrder._id || state.currentOrder.id) === String(id)
            ? updatedOrder
            : state.currentOrder,
        loading: false,
      }));
      return updatedOrder;
    } catch (error) {
      console.error("updateOrder failed:", error.response?.data || error.message);
      set({ loading: false, error: extractErrorMessage(error, "Failed to update order.") });
      throw error;
    }
  },

  // PATCH /api/orders/:id/cancel — customer-initiated cancel
  cancelOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/${id}/cancel`);
      const updatedOrder = response.data?.order || response.data?.data;
      set((state) => ({
        orders: state.orders.map((o) => (String(o._id || o.id) === String(id) ? updatedOrder : o)),
        currentOrder:
          state.currentOrder && String(state.currentOrder._id || state.currentOrder.id) === String(id)
            ? updatedOrder
            : state.currentOrder,
        loading: false,
      }));
      return updatedOrder;
    } catch (error) {
      console.error("cancelOrder failed:", error.response?.data || error.message);
      set({ loading: false, error: extractErrorMessage(error, "Failed to cancel order.") });
      throw error;
    }
  },

  // GET /api/orders/:id/track
  trackOrder: async (id) => {
    try {
      const response = await api.get(`/${id}/track`);
      return response.data?.tracking ?? response.data?.data ?? null;
    } catch (error) {
      console.error("trackOrder failed:", error.response?.data || error.message);
      set({ error: extractErrorMessage(error, "Failed to fetch tracking info.") });
      throw error;
    }
  },

  // DELETE /api/orders/delete/:id
  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/delete/${id}`);
      set((state) => ({
        orders: state.orders.filter((o) => String(o._id || o.id) !== String(id)),
        currentOrder: state.currentOrder && String(state.currentOrder._id || state.currentOrder.id) === String(id) ? null : state.currentOrder,
        loading: false,
      }));
    } catch (error) {
      console.error("deleteOrder failed:", error.response?.data || error.message);
      set({ loading: false, error: extractErrorMessage(error, "Failed to delete order.") });
      throw error;
    }
  },

  // POST /api/orders/reorder
  createReorder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/reorder", { orderId });
      const newOrder = response.data?.order || response.data?.data;
      set((state) => ({
        orders: newOrder ? [newOrder, ...state.orders] : state.orders,
        loading: false,
      }));
      return newOrder;
    } catch (error) {
      console.error("createReorder failed:", error.response?.data || error.message);
      set({ loading: false, error: extractErrorMessage(error, "Failed to reorder.") });
      throw error;
    }
  },

  // Aliases for payment endpoints
  initiatePayment: async (paymentPayload) => get().createRazorpayOrder(paymentPayload),
  verifyPayment: async (verifyPayload) => get().verifyRazorpayPayment(verifyPayload),

  getOrderById: (id) => {
    const list = get().orders || [];
    return list.find(
      (o) =>
        String(o?._id) === String(id) ||
        String(o?.id) === String(id) ||
        o?.razorpay_order_id === id,
    );
  },

  findOrderLocally: (id) => {
    const state = get();
    return state.orders.find((o) => String(o._id || o.id) === String(id));
  },

  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),

  reset: () =>
    set({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
    }),
}));

export default useOrderStore;