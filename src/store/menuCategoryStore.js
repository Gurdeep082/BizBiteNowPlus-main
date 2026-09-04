import { create } from "zustand";
import API from "../services/api";

const BASE_PATH = "/menu-categories";

const useCategoryStore = create((set, get) => ({
  categories: [],
  fullMenu: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get(`${BASE_PATH}/get`);
      const fetchedCategories =
        res.data.categories || res.data.data || res.data;

      set({ categories: fetchedCategories });
      return fetchedCategories;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to fetch categories";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.post(`${BASE_PATH}/create`, categoryData);
      const newCategory = res.data.category || res.data.data || res.data;

      set((state) => ({
        categories: [...state.categories, newCategory],
      }));

      return newCategory;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create category";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, updateData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.put(`${BASE_PATH}/${id}`, updateData);
      const updatedCategory = res.data.category || res.data.data || res.data;

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? updatedCategory : cat,
        ),
      }));

      return updatedCategory;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update category";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.delete(`${BASE_PATH}/${id}`);

      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
      }));

      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete category";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  reorderCategories: async (reorderedData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.put(`${BASE_PATH}/reorder`, reorderedData);

      const updatedCategories =
        res.data.categories || res.data.data || res.data;
      if (Array.isArray(updatedCategories)) {
        set({ categories: updatedCategories });
      } else {
        await get().fetchCategories();
      }

      return res.data;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to reorder categories";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFullMenu: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get(`${BASE_PATH}/full`);
      const menuData = res.data.menu || res.data.data || res.data;

      set({ fullMenu: menuData });
      return menuData;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to fetch full menu";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPublicFullMenu: async (sellerId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get(`${BASE_PATH}/full/${sellerId}`);
      const menuData = res.data.menu || res.data.data || res.data;

      return menuData;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Unable to fetch public menu";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  reset: () =>
    set({ categories: [], fullMenu: null, isLoading: false, error: null }),
}));

export default useCategoryStore;
