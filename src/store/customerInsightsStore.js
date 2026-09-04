import { create } from "zustand";
import API from "../services/api";

// Talks to:
//   GET /api/orders/customers              -> customer list (name, phone, order count)
//   GET /api/orders/customers/:phone/details -> full profile + insights + order history

const useCustomerInsightsStore = create((set, get) => ({
  customers: [],
  loadingCustomers: false,
  customersError: null,

  customerDetails: null,
  loadingDetails: false,
  detailsError: null,

  fetchCustomers: async () => {
    set({ loadingCustomers: true, customersError: null });
    try {
      const res = await API.get("/orders/customers");
      const list = res.data?.customers || res.data?.data || [];
      const normalized = Array.isArray(list) ? list : [];
      set({ customers: normalized, loadingCustomers: false });
      return normalized;
    } catch (err) {
      console.error("fetchCustomers failed:", err.response?.data || err.message);
      set({
        loadingCustomers: false,
        customersError: err.response?.data?.message || "Could not load customers",
        customers: [],
      });
      return [];
    }
  },

  fetchCustomerDetails: async (phone) => {
    if (!phone) return null;
    set({ loadingDetails: true, detailsError: null, customerDetails: null });
    try {
      const res = await API.get(`/orders/customers/${phone}/details`);
      set({ customerDetails: res.data, loadingDetails: false });
      return res.data;
    } catch (err) {
      console.error("fetchCustomerDetails failed:", err.response?.data || err.message);
      set({
        loadingDetails: false,
        detailsError: err.response?.data?.message || "Could not load customer details",
      });
      throw err;
    }
  },

  clearCustomerDetails: () => set({ customerDetails: null, detailsError: null }),
}));

export default useCustomerInsightsStore;