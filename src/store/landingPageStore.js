import { create } from "zustand";
import API from "../api/axios";

const useLandingPageStore = create((set, get) => ({
  landingPage: null,
  availableData: {
    products: [],
    categories: [],
    festiveDeals: [],
    discounts: [],
    storeInfo: null,
  },
  isLoading: false,
  isSaving: false,
  error: null,

  fetchLandingPage: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get("/landing-page/admin");
      set({
        landingPage: res.data?.landingPage || null,
        availableData: res.data?.availableData || {
          products: [],
          categories: [],
          festiveDeals: [],
          discounts: [],
          storeInfo: null,
        },
      });
      return res.data;
    } catch (err) {
      console.error("Fetch Landing Page Error:", err);
      set({
        error: err.response?.data?.message || "Failed to load landing page",
        landingPage: null,
        availableData: {
          products: [],
          categories: [],
          festiveDeals: [],
          discounts: [],
          storeInfo: null,
        },
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateLandingPage: async (payload) => {
    try {
      set({ isSaving: true, error: null });
      const res = await API.put("/landing-page/admin", payload);
      set({ landingPage: res.data?.landingPage || get().landingPage });
      return res.data;
    } catch (err) {
      console.error("Update Landing Page Error:", err);
      set({
        error: err.response?.data?.message || "Failed to update landing page",
      });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  updateSection: async (sectionKey, sectionPayload) => {
    try {
      set({ isSaving: true, error: null });
      const res = await API.patch(
        `/landing-page/admin/section/${sectionKey}`,
        sectionPayload,
      );
      set({ landingPage: res.data?.landingPage || get().landingPage });
      return res.data;
    } catch (err) {
      console.error("Update Section Error:", err);
      set({ error: err.response?.data?.message || "Failed to update section" });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  toggleSectionActive: async (sectionKey, isActive) => {
    const current = get().landingPage;
    if (!current) return;

    const existingSection = current.sections.find(
      (s) => s.section_key === sectionKey,
    );

    return get().updateSection(sectionKey, {
      is_active: isActive,
      order: existingSection?.order,
      data: existingSection?.data,
    });
  },

  reorderSections: async (orderedSectionKeys) => {
    const current = get().landingPage;
    if (!current) return;

    const updatedSections = current.sections.map((s) => {
      const newOrder = orderedSectionKeys.indexOf(s.section_key);
      return newOrder === -1 ? s : { ...s, order: newOrder + 1 };
    });

    return get().updateLandingPage({ sections: updatedSections });
  },

  getSection: (sectionKey) => {
    const current = get().landingPage;
    if (!current) return null;
    return current.sections.find((s) => s.section_key === sectionKey) || null;
  },

  clearError: () => set({ error: null }),
}));

export default useLandingPageStore;
