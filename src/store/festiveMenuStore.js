import { create } from "zustand";
import API from "../services/api";
import { FESTIVE_VALIDITY_DAYS } from "../data/occasionTemplate";

const normalizeMenu = (raw) => {
  if (!raw) return null;

  const productList = Array.isArray(raw.applicable_products)
    ? raw.applicable_products
    : Array.isArray(raw.products)
      ? raw.products
      : [];

  const startDt =
    raw.start_date || raw.goLive
      ? new Date(raw.start_date || raw.goLive)
      : null;
  const endDt =
    raw.end_date || raw.endsOn ? new Date(raw.end_date || raw.endsOn) : null;
  const now = new Date();

  let computedStatus = raw.status || "draft";

  if (
    raw.is_active ||
    computedStatus === "active" ||
    computedStatus === "scheduled"
  ) {
    if (endDt && endDt < now) {
      computedStatus = "expired";
    } else if (startDt && startDt > now) {
      const isToday =
        startDt.getDate() === now.getDate() &&
        startDt.getMonth() === now.getMonth() &&
        startDt.getFullYear() === now.getFullYear();

      computedStatus = isToday ? "active" : "scheduled";
    } else {
      computedStatus = "active";
    }
  }

  return {
    id: String(raw._id || raw.id || ""),
    name: raw.title || raw.deal_name || raw.name || "Festive Deal",
    festival: raw.festival_name || raw.festival || "General",
    description: raw.description || "",
    banner:
      raw.banner_image ||
      raw.banner_image_url ||
      raw.banner_url ||
      raw.banner ||
      "",
    status: computedStatus,
    is_active: raw.is_active === true,
    goLive: raw.start_date || raw.goLive || "",
    endsOn: raw.end_date || raw.endsOn || "",
    revenue: raw.revenue || 0,
    orders: raw.orders || 0,
    products: productList,
    totalProducts: raw.total_products || productList.length,
    totalCombos: raw.total_combos || raw.combos?.length || 0,
    createdOn: raw.createdAt || raw.createdOn || "",
    _raw: raw,
  };
};

const buildFormData = (menu) => {
  const formData = new FormData();

  formData.append("deal_name", menu.name || "");
  formData.append("title", menu.name || "");
  formData.append("festival_name", menu.festival || "General");
  formData.append("description", menu.description || "");
  formData.append("start_date", menu.goLive || new Date().toISOString());
  formData.append("end_date", menu.endsOn || new Date().toISOString());
  formData.append("status", menu.status || "draft");

  const resolvedIsActive =
    menu.is_active !== undefined ? !!menu.is_active : menu.status === "active";
  formData.append("is_active", resolvedIsActive ? "true" : "false");

  const safeProducts = Array.isArray(menu.products) ? menu.products : [];
  formData.append("products", JSON.stringify(safeProducts));
  formData.append("applicable_products", JSON.stringify(safeProducts));

  if (menu.banner_image instanceof File) {
    formData.append("banner_image", menu.banner_image);
  } else if (
    typeof menu.banner_url === "string" &&
    menu.banner_url.trim() !== ""
  ) {
    formData.append("banner_url", menu.banner_url);
  } else if (typeof menu.banner === "string" && menu.banner.trim() !== "") {
    formData.append("banner_url", menu.banner);
  }

  return formData;
};

const emptyState = {
  menus: [],
  storefrontMenus: [],
  selectedMenu: null,
  loading: false,
  error: null,
};

const useFestiveMenuStore = create((set, get) => ({
  ...emptyState,

  fetchMenus: async () => {
    try {
      set({ loading: true, error: null });
      const res = await API.get("/festive-deals/");
      const raw = res.data.deals || res.data.data || res.data || [];
      const menus = Array.isArray(raw) ? raw.map(normalizeMenu) : [];
      set({ menus });
      return menus;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to load festive menus",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  addMenu: async (menu) => {
    try {
      set({ loading: true, error: null });
      const formData = buildFormData(menu);
      const res = await API.post("/festive-deals/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const raw = res.data.deal || res.data.data || res.data;
      const newMenu = normalizeMenu(raw);
      set((state) => ({ menus: [newMenu, ...state.menus] }));
      return newMenu;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to create festive menu.",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateMenu: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const formData = buildFormData(updates);
      const res = await API.put(`/festive-deals/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const raw = res.data.deal || res.data.data || res.data;
      const updatedMenu = normalizeMenu(raw);

      set((state) => ({
        menus: state.menus.map((m) =>
          String(m.id) === String(id) ? updatedMenu : m,
        ),
        selectedMenu:
          String(state.selectedMenu?.id) === String(id)
            ? updatedMenu
            : state.selectedMenu,
      }));

      return updatedMenu;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to update festive menu",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  duplicateMenu: async (id) => {
    const target = get().menus.find((m) => String(m.id) === String(id));
    if (!target) throw new Error("Menu not found");
    const duplicatedPayload = {
      ...target,
      name: `${target.name} (Copy)`,
      status: "draft",
      is_active: false,
    };
    return get().addMenu(duplicatedPayload);
  },

  endMenu: async (id) => {
    return get().updateMenu(id, { status: "expired", is_active: false });
  },

  deleteMenu: async (id) => {
    try {
      set({ loading: true, error: null });
      await API.delete(`/festive-deals/${id}`);
      set((state) => ({
        menus: state.menus.filter((m) => String(m.id) !== String(id)),
        selectedMenu:
          String(state.selectedMenu?.id) === String(id)
            ? null
            : state.selectedMenu,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Unable to delete festive menu",
      });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  getMenuById: (id) => get().menus.find((m) => String(m.id) === String(id)),
  clearError: () => set({ error: null }),
  reset: () => set({ ...emptyState }),
}));

export default useFestiveMenuStore;
