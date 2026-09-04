import { create } from "zustand";
import API from "../api/axios";
import { notifySuccess } from "../utils/toast";

const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

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
        error:
          err.response?.data?.message || "Failed to fetch orders from server.",
      });
    }
  },

  fetchOrders: async () => get().fetchSellerOrders(),
  fetchCustomerOrders: async () => get().fetchSellerOrders(),

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await API.put(
        `/orders/update/${orderId}`,
        {
          status: newStatus,
          order_status: newStatus,
          delivery_status: newStatus,
        },
        { meta: { toastError: "Couldn't update the order status" } }
      );

      notifySuccess(`Order marked as ${newStatus}`);

      set((state) => ({
        orders: state.orders.map((o) =>
          (o._id || o.id) === orderId
            ? {
                ...o,
                status: newStatus,
                order_status: newStatus,
                delivery_status: newStatus,
              }
            : o,
        ),
      }));

      await get().fetchSellerOrders();
    } catch (err) {
      console.error("Update Order Status Error:", err);
      throw err;
    }
  },

  markDineInPaid: async (orderId, paymentMethod = "Cash") => {
    try {
      await API.put(`/orders/dine-in/mark-paid/${orderId}`, {
        payment_method: paymentMethod,
      });

      await get().fetchSellerOrders();
    } catch (error) {
      console.error("Failed to mark order as paid", error);
      throw error;
    }
  },

  assignOrder: async (orderId, deliveryBoyId, phone, boyObj) => {
    try {
      const res = await API.post(
        "/orders/assign",
        {
          orderId,
          order_id: orderId,
          deliveryBoyId,
          delivery_boy_id: deliveryBoyId,
          phone,
        },
        { meta: { toastError: "Couldn't assign the order" } }
      );

      notifySuccess(
        boyObj?.name ? `Order assigned to ${boyObj.name}` : "Order assigned"
      );

      set((state) => ({
        orders: state.orders.map((o) =>
          (o._id || o.id) === orderId
            ? {
                ...o,
                delivery_boy_id: boyObj || deliveryBoyId,
                status: "Out for Delivery",
                delivery_status: "Out for Delivery",
              }
            : o,
        ),
      }));

      await get().fetchSellerOrders();

      return res.data;
    } catch (err) {
      console.error("Assign Order Error:", err);
      throw err;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      await API.delete(`/orders/delete/${orderId}`, {
        meta: { toastError: "Couldn't delete the order" },
      });

      set((state) => ({
        orders: state.orders.filter((o) => (o._id || o.id) !== orderId),
      }));

      notifySuccess("Order deleted");
    } catch (err) {
      console.error("Delete Order Error:", err);
      throw err;
    }
  },
}));

export default useOrderStore;
