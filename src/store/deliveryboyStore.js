import { create } from "zustand";
import API from "../services/api";

const useDeliveryBoyStore = create((set, get) => ({
  // ===========================
  // STATES
  // ===========================

  deliveryBoys: [],

  loading: false,
  error: null,

  // ===========================
  // CREATE DELIVERY BOY -> POST /deliveryBoy/create
  // ===========================

  createDeliveryBoy: async ({ name, phoneNumber }) => {
    try {
      set({ loading: true, error: null });

      const res = await API.post("/deliveryBoy/create", {
        name,
        phoneNumber,
      });

      const boy = res.data.deliveryBoy || res.data.data || res.data;

      set({ deliveryBoys: [boy, ...get().deliveryBoys] });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to add delivery boy",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ===========================
  // LIST DELIVERY BOYS -> GET /deliveryBoy/list
  // ===========================

  fetchDeliveryBoys: async () => {
    try {
      set({ loading: true, error: null });

      const res = await API.get("/deliveryBoy/list");

      const list = res.data.deliveryBoys || res.data.data || res.data;

      set({ deliveryBoys: list });

      return list;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load delivery boys",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ===========================
  // UPDATE DELIVERY BOY -> PUT /deliveryBoy/update/:id
  // ===========================

  updateDeliveryBoy: async (id, { name, phoneNumber, is_available }) => {
    try {
      set({ loading: true, error: null });

      const res = await API.put(`/deliveryBoy/update/${id}`, {
        name,
        phoneNumber,
        is_available,
      });

      const updated = res.data.deliveryBoy || res.data.data || res.data;

      set({
        deliveryBoys: get().deliveryBoys.map((b) =>
          b._id === id ? { ...b, ...updated } : b,
        ),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to update delivery boy",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ===========================
  // TOGGLE AVAILABILITY (convenience wrapper around update)
  // ===========================

  toggleAvailability: async (id) => {
    const boy = get().deliveryBoys.find((b) => b._id === id);
    if (!boy) return;

    return get().updateDeliveryBoy(id, {
      name: boy.name,
      phoneNumber: boy.phoneNumber,
      is_available: !boy.is_available,
    });
  },

  // ===========================
  // DELETE DELIVERY BOY -> DELETE /deliveryBoy/delete/:id
  // ===========================

  deleteDeliveryBoy: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await API.delete(`/deliveryBoy/delete/${id}`);

      set({
        deliveryBoys: get().deliveryBoys.filter((b) => b._id !== id),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to delete delivery boy",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ===========================
  // RESET
  // ===========================

  reset: () => {
    set({ deliveryBoys: [], loading: false, error: null });
  },
}));

export default useDeliveryBoyStore;
