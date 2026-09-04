import { create } from "zustand";
import { devtools } from "zustand/middleware";
import API from "../services/api";

const useDiscountStore = create(
  devtools(
    (set) => ({
      // Store state
      discounts: [],
      appliedDiscount: null,
      loyaltySettings: null,
      isLoading: false,
      error: null,

      // Create discount
      createDiscount: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.post("/discounts/", payload);
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Creation failed",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Get discounts
      getDiscounts: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.get("/discounts/");
          const discounts = res.data?.discounts ?? res.data ?? [];
          set({ discounts });
          return discounts;
        } catch (err) {
          set({ error: err.response?.data?.message || "Load failed" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update discount
      updateDiscount: async (id, payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.put(`/discounts/${id}`, payload);
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Update failed",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Delete discount
      deleteDiscount: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.delete(`/discounts/${id}`);
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Delete failed",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Send push
      sendPushNotification: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.post("/notifications/send", payload);
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Push failed",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Check discount
      checkDiscount: async (
        code,
        sellerId,
        customerPhone,
        cartTotal,
        cartItems = [],
      ) => {
        try {
          console.log("🔵 CHECK DISCOUNT TRIGGERED WITH:", {
            code,
            sellerId,
            customerPhone,
            cartTotal,
          });

          const cleanCartItems = cartItems.map((item) => ({
            product_id:
              item.product_id?._id || item.product_id?.id || item.product_id,
            price: item.price || item.product_id?.price || 0,
            quantity: item.quantity || 1,
          }));

          const payload = {
            code,
            seller_id: sellerId,
            customer_phone: customerPhone,
            cart_total: cartTotal,
            cart_items: cleanCartItems,
          };

          console.log("🟡 SENDING PAYLOAD TO BACKEND:", payload);

          const res = await API.post("/discounts/check", payload);
          return res.data;
        } catch (error) {
          console.error(
            "🔴 DISCOUNT API REJECTED. BACKEND RESPONSE:",
            error.response?.data || error.message,
          );
          throw error;
        }
      },

      // Clear applied
      clearAppliedDiscount: () => set({ appliedDiscount: null, error: null }),

      // Loyalty settings — get seller's stamp program config
      getLoyaltySettings: async () => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.get("/loyalty/settings");
          const settings = res.data?.settings ?? null;
          set({ loyaltySettings: settings });
          return settings;
        } catch (err) {
          set({ error: err.response?.data?.message || "Load failed" });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Loyalty settings — save seller's stamp program config
      updateLoyaltySettings: async (payload) => {
        try {
          set({ isLoading: true, error: null });
          const res = await API.put("/loyalty/settings", payload);
          const settings = res.data?.settings ?? null;
          set({ loyaltySettings: settings });
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Update failed",
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "DiscountStore" },
  ),
);

export default useDiscountStore;
