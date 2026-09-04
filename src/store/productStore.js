import { create } from "zustand";
import API from "../services/api";
import { mockProducts } from "../data/customerMockData";

const DEFAULT_SELLER_ID = import.meta.env.VITE_DEFAULT_SELLER_ID;

const fallbackCatalog = mockProducts;

const normalizeStorefrontList = (list) => {
  const normalized = Array.isArray(list) ? list : [];
  return normalized.length > 0 ? normalized : fallbackCatalog;
};

const useProductStore = create((set, get) => ({
  // ===========================
  // STATES
  // ===========================

  products: [], // seller dashboard products

  storefront: [], // public storefront products

  categories: [], // storefront category names (public)

  sellerCategories: [], // 🆕 seller's own MenuCategory docs (for dropdowns, CRUD)

  fullMenu: [], // complete categorized menu

  combos: [], // combo meals

  festiveDeals: [], // active festive offers

  mohallas: [], // delivery locations

  loading: false,

  error: null,

  // ===========================
  // ADD PRODUCT
  // ===========================

  addProduct: async (formData) => {
    try {
      set({ loading: true, error: null });

      const res = await API.post("/products/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const raw = res.data.product || res.data.data || res.data;

      set({
        products: [
          {
            ...raw,
            available: raw.is_available ?? raw.available,
          },
          ...get().products,
        ],
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to add product",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // UPDATE PRODUCT
  // ===========================

  updateProduct: async (id, formData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.put(`/products/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const raw = res.data.product || res.data.data || res.data;

      const updated = {
        ...raw,
        available: raw.is_available ?? raw.available,
      };

      set({
        products: get().products.map((p) =>
          p._id === id
            ? {
                ...p,
                ...updated,
              }
            : p,
        ),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to update product",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // DELETE PRODUCT
  // ===========================

  deleteProduct: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.delete(`/products/delete/${id}`);

      set({
        products: get().products.filter((p) => p._id !== id),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to delete product",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // DASHBOARD PRODUCTS
  // ===========================

  fetchDashboardProducts: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get("/products/dashboard/all");

      const list = res.data.products || res.data.data || res.data;

      set({
        products: list.map((p) => ({
          ...p,
          available: p.is_available ?? p.available,
        })),
      });

      return list;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load products",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // STOREFRONT PRODUCTS
  // ===========================

  fetchStorefrontCatalog: async (
    sellerId = DEFAULT_SELLER_ID,
    { category, search } = {},
  ) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const params = {};

      if (category) params.category = category;

      if (search) params.search = search;

      const res = await API.get(`/products/${sellerId}/products`, {
        params,
      });

      const list = res.data.products || res.data.data || res.data;
      const finalList = normalizeStorefrontList(list);

      set({
        storefront: finalList,
      });

      return finalList;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load catalog",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // CATEGORIES (Storefront — public, category names only)
  // ===========================

  fetchStorefrontCategories: async (sellerId = DEFAULT_SELLER_ID) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get(
        `/menu-categories/get/${sellerId}`
      );

      const list =
        res.data.categories ||
        res.data.data?.categories ||
        res.data.data ||
        [];

      const finalList = Array.isArray(list) && list.length > 0 ? list : ["Pizza", "Burgers", "Pasta", "Drinks", "Desserts", "Snacks"];

      set({
        categories: finalList,
      });

      return finalList;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load categories",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // 🆕 SELLER CATEGORIES (Seller dashboard — MenuCategory CRUD source)
  // ===========================

  fetchSellerCategories: async () => {
    try {
      set({ loading: true, error: null });

      const res = await API.get("/seller/categories/get");

      const list = res.data.categories || [];

      set({ sellerCategories: list });

      return list;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load categories",
      });

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createSellerCategory: async (payload) => {
    try {
      set({ loading: true, error: null });

      const res = await API.post("/seller/categories/create", payload);

      const category = res.data.category;

      set({ sellerCategories: [...get().sellerCategories, category] });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to create category",
      });

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateSellerCategory: async (id, payload) => {
    try {
      set({ loading: true, error: null });

      const res = await API.put(`/seller/categories/${id}`, payload);

      const updated = res.data.category;

      set({
        sellerCategories: get().sellerCategories.map((c) =>
          c._id === id ? updated : c,
        ),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to update category",
      });

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteSellerCategory: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await API.delete(`/seller/categories/${id}`);

      set({
        sellerCategories: get().sellerCategories.filter((c) => c._id !== id),
      });

      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to delete category",
      });

      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ===========================
  // FULL MENU
  // ===========================

  fetchFullMenu: async (sellerId = DEFAULT_SELLER_ID) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await API.get(`/menu-categories/full/${sellerId}`);

      const menu = res.data.menu || [];
      const grouped = Array.isArray(menu) && menu.length > 0
        ? menu
        : Object.values(
            fallbackCatalog.reduce((acc, product) => {
              const groupName = product.category || "Other";
              if (!acc[groupName]) {
                acc[groupName] = { _id: groupName, id: groupName, name: groupName, products: [] };
              }
              acc[groupName].products.push(product);
              return acc;
            }, {})
          );

      set({
        fullMenu: grouped,
      });

      return grouped;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load full menu",
      });

      throw err;
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ===========================
  // COMBOS
  // ===========================

  fetchCombos: async (sellerId = DEFAULT_SELLER_ID) => {
    try {
      const res = await API.get(`/combos/storefront/${sellerId}`);

      const combos = res.data.combos || [];

      set({
        combos,
      });

      return combos;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load combos",
      });

      throw err;
    }
  },

  // ===========================
  // FESTIVE DEALS
  // ===========================

  fetchFestiveDeals: async (sellerId = DEFAULT_SELLER_ID) => {
    try {
      const res = await API.get(`/festive-deals/storefront/${sellerId}`);

      const deals = res.data.deals || res.data.data || [];

      set({
        festiveDeals: deals,
      });

      return deals;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load festive deals",
      });

      throw err;
    }
  },

  // ===========================
  // DELIVERY LOCATIONS
  // ===========================

  fetchAvailableMohallas: async (sellerId = DEFAULT_SELLER_ID) => {
    try {
      const res = await API.get(`/customer/mohallas/${sellerId}`);

      const list = res.data.mohendra_locations || [];

      set({
        mohallas: list,
      });

      return list;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load locations",
      });

      throw err;
    }
  },

  // ===========================
  // RESET
  // ===========================

  reset: () => {
    set({
      products: [],
      storefront: [],
      categories: [],
      sellerCategories: [],
      fullMenu: [],
      combos: [],
      festiveDeals: [],
      mohallas: [],

      loading: false,
      error: null,
    });
  },
}));

export default useProductStore;
