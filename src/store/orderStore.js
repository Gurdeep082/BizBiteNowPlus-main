import { create } from "zustand";
import API from "../api/axios";

const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  // 1. Fetch Orders directly using Existing Backend Endpoint (/api/orders/list)
  fetchSellerOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await API.get("/orders/list");

      const fetchedOrders =
        res.data?.orders ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      set({ orders: fetchedOrders, isLoading: false, error: null });
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to fetch orders from server.",
      });
    }
  },

  // Alias functions to support existing code calls
  fetchOrders: async () => get().fetchSellerOrders(),
  fetchCustomerOrders: async () => get().fetchSellerOrders(),

  // 2. Update Order Status (Hits existing router.put("/update/:id"))
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await API.put(`/orders/update/${orderId}`, {
        status: newStatus,
        order_status: newStatus,
        delivery_status: newStatus,
      });

      // Optimistic UI State Update
      set((state) => ({
        orders: state.orders.map((o) =>
          (o._id || o.id) === orderId
            ? { ...o, status: newStatus, order_status: newStatus, delivery_status: newStatus }
            : o
        ),
      }));

      // 🟢 BUG FIX: Status change ke turant baad backend se fresh orders fetch karein 
      // taaki state aur quick action buttons bilkul sync me rahein.
      await get().fetchSellerOrders();
    } catch (err) {
      console.error("Update Order Status Error:", err);
      throw err;
    }
  },

  // 3. Assign Order to Delivery Boy (Hits existing router.post("/assign"))
  assignOrder: async (orderId, deliveryBoyId, phone, boyObj) => {
    try {
      const res = await API.post("/orders/assign", {
        orderId,
        order_id: orderId,
        deliveryBoyId,
        delivery_boy_id: deliveryBoyId,
        phone,
      });

      // Local State Update
      set((state) => ({
        orders: state.orders.map((o) =>
          (o._id || o.id) === orderId
            ? {
                ...o,
                delivery_boy_id: boyObj || deliveryBoyId,
                status: "Out for Delivery",
                delivery_status: "Out for Delivery",
              }
            : o
        ),
      }));

      // 🟢 Fresh sync after assignment
      await get().fetchSellerOrders();

      return res.data;
    } catch (err) {
      console.error("Assign Order Error:", err);
      throw err;
    }
  },

  // 4. Delete Order (Hits existing router.delete("/delete/:id"))
  deleteOrder: async (orderId) => {
    try {
      await API.delete(`/orders/delete/${orderId}`);

      set((state) => ({
        orders: state.orders.filter((o) => (o._id || o.id) !== orderId),
      }));
    } catch (err) {
      console.error("Delete Order Error:", err);
      throw err;
    }
  },
}));

export default useOrderStore;