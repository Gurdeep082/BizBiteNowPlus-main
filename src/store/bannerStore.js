import { create } from "zustand";
import API from "../services/api";

const useBannerStore = create((set) => ({
  banners: [],       // seller's own (settings page)
  publicBanners: [],  // customer-facing
  isLoading: false,
  error: null,

  // GET /banners — seller's own banners
  fetchMyBanners: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get("/banners");
      set({ banners: res.data.banners || [] });
      return res.data.banners;
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to fetch banners";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // GET /banners/public/:sellerId — customer home page
  fetchPublicBanners: async (sellerId) => {
    try {
      const res = await API.get(`/banners/public/${sellerId}`);
      const list = res.data.banners || [];
      set({ publicBanners: list });
      return list;
    } catch (err) {
      set({ publicBanners: [] });
      return [];
    }
  },

  createBanner: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({ banners: [...state.banners, res.data.banner] }));
      return res.data.banner;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create banner";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBanner: async (id, formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.put(`/banners/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        banners: state.banners.map((b) => (b._id === id ? res.data.banner : b)),
      }));
      return res.data.banner;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update banner";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteBanner: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await API.delete(`/banners/${id}`);
      set((state) => ({ banners: state.banners.filter((b) => b._id !== id) }));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete banner";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useBannerStore;