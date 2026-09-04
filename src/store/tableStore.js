import { create } from "zustand";
import API from "../services/api";

const savedTable = (() => {
  try {
    return JSON.parse(localStorage.getItem("resolvedTable"));
  } catch {
    return null;
  }
})();

// Helper to normalize table objects from backend
const normalizeTable = (t) => {
  if (!t) return null;
  return {
    ...t,
    // Prefer Cloudinary CDN url over legacy Base64 string
    display_qr: t.qr_code_url || t.qr_code || null,
    display_url:
      t.ordering_url || (t.table_token ? `/order/${t.table_token}` : null),
  };
};

const useTableStore = create((set, get) => ({
  tables: [],
  resolvedTable: savedTable,
  loading: false,
  error: null,

  createTable: async ({ table_number }) => {
    try {
      set({ loading: true, error: null });
      const res = await API.post("/tables/create", { table_number });
      const newTable = normalizeTable(
        res.data.table || res.data.data || res.data,
      );

      if (newTable) {
        set({ tables: [...get().tables, newTable] });
      }
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unable to create table";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchTables: async (sellerId) => {
    try {
      set({ loading: true, error: null });

      const finalSellerId =
        sellerId ||
        localStorage.getItem("seller_id") ||
        import.meta.env.VITE_DEFAULT_SELLER_ID;

      if (!finalSellerId) {
        throw new Error("No Seller ID found to fetch tables.");
      }

      const res = await API.get(`/tables/list?seller_id=${finalSellerId}`);

      const list = (res.data.tables || res.data.data || res.data || []).map(
        normalizeTable,
      );

      set({ tables: list });
      return list;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Unable to load tables";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  toggleTableStatus: async (table_id) => {
    try {
      set({ loading: true, error: null });
      const res = await API.put(`/tables/toggle/${table_id}`);
      const updatedTable = normalizeTable(
        res.data.table || res.data.data || res.data,
      );

      set({
        tables: get().tables.map((t) =>
          t._id === table_id
            ? { ...t, is_active: updatedTable.is_active ?? !t.is_active }
            : t,
        ),
      });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Unable to update table status";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  resolveTable: async (token) => {
    try {
      set({ loading: true, error: null });
      const res = await API.get(`/tables/resolve/${token}`);
      const tableData = res.data.table || res.data.data || res.data;

      set({ resolvedTable: tableData });
      localStorage.setItem("resolvedTable", JSON.stringify(tableData));
      return tableData;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Invalid or inactive table QR code";
      set({ error: errorMsg, resolvedTable: null });
      localStorage.removeItem("resolvedTable");
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  setResolvedTable: (table) => {
    set({ resolvedTable: table });
    localStorage.setItem("resolvedTable", JSON.stringify(table));
  },

  clearTable: () => {
    localStorage.removeItem("resolvedTable");
    set({ resolvedTable: null, error: null });
  },

  hydrate: () => {
    try {
      const table = JSON.parse(localStorage.getItem("resolvedTable"));
      set({ resolvedTable: table });
    } catch {
      set({ resolvedTable: null });
    }
  },

  isTableResolved: () => !!get().resolvedTable,
  getSellerId: () => get().resolvedTable?.seller_id || null,
  getTableNumber: () => get().resolvedTable?.table_number || null,
  getStoreName: () => get().resolvedTable?.store_name || null,
  getMenu: () => get().resolvedTable?.menu || [],
  isUpiAvailable: () => !!get().resolvedTable?.upi_available,

  reset: () => {
    localStorage.removeItem("resolvedTable");
    set({ tables: [], resolvedTable: null, loading: false, error: null });
  },
}));

export default useTableStore;
